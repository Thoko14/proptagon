import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../platform/src/components/Layout';
import Button from '../../../platform/src/components/Button';
import Card from '../../../platform/src/components/Card';
import Tag from '../../../platform/src/components/Tag';

/**
 * Landing page for the Manage module
 */
const ManagePage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">🏠</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proptagon Manage
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Streamline your property management with comprehensive tools for tracking performance, 
                managing tenants, and optimizing your portfolio's cash flow.
              </p>
              <div className="flex justify-center mb-8">
                <Tag variant="manage">Coming Soon</Tag>
              </div>
              <Button variant="secondary" size="lg" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Management Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage your property portfolio effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Portfolio Dashboard
                </h3>
                <p className="text-gray-600">
                  Comprehensive overview of all your properties with key performance metrics and insights.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cash Flow Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor income, expenses, and net cash flow for each property in real-time.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tenant Management
                </h3>
                <p className="text-gray-600">
                  Manage tenant information, lease agreements, and communication all in one place.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Maintenance Tracking
                </h3>
                <p className="text-gray-600">
                  Track maintenance requests, schedule repairs, and manage contractor relationships.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Performance Analytics
                </h3>
                <p className="text-gray-600">
                  Detailed analytics on property performance, market comparisons, and ROI tracking.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Document Management
                </h3>
                <p className="text-gray-600">
                  Store and organize all property-related documents, contracts, and records securely.
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
                Ready to manage better?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join the waitlist to be notified when Proptagon Manage launches.
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

export default ManagePage;