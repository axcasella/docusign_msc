import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Row, Col } from 'antd';

import { Header, ProjectSummary, BodyContainer, Chat } from 'components';
import SideBar from './SideBar';
import OpenMeeting from './OpenMeeting';
import SiteInspection from './SiteInspection';
import Interviews from './Interviews';
import Observations from './Observations';
import CloseMeeeting from './CloseMeeeting';
import CertificateIssue from './CertificateIssue';
import { CertificationStep } from 'store/certification/types';
import { useCertificationStep, useCertification } from 'store/certification/hooks';

const Certification = () => {
  const { path } = useRouteMatch();
  const { routes, setRoutes } = useCertificationStep();
  const { certificate } = useCertification();

  useEffect(() => {
    setRoutes({
      [CertificationStep.OPEN_MEETING]: `${path}/open`,
      [CertificationStep.SITE_INSPECTION]: `${path}/inspection`,
      [CertificationStep.EMPLOYEE_INTERVIEW]: `${path}/interview`,
      [CertificationStep.OBSERVATIONS]: `${path}/observation`,
      [CertificationStep.CLOSE_MEETING]: `${path}/close`,
      [CertificationStep.CERTIFICATION_ISSUE]: `${path}/certissue`,
    });
  }, []);

  return (
    <div>
      <Header />
      <BodyContainer>
        <Row>
          <Col xs={0} sm={24}>
            <ProjectSummary />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} md={5}>
            <SideBar />
          </Col>
          <Col xs={{ span: 17, offset: 2 }} md={{ span: 15, offset: 2 }} sm={{ span: 13, offset: 1 }}>
            <Switch>
              <Route exact path={routes[CertificationStep.OPEN_MEETING]}>
                <OpenMeeting />
              </Route>
              <Route exact path={routes[CertificationStep.SITE_INSPECTION]}>
                <SiteInspection />
              </Route>
              <Route exact path={routes[CertificationStep.EMPLOYEE_INTERVIEW]}>
                <Interviews />
              </Route>
              <Route exact path={routes[CertificationStep.OBSERVATIONS]}>
                <Observations />
              </Route>
              <Route exact path={routes[CertificationStep.CLOSE_MEETING]}>
                <CloseMeeeting />
              </Route>
              <Route exact path={routes[CertificationStep.CERTIFICATION_ISSUE]}>
                <CertificateIssue />
              </Route>
            </Switch>
          </Col>
        </Row>
      </BodyContainer>
      <Chat />
    </div>
  );
};

export default Certification;
