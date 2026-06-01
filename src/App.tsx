import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ClickerPage from './pages/ClickerPage'
import PianoPage from './pages/PianoPage'
import MainHubPage from './pages/MainHubPage'
import Layout from './components/layout/Layout'
import PixelPage from './pages/PixelPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainHubPage />}></Route>
          <Route path="/clicker" element={<ClickerPage />}></Route>
          <Route path="/piano" element={<PianoPage />}></Route>
          <Route path="/pixel" element={<PixelPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
