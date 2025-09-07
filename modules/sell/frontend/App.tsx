import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../platform/src/components/Layout';
import Button from '../../../platform/src/components/Button';
import Card from '../../../platform/src/components/Card';
import Tag from '../../../platform/src/components/Tag';

/**
 * Landing page for the Sell module
 */
const SellPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">📊</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                PropBase Sell
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Maximize returns with strategic selling and market timing. Analyze market conditions 
                and optimize your exit strategy for maximum profit.
              </p>
              <div className="flex justify-center mb-8">
                <Tag variant="sell">In Development</Tag>
              </div>
              <Button variant="secondary" size="lg" disabled>
                In Development
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sales Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to sell your properties at the right time and price
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Market Timing Analysis
                </h3>
                <p className="text-gray-600">
                  Analyze market conditions and identify the optimal time to sell your property.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Price Optimization
                </h3>
                <p className="text-gray-600">
                  Get data-driven pricing recommendations based on market analysis and property condition.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Buyer Targeting
                </h3>
                <p className="text-gray-600">
                  Identify and target the right buyers for your property based on market data.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sales Analytics
                </h3>
                <p className="text-gray-600">
                  Track sales performance, market trends, and competitor analysis.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sales Preparation
                </h3>
                <p className="text-gray-600">
                  Get guidance on property preparation, staging, and marketing strategies.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Agent Network
                </h3>
                <p className="text-gray-600">
                  Connect with vetted real estate agents and professionals in your area.
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
                Ready to sell strategically?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join the waitlist to be notified when PropBase Sell launches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" disabled>
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
    </Layout>
  );
};

export default SellPage;