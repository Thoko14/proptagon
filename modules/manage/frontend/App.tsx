import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../platform/src/components/Layout';
import Button from '../../../platform/src/components/Button';
import Card from '../../../platform/src/components/Card';
import Tag from '../../../platform/src/components/Tag';
import WaitlistModal from '../../../platform/src/components/WaitlistModal';

/**
 * Landing page for the Manage module
 */
const ManagePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">⚙️</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proptagon Manage
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Streamline property management operations. Manage tenants, maintenance requests, 
                contracts, reminders, and day-to-day property administration from one comprehensive platform.
              </p>
              <div className="flex justify-center mb-8">
                <Tag variant="manage">Coming Soon</Tag>
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
                Property Management Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage your properties efficiently
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
                  Management Dashboard
                </h3>
                <p className="text-gray-600">
                  Real-time overview of all property management activities, pending tasks, and operational metrics.
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
                Ready to manage efficiently?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join the waitlist to be notified when Proptagon Manage launches.
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

export default ManagePage;