import React from "react";
import styled from "styled-components";
import { PageHeader, Button } from "antd";
import { useAuth } from "services/auth";
import { Container } from ".";
import { useCertification } from "store/certification/hooks";
import { UserRole } from "services/auth/auth.service";

const Header = styled.div`
  box-shadow: 0 0 10px rgba(32, 45, 74, 0.2);
`;

const StatusTag = styled.div`
  font-size: 12px;
  color: white;
  background-color: #3e90fe;
  padding: 2px 6px;
  border-radius: 4px;
`;

const StyledPageHeader = styled(PageHeader)`
  padding: 16px 0;
`;

export default () => {
  const { isAuth, logout, goToLoginPage, user } = useAuth();
  const { isComplete } = useCertification();

  const loggedOutFragment = [
    <Button key='1' onClick={goToLoginPage}>
      Login
    </Button>,
  ];

  const loggedInFragment = [
    <span key='1'>Welcome {user?.name}</span>,
    <Button key='2' type='default' onClick={logout}>
      Logout
    </Button>,
  ];

  const getCertificateStatus = () => (isComplete ? "COMPLETED" : "INCOMPLETE");

  const getAvatar = () => {
    if (!user) return "";
    return user.role === UserRole.CB ||
      user.role === UserRole.FSC ||
      user.role === UserRole.ASI
      ? "https://i.imgur.com/EDX4nsr.png"
      : "https://i.imgur.com/0w2WcXj.png";
  };

  const getOrgName = () => {
    if (!user) return "";
    return user.role === UserRole.CB ||
      user.role === UserRole.FSC ||
      user.role === UserRole.ASI
      ? "National Certification Board"
      : "Happy Feet Fishery";
  };

  return (
    <Header>
      <Container>
        <StyledPageHeader
          title={getOrgName()}
          avatar={{
            src: getAvatar(),
            shape: "square",
            gap: 0,
          }}
          tags={
            user && (
              <StatusTag>{`${
                user?.role
              } - ${getCertificateStatus()}`}</StatusTag>
            )
          }
          extra={isAuth ? loggedInFragment : loggedOutFragment}
        />
      </Container>
    </Header>
  );
};
