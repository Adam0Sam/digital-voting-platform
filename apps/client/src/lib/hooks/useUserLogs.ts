import { useEffect, useState } from 'react';
import { api } from '../api';
import constructActionFilter, { ActionFilter } from '../action-filter';
import { createAsyncResource } from '../async-resource';
import { cacheFunction } from '../cache';

const getCachedUserLogsResource = cacheFunction(
  (...args: Parameters<typeof api.admin.getUserLogs>) =>
    createAsyncResource(api.admin.getUserLogs(...args)),
);

const getCachedLogsCountResource = cacheFunction(
  (...args: Parameters<typeof api.admin.getUserLogsCount>) =>
    createAsyncResource(api.admin.getUserLogsCount(...args)),
);

export default function useUserLogs(
  userId: string,
  pageSize = 50,
  initialPage = 1,
  actionFilter: ActionFilter = constructActionFilter(),
) {
  const [page, setPage] = useState(initialPage);
  useEffect(() => {
    setPage(initialPage);
  }, [actionFilter, initialPage]);

  const getPage = (page: number | 'next' | 'prev') => {
    if (page === 'next') setPage(prevPage => prevPage + 1);
    else if (page === 'prev') setPage(prevPage => prevPage - 1);
    else setPage(page);
  };

  const userLogsResource = getCachedUserLogsResource(
    userId,
    pageSize,
    page,
    actionFilter,
  );

  const logsCountResource = getCachedLogsCountResource(userId, actionFilter);

  return {
    logs: {
      data: userLogsResource.read(),
      count: logsCountResource.read(),
    },
    getPage,
    pageIndex: page,
  };
}
