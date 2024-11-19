import {
  canEdit,
  isMutableIntrinsicProposalProp,
  isMutableProposalKey,
  ManagerPermissions,
  Proposal,
  UpdateProposalDto,
} from '@ambassador';
import { Prisma } from '@prisma/client';

export class UpdateInputFactory {
  private _shouldResetVotes = false;

  constructor(
    private proposalId: string,
    private proposalDto: UpdateProposalDto,
    private permissions: ManagerPermissions,
    private prevProposal: Omit<Proposal, 'votes' | 'userPattern' | 'managers'>,
  ) {}

  get shouldResetVotes(): boolean {
    return this._shouldResetVotes;
  }

  private set shouldResetVotes(value: boolean) {
    this._shouldResetVotes = value;
  }

  generateUpdateInput(): Prisma.ProposalUpdateInput {
    let updateInput: Prisma.ProposalUpdateInput = {};

    for (const key in this.proposalDto) {
      if (!this.shouldProcessKey(key)) continue;

      if (isMutableIntrinsicProposalProp(key)) {
        updateInput[key] = this.proposalDto[key];
        continue;
      }

      if (key === 'candidates') {
        const candidateUpdate = this.generateCandidatesUpdateInput();
        updateInput = { ...updateInput, ...candidateUpdate };
        this.shouldResetVotes = true;
        continue;
      }

      if (key === 'choiceCount') {
        updateInput.choiceCount = this.proposalDto.choiceCount;
        this.shouldResetVotes = true;
        continue;
      }

      if (key === 'userPattern') {
        updateInput = {
          ...updateInput,
          userPattern: {
            update: this.proposalDto.userPattern,
          },
        };
      }
    }

    return updateInput;
  }

  private shouldProcessKey(key: string): boolean {
    return (
      isMutableProposalKey(key) &&
      this.proposalDto[key] !== this.prevProposal[key] &&
      canEdit(this.permissions, key)
    );
  }

  private generateCandidatesUpdateInput(): Prisma.ProposalUpdateInput {
    const currentCandidateIdSet = new Set<string>(
      this.proposalDto.candidates.map((choice) => choice.id),
    );

    const candidateIdsForDeletion = this.prevProposal.candidates
      .filter((prevChoice) => !currentCandidateIdSet.has(prevChoice.id))
      .map((prevChoice) => prevChoice.id);

    return {
      candidates: {
        upsert: this.proposalDto.candidates.map((choice) => ({
          where: { id: choice.id ?? '' },
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
          id: { in: candidateIdsForDeletion },
        },
      },
    };
  }
}
