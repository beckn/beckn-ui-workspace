import React, { useEffect, useState } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";
import { AgentGrid, verificationKeys } from "../../shared/constant";
import { getUsers } from "../Dashboard/Dashboard.Services";
import AddDriver from "../DriversVehicles/AddDriver/AddDriver";
import TableGridDriver from "../../shared/TableGrid/TableGridDriver";

import { approve } from "../DriversVehicles/DriversVehicles.Services";
import { Verification } from "../DriversVehicles/Verification";
import "../DriversVehicles/DriversVehicles.scss";
import { ChevronRight, Plus } from "react-feather";

export const Agents = (prop) => {
  const { agentStats, activeScreenId } = prop;
  const [tabKey, setTabKey] = useState(activeScreenId || "Tdrvier");
  const [driverList, setDriverList] = useState("");
  const [selectedDriver, setSelectedDriver] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [isAddDriver, setIsAddDriver] = useState(false);
  const [driverEdit, setDriverEdit] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [verifyKey, setVerifyKey] = useState("");

  useEffect(() => {
    setTabKey(activeScreenId || "Tdrvier");
  }, [activeScreenId]);
  const handleModalClose = () => {
    setModalShow(false);
  };

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    setDeriversList();
  };

  const handleClick = (e, Details) => {
    e.preventDefault();
    const { name } = e.target;
    switch (name) {
      case verificationKeys.verifyDriver:
        setModalShow(true);
        setVerifyKey(name);
        setSelectedDriver(Details);
        break;
      default:
        setDriverEdit(Details);
        setIsAddDriver(true);
        break;
    }
    // console.log("handleEdit = Parent =", e, driverDetails);
  };

  const setDeriversList = () => {
    getUsers().then((res) => {
      let TableData = AgentGrid;
      let UpDriverList = res.data.Users.filter(
        (x) => x.Staff === "Y" && x.UserRoles && x.UserRoles[0].Role.Id === "1",
      );
      AgentGrid.ColumnsData = UpDriverList;
      setDriverList(TableData);
      // console.log("Driver List", UpDriverList, TableData);
    });
  };

  const toggleAddDriver = (e, k) => {
    e.preventDefault();
    setDriverEdit(null);
    setIsAddDriver(k);
    setDeriversList();
  };

  const verifyDocument = (id, type) => {
    approve(id, type).then((res) => {
      toast.success("Document Verified Successfully!");
      setSelectedDriver(null);
      setSelectedVehicle(null);
      handleModalClose();
      setDeriversList();
    });
  };

  return (
    <>
      <div className="row drivers-vehicles">
        <div className="col">
          <Tabs
            activeKey={"agents"}
            onSelect={(k) => setTabKey(k)}
            className="mb-3"
          >
            <Tab
              eventKey="agents"
              title="Total Agents"
              className="main-tab-content"
            >
              <div className="row mb-5">
                <div className="col arrow-right">
                  <div>
                    <h4 className="fs-6 fw-normal">Total Agents</h4>
                    <p className="fs-2 fw-semibold text-center">
                      {agentStats.totalAgent || 0}
                    </p>
                  </div>
                  <div className="icon">
                    <ChevronRight size={64} />
                  </div>
                </div>
                <div className="col line-right">
                  <div>
                    <h4 className="fs-6 fw-normal">Verified Agents</h4>
                    <p className="fs-2 fw-semibold text-center">
                      {agentStats.agentVerified || 0}
                    </p>
                  </div>
                  <div className="icon"></div>
                </div>
                <div className="col">
                  <h4 className="fs-6 fw-normal text-center">
                    Agent Verification Pending
                  </h4>
                  <p className="fs-2 fw-semibold text-center">
                    {agentStats.agentsPending || 0}
                  </p>
                </div>
              </div>

              {!isAddDriver ? (
                <div className="nested-tabs">
                  <button
                    className="ms-auto btn btn-icon shift-down"
                    onClick={(e) => toggleAddDriver(e, true)}
                  >
                    <Plus size={24} />
                    <span>New</span>
                  </button>
                  <Tabs
                    defaultActiveKey="allAgent"
                    id="driver-filtered"
                    className="mb-3"
                  >
                    <Tab eventKey="allAgent" title="All">
                      <TableGridDriver
                        GridData={driverList}
                        onClick={(e, k) => handleClick(e, k)}
                        tableType="agent"
                      />
                    </Tab>
                    <Tab eventKey="verifiedAgent" title="Verified">
                      <TableGridDriver
                        GridData={driverList}
                        onClick={(e, k) => handleClick(e, k)}
                        Status="Y"
                        tableType="agent"
                      />
                    </Tab>
                    <Tab
                      eventKey="unVerifiedAgent"
                      title="Verification Pending"
                    >
                      <TableGridDriver
                        GridData={driverList}
                        onClick={(e, k) => handleClick(e, k)}
                        Status="N"
                        tableType="agent"
                      />
                    </Tab>
                  </Tabs>
                </div>
              ) : (
                <>
                  <AddDriver
                    NewUser={false}
                    EditUser={driverEdit || {}}
                    onChange={(e, k) => toggleAddDriver(e, k)}
                    formType="agent"
                  />
                </>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
      <Modal show={modalShow} size="lg" onHide={handleModalClose} centered>
        <Verification
          verifyDocuments={
            verifyKey === verificationKeys.verifyDriver
              ? selectedDriver
              : selectedVehicle
          }
          verify={verifyKey}
          onUpdate={verifyDocument}
        />
      </Modal>
    </>
  );
};

export default React.memo(Agents);
