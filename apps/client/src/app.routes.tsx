import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import ProposalCreationPage, {
  ProposalSummary,
} from './pages/proposal/ProposalCreationPage';
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
  userLogsLoader,
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
import GreetingPage from './pages/GreetingPage';
import ProposalGreetingPage from './pages/proposal/ProposalGreetingPage';
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage';
import { ADMIN_PATHS } from './lib/routes/admin.routes';
import AdminPage from './pages/admin/AdminPageLayout';
import ChoicesOverviewPage from './pages/proposal/manager/ChoicesOverviewPage';
import AdminUserPage from './pages/admin/AdminUserPage';
import UserLogsPage from './pages/admin/UserLogsPage';

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
            <Route
              path={PROPOSAL_PATHS.CHOICES_OVERVIEW}
              element={<ChoicesOverviewPage />}
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
      <Route path={ADMIN_PATHS.BASE} element={<AdminPage />}>
        <Route path={ADMIN_PATHS.USERS} element={<AdminUserPage />} />
        <Route
          path={`${ADMIN_PATHS.USER}/${GENERIC_PATHS.ONE}/${ADMIN_PATHS.LOGS}`}
          loader={userLogsLoader}
          element={<UserLogsPage />}
        />
        <Route path={ADMIN_PATHS.PROPOSALS} element={<div>Proposals</div>} />
      </Route>
      <Route
        path="test"
        element={
          <ProposalSummary
            data={{
              title: '',
              description: undefined,
              startDate: '',
              endDate: '',
              status: 'DRAFT',
              visibility: 'PUBLIC',
              managers: [],
              voters: [],
              choices: [],
              choiceCount: 0,
            }}
            onCancel={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        }
      />
      <Route path="*" element={<div>404</div>} />
    </Route>,
  ),
);

export default router;