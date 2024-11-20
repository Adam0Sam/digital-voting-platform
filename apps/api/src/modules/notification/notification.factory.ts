import {
  CreateBaseUserNotificationDto,
  CreateUserNotificationDto,
  isMutableIntrinsicProposalProp,
  isMutableProposalKey,
  Proposal,
  UserNotificationType,
} from '@ambassador';
import { Prisma } from '@prisma/client';
import { MetaInfo } from 'src/lib/meta';

export class ProposalNotificationFactory {
  constructor(
    private updateInput: Prisma.ProposalUpdateInput,
    private prevProposal: Omit<Proposal, 'votes' | 'managers'>,
    private meta: MetaInfo,
  ) {}

  generateNotifications(): CreateUserNotificationDto[] {
    const notifications: CreateUserNotificationDto[] = [];

    for (const key in this.updateInput) {
      if (!isMutableProposalKey(key)) {
        continue;
      }

      if (isMutableIntrinsicProposalProp(key)) {
        if (key === 'status') {
          const baseNotification: CreateBaseUserNotificationDto = {
            proposalId: this.meta.proposalId,
            userId: this.meta.userId,
          };

          switch (this.updateInput[key]) {
            case 'ABORTED':
              notifications.push({
                ...baseNotification,
                package: {
                  type: UserNotificationType.PROPOSAL_ABORTION,
                  content: {
                    reason: 'Proposal was aborted',
                  },
                },
              });
              break;

            case 'ACTIVE':
              notifications.push({
                ...baseNotification,
                package: {
                  type: UserNotificationType.PROPOSAL_ACTIVATION,
                  content: {
                    startDate: new Date(this.prevProposal.startDate),
                    endDate: new Date(this.prevProposal.endDate),
                  },
                },
              });
              break;

            case 'RESOLVED':
              notifications.push({
                ...baseNotification,
                package: {
                  type: UserNotificationType.PROPOSAL_RESOLUTION,
                  content: null,
                },
              });
              break;
          }
        } else {
          notifications.push({
            proposalId: this.meta.proposalId,
            package: {
              type: UserNotificationType.PROPOSAL_UPDATE,
              content: {
                updatedFields: [key],
                updatedValues: Array.isArray(this.updateInput[key])
                  ? this.updateInput[key]
                  : [this.updateInput[key]],
              },
            },
          });
        }
      }
    }

    return notifications;
  }
}
