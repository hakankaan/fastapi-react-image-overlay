import React, { useState, useEffect, useRef } from 'react'
import { Table, Space, Button, message, Modal } from 'antd';
import axios from 'axios'
import { BACKEND_URL } from '../config';
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import ProForm, { ProFormText, ProFormSelect, ModalForm } from '@ant-design/pro-form';

const Patients = () => {
    const [ data, setData ] = useState([])
    const [cancerTypes, setCancerTypes] = useState();
    const [loading, setLoading] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState(null)
    const createFormRef = useRef()
    
    useEffect(() => {
        getPatients()
        getCancerTypes()
    }, [])

    const columns = [
        {
          title: 'id',
          dataIndex: 'id',
          width: '0px',
        },
        {
          title: 'First Name',
          dataIndex: 'first_name',
          render: name => `${name}`,
          width: '20%',
        },
        {
          title: 'Last Name',
          dataIndex: 'last_name',
          width: '20%',
        },
        {
          title: 'ID Number',
          dataIndex: 'id_number',
          width: '20%',
        },
        {
          title: 'Cancer Type',
          dataIndex: 'cancer_type_name',
          width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
              <Space size="middle">
                <ModalForm
                    title="Update Patient"
                    trigger={
                        <Button type="primary">
                            <EditOutlined />
                            Update
                        </Button>
                    }
                    modalProps={{
                        onCancel: () => console.log('run'),
                        destroyOnClose: true
                    }}
                    onFinish={async (values) => {
                        console.log(values)
                        axios.put(
                            `${BACKEND_URL}/patients/${values.id}`, 
                            {
                                first_name: values.first_name,
                                last_name: values.last_name,
                                id_number: values.id_number,
                                cancer_type: parseInt(values.cancer_type)
                            },
                            {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                            }
                        ).then((response) => {
                            message.success('Patient Updated')
                            getPatients()
                        })
                        .catch((error) => console.log(error))
                        return true
                    }}
                    initialValues={{
                        id: record.id,
                        first_name: record.first_name,
                        last_name: record.last_name,
                        id_number: record.id_number,
                        cancer_type: parseInt(record.cancer_type)
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
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="id_number"
                            label="ID Number"
                            placeholder="ID Number"  
                            rules={[
                                {
                                required: true,
                                message: 'Please enter the id number',
                                },
                            ]}
                        />
                        <ProFormSelect
                            options={cancerTypes}
                            width="md"
                            name="cancer_type"
                            label="Cancer Type"
                            rules={[
                                {
                                required: true,
                                message: 'Please enter the cancer type',
                                },
                            ]}
                        />
                    </ProForm.Group>
                    <ProFormText
                        name="id"
                        fieldProps={{
                            style:{display: 'none', width: '0px', position:'absolute', height: '0px'},
                            hidden: true
                        }}
                    />
                </ModalForm>
              </Space>
            ),
            width: '10%'
        },
      ];

    const getPatients = () => {
        
        setLoading(true)
        axios.get(
            `${BACKEND_URL}/patients`, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
            }
        ).then((response) => {
            setLoading(false)
            setData(response.data)
        })
    }
    const getCancerTypes = () => {
        setLoading(true)
        axios.get(
            `${BACKEND_URL}/cancer_types`, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
            }
        ).then((response) => {
            setLoading(false)
            setCancerTypes(response.data.map((cancerType) => ({label: cancerType.name, value: cancerType.id})))
        })
    }
    return (
        <>
         <Table
            title={() => {
                return <ModalForm
                    formRef={createFormRef}
                    title="Create Patient"
                    trigger={
                        <Button type="primary">
                            <PlusOutlined />
                            Create
                        </Button>
                    }
                    modalProps={{
                        onCancel: () => createFormRef.current?.resetFields(),
                        destroyOnClose: true
                    }}
                    onFinish={async (values) => {
                        console.log(values)
                        axios.post(
                            `${BACKEND_URL}/patients`, 
                            {
                                first_name: values.first_name,
                                last_name: values.last_name,
                                id_number: values.id_number,
                                cancer_type: parseInt(values.cancer_type)
                            },
                            {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                            }
                        ).then((response) => {
                            message.success('Patient Created')
                            getPatients()
                        })
                        .catch((error) => message.error('Could not create'))
                        return true
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
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="id_number"
                            label="ID Number"
                            placeholder="ID Number"  
                            rules={[
                                {
                                required: true,
                                message: 'Please enter the id number',
                                },
                            ]}
                        />
                        <ProFormSelect
                            options={cancerTypes}
                            width="md"
                            name="cancer_type"
                            label="Cancer Type"
                            rules={[
                                {
                                required: true,
                                message: 'Please enter the cancer type',
                                },
                            ]}
                        />
                    </ProForm.Group>
                </ModalForm>
            }}
            columns={columns}
            dataSource={data}
            pagination={false}
            loading={loading}
            onChange={getPatients}
        />   
        
        </>
    )
}

export default Patients
