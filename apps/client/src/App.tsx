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
import ProposalsVoterPage from './pages/proposal/ProposalsVoterPage';
import ProposalsManagerPage, {
  loader as manageProposalsLoader,
} from './pages/proposal/ProposalsManagerPage';
import { api } from './lib/api';
import { ProposalAgentRoles } from './lib/types/proposal.type';
import ProposalVotePage from './pages/proposal/ProposalVotePage';

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
          <Route
            path="vote"
            id="vote"
            loader={async () =>
              await Promise.all([
                api.proposals.getProposalsByAgentRole(ProposalAgentRoles.VOTER),
                api.proposals.getAllUserVotes(),
              ])
            }
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
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
