import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Button from '../components/Button'
import Card from '../components/Card'
import Tag from '../components/Tag'
import WaitlistModal from '../components/WaitlistModal'

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Layout>
      <div className="bg-gray-50">

      {/* Hero Section */}
      

      <section className="bg-white py-16">
        <div className="relative max-w-screen-xl mx-auto px-4">
          <div className="relative h-[680px] sm:h-[740px] lg:h-[800px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-sky-100 transform hover:scale-[1.01] transition-all duration-500" style={{ 
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(14, 165, 233, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 0 50px rgba(14, 165, 233, 0.1)' 
          }}>
            <img
              src="/hero-map3.png"
              alt="Map of investment hotspots"
              className="w-full h-full object-cover object-center"
              style={{
                filter: 'saturate(0.4) brightness(1.1) contrast(0.9) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
                transform: 'translateZ(0)'
              }}
              loading="eager"
              fetchPriority="high"
            />

            {/* Light sky/white wash to soften image */}
            <div className="absolute inset-0 bg-white/10 mix-blend-screen" />
            <div className="absolute inset-0 bg-sky-100/20 mix-blend-lighten" />

            {/* Hero content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 -translate-y-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Smarter property investing starts here
              </h1>
              <p className="mt-2 text-xl sm:text-2xl lg:text-3xl text-gray-800 max-w-2xl mb-8">
                Research suburbs, score opportunities, and build your portfolio with confidence.
              </p>
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="shadow-2xl hover:!bg-sky-600 transform hover:scale-105 transition-all duration-200 !opacity-100"
                style={{
                  backgroundColor: '#0ea5e9 !important',
                  color: '#ffffff !important',
                  border: '1px solid #0ea5e9 !important',
                  boxShadow: '0 10px 25px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important',
                  opacity: '1 !important'
                }}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section className="bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your complete property investment lifecycle
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Proptagon guides you through every stage of your property investment journey — from initial research and opportunity discovery, through strategic portfolio management, to eventual sale. We're building a comprehensive platform that grows with your investment goals.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-orange-800 font-medium">
                🚧 <strong>Under Development:</strong> Our Grow module is currently part of our MVP. Join the waitlist to get early access!
              </p>
            </div>
          </div>

          {/* Top row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="grow">Under Development</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  <strong>Stage 1:</strong> Discover and research high-potential suburbs with data-driven insights. 
                  Use strategic filters to find areas that match your investment goals and risk profile.
                </p>
                <Link to="/grow">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Invest</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="invest">Coming Soon</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  <strong>Stage 2:</strong> Guide your investment decisions with calculators and financial tools. 
                  Use investment calculators, loan analysis, and financial planning tools to make informed decisions.
                </p>
                <Link to="/invest">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategise</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="strategise">Coming Soon</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  <strong>Stage 3:</strong> Strategically manage your property portfolio with advanced analytics and market insights. 
                  Make data-driven decisions for optimal asset performance and portfolio growth.
                </p>
                <Link to="/strategise">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Bottom row - 2 centered cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Manage</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="manage">Coming soon</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  <strong>Stage 4:</strong> Handle day-to-day property management operations and tenant relations. 
                  Manage tenants, maintenance requests, contracts, reminders, and property administration.
                </p>
                <Link to="/manage">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sell</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="sell">Coming soon</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  <strong>Stage 5:</strong> Maximize returns with strategic selling and market timing. 
                  Analyze market conditions and optimize your exit strategy for maximum profit.
                </p>
                <Link to="/sell">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>


      {/* How Grow Works */}
      <section className="bg-sky-50 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our first module: Grow 
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Our MVP focuses on the Grow module to help you discover and research high-potential investment opportunities
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-orange-800 font-medium">
                🚧 <strong>Join the Waitlist:</strong> Our Grow module is currentlyunder development. Get early access when we launch!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Define your strategy
              </h3>
              <p className="text-gray-600">
                Choose your investment style – growth, cashflow or buy & hold.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Find and explore your suburbs
              </h3>
              <p className="text-gray-600">
                Use filters, scores and data to identify high-potential areas.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Set alerts and stay informed
              </h3>
              <p className="text-gray-600">
                Track suburb changes, get notified when conditions improve.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Find available properties
              </h3>
              <p className="text-gray-600">
                Find property listings in your suburb that match your strategy.
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" disabled>
              Join Waitlist
            </Button>
          </div>
        </div>  
      </section>

      {/* How Grow compares */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What makes Grow unique?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Our first module provides a comprehensive set that sets it apart from the competition and helps you make smarter investment decisions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Proptagon (Grow) ✅</th>
                  <th className="text-center p-6 font-semibold text-gray-900">RealEstate Investar</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Microburbs / OpenAgent</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-gray-700">Suburb investment score (strategy-based)</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  </td>
                  <td className="p-6 text-center text-gray-500">✗ (fixed criteria)</td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-gray-700">Interactive heatmap with filters & overlays</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  </td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-gray-700">Investor strategy filters (growth, yield, etc.)</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  </td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-gray-700">School catchment area overlays</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  </td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-gray-700">Alerts & suburb watchlist</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  </td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                  <td className="p-6 text-center text-gray-500">✗</td>
                </tr>
                <tr>
                  <td className="p-6 text-gray-700">Free suburb exploration (no login required)</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  </td>
                  <td className="p-6 text-center text-gray-500">✗ (trial paywall)</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Yes
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>         
        </div>
      </section>

      {/* Call to Action Section (Start Exploring) */}
      <section className="bg-blue-100 py-20">
        <div className="max-w-screen-xl mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Be the first to experience Proptagon
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join our waitlist to get early access to the Grow module and be notified when we launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      </div>
      
      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </Layout>
  )
}

export default LandingPage