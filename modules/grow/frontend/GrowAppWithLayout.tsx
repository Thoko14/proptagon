import React from 'react';
import Layout from '../../../platform/src/components/Layout';
import { GrowPageRefactored } from './components/GrowPageRefactored';

/**
 * Grow application wrapped in the site's Layout component
 * This provides the header and footer while showing the full Grow functionality
 */
const GrowAppWithLayout: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <GrowPageRefactored />
      </div>
    </Layout>
  );
};

export default GrowAppWithLayout;



