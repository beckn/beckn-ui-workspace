import styled from "styled-components";

export const DarkLayout = (props) => {
  return (
    <Container>
      <Content>{props.children}</Content>
    </Container>
  );
};

const Container = styled.div`
  background-image: url(/assets/images/background.png);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
`;

const Content = styled.div`
  min-height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(14px);
  color: #fff;
  overflow-y: auto;
`;
