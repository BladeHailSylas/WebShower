import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ClickerPage from './pages/ClickerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/clicker" element={<ClickerPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
