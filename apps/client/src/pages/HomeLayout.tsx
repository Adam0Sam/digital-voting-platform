import { Outlet } from 'react-router-dom';

export default function HomeLayout() {
  return (
    <div>
      <h1>Home</h1>
      <Outlet />
    </div>
  );
}
