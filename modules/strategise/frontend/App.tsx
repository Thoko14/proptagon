import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../platform/src/components/Layout';
import Button from '../../../platform/src/components/Button';
import Card from '../../../platform/src/components/Card';
import Tag from '../../../platform/src/components/Tag';
import WaitlistModal from '../../../platform/src/components/WaitlistModal';

/**
 * Landing page for the Strategise module
 */
const StrategisePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proptagon Strategise
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Strategically manage your property portfolio with advanced analytics, market insights, 
                and data-driven decision making tools for optimal asset performance.
              </p>
              <div className="flex justify-center mb-8">
                <Tag variant="strategise">Coming Soon</Tag>
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
                Strategic Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to strategically manage your property portfolio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Strategic Portfolio Dashboard
                </h3>
                <p className="text-gray-600">
                  Advanced analytics and insights for strategic portfolio decision-making with market comparisons and performance forecasting.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Portfolio Cash Flow Analysis
                </h3>
                <p className="text-gray-600">
                  Strategic cash flow modeling and forecasting across your entire portfolio with scenario planning.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Market Analysis
                </h3>
                <p className="text-gray-600">
                  Comprehensive market analysis and trend identification to inform strategic portfolio decisions.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Asset Optimization
                </h3>
                <p className="text-gray-600">
                  Strategic asset optimization recommendations based on market conditions and portfolio performance.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Strategic Analytics
                </h3>
                <p className="text-gray-600">
                  Advanced portfolio analytics with predictive modeling, risk assessment, and strategic recommendations.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🎲</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Risk Management
                </h3>
                <p className="text-gray-600">
                  Comprehensive risk assessment and mitigation strategies for your property portfolio.
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
                Ready to strategise better?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join the waitlist to be notified when Proptagon Strategise launches.
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

export default StrategisePage;