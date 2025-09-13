import React from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const UnsubscribedPage: React.FC = () => {
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
              Successfully Unsubscribed
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              You have been successfully removed from the Proptagon waitlist. You will no longer receive emails from us.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                What happens next?
              </h2>
              <ul className="text-gray-600 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">✓</span>
                  <span>You won't receive any more waitlist emails</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">✓</span>
                  <span>Your email has been removed from our system</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">✓</span>
                  <span>You can always rejoin the waitlist if you change your mind</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="bg-sky-500 text-white hover:bg-sky-600">
                  Back to Home
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg">
                  Learn More About Proptagon
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
                Still Interested in Property Investing?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Even though you've unsubscribed from our waitlist, you can still explore our platform and learn about property investing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn More</h3>
                <p className="text-gray-600">
                  Explore our About page to understand how Proptagon can help with your property investment journey.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Change Your Mind?</h3>
                <p className="text-gray-600">
                  You can always rejoin our waitlist when you're ready to be notified about our launch.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                <p className="text-gray-600">
                  Have questions? Feel free to reach out to us directly for any inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UnsubscribedPage;
