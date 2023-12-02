import Login from "./modules/auth/Login";
import Signup from "./modules/auth/Signup";

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
   * Template to render
   */
  element: React.ReactNode;
}

const AppRoutes: AppRoute[] = [
  { path: "/login", element: <Login />, auth: false },
  { path: "/signup", element: <Signup />, auth: false },
  { path: "/*", element: <Login />, auth: false },
];

export default AppRoutes;
