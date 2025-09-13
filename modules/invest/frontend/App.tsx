import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../platform/src/components/Layout';
import Button from '../../../platform/src/components/Button';
import Card from '../../../platform/src/components/Card';
import Tag from '../../../platform/src/components/Tag';
import WaitlistModal from '../../../platform/src/components/WaitlistModal';

/**
 * Landing page for the Invest module
 */
const InvestPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">💰</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proptagon Invest
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Make informed investment decisions with data-driven insights and market analysis. 
                Track market trends, analyze opportunities, and optimize your investment strategy.
              </p>
              <div className="flex justify-center mb-8">
                <Tag variant="invest">Coming Soon</Tag>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Investment Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to make smarter investment decisions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Market Analysis
                </h3>
                <p className="text-gray-600">
                  Comprehensive market data and trends analysis to identify the best investment opportunities.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Investment Scoring
                </h3>
                <p className="text-gray-600">
                  AI-powered scoring system to evaluate investment potential and risk factors.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Portfolio Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your investment portfolio performance and track key metrics over time.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real-time Alerts
                </h3>
                <p className="text-gray-600">
                  Get notified when market conditions change or new opportunities arise.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Due Diligence Tools
                </h3>
                <p className="text-gray-600">
                  Comprehensive tools to research and analyze potential investments thoroughly.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Investment Planning
                </h3>
                <p className="text-gray-600">
                  Plan your investment strategy with goal setting and milestone tracking.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-100 py-20">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to invest smarter?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join the waitlist to be notified when Proptagon Invest launches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Join Waitlist
                </Button>
                <Link to="/">
                  <Button size="lg">
                    Back to Home
                  </Button>
                </Link>
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
  );
};

export default InvestPage;