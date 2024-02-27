/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AppRoutes, LocalKey } from "../../core/constant";
import { getCookie, removeCookie } from "../../core/CookiesHandler";
import { userLogout } from "../LoginModule/Login.services";
import "./AppHeader.scss";
const logout = () => {
  userLogout("logout").then((res) => {
    console.log("User Logout", res);
    removeCookie(LocalKey.saveApi);
    removeCookie(LocalKey.saveUser);
    window.location.href = AppRoutes.admin;
  });
};
const roleMap = {
  VECHICLES_OWNER: "OWNER",
  DRIVER: "Driver",
  ADMIN: "Admin",
  AGENT: "Agent",
};
const MenuBar = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const user =
    getCookie(LocalKey.saveUser) && JSON.parse(getCookie(LocalKey.saveUser));
  console.log(user?.UserRoles?.map((x) => x.Role.Name));
  const userRole = user?.UserRoles?.map((x) => x.Role.Name)[0];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <header className="bg-dark header-round">
            <Container fluid>
              <Row>
                <Col className="position-relative">
                  <div className="round-1"></div>
                  <h1 className="text-white px-lg-5 py-lg-3 fs-4 fw-semibold">
                    Taxi Admin
                  </h1>
                </Col>
                <Col className="d-flex align-items-center justify-content-end text-white">
                  Welcome : {user.FirstName} [{roleMap[`${userRole}`] || ""}]
                  <button
                    className="btn btn-primary btn-sm ms-2"
                    onClick={() => logout()}
                  >
                    Logout
                  </button>
                </Col>
              </Row>
            </Container>
          </header>
        </ul>
      </div>
    </nav>
  );
};

// todo: Unless you need to use lifecycle methods or local state,
// write your component in functional form as above and delete
// this section.
// className appHeader extends React.Component {
//   render() {
//     return <div>This is a component called appHeader.</div>;
//   }
// }

const MenuBarPropTypes = {
  // always use prop types!
};

MenuBar.propTypes = MenuBarPropTypes;

export default MenuBar;
