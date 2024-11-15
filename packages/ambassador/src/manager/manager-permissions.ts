import { z } from "zod";
import { MutableProposalKey, UpdateProposalDto } from "../proposal";

export const ManagerPermissionNames = [
  "canEditTitle",
  "canEditDescription",
  "canEditDates",
  "canEditStatus",
  "canEditVisibility",
  "canDeleteVotes",
  "canCreateVotes",
  "canEditVotes",
  "canEditManagers",
  "canEditCandidates",
  "canEditChoiceCount",
  "canEditUserPattern",
  "canManuallyResolve",
] as const;

export type ManagerPermissionName = (typeof ManagerPermissionNames)[number];

export const ManagerPermissionsSchema = z.object(
  ManagerPermissionNames.reduce(
    (acc, permName) => ({
      ...acc,
      [permName]: z.boolean(),
    }),
    {} as Record<ManagerPermissionName, z.ZodBoolean>
  )
);

export type ManagerPermissions = Record<ManagerPermissionName, boolean>;
export const ManagerPermissions = ManagerPermissionNames.reduce(
  (acc, permName) => ({
    ...acc,
    [permName]: permName,
  }),
  {} as ManagerPermissions
);

const proposalKeyPermissionMap: Record<
  MutableProposalKey,
  ManagerPermissionName
> = {
  title: "canEditTitle",
  description: "canEditDescription",
  startDate: "canEditDates",
  endDate: "canEditDates",
  resolutionDate: "canEditDates",
  status: "canEditStatus",
  visibility: "canEditVisibility",
  candidates: "canEditCandidates",
  choiceCount: "canEditChoiceCount",
  userPattern: "canEditUserPattern",
};

export function canEdit(
  permissions: ManagerPermissions,
  key: MutableProposalKey
) {
  return permissions[proposalKeyPermissionMap[key]];
}
