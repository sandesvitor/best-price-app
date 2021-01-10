import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import './App.css';

import Header from '../components/templates/Header'
import Menu from '../components/templates/Menu'
import Section from '../components/templates/Section'
import Footer from '../components/templates/Footer'

export default function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <Menu />
        <Section />
        <Footer />
      </BrowserRouter>
    </div>
  )
}

