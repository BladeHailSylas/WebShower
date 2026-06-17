import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import BlockStudioPage from './pages/BlockStudioPage'
import WebDownloadPage from './pages/WebDownloadPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BlockStudioPage />}></Route>
          <Route path="/code" element={<WebDownloadPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
