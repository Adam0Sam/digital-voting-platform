import {
  Action,
  intrinsicProposalProps,
  isMutableProposalKey,
  MutableProposalKey,
  Proposal,
  User,
} from '@ambassador';
import { Prisma } from '@prisma/client';
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
  let prevCandidatePointer = 0;
  let currentCandidatePointer = 0;
  const logMessages: LogActionParams[] = [];

  const prevCandidatesSet = new Set(
    prevCandidates.map((candidate) => candidate.id),
  );
  const prevCandidatesLength = prevCandidates.length;
  const prevCandidateIdContentMap = prevCandidates.reduce((acc, candidate) => {
    acc[candidate.id] = {
      value: candidate.value,
      description: candidate.description,
    };
    return acc;
  }, {} as CandidateIdToContentMap);

  let currentCandidatesLength = 0;
  const currentCandidateIdContentMap: CandidateIdToContentMap = {};
  const currentCandidatesSet = new Set();
  for (const candidateUpsertId in currentCandidates) {
    const candidateUpsert = currentCandidates[candidateUpsertId];
    const candidateId = candidateUpsert.where.id || currentCandidatesLength;
    currentCandidatesSet.add(candidateId);
    currentCandidateIdContentMap[
      candidateUpsert.where.id ?? currentCandidatesLength
    ] = {
      value: candidateUpsert.create.value,
      description: candidateUpsert.create.description,
    };
    currentCandidatesLength++;
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
        message: `${contentMap[candidateId].value} ${
          contentMap[candidateId].description
            ? `(${contentMap[candidateId].description})`
            : ''
        }`,
      },
    };

    return logMessage;
  }

  while (
    prevCandidatePointer < prevCandidatesLength ||
    currentCandidatePointer < currentCandidatesLength
  ) {
    const prevCandidate = prevCandidates[prevCandidatePointer];
    const currentCandidate = currentCandidates[currentCandidatePointer];

    if (!prevCandidate && !currentCandidate) {
      break;
    }

    // Handle case when we've reached the end of prev array
    if (!prevCandidate && currentCandidate) {
      const currentCandidateId = currentCandidate.where.id;
      if (!prevCandidatesSet.has(currentCandidateId)) {
        logMessages.push(
          getLogMessage(Action.ADD_CANDIDATE, currentCandidateId),
        );
      }
      currentCandidatePointer++;
      continue;
    }

    // Handle case when we've reached the end of current array
    if (prevCandidate && !currentCandidate) {
      const prevCandidateId = prevCandidate.id;
      if (!currentCandidatesSet.has(prevCandidateId)) {
        logMessages.push(
          getLogMessage(Action.REMOVE_CANDIDATE, prevCandidateId),
        );
      }
      prevCandidatePointer++;
      continue;
    }

    // Both arrays have elements
    const prevCandidateId = prevCandidate.id;
    const currentCandidateId = currentCandidate.where.id;

    if (!currentCandidatesSet.has(prevCandidateId)) {
      logMessages.push(getLogMessage(Action.REMOVE_CANDIDATE, prevCandidateId));
      prevCandidatePointer++;
      continue;
    }

    if (!prevCandidatesSet.has(currentCandidateId)) {
      logMessages.push(getLogMessage(Action.ADD_CANDIDATE, currentCandidateId));
      currentCandidatePointer++;
      continue;
    }

    prevCandidatePointer++;
    currentCandidatePointer++;
  }

  return logMessages;
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
      console.log('candidate upsert', updateInput.candidates.upsert);
      console.log(
        'candidate log message',
        getUpdateCandidatesLogMessages(
          prevProposal.candidates,
          updateInput.candidates.upsert,
          { userId, proposalId: prevProposal.id },
        ),
      );
    }
  }
  return logMessages;
}
