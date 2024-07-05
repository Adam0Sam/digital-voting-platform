import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';
import './app.css';
import getAuthEndpoint from './lib/auth/getAuthEndpoint';
// import { getSessionToken } from './lib/auth/authAsync';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          path="signin"
          loader={({ request }) => {
            const url = new URL(request.url);
            const idToken =
              url.searchParams.get('id_token') ||
              localStorage.getItem('id_token');
            if (idToken === null) {
              return redirect('/signup');
            }
            // const sessionToken = getSessionToken(idToken);
            return '';
          }}
        />
        <Route
          path="signup"
          loader={() => {
            return redirect(getAuthEndpoint());
          }}
        />
        <Route path="home"></Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;
