import {
  useAsyncValue,
  useLoaderData,
  useRouteLoaderData,
} from 'react-router-dom';
import { LOADER_IDS, LoaderReturnType } from '../utils/loader-map';
import { DeferredData } from '../utils';
export const useLoadedData = <T extends keyof typeof LOADER_IDS>(id: T) => {
  return useRouteLoaderData(id) as LoaderReturnType<T>;
};

export const useDeferredLoadedData = <T extends keyof typeof LOADER_IDS>(
  id: T,
) => {
  return useRouteLoaderData(id) as DeferredData<LoaderReturnType<T>>;
};

export const useLoadedDataLocal = <T extends keyof typeof LOADER_IDS>() => {
  return useLoaderData as LoaderReturnType<T>;
};

export const useAsyncLoaderValue = <T extends keyof typeof LOADER_IDS>(
  id: T,
) => {
  return useAsyncValue() as LoaderReturnType<typeof id>;
};
