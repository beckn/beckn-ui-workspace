import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { LogOut } from "react-feather";
import { removeCookie } from "../../../../core/CookiesHandler";
import { LocalKey, AppRoutes } from "../../../../core/constant";
import { userLogout } from "../../../LoginModule/Login.services";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function DriverAppHeader({ title }) {
  const navigate = useNavigate();
  const logout = () => {
    userLogout("logout").then((res) => {
      console.log("User Logout", res);
      removeCookie(LocalKey.saveApi);
      removeCookie(LocalKey.saveActiveRide);
      //window.localStorage.removeItem(LocalKey.saveApi);
      removeCookie(LocalKey.saveUser);
      // navigate(AppRoutes.admin);
      localStorage.clear();
      window.location.href = AppRoutes.admin;
    });
  };
  const renderlogoutTooltip = (props) => <Tooltip {...props}>Logout</Tooltip>;
  return (
    <>
      <div className="top-bar">
        <span>
          {title != "Home" && (
            <button className="back-button" onClick={() => navigate(-1)}>
              <span>&#60;</span> Back
            </button>
          )}
        </span>
        <span className="header-push text-white">{title}</span>
        <OverlayTrigger placement="left" overlay={renderlogoutTooltip}>
          <span className="header-push" title="logout">
            {title === "Account" && (
              <button className="back-button" onClick={logout}>
                <span>
                  {" "}
                  <LogOut />
                </span>
              </button>
            )}
          </span>
        </OverlayTrigger>
      </div>
    </>
  );
}

export default DriverAppHeader;
