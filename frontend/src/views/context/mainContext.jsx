import React, { createContext, useReducer, useState, useEffect, useRef } from 'react'
import { mainReducer } from './mainReducer'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { useHistory } from 'react-router';
import { Image, Button, Tooltip, message } from 'antd'
import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import ProForm, { ProFormText, ProFormSelect, ModalForm } from '@ant-design/pro-form';
import Draw from '../Draw';

const initialState = {
    newImage: false,
    rawFileList: [],
    maskFileList: [],
    rawImageId: null,
    maskImageId: null,
    imageSets : [],
    pathname: '/images',
    overlayModal: false,
    selectedImageSet: null,
    user: null,
}

export const mainContext = createContext()

export const MainProvider = ({children}) => {
    const [mainData, mainDispatch] = useReducer(mainReducer, initialState)
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory();
    const canvasRef = useRef()

    useEffect(() => {
        if(localStorage.getItem('email')){
            setUser({
                id:localStorage.getItem('id'),
                email:localStorage.getItem('email'),
                first_name:localStorage.getItem('first_name'),
                last_name:localStorage.getItem('last_name'),
            })
        }
    }, [])

    useEffect(() => { 
        switch(mainData.pathname){
            case '/images':
                getImageSet()
                break

            case '/patients':
                // getDatas()
                break
            default:
                break
        }
    }, [mainData.pathname])

    useEffect(() => {
        if(typeof mainData.rawImageId === 'number' && typeof mainData.maskImageId === 'number') {
            createDataSet(mainData.rawImageId, mainData.maskImageId)
            .then(() => {
                setPathname('/images')
                history.push('/images')
                setRawImageId(null)
                setMaskImageId(null)
            })
        }
      }, [mainData.maskImageId])

    return (
        <mainContext.Provider 
            value={{
                mainData, 
                isLoading, 
                setIsLoading,
                setNewImage,
                setRawImageId,
                setMaskImageId,
                setPathname,
                createDataSet,
                setRawFileList,
                setMaskFileList,
                getImageSet,
                setOverlayModal,
                setSelectedImageSet,
                setUser,
            }}
        >
            {children}
        </mainContext.Provider>
    )

    function setNewImage(value){
        mainDispatch({type:"setNewImage", payload:{value}})
    }

    function setRawImageId(id){
        mainDispatch({type:"setRawImageId", payload:{id}})
    }

    function setMaskImageId(id){
        mainDispatch({type:"setMaskImageId", payload:{id}})
    }
    
    function setPathname(pathname){
        mainDispatch({type:"setPathname", payload:{pathname}})
    }

    function setRawFileList(list){
        mainDispatch({type:"setRawFileList", payload:{list}})
    }

    function setMaskFileList(list){
        mainDispatch({type:"setMaskFileList", payload:{list}})
    }

    async function createDataSet(rawImageId, maskImageId){
        await axios.post(
            `${BACKEND_URL}/image_sets`, 
            {
                raw_image_id: rawImageId,
                mask_image_id: maskImageId
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
            }
        )
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    }
    async function getImageSet(){
        await axios.get(
            `${BACKEND_URL}/image_sets`, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
            }
        )
        .then((response) => {
            const imageSet = response.data.map((item) => ({
                title: `#${item.image_set_id}`,
                actions: [
                <Tooltip title="analyze">
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => {
                        setOverlayModal(true)
                        setSelectedImageSet(item)
                    }} />
                </Tooltip>,
                    <ModalForm
                        width={900}
                       title="Edit Mask Image"
                       trigger={
                            <Button shape="circle" icon={<EditOutlined />} />
                       }
                       drawerProps={{
                           onCancel: () => console.log('run'),
                           destroyOnClose: true,
                       }}
                       onFinish={async (values) => {
                           console.log(canvasRef.current)
                           const base64 = await canvasRef.current?.toDataURL('image/png')
                           const blob = dataURLtoBlob(base64)
                           const postData = { file: blob}
                           axios.post(
                               `${BACKEND_URL}/images/update-mask/${item.id}`, 
                               postData,
                               {
                                   headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                               }
                           ).then((response) => {
                               message.success('Mask Image Edited')
                           })
                           .catch((error) => console.log(error))
                           return true
                       }}
                   >
                       <Draw {...{url: item.mask_image_url, canvasRef }} />
                   </ModalForm>
                    ],
                // avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                content: (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div
                      style={{
                          width: 200,
                        }}
                    >
                        <Image
                            width={100}
                            height={100}
                            src={item.raw_image_url}
                        />
                        <Image
                            width={100}
                            height={100}
                            src={item.mask_image_url}
                        />
                    </div>
                  </div>
                ),
              }));
            mainDispatch({type: "getImageSet", payload:{imageSet}});
        })
        .catch((error) => console.log(error))
    }

    function setOverlayModal(value){
        mainDispatch({type: "setOverlayModal", payload: {value}});
    }

    function setSelectedImageSet(value){
        mainDispatch({type: "setSelectedImageSet", payload: {value}});
    }

    function setUser(value){
        mainDispatch({type: "setUser", payload: {value}});
    }
}
        


function dataURLtoBlob(dataURL) {
    let array, binary, i, len;
    binary = atob(dataURL.split(',')[1]);
    array = [];
    i = 0;
    len = binary.length;
    while (i < len) {
      array.push(binary.charCodeAt(i));
      i++;
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  };