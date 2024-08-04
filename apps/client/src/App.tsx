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
import { SingularLabeledBarChart } from './components/bar-chart/SingularLabeledChart';
import ProposalManagePage from './pages/proposal/manager/ProposalManagePage';

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
          <Route
            path="vote"
            id={VOTER_PROPOSALS_LOADER_ID}
            loader={voterProposalsLoader}
          >
            <Route path="all" element={<VoterLandingPage />} />
            <Route path=":id" element={<ProposalVotePage />} />
          </Route>

          <Route
            path="manage"
            id={MANAGER_PROPOSALS_LOADER_ID}
            loader={managerProposalsLoader}
          >
            <Route path="all" element={<ManagerLandingPage />} />
            <Route path=":id" element={<ProposalManagePage />} />
          </Route>
          <Route path="create" element={<ProposalCreationPage />} />
        </Route>
        <Route
          path="test"
          element={
            <SingularLabeledBarChart
              chartData={[
                { month: 'January', desktop: 186 },
                { month: 'February', desktop: 305 },
                { month: 'March', desktop: 237 },
                { month: 'April', desktop: 73 },
                { month: 'May', desktop: 209 },
                { month: 'June', desktop: 214 },
              ]}
              dataLabelKey="month"
              dataValueKey="desktop"
            />
          }
        />
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
