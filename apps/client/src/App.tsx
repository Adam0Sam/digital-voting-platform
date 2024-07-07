import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';
import './App.css';
import getAuthEndpoint from './lib/auth/getAuthEndpoint';

import HomeLayout from './pages/HomeLayout';
import { AuthLoader } from './lib/auth';
import RedirectingPlaceholder from './components/RedirectingPlaceholder';
import { Provider } from 'react-redux';
import store from './store/store';
import { ThemeProvider } from './components/theme-provider';
import Greeting from './components/Greeting';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" loader={AuthLoader} element={<Greeting />}>
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
    <ThemeProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
