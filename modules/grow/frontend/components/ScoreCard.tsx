import React from 'react';

/**
 * ScoreCard - Shows the evaluation result of a property
 * Displays scoring results and key metrics
 */
export const ScoreCard: React.FC = () => {
  return (
    <div className="score-card">
      <h3>Evaluation Result</h3>
      
      <div className="score-metrics">
        <div className="metric">
          <span className="metric-label">Overall Score</span>
          <span className="metric-value">85/100</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Growth Potential</span>
          <span className="metric-value">A+</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Risk</span>
          <span className="metric-value">Low</span>
        </div>
      </div>
      
      {/* TODO: Implement detailed scoring metrics */}
    </div>
  );
}; 