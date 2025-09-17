import React from 'react';

/**
 * StrategyBox - Shows strategy recommendations based on scoring
 * Displays strategy recommendations based on property analysis
 */
export const StrategyBox: React.FC = () => {
  return (
    <div className="strategy-box">
      <h3>Strategy Recommendations</h3>
      
      <div className="strategy-list">
        <div className="strategy-item">
          <h4>Short-term (1-2 years)</h4>
          <p>Focus on renovation and value appreciation</p>
        </div>
        
        <div className="strategy-item">
          <h4>Medium-term (3-5 years)</h4>
          <p>Rental for stable cash flows</p>
        </div>
        
        <div className="strategy-item">
          <h4>Long-term (5+ years)</h4>
          <p>Value appreciation through market growth</p>
        </div>
      </div>
      
      {/* TODO: Implement dynamic strategy recommendations */}
    </div>
  );
}; 