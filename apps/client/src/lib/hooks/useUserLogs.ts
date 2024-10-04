import { useEffect, useState } from 'react';
import { api } from '../api';
import { createCachedAsyncResource } from '../async-resource';
import { ActionLogEntry } from '@ambassador';
import constructActionFilter, { ActionFilter } from '../action-filter';

const userLogResourceCache = new Map();
const logCountResourceCache = new Map();
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
  const userLogResource = createCachedAsyncResource<ActionLogEntry[]>(
    userLogResourceCache,
    `${userId}-${pageSize}-${page}-${JSON.stringify(actionFilter)}`,
  );
  const logCountResource = createCachedAsyncResource<number>(
    logCountResourceCache,
    `${userId}-${JSON.stringify(actionFilter)}`,
  );

  const getPage = (page: number | 'next' | 'prev') => {
    if (page === 'next') setPage(prevPage => prevPage + 1);
    else if (page === 'prev') setPage(prevPage => prevPage - 1);
    else setPage(page);
  };

  return {
    logs: {
      data: userLogResource(() =>
        api.admin.getUserLogs(userId, pageSize, page, actionFilter),
      ).read(),
      count: logCountResource(() =>
        api.admin.getUserLogsCount(userId, actionFilter),
      ).read(),
    },
    getPage,
    pageIndex: page,
  };
}
