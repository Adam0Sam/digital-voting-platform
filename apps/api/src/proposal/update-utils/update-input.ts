import {
  canEdit,
  intrinsicProposalProps,
  isMutableProposalKey,
  ManagerPermissions,
  Proposal,
  UpdateProposalDto,
  VoteStatus,
} from '@ambassador';
import { Prisma } from '@prisma/client';

function getCandidatesUpdateInput(
  prevCandidates: Proposal['candidates'],
  currentCandidates: UpdateProposalDto['candidates'],
): Prisma.ProposalUpdateInput {
  const currentCandidateIdSet = new Set<string>(
    currentCandidates.map((choice) => choice.id),
  );

  const candidateIdsForDeletion: string[] = prevCandidates
    .filter((prevChoice) => !currentCandidateIdSet.has(prevChoice.id))
    .map((prevChoice) => prevChoice.id);

  return {
    candidates: {
      upsert: currentCandidates.map((choice) => ({
        where: {
          id: choice.id ?? '',
        },
        update: {
          value: choice.value,
          description: choice.description,
        },
        create: {
          value: choice.value,
          description: choice.description,
        },
      })),
      deleteMany: {
        id: {
          in: candidateIdsForDeletion,
        },
      },
    },
  };
}

export function getProposalUpdateInput({
  proposalId,
  proposalDto,
  permissions,
  prevProposal,
}: {
  proposalId?: string;
  proposalDto: UpdateProposalDto;
  permissions: ManagerPermissions;
  prevProposal: Omit<Proposal, 'votes' | 'userPattern' | 'managers'>;
}) {
  let updateInput: Prisma.ProposalUpdateInput = {};
  let shouldResetVotes = false;
  for (const key in proposalDto) {
    if (!isMutableProposalKey(key)) {
      continue;
    }
    if (proposalDto[key] === prevProposal[key]) {
      continue;
    }
    if (intrinsicProposalProps.includes(key) && canEdit(permissions, key)) {
      updateInput = {
        ...updateInput,
        [key]: proposalDto[key],
      };
      continue;
    }
    if (key === 'candidates' && canEdit(permissions, key)) {
      updateInput = {
        ...updateInput,
        ...getCandidatesUpdateInput(
          prevProposal.candidates,
          proposalDto.candidates,
        ),
      };
      shouldResetVotes = true;
      continue;
    }
    if (key === 'choiceCount' && canEdit(permissions, key)) {
      updateInput = {
        ...updateInput,
        [key]: proposalDto[key],
      };
      shouldResetVotes = true;
      continue;
    }
    if (key === 'userPattern' && canEdit(permissions, key)) {
      updateInput = {
        ...updateInput,
        [key]: {
          update: proposalDto[key],
        },
      };
    }
  }

  if (shouldResetVotes) {
    updateInput = {
      ...updateInput,
      votes: {
        updateMany: {
          where: {
            proposalId: proposalId ?? proposalDto.id,
          },
          data: {
            status: VoteStatus.PENDING,
          },
        },
      },
    };
  }

  return updateInput;
}
