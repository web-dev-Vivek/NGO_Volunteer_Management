import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthLayout } from './layouts/AuthLayout'
import Login from "./pages/authentication/Login"
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
