import { useEffect } from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { isAuthenticated } from "../../../core/common.functions";
import { AppRoutes, LocalKey } from "../../../core/constant";
import { LeftSection } from "../../../shared/graphics/LeftSection";
import { DarkLayout } from "../../../shared/layout/DarkLayout";
import "../Login.scss";

export const SignInPhone = (props) => {
  useEffect(() => {
    isAuthenticated();
    document.title = `taxi BPP`;
    // console.log(props);
    // spinnerService.show("mySpinner");
  });

  return (
    <DarkLayout>
      <section>
        <Container fluid className="vh-100">
          <Row className="vh-100">
            <Col lg="3" className="p-0">
              <LeftSection />
            </Col>
            <Col
              lg="9"
              className="d-flex align-items-center justify-content-center"
            >
              <div className="row w-100 justify-content-center">
                <div className="col-6 col-12 col-lg-6">
                  <Title>
                    Welcome <br /> to the Taxi Hub
                  </Title>
                  <FormContainer>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your Mobile number"
                    />

                    <button className="btn btn-primary">Send OTP</button>
                  </FormContainer>

                  <SignUpTextContainer>
                    <div>
                      New User?{" "}
                      <Link to={AppRoutes.signUp} className="link-primary">
                        Sign Up
                      </Link>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <Link
                        to={AppRoutes.signInPassword}
                        className="link-primary"
                      >
                        Sign in with Email
                      </Link>
                    </div>
                  </SignUpTextContainer>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </DarkLayout>
  );
};

const Title = styled.h1`
  font-weight: 500;
  font-size: 2rem;
  line-height: 1.5;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 4.5rem 0;
`;

const SignUpTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 1rem;
`;

export default SignInPhone;
