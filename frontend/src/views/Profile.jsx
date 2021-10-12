import React from 'react'
import { Form, message } from 'antd';
import ProForm, { ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import { LockOutlined } from '@ant-design/icons'
const Profile = () => {
    return (
        <>
    <ProForm
      onFinish={async (values) => {
        console.log(values);
        message.success('提交成功');
      }}
      initialValues={{
        first_name: '蚂蚁设计有限公司',
        last_name: '蚂蚁设计集团',
        useMode: 'chapter',
      }}
    >
        <ProForm.Group>
            <ProFormText
                width="md"
                name="first_name"
                label="First Name"
                placeholder="First Name"
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
                rules={[
                        {
                        required: true,
                        message: 'Please enter the last name',
                        },
                    ]} 
            />
            <ProFormText
                width="md"
                name="email"
                label="Email"
                placeholder="email@email.com" 
                rules={[
                        {
                        required: true,
                        message: 'Please enter the email',
                        },
                    ]} 
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'password: ant.design'}
              rules={[
                {
                  required: true,
                  message: 'Please enter password',
                },
              ]}
            />
        </ProForm.Group>
      
    </ProForm>
        </>
    )
}

export default Profile
