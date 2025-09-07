import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../platform/src/components/Layout';
import Button from '../../../platform/src/components/Button';
import Card from '../../../platform/src/components/Card';
import Tag from '../../../platform/src/components/Tag';

/**
 * Landing page for the Operate module
 */
const OperatePage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">⚙️</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proptagon Operate
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Streamline property operations and maintenance workflows. Manage tenants, repairs, 
                and property administration from one comprehensive platform.
              </p>
              <div className="flex justify-center mb-8">
                <Tag variant="operate">Coming Soon</Tag>
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
                Operations Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to operate your properties efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Maintenance Management
                </h3>
                <p className="text-gray-600">
                  Schedule and track maintenance tasks, manage work orders, and coordinate with contractors.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tenant Portal
                </h3>
                <p className="text-gray-600">
                  Provide tenants with a self-service portal for rent payments, maintenance requests, and communication.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Operations Dashboard
                </h3>
                <p className="text-gray-600">
                  Real-time overview of all operational activities, pending tasks, and performance metrics.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Vendor Management
                </h3>
                <p className="text-gray-600">
                  Manage relationships with contractors, suppliers, and service providers efficiently.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Compliance Tracking
                </h3>
                <p className="text-gray-600">
                  Track regulatory compliance, safety inspections, and certification renewals.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Communication Hub
                </h3>
                <p className="text-gray-600">
                  Centralized communication system for tenants, contractors, and property managers.
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
                Ready to operate efficiently?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join the waitlist to be notified when Proptagon Operate launches.
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

export default OperatePage;