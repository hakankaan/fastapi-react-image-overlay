import React, { useState, useEffect, useContext} from 'react'
import ProForm, {
    StepsForm,
  } from '@ant-design/pro-form';
import { mainContext } from './context/mainContext';
import { BACKEND_URL } from '../config';
import { Empty, Button, message, Upload } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const NewImageSet = () => {
    const { mainData, createDataSet, setRawImageId, setMaskImageId, setRawFileList, setMaskFileList } = useContext(mainContext)
    const [current, setCurrent] = useState(0);


    return (<>
        <StepsForm
        onFinish={async (values) => {
          message.success('Success');
        }}
        formProps={{
          validateMessages: {
            required: 'Required',
          },
        }}
        current={current}
        submitter={false}
      >
        <StepsForm.StepForm
          name="base"
          title="Raw Image"
          onFinish={async () => {
            return true;
          }}
        >
            <Dragger 
                id="rawFile"
                name= 'file'
                headers={{
                  authorization: `Bearer ${localStorage.getItem('token')}`,
                }}
                accept=".jpg,.jpeg"
                action={`${BACKEND_URL}/images/raw`}
                multiple={false}
                onChange={(info) => {
                    setRawFileList([...info.fileList])
                  if (info.file.status === 'done') {
                    setRawImageId(info.file.response.id);
                    setCurrent(current + 1);
                  }
                }}
                fileList={mainData.rawFileList}
            >
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload raw image</p>
            </Dragger>
        </StepsForm.StepForm>

        <StepsForm.StepForm name="checkbox" title="Mask Image">
            <Dragger 
                name= 'file'
                headers={{
                  authorization: `Bearer ${localStorage.getItem('token')}`,
                }}
                accept=".jpg,.jpeg"
                action={`${BACKEND_URL}/images/mask`}
                multiple={false}
                onChange={(info) => {
                    setMaskFileList([...info.fileList])
                  if (info.file.status === 'done') {
                    setMaskImageId(info.file.response.id);
                    setCurrent(current + 1);
                  }
                }}
                fileList={mainData.maskFileList}
            >
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload mask image</p>
            </Dragger>
          
        </StepsForm.StepForm>
      </StepsForm>
      </>
    )
}

export default NewImageSet
