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
  }
  return logMessages;
}
