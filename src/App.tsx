import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ClickerPage from './pages/ClickerPage'
import PianoPage from './pages/PianoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/clicker" element={<ClickerPage />}></Route>
        <Route path="/piano" element={<PianoPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
