import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
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
  USER_LOADER_ID,
  AUTH_LOADER_ID,
  userLoader,
  managerRolesLoader,
  MANAGER_ROLES_LOADER_ID,
} from './lib/loaders';
import ProposalManagePage from './pages/proposal/manager/ProposalManagePage';
import ProfilePageLayout from './pages/profile/ProfilePageLayout';
import RootErrorBoundary from './components/RootErrorBoundary';
import ProposalsLayout from './pages/ProposalsLayout';
import ProfileTemplatesPage from './pages/profile/profile-templates/ProfileTemplatesPage';
import {
  AUTH_PATHS,
  PROPOSAL_PATHS,
  USER_PROFILE_PATHS,
  USER_TEMPLATES_PATHS,
} from './lib/routes';
import { GENERIC_PATHS } from './lib/routes/util.routes';
import ManagerRoleTemplates from './pages/profile/profile-templates/ManagerRoleTemplates';
import VoteOverviewPage from './pages/proposal/manager/VoteOverviewPage';
import ContentOverviewPage from './pages/proposal/manager/ContentOverviewPage';
import { Component } from './test components/test-chart';
import GreetingPage from './pages/GreetingPage';
import ProposalGreetingPage from './pages/proposal/ProposalGreetingPage';
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<RootLayout />}
      errorElement={<RootErrorBoundary />}
    >
      <Route index element={<GreetingPage />} />
      <Route
        path={AUTH_PATHS.SIGNIN}
        id={USER_LOADER_ID}
        loader={userLoader}
        element={<GreetingPage />}
      />
      <Route path={AUTH_PATHS.SIGNUP} id={AUTH_LOADER_ID} loader={authLoader} />

      <Route path={PROPOSAL_PATHS.BASE} element={<ProposalsLayout />}>
        <Route index element={<ProposalGreetingPage />} />
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
          <Route path={GENERIC_PATHS.ONE} element={<ProposalManagePage />}>
            <Route
              path={PROPOSAL_PATHS.VOTES_OVERVIEW}
              element={<VoteOverviewPage />}
            />
            <Route
              path={PROPOSAL_PATHS.CONTENT_OVERVIEW}
              element={<ContentOverviewPage />}
            />
          </Route>
        </Route>
        <Route
          path={PROPOSAL_PATHS.CREATE}
          loader={managerRolesLoader}
          id={MANAGER_ROLES_LOADER_ID}
          element={<ProposalCreationPage />}
        />
      </Route>
      <Route path={USER_PROFILE_PATHS.BASE} element={<ProfilePageLayout />}>
        <Route
          path={USER_PROFILE_PATHS.PROFILE}
          element={<ProfileSettingsPage />}
        />
        <Route path={USER_PROFILE_PATHS.HISTORY} element={<div>History</div>} />
        <Route
          path={USER_TEMPLATES_PATHS.BASE}
          element={<ProfileTemplatesPage />}
        >
          <Route
            path={USER_TEMPLATES_PATHS.MANAGER}
            loader={managerRolesLoader}
            element={<ManagerRoleTemplates />}
          />
        </Route>
      </Route>

      <Route path="test" element={<Component />} />
      <Route path="*" element={<div>404</div>} />
    </Route>,
  ),
);

export default router;
