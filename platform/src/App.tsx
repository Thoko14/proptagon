import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GrowPage from '../../modules/grow/frontend/App'
import InvestPage from '../../modules/invest/frontend/App'
import ManagePage from '../../modules/manage/frontend/App'
import OperatePage from '../../modules/operate/frontend/App'
import SellPage from '../../modules/sell/frontend/App'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/grow" element={<GrowPage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/operate" element={<OperatePage />} />
          <Route path="/sell" element={<SellPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App