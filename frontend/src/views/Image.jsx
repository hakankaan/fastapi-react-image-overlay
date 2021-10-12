import React, { useState, useContext, useEffect } from 'react'
import ProList from '@ant-design/pro-list';
import { Empty, Button, message, Modal } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';

import { mainContext } from './context/mainContext';

import { Link } from 'react-router-dom';
import AnalyzeImageSet from './AnalyzeImageSet';

const Image = () => {
    const { mainData, setNewImage, setPathname, getImageSet, setOverlayModal, setSelectedImageSet } = useContext(mainContext);
  

    const addButton = (size = 'default') => (
      <Link 
          to={'/newImage'}
          onClick={() => {
              setPathname('/newImage');
          }}
      >
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size={size}
            onClick={() =>setNewImage(true)}
        >
            Create Image Set
        </Button>
    </Link>
    )
    return (
        <>
        {
            mainData.imageSets.length > 0 
            ? (<ProList
                  style={{
                      width: '100%',
                      height: '1000px',
                  }}
                  grid={{ gutter: 16, column: 6 }}
                  metas={{
                      title: {},
                      subTitle: {},
                      type: {},
                      avatar: {},
                      content: {},
                      actions: {},
                  }}
                  headerTitle={
                      "Image Sets"
                  }
                  dataSource={mainData.imageSets}
              />) 
            : <> 
                <Empty description="No Image Data"> 
                {addButton('large')}
                </Empty>
            </>
    }
    <Modal
      visible={mainData.overlayModal}
      title="Image Set Overlay Analyze"
      onCancel={() => {
        setOverlayModal(false)
        setSelectedImageSet(false)
      }}
      footer={null}
      width={'50vw'}
      bodyStyle={{
        height: '50vh'
      }}
    >
      <AnalyzeImageSet />
    </Modal>
    

    </>
    )
}

export default Image;


