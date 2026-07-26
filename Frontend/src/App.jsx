import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>NGO Volunteer System - Auth Cleared</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
