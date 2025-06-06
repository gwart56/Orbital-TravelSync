import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'

function App() {

  return (
    <>
    <Header />
    <div class="activity-content">
    <h1 className="text-primary">Welcome to TravelSync</h1>
    <p className="lead">Plan your group trips easily.</p>
    <button className="btn btn-success">Start</button>
  </div>
    </>
  )
}

export default App
