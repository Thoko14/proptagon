import React from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const ConfirmedPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Proptagon! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Your email has been confirmed and you're now on our waitlist. We'll keep you updated on our progress and notify you when we launch.
            </p>
            
            <div className="bg-sky-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                What happens next?
              </h2>
              <ul className="text-gray-600 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start">
                  <span className="text-sky-500 font-bold mr-2">→</span>
                  <span>We'll send you updates on our development progress</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-500 font-bold mr-2">→</span>
                  <span>You'll be among the first to know when we launch</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-500 font-bold mr-2">→</span>
                  <span>Early access opportunities for waitlist members</span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-500 font-bold mr-2">→</span>
                  <span>Exclusive insights and property investment tips</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="bg-sky-500 text-white hover:bg-sky-600">
                  Explore Proptagon
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                While You Wait
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get familiar with what Proptagon will offer and start thinking about your property investment strategy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow Module</h3>
                <p className="text-gray-600">
                  Discover suburbs and uncover data-driven growth potential with our advanced analytics.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Invest Module</h3>
                <p className="text-gray-600">
                  Make informed investment decisions with our calculators and financial tools.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategise Module</h3>
                <p className="text-gray-600">
                  Tailor strategies to your profile and risk appetite with our strategic tools.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ConfirmedPage;
