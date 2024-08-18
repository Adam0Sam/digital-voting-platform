import { Outlet } from 'react-router-dom';

export default function ProposalsLayout() {
  console.log(Outlet);
  return (
    <div className="flex h-full flex-col">
      <Outlet />
    </div>
  );
}
