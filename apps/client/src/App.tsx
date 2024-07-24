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
import ProposalCreationPage, {
  action as proposalCreationAction,
} from './pages/ProposalCreationPage';
import UserSelectionTable from '@/components/tables/user/UserSelectionTable';
import UserSelectionForm from './components/forms/UserSelectionForm';
import { User } from './types';

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
            path="create"
            element={<ProposalCreationPage />}
            action={proposalCreationAction}
          />
        </Route>
        <Route
          path="user"
          element={
            <UserSelectionForm
              onSubmit={function (values: {
                owner: User;
                managers: User[];
              }): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
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
