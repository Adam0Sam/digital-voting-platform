import { useRouteError } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';
import { APIError } from '@/lib/api';

export default function RootErrorBoundary() {
  const error = useRouteError();

  let errorTitle = 'Unexpected Error';
  let errorMessage = 'An unknown error occurred. Please try again later.';
  let errorStatus = '';

  if (error instanceof APIError) {
    errorTitle = 'API Error';
    errorMessage =
      error.message || 'An error occurred while communicating with the server.';
    errorStatus = `Status: ${error.status}`;
    if (error.status === 404) {
      errorTitle = 'Not Found';
      errorMessage =
        error.message || 'The requested resource could not be found.';
    }
  } else if (error instanceof Error) {
    errorTitle = error.name;
    errorMessage = error.message;
  }

  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-destructive">
            <AlertCircle className="h-6 w-6" />
            {errorTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{errorStatus}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground">
            We apologize for the inconvenience. If this error persists, please
            contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Button
            variant="default"
            onClick={() => (window.location.href = '/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
