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
import HomeLayout from './pages/HomeLayout';
import { AuthLoader } from './lib/auth';
import RedirectingPlaceholder from './components/RedirectingPlaceholder';
import { Provider } from 'react-redux';
import store from './store/store';

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
        <Route path="home" element={<HomeLayout />}></Route>
      </Route>,
    ),
  );

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
