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
import ProposalsVoterPage from './pages/proposal/ProposalsVoterPage';
import ProposalsManagerPage, {
  loader as manageProposalsLoader,
} from './pages/proposal/ProposalsManagerPage';
import ProposalVotePage from './pages/proposal/ProposalVotePage';
import {
  authLoader,
  voterProposalsLoader,
  VOTER_PROPOSALS_LOADER_ID,
} from './lib/loaders';

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
        <Route path="proposals">
          {/* TODO: Make generic function which returns reroute response */}
          <Route
            path="vote"
            id={VOTER_PROPOSALS_LOADER_ID}
            loader={voterProposalsLoader}
          >
            <Route path="all" element={<ProposalsVoterPage />} />
            <Route path=":id" element={<ProposalVotePage />} />
          </Route>

          <Route
            path="manage"
            element={<ProposalsManagerPage />}
            loader={manageProposalsLoader}
          ></Route>
          <Route path="create" element={<ProposalCreationPage />} />
        </Route>
        <Route path="test" element={<></>} />
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
