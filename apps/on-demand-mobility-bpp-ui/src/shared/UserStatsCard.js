import React, { memo } from "react";
import { roleBasedMapUser } from "./constant";

const UserStatsCard = (props) => {
  const { icon, count = 0, cardTitle, handleClick, userRole } = props;
  return (
    <>
      {roleBasedMapUser[`${cardTitle}`].includes(userRole) ? (
        <div
          className="card bg-dark h-100 h-100 rounded-0 text-white"
          role={"button"}
          onClick={handleClick}
        >
          <div className="row g-0 h-100">
            <div className="col-4 bg-white bg-opacity-25 d-flex justify-content-center align-items-center icon-col">
              {icon}
            </div>
            <div className="col-8">
              <div className="card-body">
                <h5 className="card-title fs-6 fw-normal">{cardTitle}</h5>
                <h6 className="fs-4 fw-semibold mt-auto">{count}</h6>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default memo(UserStatsCard);
