import { APIError } from '@/lib/api';
import { useRouteError } from 'react-router-dom';

export default function RootErrorBoundary() {
  const error = useRouteError();
  if (error instanceof APIError) {
    return (
      <div>
        {error.message}
        {error.status}
      </div>
    );
  }
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }
  return <div>Unknown error</div>;
}
