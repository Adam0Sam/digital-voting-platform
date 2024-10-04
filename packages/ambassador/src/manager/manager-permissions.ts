import { z } from "zod";

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
