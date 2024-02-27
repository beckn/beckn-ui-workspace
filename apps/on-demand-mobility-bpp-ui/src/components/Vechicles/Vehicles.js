import { Col, Container, Row } from "react-bootstrap";
import { LeftSection } from "../../shared/graphics/LeftSection";

export const Vehicles = (prop) => {
  return (
    <section>
      <Container fluid className="vh-100">
        <Row className="vh-100">
          <Col lg="3" className="p-0">
            <LeftSection />
          </Col>
          <Col lg="9" className="d-flex align-items-center">
            <form>
              <div className="row w-100 justify-content-center">
                <div className="col-5 mb-3">
                  <input
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    className="form-control"
                    placeholder="First Name"
                  />
                </div>
                <div className="col-5  mb-3">
                  <input
                    type="text"
                    name="LastName"
                    id="LastName"
                    className="form-control"
                    placeholder="Last Name"
                  />
                </div>
                <div className="col-5 mb-3">
                  <select name="Company" id="Company" className="form-select">
                    <option value="" selected disabled>
                      Select Association Name
                    </option>
                  </select>
                </div>
                <div className="col-5  mb-3">
                  <select name="Role" id="Role" className="form-select">
                    <option value="" selected disabled>
                      Select your role
                    </option>
                  </select>
                </div>
                <div className="col-5 mb-3">
                  <input
                    type="text"
                    name="PhoneNumber"
                    id="PhoneNumber"
                    className="form-control"
                    placeholder="Enter Mobile Number"
                  />
                </div>
                <div className="col-5  mb-3">
                  <input
                    type="text"
                    name="Name"
                    id="Name"
                    className="form-control"
                    placeholder="Enter Email ID"
                  />
                </div>
                <div className="col-5 mb-3">
                  <input
                    type="password"
                    name="Password1"
                    id="Password1"
                    className="form-control"
                    placeholder="Create New Password"
                  />
                </div>
                <div className="col-5  mb-3">
                  <input
                    type="password"
                    name="Password2"
                    id="Password2"
                    className="form-control"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <div className="row w-100 justify-content-center">
                <div className="col-5 d-grid">
                  <a role="button" type="reset" className="btn btn-dark">
                    cancel
                  </a>
                </div>
                <div className="col-5 d-grid">
                  <button className="btn btn-primary" type="submit">
                    submit
                  </button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Vehicles;
