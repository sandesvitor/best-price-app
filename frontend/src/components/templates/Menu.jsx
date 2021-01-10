import React from 'react'
import { Link } from 'react-router-dom'
import './Menu.css'

export default props =>
    <div className="main-menu">
        <Link to="/hardwares" style={{ textDecoration: 'none' }}>
            <div className="icon-button" title="Hardwares">
                <i className="fas fa-memory fa-3x"></i>
            </div>
        </Link>

        <Link to="/desktops" style={{ textDecoration: 'none' }}>
            <div className="icon-button" title="Desktops">
                <i className="fas fa-desktop fa-3x"></i>
            </div>
        </Link>

        <Link to="/mobiles" style={{ textDecoration: 'none' }}>
            <div className="icon-button" title="Mobiles">
                <i className="fas fa-mobile-alt fa-3x"></i>
            </div>
        </Link>
    </div>