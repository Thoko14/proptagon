import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import GrowPage from '../../modules/grow/frontend/App'
import InvestPage from '../../modules/invest/frontend/App'
import StrategisePage from '../../modules/strategise/frontend/App'
import ManagePage from '../../modules/manage/frontend/App'
import SellPage from '../../modules/sell/frontend/App'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/grow" element={<GrowPage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/strategise" element={<StrategisePage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/sell" element={<SellPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App