import {
  Action,
  intrinsicProposalProps,
  isMutableProposalKey,
  MutableProposalKey,
  Proposal,
  User,
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

function getUpdateCandidatesLogMessages(
  prevCandidates: Proposal['candidates'],
  currentCandidates: Prisma.ProposalUpdateInput['candidates']['upsert'],
  meta: { userId: User['id']; proposalId: Proposal['id'] },
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

export function getProposalUpdateLogMessages(
  updateInput: Prisma.ProposalUpdateInput,
  prevProposal: Omit<Proposal, 'votes' | 'userPattern' | 'managers'>,
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
  }
  return logMessages;
}
