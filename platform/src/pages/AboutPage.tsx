import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import WaitlistModal from '../components/WaitlistModal';

const AboutPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Proptagon
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Own the property lifecycle.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Our Mission
              </h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="text-lg leading-relaxed mb-6">
                  We started Proptagon with one simple idea: every investor — especially first-timers — should have access to the same insights and tools that professionals use.
                </p>
                <p className="text-lg leading-relaxed">
                  Property investing shouldn't feel overwhelming, confusing, or out of reach. With Proptagon, we turn raw data into clear strategies that help you decide where to buy, what to buy, and how to grow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built for First-Time and Next-Gen Investors */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Built for First-Time and Next-Gen Investors
              </h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="text-lg leading-relaxed mb-8">
                  Getting into the property market is harder than ever. Prices are high, information is scattered, and it's tough to know where to start.
                </p>
                <p className="text-lg leading-relaxed mb-8">
                  That's why we built Proptagon as your co-pilot:
                </p>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Clarity, not jargon</strong> → See suburb growth and property trends in simple scores and maps.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Confidence to act</strong> → Spot risks, weigh opportunities, and choose with conviction.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Support that grows with you</strong> → From your first purchase to scaling a portfolio.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Five integrated modules that guide you through every stage of your property investment journey
              </p>
            </div>

            {/* Top row - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow</h3>
                <p className="text-gray-600">
                  Discover suburbs and uncover data-driven growth potential.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Invest</h3>
                <p className="text-gray-600">
                  Guide your investment decisions with calculators and financial tools.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategise</h3>
                <p className="text-gray-600">
                  Tailor strategies to your profile and risk appetite.
                </p>
              </Card>
            </div>

            {/* Bottom row - 2 centered cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Manage</h3>
                <p className="text-gray-600">
                  Handle day-to-day property management operations and tenant relations.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sell</h3>
                <p className="text-gray-600">
                  Know when and how to exit with confidence.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="text-lg leading-relaxed mb-6">
                  I'm Thomas Kohlborn, founder of Proptagon.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Like many young investors, I remember how overwhelming it felt trying to break into the property market. I had to piece together fragmented data, conflicting advice, and endless spreadsheets just to make sense of one suburb.
                </p>
                <p className="text-lg leading-relaxed">
                  Proptagon is the platform I wish I had back then — a simple, powerful tool to make smarter investment decisions without the noise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Our Team
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-600 mb-8">
                  We're a small but growing team of builders, analysts, and investors. Together we bring a unique mix of:
                </p>
                <ul className="space-y-4 text-lg text-left max-w-2xl mx-auto">
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Industry Depth</strong> — decades of combined experience in software development, product strategy, and data-driven platforms.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Financial & Investment Expertise</strong> — backgrounds in consulting, property investment, and KPI-based analysis frameworks.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Technical Excellence</strong> — proven track record in AI, analytics, and building scalable SaaS solutions on AWS.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Entrepreneurial Mindset</strong> — hands-on experience launching ventures, scaling ideas from MVP to market, and innovating in fast-moving industries.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-500 font-bold mr-3">→</span>
                    <span><strong>Global Perspective</strong> — international experience across corporate, consulting, and entrepreneurial ventures in Australia and Europe.</span>
                  </li>
                </ul>
              </div>
            </div>


            {/* Team Member Card */}
            <div className="flex justify-center">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300 max-w-lg">
                <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thomas Kohlborn</h3>
                <p className="text-sky-600 font-medium mb-4">Founder & CEO</p>
                <div className="text-gray-600 text-sm space-y-3">
                  <p>
                    <strong>15+ years in product, platform and data-driven innovation</strong> across Australia and Europe (Deloitte, Sanofi, Woolworths, GuideCom).
                  </p>
                  <p>
                    <strong>Hands-on experience in property investment</strong> and developing KPI-based suburb and property analysis frameworks.
                  </p>
                  <p>
                    <strong>Deep expertise in AI, analytics, and SaaS development</strong> on AWS with focus on scalable, modular platforms.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                These core principles guide everything we build and every decision we make at Proptagon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-600 mb-4">
                  We surface the truth in the data, clearly.
                </p>
                <p className="text-sm text-gray-500">
                  No black boxes, no hidden algorithms. Every score, every recommendation comes with clear reasoning and methodology that you can understand and trust.
                </p>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility</h3>
                <p className="text-gray-600 mb-4">
                  Tools for everyone, not just professionals.
                </p>
                <p className="text-sm text-gray-500">
                  Complex property data made simple. Whether you're a first-time buyer or seasoned investor, our platform speaks your language and meets you where you are.
                </p>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Empowerment</h3>
                <p className="text-gray-600 mb-4">
                  Confidence through actionable insights.
                </p>
                <p className="text-sm text-gray-500">
                  We don't just give you data — we give you the tools and insights to make confident decisions. Every feature is designed to reduce uncertainty and increase your ability to act.
                </p>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-600 mb-4">
                  Learn, grow, and share with others on the same journey.
                </p>
                <p className="text-sm text-gray-500">
                  Property investing can be lonely. We're building a community where investors can share experiences, learn from each other, and grow together in their property journey.
                </p>
              </Card>
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Putting Values Into Action
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  These values aren't just words on a page — they're embedded in our product design, our data methodology, and our approach to customer success. 
                  Every feature we build, every algorithm we create, and every interaction we have is guided by these principles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-sky-50 py-20">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to own your property lifecycle?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join our waitlist to be the first to experience Proptagon when we launch.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => setIsModalOpen(true)}
              >
                Join the waitlist
              </Button>
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

export default AboutPage;
