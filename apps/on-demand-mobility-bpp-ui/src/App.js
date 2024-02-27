import { Spinner } from "@simply007org/react-spinners";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DriverAppFooter from "./components/DriverApp/components/NavFooter/NavFooter";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { Vehicles } from "./components/Vechicles/Vehicles";
import { AuthGuard } from "./core/AuthGuard";
import { AppRoutes, LocalKey, NoHeader } from "./core/constant";
import ErrorBoundary from "./shared/ErrorBoundary";
const AppHeader = React.lazy(() => import("./components/AppHeader"));
const MenuBar = React.lazy(() => import("./components/AppHeader/MenuBar"));
const Login = React.lazy(() => import("./components/LoginModule/Login"));
const SignUp = React.lazy(() => import("./components/LoginModule/SignUp"));
const SignInPassword = React.lazy(
  () => import("./components/LoginModule/SignInPassword/SignInPassword"),
);
const SignInPhone = React.lazy(
  () => import("./components/LoginModule/SignInPhone"),
);
const Registration = React.lazy(
  () =>
    import("./components/DriverApp/components/AccountDetails/RegistrationHome"),
);
const DriverDashboard = React.lazy(
  () => import("./components/DriverApp/DriverDashboard"),
);
const PageNotFound = React.lazy(
  () => import("./shared/PageNotFound/PageNotFound"),
);
let isLogin = !NoHeader.includes(window.location.pathname);
const RideEnd = React.lazy(
  () => import("./components/DriverApp/components/EndRide/RideEnd"),
);

const raw = "";

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

const getExperienceCenterId = async () => {
  const url = window.location.href;
  let expId = url.split("?")[1];
  // if (!expId) {
  //   expId = await fetch(
  //     "https://api.eventcollector.becknprotocol.io/v2/event/experience",
  //     requestOptions
  //   )
  //     .then((response) => response.text())
  //     .then((result) => result.split(":")[1].trim())
  //     .catch((error) => console.log("error", error));
  // }
  console.log("app", expId);
  if (expId) {
    localStorage.setItem("expId", expId);
  }
};
function App() {
  useEffect(() => {
    getExperienceCenterId();
  }, []);
  return (
    <>
      <ToastContainer position="top-center" hideProgressBar="false" />
      <Spinner name={LocalKey.spinnerKey}>
        <div className="modal d-block">
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content text-center p-3">
              <img
                src="assets/images/Loading.svg"
                width={"60px"}
                height={"60px"}
                className="m-auto my-3"
                alt=""
              />
              <p className="mb-0">Please wait</p>
              <p className="text-muted small mb-0">
                while processing your request!
              </p>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
      </Spinner>
      <BrowserRouter forceRefresh={true}>
        <ErrorBoundary>
          <Suspense>
            <Routes>
              <Route path="/" element={<SignInPassword />}></Route>
              <Route
                path={AppRoutes.admin}
                element={<SignInPassword />}
              ></Route>
              <Route path={AppRoutes.signUp} element={<SignUp />}></Route>
              <Route
                path={AppRoutes.signInPassword}
                element={<SignInPassword />}
              ></Route>
              <Route
                path={AppRoutes.signInOtp}
                element={<SignInPhone />}
              ></Route>
              <Route
                path={AppRoutes.accountRegistration}
                element={<Registration />}
              ></Route>
              <Route
                path={AppRoutes.driverDashboard}
                element={
                  <AuthGuard>
                    <DriverDashboard />
                  </AuthGuard>
                }
              ></Route>
              <Route
                path={AppRoutes.endRide}
                element={
                  <AuthGuard>
                    <RideEnd />
                  </AuthGuard>
                }
              ></Route>
              <Route path="/*" element={<PageNotFound />}></Route>
            </Routes>
            {/*<DriverAppFooter/>*/}
            {/* {isLogin && <AppFooter />} */}
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
}

export default App;
