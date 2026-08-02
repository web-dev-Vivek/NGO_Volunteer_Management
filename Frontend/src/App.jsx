import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>
          <header>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
        </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
