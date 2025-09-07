import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';

const PrivacyPage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Privacy & Legal
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                This page explains how we collect, use, and protect your information on the Proptagon landing site.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-12">
              {/* Who We Are */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Proptagon is an early-stage software platform based in Australia. Our mission is to make property investing more transparent, accessible, and data-driven.
                </p>
              </div>

              {/* What Data We Collect */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What Data We Collect</h2>
                <ul className="space-y-3 text-lg text-gray-600">
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Your email address (required when you join the waitlist)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Your name (if provided)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Basic metadata such as IP address, signup time, and referral/UTM source (collected automatically)</span>
                  </li>
                </ul>
              </div>

              {/* How We Use Your Data */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Data</h2>
                <ul className="space-y-3 text-lg text-gray-600 mb-6">
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Confirm your subscription and manage the waitlist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Contact you with product updates, early access invitations, or news about Proptagon</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Improve our landing page and understand where our subscribers come from</span>
                  </li>
                </ul>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We will not sell or rent your personal data to third parties.
                </p>
              </div>

              {/* Where Your Data Is Stored */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Where Your Data Is Stored</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your data is securely stored on Amazon Web Services (AWS) in DynamoDB. Emails are sent via Amazon Simple Email Service (SES).
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
                <ul className="space-y-3 text-lg text-gray-600 mb-6">
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Request a copy of the data we hold about you</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Ask us to correct or delete your data at any time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">•</span>
                    <span>Withdraw your consent to receive updates</span>
                  </li>
                </ul>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To exercise these rights, email us at{' '}
                  <a href="mailto:privacy@proptagon.com" className="text-sky-600 hover:text-sky-700 underline">
                    privacy@proptagon.com
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Notice Section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="border-l-4 border-l-orange-400 bg-orange-50">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Legal Notice</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p className="leading-relaxed">
                  Proptagon is an information and software platform. We are not financial advisers. Nothing on this website or in our communications should be considered financial advice.
                </p>
                <p className="leading-relaxed">
                  All information provided is general in nature and does not take into account your individual circumstances. Seek independent professional advice before making investment decisions.
                </p>
                <p className="leading-relaxed">
                  While we aim to keep content accurate and up-to-date, Proptagon makes no guarantees and accepts no liability for actions taken based on information provided.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact</h2>
            <p className="text-lg text-gray-600 mb-6">
              Questions about this policy or your data? Contact us:
            </p>
            <div className="space-y-3 text-lg text-gray-600">
              <div className="flex items-center">
                <span className="text-sky-500 font-bold mr-3">•</span>
                <span>
                  General enquiries:{' '}
                  <a href="mailto:info@proptagon.com" className="text-sky-600 hover:text-sky-700 underline">
                    info@proptagon.com
                  </a>
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sky-500 font-bold mr-3">•</span>
                <span>
                  Privacy requests:{' '}
                  <a href="mailto:privacy@proptagon.com" className="text-sky-600 hover:text-sky-700 underline">
                    privacy@proptagon.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="bg-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Last updated: {currentDate}</p>
              <p>
                If you joined our waitlist and wish to be removed, email{' '}
                <a href="mailto:privacy@proptagon.com?subject=Delete my data" className="text-sky-600 hover:text-sky-700 underline">
                  privacy@proptagon.com
                </a>{' '}
                with the subject 'Delete my data'.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
