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
import { Provider } from 'react-redux';
import store from './store/store';
import { ThemeProvider } from './components/theme-provider';
import GreetingPage from './pages/GreetingPage';
import RootLayout from './pages/RootLayout';
import ProposalCreationPage from './pages/proposal/ProposalCreationPage';
import RestrictedActiveProposalsPage, {
  loader as restrictedActiveProposalsLoader,
} from './pages/proposal/RestrictedActiveProposalsPage';
import ProposalByVisibilityPage, {
  loader as proposalsByVisibilityLoader,
} from './pages/proposal/ProposalsByVisibilityPage';
import SpecificProposalsPage from './pages/proposal/SpecificProposalsPage';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="signin" loader={AuthLoader} element={<GreetingPage />} />
        <Route
          path="signup"
          loader={() => {
            return redirect(getAuthEndpoint());
          }}
        />
        <Route path="home" element={<HomeLayout />}></Route>
        <Route path="proposals">
          <Route path="create" element={<ProposalCreationPage />} />
          <Route
            path=":visibility"
            loader={proposalsByVisibilityLoader}
            element={<ProposalByVisibilityPage />}
          >
            <Route path=":status" element={<SpecificProposalsPage />} />
            <Route path="all" />
            {/* <Route
              path="active"
              loader={restrictedActiveProposalsLoader}
              element={<RestrictedActiveProposalsPage />}
            /> */}
          </Route>
        </Route>
        <Route path="test" element={<></>} />
        <Route path="*" element={<div>404</div>} />
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
