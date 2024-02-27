import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState, useMemo } from "react";
// import PropTypes from "prop-types";
import { Col, Container, Modal, Nav, Row, Tab, Tabs } from "react-bootstrap";
import { Plus } from "react-feather";
import { getAddress } from "../../core/common.functions";
import { LocalKey } from "../../core/constant";
import { getCookie } from "../../core/CookiesHandler";
import {
  AgentVerification,
  DriverIcon,
  VehicleIcon,
  AgentsIcon,
  RidesIcon,
  RevenueIcon,
} from "../../shared/icons";
import UserStatsCard from "../../shared/UserStatsCard";
import "./Dashboard.scss";
import { getUserSummaries, getTrips } from "./Dashboard.Services";
const FarePolicy = React.lazy(() => import("../FarePolicy/FarePolicy"));
const AddFarePolicy = React.lazy(
  () => import("../FarePolicy/AddFarePolicy/AddFarePolicy"),
);
const DriversVehicles = React.lazy(
  () => import("../DriversVehicles/DriversVehicles"),
);
const Agents = React.lazy(() => import("../Agent/Agents"));
const Account = React.lazy(() => import("../Account/Account"));
const activeDriverTab = ["ADMIN", "AGENT"];

export const Dashboard = () => {
  const [activeScreen, setActiveScreen] = useState("home");
  const [tabKey, setTabKey] = useState("DashBoard");
  const [screenId, setScreenId] = useState();
  const [user] = useState(JSON.parse(getCookie(LocalKey.saveUser)));
  const [summaries, setSummaries] = useState(0);
  // comment to enable rolebase Access
  const userRole = useMemo(
    () => user?.UserRoles?.map((x) => x.Role.Name)[0],
    [user],
  );
  //const userRole = "ADMIN";

  const [drivers, setDrivers] = useState({
    totalDriver: 0,
    driversVerified: 0,
    driversPending: 0,
  });
  const [vehicles, setVehicles] = useState({
    totalVehicle: 0,
    vehiclesVerified: 0,
    vehiclesPending: 0,
  });
  const [agents, setAgents] = useState({
    totalAgent: 0,
    agentsVerified: 0,
    agentsPending: 0,
  });

  const [show, setShow] = useState(false);
  const [isNewFarePolicy, setIsNewFarePolicy] = useState(false);
  const [existingFare, setExistingFare] = useState([]);
  const [editFare, setEditFare] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    document.title = `taxi BPP DashBoard`;
    getScreen();
  };

  const handleClose = () => setShow(false);

  const getScreen = () => {
    if (isEmpty(getAddress(user)) || user.Approved === "N") {
      setActiveScreen("profile");
      isEmpty(getAddress(user)) && setShow(true);
      !isEmpty(getAddress(user)) && user.Approved === "N" && setShow(true);
    } else {
      // getTrips().then((res) => {
      //   console.log("trips", res);
      // });
      getUserSummaries().then((res) => {
        setSummaries(res);
        res.UserSummaries.forEach((user) => {
          if (user.Role?.Name?.toLowerCase() === "driver") {
            setDrivers({
              totalDriver: +user.UserCount,
              driversVerified: +user.UserCount - +user.UnverifiedUserCount,
              driversPending: +user.UnverifiedUserCount,
            });
          }
          if (user.Role?.Name?.toLowerCase() === "agent") {
            setAgents({
              totalAgent: +user.UserCount,
              agentsVerified: +user.UserCount - +user.UnverifiedUserCount,
              agentsPending: +user.UnverifiedUserCount,
            });
          }
        });
        res.VehicleSummaries?.forEach((vh) => {
          if (vh.Company?.Id?.toLowerCase() === user.Company.Id) {
            setVehicles({
              totalVehicle: +vh.VehicleCount,
              vehiclesVerified: +vh.VehicleCount - +vh.UnverifiedVehicleCount,
              vehiclesPending: +vh.UnverifiedVehicleCount,
            });
          }
        });
      });
    }
  };
  const navigateToScreen = (tabId, screenId) => {
    setActiveScreen(tabId);
    setScreenId(screenId);
  };

  const toggleAddEditPolicy = (k) => {
    setIsNewFarePolicy(k);
  };

  const handleOnFareChange = (e) => {
    console.log("handleOnFareChange", e);
    editFare && setEditFare(null);
    toggleAddEditPolicy(e);
  };
  const handleUpdate = (list) => {
    console.log("asdf", list);
    let ExistingList = [];
    list.map((x) => {
      ExistingList.push(x);
    });
    console.log("asdf after", list, ExistingList);
    setExistingFare(ExistingList);
  };

  const handleFareEdit = (e, Fare) => {
    e.preventDefault();
    setEditFare(Fare);
    toggleAddEditPolicy(true);
  };

  return (
    <section className="dashboard">
      <Container fluid className="vh-100">
        <Row>
          <Col>
            <Tab.Container
              onSelect={(k) => setActiveScreen(k)}
              activeKey={activeScreen}
            >
              <Row className="vh-100">
                <Col
                  xxl={2}
                  lg={2}
                  className="position-relative bg-dark left-section rounded-0"
                >
                  <div className="round-2"></div>
                  <Nav
                    variant="pills"
                    className="flex-column mt-4 me-n3 position-relative"
                  >
                    <Nav.Item>
                      <Nav.Link
                        role={"button"}
                        eventKey="home"
                        disabled={user.Verified === "N"}
                      >
                        Home
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        role={"button"}
                        eventKey="drivers"
                        disabled={user.Verified === "N"}
                      >
                        {activeDriverTab.includes(userRole)
                          ? "Drivers / Vehicles"
                          : "Vehicles"}
                      </Nav.Link>
                    </Nav.Item>
                    {userRole === "ADMIN" && (
                      <Nav.Item>
                        <Nav.Link
                          role={"button"}
                          eventKey="agents"
                          disabled={user.Verified === "N"}
                        >
                          Agents
                        </Nav.Link>
                      </Nav.Item>
                    )}
                    {/* <Nav.Item>
                      <Nav.Link
                        role={"button"}
                        eventKey="verification"
                        disabled
                      >
                        Verification
                      </Nav.Link>
                    </Nav.Item> */}
                    <Nav.Item>
                      <Nav.Link role={"button"} eventKey="profile">
                        User Profile
                      </Nav.Link>
                    </Nav.Item>
                    {/* <Nav.Item>
                      <Nav.Link role={"button"} eventKey="support" disabled>
                        Support
                      </Nav.Link>
                    </Nav.Item> */}
                  </Nav>
                </Col>
                <Col xxl={10} sm={10} className="py-3">
                  <Tab.Content>
                    <Tab.Pane eventKey="home">
                      {!isNewFarePolicy ? (
                        <div className="nested-tabs">
                          {tabKey === "FarePolicy" && (
                            <button
                              className="ms-auto btn btn-icon shift-down py-0"
                              onClick={() => toggleAddEditPolicy(true)}
                            >
                              <Plus size={24} />
                              <span>New</span>
                            </button>
                          )}
                          <Tabs
                            activeKey={tabKey}
                            onSelect={(k) => setTabKey(k)}
                            className="mb-3"
                          >
                            <Tab
                              eventKey="DashBoard"
                              title="Dashboard"
                              className="main-tab-content"
                            >
                              <div className="w-100">
                                <div className="row justify-content-left">
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={<DriverIcon className="w-50" />}
                                      cardTitle="Total Drivers"
                                      count={drivers.totalDriver}
                                      handleClick={(e) =>
                                        navigateToScreen("drivers", "Tvehicle")
                                      }
                                      userRole={userRole}
                                    />
                                  </div>
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={<VehicleIcon className="w-50" />}
                                      cardTitle="Total Vehicles"
                                      count={vehicles.totalVehicle}
                                      handleClick={(e) =>
                                        navigateToScreen("drivers", "Tvehicle")
                                      }
                                      userRole={userRole}
                                    />
                                  </div>
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={<AgentsIcon className="w-50" />}
                                      cardTitle="Total Agents"
                                      count={agents.totalAgent}
                                      handleClick={(e) => {}}
                                      userRole={userRole}
                                    />
                                  </div>
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={<RidesIcon className="w-50" />}
                                      cardTitle="Total Rides"
                                      count={0}
                                      handleClick={(e) => {}}
                                      userRole={userRole}
                                    />
                                  </div>
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={<RevenueIcon className="w-50" />}
                                      cardTitle="Total Revenue"
                                      count={0}
                                      handleClick={(e) => {}}
                                      userRole={userRole}
                                    />
                                  </div>
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={
                                        <AgentVerification className="w-50" />
                                      }
                                      cardTitle="Agent Verification Pending"
                                      count={agents.agentsPending}
                                      handleClick={(e) => {}}
                                      userRole={userRole}
                                    />
                                  </div>
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={<DriverIcon className="w-50" />}
                                      cardTitle="Driver Verification Pending"
                                      count={drivers.driversPending}
                                      handleClick={(e) => {}}
                                      userRole={userRole}
                                    />
                                  </div>
                                  <div className="col-sm-4 mb-3">
                                    <UserStatsCard
                                      icon={<VehicleIcon className="w-50" />}
                                      cardTitle="Vehicle Verification Pending"
                                      count={vehicles.vehiclesPending}
                                      handleClick={(e) => {}}
                                      userRole={userRole}
                                    />
                                  </div>
                                </div>
                              </div>
                            </Tab>
                            {userRole === "ADMIN" && (
                              <Tab
                                eventKey="FarePolicy"
                                title="Fare Policy"
                                className="main-tab-content"
                              >
                                <FarePolicy
                                  onUpdate={handleUpdate}
                                  onChange={handleFareEdit}
                                />
                              </Tab>
                            )}
                          </Tabs>
                        </div>
                      ) : (
                        <AddFarePolicy
                          EditFare={editFare}
                          existingFare={existingFare}
                          onChange={handleOnFareChange}
                        />
                      )}
                    </Tab.Pane>
                    <Tab.Pane eventKey="drivers">
                      {summaries && (
                        <DriversVehicles
                          activeScreenId={screenId}
                          driverStats={drivers}
                          vehicleStats={vehicles}
                          userRole={userRole}
                        />
                      )}
                    </Tab.Pane>
                    {userRole === "ADMIN" && (
                      <Tab.Pane eventKey="agents">
                        {summaries && (
                          <Agents
                            activeScreenId={screenId}
                            agentStats={agents}
                          />
                        )}
                      </Tab.Pane>
                    )}
                    <Tab.Pane eventKey="documents">Documents</Tab.Pane>
                    {/* <Tab.Pane eventKey="verification">Verification</Tab.Pane> */}
                    <Tab.Pane eventKey="profile">
                      <Account User={user} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="support">Support</Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="text-center">
          {user.DriverDocuments && user.Verified === "N" ? (
            <>
              <h5>Verification Pending for document(s)</h5>
              <p className="text-muted">wait for confirmation to continue!</p>
            </>
          ) : (
            <>
              <h4>Please complete the registration</h4>
              <p className="text-muted">in order to continue!</p>
            </>
          )}
          <button className="btn btn-dark w-50" onClick={handleClose}>
            Account
          </button>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Dashboard;
