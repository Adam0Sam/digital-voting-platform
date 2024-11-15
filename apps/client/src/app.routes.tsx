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
import ProposalManagePage from './pages/proposal/manager/ProposalManagePage';
import ProfilePageLayout from './pages/profile/ProfilePageLayout';
import RootErrorBoundary from './components/RootErrorBoundary';
import ProfileTemplatesPage from './pages/profile/profile-templates/ProfileTemplatesPage';
import {
  AUTH_PATHS,
  PROPOSAL_OVERVIEW_PATHS,
  PROPOSAL_PATHS,
  USER_PROFILE_PATHS,
  USER_TEMPLATES_PATHS,
  GENERIC_PATHS,
  ADMIN_PATHS,
} from './lib/routes';
import ManagerRoleTemplates from './pages/profile/profile-templates/ManagerRoleTemplates';
import VoteOverviewPage from './pages/proposal/manager/VoteOverviewPage';
import ContentOverviewPage from './pages/proposal/manager/ContentOverviewPage';
import GreetingPage from './pages/GreetingPage';
import ProposalGreetingPage from './pages/proposal/ProposalGreetingPage';
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage';
import AdminPage from './pages/admin/AdminPageLayout';
import ChoicesOverviewPage from './pages/proposal/manager/ChoicesOverviewPage';
import AdminUserPage from './pages/admin/AdminUserPage';
import UserLogsPage from './pages/admin/UserLogsPage';
import UserPatternPage from './pages/proposal/manager/UserPatternPage';
import UserManagePage from './pages/admin/UserManagePage';
import { LOADER_IDS, LOADER_ID_MAP, loaderDefer } from './lib/loaders';
import TimelinePage from './pages/proposal/manager/TimelinePage';
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
        id={LOADER_IDS.USER}
        loader={LOADER_ID_MAP[LOADER_IDS.USER]}
        element={<GreetingPage />}
      />
      <Route
        path={AUTH_PATHS.SIGNUP}
        id={LOADER_IDS.AUTH}
        loader={LOADER_ID_MAP[LOADER_IDS.AUTH]}
      />

      <Route path={PROPOSAL_PATHS.BASE}>
        <Route index element={<ProposalGreetingPage />} />
        <Route
          path={PROPOSAL_PATHS.VOTE}
          id={LOADER_IDS.VOTER_PROPOSALS}
          loader={LOADER_ID_MAP[LOADER_IDS.VOTER_PROPOSALS]}
        >
          <Route path={GENERIC_PATHS.ALL} element={<VoterLandingPage />} />
          <Route path={GENERIC_PATHS.ONE} element={<ProposalVotePage />} />
        </Route>

        <Route
          path={PROPOSAL_PATHS.MANAGE}
          id={LOADER_IDS.MANAGER_PROPOSALS}
          loader={LOADER_ID_MAP[LOADER_IDS.MANAGER_PROPOSALS]}
        >
          <Route path={GENERIC_PATHS.ALL} element={<ManagerLandingPage />} />
          <Route path={GENERIC_PATHS.ONE} element={<ProposalManagePage />}>
            <Route
              path={PROPOSAL_OVERVIEW_PATHS.VOTES}
              element={<VoteOverviewPage />}
            />
            <Route
              path={PROPOSAL_OVERVIEW_PATHS.CONTENT}
              element={<ContentOverviewPage />}
            />
            <Route
              path={PROPOSAL_OVERVIEW_PATHS.CHOICES}
              element={<ChoicesOverviewPage />}
            />
            <Route
              path={PROPOSAL_OVERVIEW_PATHS.PATTERN}
              element={<UserPatternPage />}
            />
            <Route
              path={PROPOSAL_OVERVIEW_PATHS.TIMELINE}
              element={<TimelinePage />}
            />
          </Route>
        </Route>
        <Route
          path={PROPOSAL_PATHS.CREATE}
          id={LOADER_IDS.MANAGER_ROLES}
          loader={LOADER_ID_MAP[LOADER_IDS.MANAGER_ROLES]}
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
          loader={LOADER_ID_MAP[LOADER_IDS.MANAGER_ROLES]}
          element={<ProfileTemplatesPage />}
        >
          <Route element={<ManagerRoleTemplates />} />
        </Route>
      </Route>
      <Route
        path={ADMIN_PATHS.BASE}
        id={LOADER_IDS.USER_DEEP_INFO}
        loader={() => loaderDefer(LOADER_IDS.USER_DEEP_INFO)}
        element={<AdminPage />}
      >
        <Route path={ADMIN_PATHS.USERS} element={<AdminUserPage />} />
        <Route path={`${ADMIN_PATHS.USER}/${GENERIC_PATHS.ONE}`}>
          <Route path={ADMIN_PATHS.LOGS} element={<UserLogsPage />} />
          <Route path={ADMIN_PATHS.manage} element={<UserManagePage />} />
        </Route>

        <Route path={ADMIN_PATHS.PROPOSALS} element={<div>Proposals</div>} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Route>,
  ),
);

export default router;
