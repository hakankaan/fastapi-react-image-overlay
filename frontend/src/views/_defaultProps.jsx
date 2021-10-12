import React from 'react';
import { PlusOutlined, FileImageOutlined, TableOutlined } from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/newImage',
        name: 'Create Image Set',
        icon: <PlusOutlined />,
        component: './NewImageSet',
      },
      {
        path: '/images',
        name: 'Image Sets',
        icon: <FileImageOutlined />,
        component: './Image',
      },
      {
        path: '/patients',
        name: 'Patients',
        icon: <TableOutlined />,
        component: './Patients',
      }
    ],
  },
  location: {
    pathname: '/',
  },
};