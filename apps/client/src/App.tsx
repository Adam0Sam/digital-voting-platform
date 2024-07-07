import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';
import './app.css';
import getAuthEndpoint from './lib/auth/getAuthEndpoint';

import Greeting from './components/Greeting';
import Home from './pages/Home';
import { AuthLoader } from './lib/auth';
import RedirectingPlaceholder from './components/RedirectingPlaceholder';
import { UserProvider } from './context/UserProvider';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="signin" loader={AuthLoader} element={<Greeting />} />
        <Route
          path="signup"
          loader={() => {
            return redirect(getAuthEndpoint());
          }}
          element={<RedirectingPlaceholder />}
        />
        <Route path="home" element={<Home />}></Route>
      </Route>,
    ),
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
