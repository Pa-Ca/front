import { UserRole } from "@objects";
import Login from "./modules/Auth/Login";
import Home from "./modules/Client/Home";
import Signup from "./modules/Auth/Signup";
import Profile from "./modules/Business/Profile";
import Coupons from "./modules/Business/Coupons";
import Products from "./modules/Business/Products";
import Dashboard from "./modules/Business/Dashboard";
import Reservations from "./modules/Business/Reservations";
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

  // Business pages
  {
    path: "/business",
    role: UserRole.BUSINESS,
    element: <Dashboard />,
    auth: true,
  },
  {
    path: "/business/profile",
    role: UserRole.BUSINESS,
    element: <Profile />,
    auth: true,
  },
  {
    path: "/business/products",
    role: UserRole.BUSINESS,
    element: <Products />,
    auth: true,
  },
  {
    path: "/business/coupons",
    role: UserRole.BUSINESS,
    element: <Coupons />,
    auth: true,
  },
  {
    path: "/business/reservations",
    role: UserRole.BUSINESS,
    element: <Reservations />,
    auth: true,
  },
  {
    path: "/*",
    element: <Dashboard />,
    role: UserRole.BUSINESS,
    auth: true,
  },

  // Client pages
  {
    path: "/home",
    element: <Home />,
    role: UserRole.CLIENT,
    auth: true,
  },
  {
    path: "/*",
    element: <Home />,
    role: UserRole.CLIENT,
    auth: true,
  },
];

export default AppRoutes;
