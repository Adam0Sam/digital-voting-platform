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

import { ThemeProvider } from './components/theme-provider';
import GreetingPage from './pages/GreetingPage';
import RootLayout from './pages/RootLayout';
import ProposalCreationPage from './pages/proposal/ProposalCreationPage';
import VoterLandingPage from './pages/proposal/voter/VoterLandingPage';
import ManagerLandingPage from './pages/proposal/manager/ManagerLandingPage';
import ProposalVotePage from './pages/proposal/voter/ProposalVotePage';
import {
  authLoader,
  voterProposalsLoader,
  VOTER_PROPOSALS_LOADER_ID,
  managerProposalsLoader,
  MANAGER_PROPOSALS_LOADER_ID,
} from './lib/loaders';
import ProposalManagePage from './pages/proposal/manager/ProposalManagePage';
import { GENERIC_PATHS, PROPOSAL_PATHS } from './components/nav';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="signin" loader={authLoader} element={<GreetingPage />} />
        <Route
          path="signup"
          loader={() => {
            return redirect(getAuthEndpoint());
          }}
        />
        <Route path="home" element={<HomeLayout />}></Route>
        <Route path={PROPOSAL_PATHS.BASE}>
          <Route
            path={PROPOSAL_PATHS.VOTE}
            id={VOTER_PROPOSALS_LOADER_ID}
            loader={voterProposalsLoader}
          >
            <Route path={GENERIC_PATHS.ALL} element={<VoterLandingPage />} />
            <Route path={GENERIC_PATHS.ONE} element={<ProposalVotePage />} />
          </Route>

          <Route
            path={PROPOSAL_PATHS.MANAGE}
            id={MANAGER_PROPOSALS_LOADER_ID}
            loader={managerProposalsLoader}
          >
            <Route path={GENERIC_PATHS.ALL} element={<ManagerLandingPage />} />
            <Route path={GENERIC_PATHS.ONE} element={<ProposalManagePage />} />
          </Route>
          <Route
            path={PROPOSAL_PATHS.CREATE}
            element={<ProposalCreationPage />}
          />
        </Route>
        <Route path="me" element={<div>labas</div>}></Route>
        <Route path="*" element={<div>404</div>} />
      </Route>,
    ),
  );

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
