import { UserRole } from "@objects";
import Login from "./modules/Auth/Login";
import Home from "./modules/Client/Home";
import Signup from "./modules/Auth/Signup";
import Dashboard from "./modules/Business/Dashboard";
import PasswordRecovery from "./modules/Auth/PasswordRecovery";
import TermsAndConditions from "./modules/Auth/TermsAndConditions";

interface AppRoute {
  /**
   * URL path
   */
  path: string;
  /**
   * If true, the route is only accessible if the user is authenticated
   */
  auth: boolean;
  /**
   * Role
   */
  role?: UserRole;
  /**
   * Template to render
   */
  element: React.ReactNode;
}

const AppRoutes: AppRoute[] = [
  { path: "/login", element: <Login />, auth: false },
  { path: "/signup", element: <Signup />, auth: false },
  { path: "/password-recovery", element: <PasswordRecovery />, auth: false },
  { path: "/terms-and-conditions", element: <TermsAndConditions />, auth: false },
  { path: "/*", element: <Login />, auth: false },

  { path: "/dashboard", element: <Dashboard />, auth: true, role: UserRole.BUSINESS },
  { path: "/*", element: <Dashboard />, auth: true, role: UserRole.BUSINESS },

  { path: "/home", element: <Home />, auth: true, role: UserRole.CLIENT },
  { path: "/*", element: <Home />, auth: true, role: UserRole.CLIENT },
];

export default AppRoutes;
