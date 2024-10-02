// import { api } from '../api';
// import { getUserQueryId } from '../routes/admin.routes';
// import { User } from '../types';
// import { UserActionLog } from '../types/log.type';

// export async function externalUserInfoLoader({
//   request,
// }: {
//   request: Request;
// }) {
//   const userId = getUserQueryId(new URL(request.url));
//   const data: ReturnType = await api.admin.getUserLogs(userId);
//   return data;
// }

// export const LOADER_ID = 'user-logs';
// export type ReturnType = User & { actionLogs: UserActionLog[] };
