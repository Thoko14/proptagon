import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../platform/src/components/Layout';
import Button from '../../../platform/src/components/Button';
import Card from '../../../platform/src/components/Card';
import Tag from '../../../platform/src/components/Tag';
import WaitlistModal from '../../../platform/src/components/WaitlistModal';

/**
 * Landing page for the Grow module
 */
const GrowPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">📈</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proptagon Grow
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Research suburbs and score investment opportunities with data-driven insights. 
                Use strategic filters to find high-potential areas that match your investment style.
              </p>
              <div className="flex justify-center mb-8">
                <Tag variant="grow">Under development</Tag>
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
                Grow Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to discover and analyze investment opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Interactive Maps
                </h3>
                <p className="text-gray-600">
                  Explore suburbs with interactive heatmaps, filters, and overlays to identify investment hotspots.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Investment Scoring
                </h3>
                <p className="text-gray-600">
                  Get strategy-based investment scores that adapt to your investment style and goals.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Strategic Filters
                </h3>
                <p className="text-gray-600">
                  Filter suburbs by growth potential, yield, cash flow, and other investment criteria.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  School Catchments
                </h3>
                <p className="text-gray-600">
                  View school catchment areas and analyze their impact on property values and demand.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Market Data
                </h3>
                <p className="text-gray-600">
                  Access comprehensive market data including prices, trends, and demographic information.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Alerts & Watchlist
                </h3>
                <p className="text-gray-600">
                  Set up alerts and watchlists to track suburbs and get notified of market changes.
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
                Ready to grow your portfolio?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Start exploring suburbs and finding investment opportunities today.
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

export default GrowPage;
