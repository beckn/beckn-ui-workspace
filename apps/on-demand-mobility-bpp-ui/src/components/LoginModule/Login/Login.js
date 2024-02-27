import { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated } from "../../../core/common.functions";
import { AppRoutes } from "../../../core/constant";
import { MailIcon, PhoneIcon } from "../../../shared/icons";
import "../Login.scss";
import { DarkLayout } from "../../../shared/layout/DarkLayout";
import { LeftSection } from "../../../shared/graphics/LeftSection";

export const Login = (props) => {
  const navigate = useNavigate();
  const [App, setApp] = useState(0);

  useEffect(() => {
    isAuthenticated(navigate);
    document.title = `Driver App`;
    let appTitle =
      (window.location.pathname === "/" && "Driver") ||
      (window.location.pathname === AppRoutes.admin && "Taxi Driver");
    setApp(appTitle);
    // spinnerService.show("mySpinner");
  }, []);

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
                <div className="col-12 col-lg-6">
                  <Title>
                    Welcome <br /> to the Taxi Hub
                  </Title>
                  <ButtonsContainer>
                    <Link
                      to={AppRoutes.signInPassword}
                      className="btn btn-outline-primary d-flex justify-content-start align-items-center"
                    >
                      <MailIcon height={18} />
                      <BtnText1>Sign In with Email ID</BtnText1>
                    </Link>
                    <Link
                      to={AppRoutes.signInOtp}
                      className="btn btn-outline-primary d-flex justify-content-start align-items-center"
                    >
                      <PhoneIcon width={18} />
                      <BtnText2>Sign In with Mobile number</BtnText2>
                    </Link>
                  </ButtonsContainer>
                  <SignUpTextContainer>
                    New User?{" "}
                    <Link className="link-primary" to={AppRoutes.signUp}>
                      Sign Up
                    </Link>
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

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 4.5rem 0;
`;

const BtnText1 = styled.div`
  margin-left: 1rem;
`;

const BtnText2 = styled.div`
  margin-left: 1.5rem;
`;

const SignUpTextContainer = styled.div`
  font-size: 1rem;
`;

export default Login;
