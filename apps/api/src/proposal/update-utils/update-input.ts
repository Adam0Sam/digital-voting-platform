import {
  Candidate,
  canEdit,
  intrinsicProposalProps,
  isMutableProposalKey,
  ManagerPermissions,
  Proposal,
  UpdateProposalDto,
  VoteStatus,
} from '@ambassador';
import { Prisma } from '@prisma/client';

function withMutatedIntrinsicProposalProp<
  T extends keyof Pick<
    UpdateProposalDto,
    (typeof intrinsicProposalProps)[number]
  >,
>(
  updateInputObject: Prisma.ProposalUpdateInput,
  key: T,
  value: UpdateProposalDto[T],
): Prisma.ProposalUpdateInput {
  return {
    ...updateInputObject,
    [key]: value,
  };
}

function withMutatedCandidates(
  updateInputObject: Prisma.ProposalUpdateInput,
  prevCandidates: Proposal['candidates'],
  currentCandidates: UpdateProposalDto['candidates'],
): Prisma.ProposalUpdateInput {
  const candidateIdsForDeletion: string[] = prevCandidates
    .filter((prevChoice) =>
      currentCandidates.some(
        (newChoice) =>
          newChoice.id !== undefined && newChoice.id === prevChoice.id,
      ),
    )
    .map((choice) => choice.id);

  return {
    ...updateInputObject,
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
  prevCandidates,
}: {
  proposalId?: string;
  proposalDto: UpdateProposalDto;
  permissions: ManagerPermissions;
  prevCandidates: Candidate[];
}) {
  let updateInput: Prisma.ProposalUpdateInput = {};
  let shouldResetVotes = false;
  for (const key in proposalDto) {
    if (!isMutableProposalKey(key)) {
      continue;
    }
    if (intrinsicProposalProps.includes(key) && canEdit(permissions, key)) {
      updateInput = withMutatedIntrinsicProposalProp(
        updateInput,
        key,
        proposalDto[key],
      );
      continue;
    }
    if (key === 'candidates' && canEdit(permissions, key)) {
      updateInput = withMutatedCandidates(
        updateInput,
        prevCandidates,
        proposalDto.candidates,
      );
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
