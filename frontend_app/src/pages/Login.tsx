import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Button, Alert } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { Header, BodyContainer } from 'components';
import { useAuth } from 'services/auth';

type LocationState = {
  referrer?: string;
};


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { xs: { offset: 0, span: 24 }, md: { offset: 8, span: 16 } },
};

const Login = () => {
  const [error, setError] = useState('');

  const history = useHistory();
  const loc = useLocation<LocationState>();
  const auth = useAuth();
  useEffect(() => {
    if (loc.state?.referrer && auth.isAuth) {
      history.push(`${loc.state.referrer}`);
    }
  }, [auth.isAuth]);

  const onFinish = useCallback((v) => {
    const { email, password } = v;
    auth.login(email, password).then(() => history.push('/certification')).catch((e) => {
      setError(e.message);
    });
  }, []);

  const onFinishFailed = useCallback((v) => {
    console.log(v);
  }, []);

  return (
    <>
      <Header />
      <BodyContainer>
        <Row>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 6, span: 12 }}>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input value="cb@cb.org" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password value="password" />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
            {error && (
              <Row>
                <Col xs={{ offset: 0, span: 24 }} md={{ offset: 8, span: 12 }}>
                  <Alert message={error} type="error" />
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </BodyContainer>
    </>
  );
};

export default Login;
