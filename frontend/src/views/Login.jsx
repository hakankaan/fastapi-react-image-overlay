import React, { useState, useContext } from 'react';
import ProForm, {
  ProFormText,
  LoginForm,
} from '@ant-design/pro-form';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';

import { login, isAuthenticated } from '../utils/auth';
import { mainContext } from './context/mainContext';
import { Form, Button } from 'antd'


export const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, getImageSet } = useContext(mainContext)

  const handleSubmit = async (_) => {
    setError('');
    try {
      const data = await login(email, password);
      getImageSet()
      setUser({
          id: data['user']['id'],
          email: data['user']['email'],
          first_name: data['user']['first_name'],
          last_name: data['user']['last_name'],
      })
      if (data) {
        history.push('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        // handle errors thrown from frontend
        setError(err.message);
      } else {
        // handle errors thrown from backend
        setError(String(err));
      }
    }
  };

  return isAuthenticated() ? (
    <Redirect to="/" />
  ) : (

    <LoginForm
        title="Login"
        subTitle="AI destekli patoloji takibi"
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: 'Login',
          },
          resetButtonProps: {
            hidden: true
          },
          submitButtonProps: {
            size: 'large',
            hidden: true
          }
        }}
      >
        {' '}
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'Kullanıcı Adı: admin or user'}
          rules={[
            {
              required: true,
              message: 'Kullanıcı adı zorunludur!',
            },
          ]}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'Şifre: ant.design'}
          rules={[
            {
              required: true,
              message: 'Şifre zorunludur！',
            },
          ]}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
             Or <a href="/signup">register now!</a>
        </Form.Item>
      </LoginForm>


    
  );
};
