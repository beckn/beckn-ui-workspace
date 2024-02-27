import { Navigate } from "react-router";
import { LocalKey } from "./constant";
import { getCookie } from "./CookiesHandler";
import { history } from "./history";

export { AuthGuard };

function AuthGuard({ children }) {
  if (!getCookie(LocalKey.saveApi)) {
    // not logged in so redirect to login page with the return url
    return (
      <Navigate to="/sign-in-password" state={{ from: history.location }} />
    );
  }

  // authorized so return child components
  return children;
}
