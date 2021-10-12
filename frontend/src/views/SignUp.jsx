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

import { signUp, isAuthenticated } from '../utils/auth';
import { mainContext } from './context/mainContext';


export const SignUp = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(mainContext)

  const handleSubmit = async (_) => {
    // Password confirmation validation
    if (password !== passwordConfirmation) setError('Passwords do not match');
    else {
      setError('');
      try {
        const data = await signUp(email, password, passwordConfirmation);
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
    }
  };

  return isAuthenticated() ? (
    <Redirect to="/" />
  ) : (

    <LoginForm
        title="Register"
        subTitle="AI destekli patoloji takibi"
        onFinish={handleSubmit}
        submitter={{
          searchConfig: {
            submitText: 'Register',
          },
          resetButtonProps: {
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
          placeholder={'Email: example@example.com'}
          rules={[
            {
              required: true,
              message: 'Email is required!',
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
          placeholder={'Password: ant.design'}
          rules={[
            {
              required: true,
              message: 'Password is required!',
            },
          ]}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ProFormText.Password
          name="password_confirmation"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'Şifre onay: ant.design'}
          rules={[
            {
              required: true,
              message: 'Password confirmation is required!',
            },
          ]}
          value={passwordConfirmation}
          onChange={(e) =>
            setPasswordConfirmation(e.currentTarget.value)
          }
        />
      </LoginForm>

  );
};
