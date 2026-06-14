import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ClickerPage from './pages/ClickerPage'
import PianoPage from './pages/PianoPage'
import Layout from './components/layout/Layout'
import PixelPage from './pages/PixelPage'
import PhysicsPage from './pages/PhysicsPage'
import PianoComposePage from './pages/PianoComposePage'
import GamePage from './pages/GamePage'
import BlockStudioPage from './pages/BlockStudioPage'
import WebDownloadPage from './pages/WebDownloadPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BlockStudioPage />}></Route>
          <Route path="/clicker" element={<ClickerPage />}></Route>
          <Route path="/game" element={<GamePage />}></Route>
          <Route path="/piano" element={<PianoPage />}></Route>
          <Route path="/piano-compose" element={<PianoComposePage />}></Route>
          <Route path="/pixel" element={<PixelPage />}></Route>
          <Route path="/sandbox" element={<PhysicsPage />}></Route>
          <Route path="/code" element={<WebDownloadPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
