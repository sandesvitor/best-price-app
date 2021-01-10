import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header(props) {
    const [input, setInput] = useState('')

    return (
        <header>
            <div className="top-menu">
                <Link to="/">
                    <img className="logo" src={require('../../assets/logo_template.png')} alt="Brand Logo" />
                </Link>
                <div className="search-bar">
                    <input type="text" placeholder="Search..."
                        onChange={e => {
                            console.debug(e.target.value)
                            setInput(e.target.value)
                        }} />
                </div>
            </div>
            <div className="bottom-menu">
            </div>
        </header>
    )
}