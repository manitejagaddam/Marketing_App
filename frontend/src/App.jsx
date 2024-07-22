import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Pages/Home'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Predict from './Pages/Predict'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <Router>
    <nav className="navbar">
      <div className="logo">
        <img className='logo-img'src="logo.png" alt="" srcset="" />
      </div>
        <li className="elements">
          <a><Link to={"/"}>Home</Link></a>
        </li>
        <li className="elements">
        <a href='https://c759ln1v-5002.euw.devtunnels.ms/'>Predict</a>

        </li>

        <li className=" contact " id="">
          <a href="#">Contact Us</a>
        </li>
      </nav>
      <Routes>
        <Route path='/' Component={Home} />
        {/* <Route path='/predict' Component={Predict} /> */}

        <Route/>

      </Routes>
    </Router>
    
      
    </>
  )
}

export default App
