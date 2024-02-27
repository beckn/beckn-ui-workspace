import React from "react";
// import PropTypes from "prop-types";
// import styles from "./AppFooter.scss";
import { Col, Container, Row } from "react-bootstrap";

const AppFooter = (props) => (
  <footer className="border">
    <Container>
      <Row>
        <Col>This is a component called appFooter.</Col>
      </Row>
    </Container>
  </footer>
);

// todo: Unless you need to use lifecycle methods or local state,
// write your component in functional form as above and delete
// this section.
// class appFooter extends React.Component {
//   render() {
//     return <div>This is a component called appFooter.</div>;
//   }
// }

const AppFooterPropTypes = {
  // always use prop types!
};

AppFooter.propTypes = AppFooterPropTypes;

export default AppFooter;
