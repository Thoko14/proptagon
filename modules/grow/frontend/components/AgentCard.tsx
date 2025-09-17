import React from 'react';
import { Phone, Mail } from 'lucide-react';
import Button from '../../../../platform/src/components/Button';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  onCallAgent: (phone: string) => void;
  onEmailAgent: (email: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onCallAgent,
  onEmailAgent
}) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Listed by</h3>
      <div className="flex items-center gap-3 mb-4">
        {agent.photo ? (
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-12 h-12 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {agent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">{agent.name}</div>
          <div className="text-sm text-gray-600">{agent.agency}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => onCallAgent(agent.phone)}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Agent
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onEmailAgent(agent.email)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Agent
        </Button>
      </div>
    </div>
  );
};
