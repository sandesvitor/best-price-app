import React from 'react';
import './Mobiles.css';

import Products from '../templates/Products'

let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
    baseUrl = process.env.REACT_APP_BASE_URL_DEV
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.REACT_APP_BASE_URL_PRODUCTION
}


export default function Mobiles() {
    return (
        <Products
            sidebarTitle="Mobile"
            baseUrl={baseUrl}
        />
    )
}