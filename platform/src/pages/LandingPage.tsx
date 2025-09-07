import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Button from '../components/Button'
import Card from '../components/Card'
import Tag from '../components/Tag'

const LandingPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="relative max-w-screen-xl mx-auto px-4">
          <div className="relative h-[700px] sm:h-[750px] lg:h-[800px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-sky-200">
            <img
              src="/hero-map3.png"
              alt="Map of investment hotspots"
              className="w-full h-full object-cover object-bottom"
              style={{
                filter: 'brightness(1.2) saturate(0.6) contrast(0.9)'
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-s" />

            {/* Hero text content without visible box, slightly higher */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 translate-y-[-20%]">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}>
                Smarter property investing starts here
              </h1>
              <p className="mt-2 text-lg sm:text-xl text-gray-800 max-w-2xl mb-8" style={{ textShadow: '0 0 6px rgba(255, 255, 255, 0.6)' }} >
                Research suburbs, score opportunities, and build your portfolio with confidence.
              </p>
              <Link to="/grow">
                <Button variant="secondary" size="lg">
                  Explore Suburbs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-sky-50 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it Works
            </h2>
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
            <Link to="/grow">
              <Button size="lg">Explore Grow Module</Button>
            </Link>
          </div>
        </div>  
      </section>

      {/* How Grow compares */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Grow compares
            </h2>
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

      {/* Modules Overview */}
      <section className="bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed in property investment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Proptagon is a strategic property investment platform built to guide everyday Australians through every stage of their investment journey — from research to acquisition, management and eventual sale. We're in early development and starting with the Grow module, but our vision spans the full lifecycle of smart property investing.
            </p>
          </div>

          {/* Top row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="grow">Live</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  Research suburbs and score investment opportunities with data-driven insights. 
                  Use strategic filters to find high-potential areas that match your investment style.
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
                  Analyze market trends and make informed investment decisions. 
                  Track market movements and identify the optimal timing for your investments.
                </p>
                <Link to="/invest">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Manage</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="manage">Coming Soon</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  Track your portfolio performance and manage properties efficiently. 
                  Monitor cash flow, expenses, and property value changes in real-time.
                </p>
                <Link to="/manage">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Bottom row - 2 centered cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Operate</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="operate">Coming Soon</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  Streamline property operations and maintenance workflows. 
                  Manage tenants, repairs, and property administration from one platform.
                </p>
                <Link to="/operate">
                  <Button variant="secondary" size="sm">Learn More</Button>
                </Link>
              </div>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sell</h3>
                <div className="flex justify-center mb-3">
                  <Tag variant="sell">In Development</Tag>
                </div>
                <p className="text-gray-600 mb-6">
                  Maximize returns with strategic selling and market timing. 
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


      {/* Call to Action Section (Start Exploring) */}
      <section className="bg-blue-100 py-20">
        <div className="max-w-screen-xl mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Start exploring smarter
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of investors using Proptagon to find the right suburbs faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/grow">
                <Button size="lg">
                  Explore Now
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      </div>
    </Layout>
  )
}

export default LandingPage