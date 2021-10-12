import React, { useState, useContext, useRef, useEffect } from 'react';
import { Avatar, Dropdown, Menu, message, Button, Space } from 'antd';

import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import defaultProps from './_defaultProps';
import * as virasoft from './virasoft.png'
import { Link } from 'react-router-dom';
import Image from './Image';
import { mainContext } from './context/mainContext';
import NewImageSet from './NewImageSet';
import Patients from './Patients';
import Profile from './Profile';
import ProForm, { ProFormText, ProFormSelect, ModalForm } from '@ant-design/pro-form';
import { BACKEND_URL } from '../config';
import axios from 'axios'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'


export const Dashboard = ({children}) => {
    const settingsRef = useRef()
    const { mainData, setPathname, setUser } = useContext(mainContext)
    const [menu, setMenu] = useState(<></>)
    const [settings, setSetting] = useState({ 
        fixSiderbar: true,
        navTheme: 'light',
        title: 'Virasoft Panel',
        layout: 'top',
        settings: false
     });

     useEffect(() => {
        if(mainData.user){
            setMenu(<Menu>
                <Menu.Item key="0">
                <ModalForm
                       formRef={settingsRef}
                       title="Update Profile"
                       trigger={
                           <a>
                               Settings
                           </a>
                       }
                       drawerProps={{
                           onCancel: () => console.log('run'),
                           destroyOnClose: true,
                       }}
                       onFinish={async (values) => {
                           console.log(values)
                           const postData = values.password
                                                ? {
                                                    first_name: values.first_name,
                                                    last_name: values.last_name,
                                                    email: values.email,
                                                    password: values.password
                                                }
                                                : {
                                                    first_name: values.first_name,
                                                    last_name: values.last_name,
                                                    email: values.email
                                                }
                           axios.put(
                               `${BACKEND_URL}/users/${mainData.user?.id}`, 
                               postData,
                               {
                                   headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                               }
                           ).then((response) => {
                               message.success('Profile Updated')
                               setUser(...response.data)
                           })
                           .catch((error) => console.log(error))
                           return true
                       }}
                       initialValues={{
                           first_name: mainData.user?.first_name,
                           last_name: mainData.user?.last_name,
                           email: mainData.user?.email,
                       }}
                   >
                       <ProForm.Group>
                           <ProFormText
                               width="md"
                               name="first_name"
                               label="First Name"
                               placeholder="First Name"
                               fieldProps={{
                                   prefix: <UserOutlined className={'prefixIcon'} />,
                               }}
                               rules={[
                                   {
                                       required: true,
                                       message: 'Please enter the first name',
                                   },
                                   ]}
                           />
                           <ProFormText
                               width="md"
                               name="last_name"
                               label="Last Name"
                               placeholder="LastName" 
                               fieldProps={{
                                   prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the last name',
                                    },
                                ]} 
                                />
                            </ProForm.Group>
                            <ProForm.Group>
                           <ProFormText
                               width="md"
                               name="email"
                               label="Email"
                               placeholder="email@email.com" 
                               fieldProps={{
                                   prefix: <MailOutlined className={'prefixIcon'} />,
                               }}
                               rules={[
                                       {
                                       required: true,
                                       message: 'Please enter the email',
                                       },
                                   ]} 
                           />
                           <ProFormText.Password
                               width="md"
                               name="password"
                               fieldProps={{
                                   prefix: <LockOutlined className={'prefixIcon'} />,
                               }}
                               placeholder={'password: ant.design'}
                               label="Password"
                               
                           />
                       </ProForm.Group>
                       </ModalForm>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link to="/logout" onClick={() => setPathname('/logout')}>Logout</Link>
                </Menu.Item>
            </Menu>)
        }
     }, [mainData.user])


    return (
        <div
        id="dashboard-layout"
        style={{
            height: '100vh',
        }}
        >
        <ProLayout
            {...defaultProps}
            location={{
                pathname: mainData.pathname
            }}
            logo={virasoft}
            onMenuHeaderClick={(e) => console.log(e)}
            menuItemRender={(item, dom) => (
                <Link 
                    to={item.path}
                    onClick={() => {
                        setPathname(item.path || '/welcome');
                    }}
                >
                {dom}
                </Link>
            )}
            rightContentRender={() => (
            <Dropdown overlay={menu} trigger={['click']}>
                <div>
                    <Avatar shape="square" size="small" icon={<UserOutlined />} />
                    <span style={{paddingLeft: '5px'}}>{mainData.user?.email}</span>
                </div>
            </Dropdown>
            )}
            {...settings}
        >
            <PageContainer>
                {
                    {
                        '/images': <Image />,
                        '/newImage': <NewImageSet />,
                        '/patients': <Patients />,
                        '/profile': <Profile />
                    }[mainData.pathname]
                }
            </PageContainer>
        </ProLayout>

        </div>
    )
}