import { useState, useCallback } from 'react';

export interface StrategyProfileState {
  capitalGrowth: number;
  cashFlow: number;
  riskTolerance: number;
  investmentHorizon: string;
  budget: number;
  propertyType: string[];
}

export const useStrategyProfile = () => {
  const [strategyProfile, setStrategyProfile] = useState<StrategyProfileState>({
    capitalGrowth: 50,
    cashFlow: 30,
    riskTolerance: 40,
    investmentHorizon: '5-7',
    budget: 1000000,
    propertyType: ['house', 'unit']
  });

  // Update individual strategy values
  const updateCapitalGrowth = useCallback((value: number) => {
    setStrategyProfile(prev => ({ ...prev, capitalGrowth: value }));
  }, []);

  const updateCashFlow = useCallback((value: number) => {
    setStrategyProfile(prev => ({ ...prev, cashFlow: value }));
  }, []);

  const updateRiskTolerance = useCallback((value: number) => {
    setStrategyProfile(prev => ({ ...prev, riskTolerance: value }));
  }, []);

  const updateInvestmentHorizon = useCallback((value: string) => {
    setStrategyProfile(prev => ({ ...prev, investmentHorizon: value }));
  }, []);

  const updateBudget = useCallback((value: number) => {
    setStrategyProfile(prev => ({ ...prev, budget: value }));
  }, []);

  const updatePropertyType = useCallback((types: string[]) => {
    setStrategyProfile(prev => ({ ...prev, propertyType: types }));
  }, []);

  // Reset to default values
  const resetToDefaults = useCallback(() => {
    setStrategyProfile({
      capitalGrowth: 50,
      cashFlow: 30,
      riskTolerance: 40,
      investmentHorizon: '5-7',
      budget: 1000000,
      propertyType: ['house', 'unit']
    });
  }, []);

  // Get total allocation (should equal 100)
  const getTotalAllocation = useCallback(() => {
    return strategyProfile.capitalGrowth + strategyProfile.cashFlow + strategyProfile.riskTolerance;
  }, [strategyProfile]);

  // Check if allocation is valid (equals 100)
  const isAllocationValid = useCallback(() => {
    return getTotalAllocation() === 100;
  }, [getTotalAllocation]);

  // Get allocation percentage for a specific metric
  const getAllocationPercentage = useCallback((metric: keyof Pick<StrategyProfileState, 'capitalGrowth' | 'cashFlow' | 'riskTolerance'>) => {
    return strategyProfile[metric];
  }, [strategyProfile]);

  return {
    // State
    strategyProfile,
    
    // Update functions
    updateCapitalGrowth,
    updateCashFlow,
    updateRiskTolerance,
    updateInvestmentHorizon,
    updateBudget,
    updatePropertyType,
    
    // Utility functions
    resetToDefaults,
    getTotalAllocation,
    isAllocationValid,
    getAllocationPercentage,
    
    // Setter
    setStrategyProfile,
  };
};
