import { LOADER_IDS, useLoadedData } from '@/lib/loaders';

export default function UserManagePage() {
  const user = useLoadedData(LOADER_IDS.USER);
  return <div className="flex flex-col gap-4"></div>;
}
