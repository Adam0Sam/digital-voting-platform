import {
  Action,
  Grade,
  isGrade,
  isMutableIntrinsicProposalProp,
  isMutableProposalKey,
  isUserRole,
  MutableIntrinsicProposalKey,
  Proposal,
  UserRole,
} from '@ambassador';
import { Prisma } from '@prisma/client';
import {
  ArrayMembership,
  getPrimitiveArrayExclusivityMap,
} from 'src/lib/exclusive';
import { LogMessage } from './type';
import { PatternChangeTracker } from 'src/lib/pattern-change-tracker';

export class LogMessageFactory {
  private static updateIntrinsicKeyToActionMap: Record<
    MutableIntrinsicProposalKey,
    Action
  > = {
    title: Action.EDIT_TITLE,
    description: Action.EDIT_DESCRIPTION,
    startDate: Action.EDIT_START_END_DATES,
    endDate: Action.EDIT_START_END_DATES,
    resolutionDate: Action.EDIT_RESOLUTION_DATE,
    status: Action.EDIT_STATUS,
    visibility: Action.EDIT_VISIBILITY,
  };

  constructor(
    private updateInput: Prisma.ProposalUpdateInput,
    private prevProposal: Omit<Proposal, 'votes' | 'managers'>,
    private meta: { userId: string; proposalId: string },
  ) {}

  generateLogMessages(): LogMessage[] {
    let logMessages: LogMessage[] = [];

    for (const key in this.updateInput) {
      if (!isMutableProposalKey(key)) {
        continue;
      }

      if (isMutableIntrinsicProposalProp(key)) {
        logMessages.push({
          action: LogMessageFactory.updateIntrinsicKeyToActionMap[key],
          info: {
            message: this.updateInput[key].toString(),
            userId: this.meta.userId,
            proposalId: this.meta.proposalId,
          },
        });
        continue;
      }

      if (key === 'candidates') {
        logMessages = logMessages.concat(this.generateCandidateLogMessages());
        continue;
      }

      if (key === 'choiceCount') {
        logMessages.push({
          action: Action.EDIT_CHOICE_COUNT,
          info: {
            message: `From ${this.prevProposal.choiceCount} to ${this.updateInput.choiceCount}`,
            userId: this.meta.userId,
            proposalId: this.meta.proposalId,
          },
        });
        continue;
      }

      if (key === 'userPattern') {
        logMessages = logMessages.concat(
          this.generateUserPatternLogMessages().filter((msg) => msg !== null),
        );
      }
    }

    return logMessages;
  }

  private generateCandidateLogMessages(): LogMessage[] {
    const prevCandidates = this.prevProposal.candidates;
    const currentCandidates = this.updateInput.candidates.upsert;

    type CandidateIdToContentMap = Record<
      string,
      { value: string; description?: string }
    >;

    const prevCandidateIdContentMap = prevCandidates.reduce(
      (acc, candidate) => {
        acc[candidate.id] = {
          value: candidate.value,
          description: candidate.description,
        };
        return acc;
      },
      {} as CandidateIdToContentMap,
    );
    const prevCandidateIds = prevCandidates.map((candidate) => candidate.id);

    const currentCandidateIdContentMap: CandidateIdToContentMap = {};
    const currentCandidateIds: string[] = [];

    for (const candidateUpsertId in currentCandidates) {
      const candidateUpsert = currentCandidates[candidateUpsertId];
      const candidateId = candidateUpsert.where.id ?? self.crypto.randomUUID();
      currentCandidateIds.push(candidateId);
      currentCandidateIdContentMap[candidateId] = {
        value: candidateUpsert.create.value,
        description: candidateUpsert.create.description,
      };
    }

    const exclusivityMap = getPrimitiveArrayExclusivityMap(
      prevCandidateIds,
      currentCandidateIds,
    );

    const candidateLogMessages: LogMessage[] = [];

    for (const candidateId in exclusivityMap) {
      const membership = exclusivityMap[candidateId];
      let action: Action;
      let contentMap: CandidateIdToContentMap;

      if (membership === ArrayMembership.FIRST) {
        action = Action.REMOVE_CANDIDATE;
        contentMap = prevCandidateIdContentMap;
      } else if (membership === ArrayMembership.SECOND) {
        action = Action.ADD_CANDIDATE;
        contentMap = currentCandidateIdContentMap;
      } else {
        return;
      }

      candidateLogMessages.push({
        action,
        info: {
          userId: this.meta.userId,
          proposalId: this.meta.proposalId,
          message: `Value: ${contentMap[candidateId].value}${
            contentMap[candidateId].description
              ? ` (${contentMap[candidateId].description})`
              : ''
          }`,
        },
      });
    }

    return candidateLogMessages;
  }

  private generateUserPatternLogMessages(): (LogMessage | null)[] {
    const prevPattern = this.prevProposal.userPattern;
    const currentPattern = this.updateInput.userPattern.update;

    if (!Array.isArray(currentPattern.roles)) {
      throw new Error('currentPattern.roles is not an array');
    }
    if (!Array.isArray(currentPattern.grades)) {
      throw new Error('currentPattern.grades is not an array');
    }

    const roleExclusivityMap = getPrimitiveArrayExclusivityMap(
      prevPattern.roles,
      currentPattern.roles,
    );
    const gradeExclusivityMap = getPrimitiveArrayExclusivityMap(
      prevPattern.grades,
      currentPattern.grades,
    );

    const roleTracker = new UserRoleChangeTracker<UserRole>(
      Action.EDIT_PATTERN_ROLE,
      this.meta,
    );
    const gradeTracker = new UserRoleChangeTracker<Grade>(
      Action.EDIT_PATTERN_GRADE,
      this.meta,
    );

    for (const role in roleExclusivityMap) {
      if (!isUserRole(role)) {
        throw new Error('role is not a valid user role');
      }
      if (roleExclusivityMap[role] === ArrayMembership.SECOND) {
        roleTracker.addAddition(role);
      } else if (roleExclusivityMap[role] === ArrayMembership.FIRST) {
        roleTracker.addRemoval(role);
      }
    }

    for (const grade in gradeExclusivityMap) {
      if (!isGrade(grade)) {
        throw new Error('grade is not a valid grade');
      }
      if (gradeExclusivityMap[grade] === ArrayMembership.SECOND) {
        gradeTracker.addAddition(grade);
      } else if (gradeExclusivityMap[grade] === ArrayMembership.FIRST) {
        gradeTracker.addRemoval(grade);
      }
    }

    return [
      roleTracker.getAdditionsLogMessage(),
      roleTracker.getRemovalsLogMessage(),
      gradeTracker.getAdditionsLogMessage(),
      gradeTracker.getRemovalsLogMessage(),
    ];
  }
}

class UserRoleChangeTracker<
  T extends UserRole | Grade,
> extends PatternChangeTracker<T> {
  constructor(
    private action:
      | typeof Action.EDIT_PATTERN_ROLE
      | typeof Action.EDIT_PATTERN_GRADE,
    private meta: { userId: string; proposalId: string },
  ) {
    super();
  }

  getAdditionsLogMessage(): LogMessage | null {
    const additions = this.getAdditions();
    if (!additions) {
      return null;
    }
    return {
      action: this.action,
      info: {
        userId: this.meta.userId,
        proposalId: this.meta.proposalId,
        message: `Added ${additions.join(', ')}`,
      },
    };
  }

  getRemovalsLogMessage(): LogMessage | null {
    const removals = this.getRemovals();
    if (!removals) {
      return null;
    }
    return {
      action: this.action,
      info: {
        userId: this.meta.userId,
        proposalId: this.meta.proposalId,
        message: `Removed ${removals.join(', ')}`,
      },
    };
  }
}
