import {
  Action,
  Grade,
  intrinsicProposalProps,
  isGrade,
  isMutableProposalKey,
  isUserRole,
  MutableProposalKey,
  Proposal,
  User,
  UserRole,
} from '@ambassador';
import { Prisma } from '@prisma/client';
import {
  ArrayMembership,
  getPrimitiveArrayExclusivityMap,
} from 'src/lib/exclusive';
import { LogActionParams } from 'src/logger/logger.service';

const updateKeyToActionMap: Record<MutableProposalKey, Action | undefined> = {
  title: Action.EDIT_TITLE,
  description: Action.EDIT_DESCRIPTION,
  startDate: Action.EDIT_START_END_DATES,
  endDate: Action.EDIT_START_END_DATES,
  resolutionDate: Action.EDIT_RESOLUTION_DATE,
  status: undefined,
  visibility: undefined,
  userPattern: undefined,
  candidates: undefined,
  choiceCount: undefined,
};

type CandidateIdToContentMap = Record<
  string,
  { value: string; description?: string }
>;

type MetaInfo = { userId: User['id']; proposalId: Proposal['id'] };

function getUpdateCandidatesLogMessages(
  prevCandidates: Proposal['candidates'],
  currentCandidates: Prisma.ProposalUpdateInput['candidates']['upsert'],
  meta: MetaInfo,
) {
  const prevCandidateIdContentMap = prevCandidates.reduce((acc, candidate) => {
    acc[candidate.id] = {
      value: candidate.value,
      description: candidate.description,
    };
    return acc;
  }, {} as CandidateIdToContentMap);

  const prevCandidatesIds = prevCandidates.map((candidate) => candidate.id);

  const currentCandidateIdContentMap: CandidateIdToContentMap = {};
  const currentCandidatesIds = [];
  for (const candidateUpsertId in currentCandidates) {
    const candidateUpsert = currentCandidates[candidateUpsertId];
    const candidateId = candidateUpsert.where.id ?? self.crypto.randomUUID();
    currentCandidatesIds.push(candidateId);
    currentCandidateIdContentMap[candidateId] = {
      value: candidateUpsert.create.value,
      description: candidateUpsert.create.description,
    };
  }

  function getLogMessage(
    action: typeof Action.ADD_CANDIDATE | typeof Action.REMOVE_CANDIDATE,
    candidateId: string,
  ) {
    const contentMap =
      action === Action.ADD_CANDIDATE
        ? currentCandidateIdContentMap
        : prevCandidateIdContentMap;

    const logMessage: LogActionParams = {
      action,
      info: {
        userId: meta.userId,
        proposalId: meta.proposalId,
        message: `Value: ${contentMap[candidateId].value} ${
          contentMap[candidateId].description
            ? `(${contentMap[candidateId].description})`
            : ''
        }`,
      },
    };

    return logMessage;
  }

  const exclusivityMap = getPrimitiveArrayExclusivityMap(
    prevCandidatesIds,
    currentCandidatesIds,
  );

  return Object.keys(exclusivityMap).reduce((acc, candidateId) => {
    switch (exclusivityMap[candidateId]) {
      case ArrayMembership.FIRST:
        acc.push(getLogMessage(Action.REMOVE_CANDIDATE, candidateId));
        break;
      case ArrayMembership.SECOND:
        acc.push(getLogMessage(Action.ADD_CANDIDATE, candidateId));
        break;
    }
    return acc;
  }, [] as LogActionParams[]);
}

class PatternChangeTracker<T> {
  private additions: T[] = [];
  private removals: T[] = [];

  constructor(
    private readonly action:
      | typeof Action.EDIT_PATTERN_ROLE
      | typeof Action.EDIT_PATTERN_GRADE,
    private readonly meta: MetaInfo,
  ) {}

  addAddition(value: T) {
    this.additions.push(value);
  }

  addRemoval(value: T) {
    this.removals.push(value);
  }

  getRemovalsLogMessage() {
    if (this.removals.length === 0) {
      return null;
    }
    return {
      action: this.action,
      info: {
        userId: this.meta.userId,
        proposalId: this.meta.proposalId,
        message: `Removed ${this.removals.join(', ')}`,
      },
    };
  }

  getAdditionsLogMessage() {
    if (this.additions.length === 0) {
      return null;
    }
    return {
      action: this.action,
      info: {
        userId: this.meta.userId,
        proposalId: this.meta.proposalId,
        message: `Added ${this.additions.join(', ')}`,
      },
    };
  }
}

function getUpdateUserPatternLogMessages(
  prevPattern: Proposal['userPattern'],
  currentPattern: Prisma.ProposalUpdateInput['userPattern']['update'],
  meta: MetaInfo,
) {
  if (!Array.isArray(currentPattern.roles)) {
    throw new Error('currentPattern.Roles is not an array');
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

  const roleTracker = new PatternChangeTracker<UserRole>(
    Action.EDIT_PATTERN_ROLE,
    meta,
  );
  const gradeTracker = new PatternChangeTracker<Grade>(
    Action.EDIT_PATTERN_GRADE,
    meta,
  );

  for (const role in roleExclusivityMap) {
    if (!isUserRole(role)) {
      throw new Error('role is not a valid user role');
    }
    if (roleExclusivityMap[role] === ArrayMembership.BOTH) {
      continue;
    }
    if (roleExclusivityMap[role] === ArrayMembership.FIRST) {
      roleTracker.addRemoval(role);
      continue;
    }
    roleTracker.addAddition(role);
  }

  for (const grade in gradeExclusivityMap) {
    if (!isGrade(grade)) {
      throw new Error('grade is not a valid grade');
    }
    if (gradeExclusivityMap[grade] === ArrayMembership.BOTH) {
      continue;
    }
    if (gradeExclusivityMap[grade] === ArrayMembership.FIRST) {
      gradeTracker.addRemoval(grade);
      continue;
    }
    gradeTracker.addAddition(grade);
  }

  return [
    roleTracker.getAdditionsLogMessage(),
    roleTracker.getRemovalsLogMessage(),
    gradeTracker.getAdditionsLogMessage(),
    gradeTracker.getRemovalsLogMessage(),
  ];
}

export function getProposalUpdateLogMessages(
  updateInput: Prisma.ProposalUpdateInput,
  prevProposal: Omit<Proposal, 'votes' | 'managers'>,
  userId: User['id'],
) {
  let logMessages: LogActionParams[] = [];
  for (const key in updateInput) {
    if (!isMutableProposalKey(key)) {
      continue;
    }
    if (intrinsicProposalProps.includes(key)) {
      logMessages = [
        ...logMessages,
        {
          action: updateKeyToActionMap[key],
          info: {
            message: updateInput[key].toString(),
            userId,
            proposalId: prevProposal.id,
          },
        },
      ];
    }
    if (key === 'candidates') {
      logMessages = [
        ...logMessages,
        ...getUpdateCandidatesLogMessages(
          prevProposal.candidates,
          updateInput.candidates.upsert,
          { userId, proposalId: prevProposal.id },
        ),
      ];
    }
    if (key === 'choiceCount') {
      logMessages = [
        ...logMessages,
        {
          action: Action.EDIT_CHOICE_COUNT,
          info: {
            message: `From ${
              prevProposal.choiceCount
            } to ${updateInput.choiceCount.toString()}`,
            userId,
            proposalId: prevProposal.id,
          },
        },
      ];
    }
    if (key === 'userPattern') {
      logMessages = [
        ...logMessages,
        ...getUpdateUserPatternLogMessages(
          prevProposal.userPattern,
          updateInput.userPattern.update,
          { userId, proposalId: prevProposal.id },
        ).filter((message) => message !== null),
      ];
    }
  }
  return logMessages;
}
