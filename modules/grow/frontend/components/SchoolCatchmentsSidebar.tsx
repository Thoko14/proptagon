import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

interface CatchmentsState {
  globalTypes: {
    primary: boolean;
    secondary: boolean;
  };
  stateSelections: {
    [state: string]: {
      [key: string]: boolean;
    };
  };
  accordionOpen: {
    [state: string]: boolean;
  };
}

interface SchoolCatchmentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filter: any) => void;
}

const TYPE_COLORS = {
  Primary: '#4F8DFB',
  'Junior Secondary': '#F4A640',
  'Senior Secondary': '#B23A7F',
  'Single Sex': '#6E56CF',
  Secondary: '#2CA6A4',
};

const TYPE_STATE_MAPPING = {
  Primary: 'All States',
  'Junior Secondary': 'QLD, VIC',
  'Senior Secondary': 'QLD, VIC, SA',
  'Single Sex': 'VIC',
  Secondary: 'NSW',
};

const STATE_CONFIGS = {
  QLD: {
    types: ['Primary', 'Junior Secondary', 'Senior Secondary'],
  },
  SA: {
    types: ['Primary', 'Senior Secondary'],
  },
  VIC: {
    types: ['Primary', 'Junior Secondary', 'Senior Secondary', 'Single Sex'],
    yearLevels: [7, 8, 9, 10, 11, 12],
    // Junior Secondary: years 7-9, Senior Secondary: years 10-12, Single Sex: year 7
  },
  NSW: {
    types: ['Primary', 'Secondary'],
    yearLevels: [7, 8, 9, 10, 11, 12],
    // Secondary: years 7-12
  },
};

export const SchoolCatchmentsSidebar: React.FC<SchoolCatchmentsSidebarProps> = ({
  isOpen,
  onClose,
  onFilterChange,
}) => {
  const [state, setState] = useState<CatchmentsState>({
    globalTypes: {
      primary: false,
      secondary: false,
    },
    stateSelections: {},
    accordionOpen: {},
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('propbase_catchments_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch (error) {
        console.error('Failed to parse saved catchments state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('propbase_catchments_state', JSON.stringify(state));
  }, [state]);

  // Note: Filter is only applied when Apply button is clicked, not automatically

  const buildFilter = (currentState: CatchmentsState) => {
    const clauses: any[] = [];

    // Global type filters
    if (currentState.globalTypes.primary) {
      clauses.push(['==', ['get', 'type'], 'Primary']);
    }

    if (currentState.globalTypes.secondary) {
      clauses.push(
        ['==', ['get', 'type'], 'Secondary'],
        ['==', ['get', 'type'], 'Junior Secondary'],
        ['==', ['get', 'type'], 'Senior Secondary'],
        ['==', ['get', 'type'], 'Single Sex']
      );
    }

    // State-specific filters
    Object.entries(currentState.stateSelections).forEach(([stateCode, selections]) => {
      const stateClauses: any[] = [];
      
      // Check if any selections are made for this state
      const hasSelections = Object.values(selections).some(Boolean);
      
      if (hasSelections) {
        // Apply specific selections for this state
        Object.entries(selections).forEach(([key, isSelected]) => {
          if (isSelected) {
            if (key.startsWith('year_')) {
              // NSW/VIC year level filtering
              const year = parseInt(key.replace('year_', ''));
              stateClauses.push([
                'all',
                ['==', ['get', 'state'], stateCode],
                ['==', ['get', 'year_level'], year]
              ]);
            } else {
              // Regular type filtering
              stateClauses.push([
                'all',
                ['==', ['get', 'state'], stateCode],
                ['==', ['get', 'type'], key]
              ]);
            }
          }
        });
      } else {
        // No specific selections, include all types for this state that match global types
        const stateConfig = STATE_CONFIGS[stateCode as keyof typeof STATE_CONFIGS];
        if (stateConfig) {
          stateConfig.types.forEach(type => {
            if ((type === 'Primary' && currentState.globalTypes.primary) ||
                (type !== 'Primary' && currentState.globalTypes.secondary)) {
              stateClauses.push([
                'all',
                ['==', ['get', 'state'], stateCode],
                ['==', ['get', 'type'], type]
              ]);
            }
          });
        }
      }

      if (stateClauses.length > 0) {
        clauses.push(['any', ...stateClauses]);
      }
    });

    return clauses.length > 0 ? ['any', ...clauses] : ['==', ['get', 'code'], '']; // Hide all if no selections
  };

  const updateGlobalType = (type: 'primary' | 'secondary', checked: boolean) => {
    setState(prev => {
      const newState = {
        ...prev,
        globalTypes: {
          ...prev.globalTypes,
          [type]: checked,
        },
      };
      
      // Update all state selections based on global type
      const updatedStateSelections = { ...prev.stateSelections };
      
      Object.entries(STATE_CONFIGS).forEach(([stateCode, config]) => {
        if (!updatedStateSelections[stateCode]) {
          updatedStateSelections[stateCode] = {};
        }
        
        if (type === 'primary') {
          if (checked) {
            // Check all Primary checkboxes in all states
            if (config.types.includes('Primary')) {
              updatedStateSelections[stateCode]['Primary'] = true;
            }
          } else {
            // Uncheck all Primary checkboxes in all states
            delete updatedStateSelections[stateCode]['Primary'];
          }
        } else if (type === 'secondary') {
          if (checked) {
            // Check all Secondary checkboxes in all states (including Single Sex)
            config.types.forEach(typeName => {
              if (['Secondary', 'Junior Secondary', 'Senior Secondary', 'Single Sex'].includes(typeName)) {
                updatedStateSelections[stateCode][typeName] = true;
              }
            });
            // Also check all year-level checkboxes for NSW/VIC
            if (config.yearLevels) {
              config.yearLevels.forEach(year => {
                updatedStateSelections[stateCode][`year_${year}`] = true;
              });
            }
          } else {
            // Uncheck all Secondary checkboxes in all states
            config.types.forEach(typeName => {
              if (['Secondary', 'Junior Secondary', 'Senior Secondary', 'Single Sex'].includes(typeName)) {
                delete updatedStateSelections[stateCode][typeName];
              }
            });
            // Also uncheck all year-level checkboxes for NSW/VIC
            if (config.yearLevels) {
              config.yearLevels.forEach(year => {
                delete updatedStateSelections[stateCode][`year_${year}`];
              });
            }
          }
        }
      });
      
      newState.stateSelections = updatedStateSelections;
      return newState;
    });
  };

  const updateStateSelection = (stateCode: string, key: string, checked: boolean) => {
    setState(prev => {
      const newState = {
        ...prev,
        stateSelections: {
          ...prev.stateSelections,
          [stateCode]: {
            ...prev.stateSelections[stateCode],
            [key]: checked,
          },
        },
      };
      
      // Handle year-level checkbox selection
      if (key.startsWith('year_')) {
        const year = parseInt(key.replace('year_', ''));
        
        if (checked) {
          // When a year-level checkbox is selected, enable the corresponding secondary type for this state
          const stateConfig = STATE_CONFIGS[stateCode as keyof typeof STATE_CONFIGS];
          if (stateConfig) {
            if (stateCode === 'VIC') {
              // VIC logic: enable appropriate type based on year
              if (year >= 7 && year <= 9) {
                newState.stateSelections[stateCode]['Junior Secondary'] = true;
              }
              if (year >= 10 && year <= 12) {
                newState.stateSelections[stateCode]['Senior Secondary'] = true;
              }
              if (year === 7) {
                newState.stateSelections[stateCode]['Single Sex'] = true;
              }
            } else if (stateCode === 'NSW') {
              // NSW logic: enable Secondary type for any year
              if (year >= 7 && year <= 12) {
                newState.stateSelections[stateCode]['Secondary'] = true;
              }
            }
          }
        } else {
          // When a year-level checkbox is unchecked, check if we need to disable secondary types
          if (stateCode === 'VIC') {
            // Check if Junior Secondary should be disabled (no years 7-9 selected)
            if (year >= 7 && year <= 9) {
              const hasJuniorYears = [7, 8, 9].some(y => 
                newState.stateSelections[stateCode]?.[`year_${y}`] === true
              );
              if (!hasJuniorYears) {
                delete newState.stateSelections[stateCode]['Junior Secondary'];
              }
            }
            
            // Check if Senior Secondary should be disabled (no years 10-12 selected)
            if (year >= 10 && year <= 12) {
              const hasSeniorYears = [10, 11, 12].some(y => 
                newState.stateSelections[stateCode]?.[`year_${y}`] === true
              );
              if (!hasSeniorYears) {
                delete newState.stateSelections[stateCode]['Senior Secondary'];
              }
            }
            
            // Check if Single Sex should be disabled (year 7 not selected)
            if (year === 7) {
              const hasYear7 = newState.stateSelections[stateCode]?.['year_7'] === true;
              if (!hasYear7) {
                delete newState.stateSelections[stateCode]['Single Sex'];
              }
            }
          } else if (stateCode === 'NSW') {
            // Check if Secondary should be disabled (no years 7-12 selected)
            if (year >= 7 && year <= 12) {
              const hasAnyYears = [7, 8, 9, 10, 11, 12].some(y => 
                newState.stateSelections[stateCode]?.[`year_${y}`] === true
              );
              if (!hasAnyYears) {
                delete newState.stateSelections[stateCode]['Secondary'];
              }
            }
          }
        }
      } else if (['Secondary', 'Junior Secondary', 'Senior Secondary', 'Single Sex'].includes(key)) {
        // When a secondary type is selected/unselected, enable/disable specific year-level checkboxes
        const stateConfig = STATE_CONFIGS[stateCode as keyof typeof STATE_CONFIGS];
        if (stateConfig && stateConfig.yearLevels) {
          let yearsToControl: number[] = [];
          
          // Determine which years this type controls
          if (stateCode === 'VIC') {
            if (key === 'Junior Secondary') {
              yearsToControl = [7, 8, 9];
            } else if (key === 'Senior Secondary') {
              yearsToControl = [10, 11, 12];
            } else if (key === 'Single Sex') {
              yearsToControl = [7]; // Single Sex schools are only Year 7
            }
          } else if (stateCode === 'NSW') {
            if (key === 'Secondary') {
              yearsToControl = [7, 8, 9, 10, 11, 12];
            }
          }
          
          if (checked) {
            // Enable specific year-level checkboxes
            yearsToControl.forEach(year => {
              newState.stateSelections[stateCode][`year_${year}`] = true;
            });
          } else {
            // Disable specific year-level checkboxes, but only if no other type covers them
            yearsToControl.forEach(year => {
              // Check if any other still-enabled secondary type covers this year
              let isCoveredByOtherType = false;
              
              if (stateCode === 'VIC') {
                // Check if other VIC types still cover this year
                if (year >= 7 && year <= 9) {
                  // Year 7-9: check if Junior Secondary is still enabled
                  if (newState.stateSelections[stateCode]?.['Junior Secondary'] === true) {
                    isCoveredByOtherType = true;
                  }
                }
                if (year >= 10 && year <= 12) {
                  // Year 10-12: check if Senior Secondary is still enabled
                  if (newState.stateSelections[stateCode]?.['Senior Secondary'] === true) {
                    isCoveredByOtherType = true;
                  }
                }
                if (year === 7) {
                  // Year 7: check if Single Sex is still enabled
                  if (newState.stateSelections[stateCode]?.['Single Sex'] === true) {
                    isCoveredByOtherType = true;
                  }
                }
              } else if (stateCode === 'NSW') {
                // Check if Secondary is still enabled
                if (newState.stateSelections[stateCode]?.['Secondary'] === true) {
                  isCoveredByOtherType = true;
                }
              }
              
              // Only disable the year if no other type covers it
              if (!isCoveredByOtherType) {
                delete newState.stateSelections[stateCode][`year_${year}`];
              }
            });
          }
        }
      }

      // Update global types based on state selections
      if (key === 'Primary') {
        // Check if all states have Primary checked
        const allPrimaryChecked = Object.entries(STATE_CONFIGS).every(([stateCode, config]) => {
          if (!config.types.includes('Primary')) return true; // Skip states without Primary
          return newState.stateSelections[stateCode]?.['Primary'] === true;
        });
        newState.globalTypes = { ...prev.globalTypes, primary: allPrimaryChecked };
      } else if (['Secondary', 'Junior Secondary', 'Senior Secondary', 'Single Sex'].includes(key)) {
        // Check if all states have all their secondary types AND year-level checkboxes checked
        const allSecondaryChecked = Object.entries(STATE_CONFIGS).every(([stateCode, config]) => {
          const secondaryTypes = config.types.filter(type => 
            ['Secondary', 'Junior Secondary', 'Senior Secondary', 'Single Sex'].includes(type)
          );
          if (secondaryTypes.length === 0) return true; // Skip states without secondary types
          
          // Check if all secondary types are selected
          const allSecondaryTypesSelected = secondaryTypes.every(secondaryType => 
            newState.stateSelections[stateCode]?.[secondaryType] === true
          );
          
          // Check if all year-level checkboxes are selected (for states that have them)
          let allYearLevelsSelected = true;
          if (config.yearLevels) {
            allYearLevelsSelected = config.yearLevels.every(year => 
              newState.stateSelections[stateCode]?.[`year_${year}`] === true
            );
          }
          
          return allSecondaryTypesSelected && allYearLevelsSelected;
        });
        newState.globalTypes = { ...prev.globalTypes, secondary: allSecondaryChecked };
      } else if (key.startsWith('year_')) {
        // When year-level checkboxes change, also check global secondary state
        const allSecondaryChecked = Object.entries(STATE_CONFIGS).every(([stateCode, config]) => {
          const secondaryTypes = config.types.filter(type => 
            ['Secondary', 'Junior Secondary', 'Senior Secondary', 'Single Sex'].includes(type)
          );
          if (secondaryTypes.length === 0) return true; // Skip states without secondary types
          
          // Check if all secondary types are selected
          const allSecondaryTypesSelected = secondaryTypes.every(secondaryType => 
            newState.stateSelections[stateCode]?.[secondaryType] === true
          );
          
          // Check if all year-level checkboxes are selected (for states that have them)
          let allYearLevelsSelected = true;
          if (config.yearLevels) {
            allYearLevelsSelected = config.yearLevels.every(year => 
              newState.stateSelections[stateCode]?.[`year_${year}`] === true
            );
          }
          
          return allSecondaryTypesSelected && allYearLevelsSelected;
        });
        newState.globalTypes = { ...prev.globalTypes, secondary: allSecondaryChecked };
      }
      
      return newState;
    });
  };

  const toggleAccordion = (stateCode: string) => {
    setState(prev => ({
      ...prev,
      accordionOpen: {
        ...prev.accordionOpen,
        [stateCode]: !prev.accordionOpen[stateCode],
      },
    }));
  };

  const renderStateAccordion = (stateCode: string, config: any) => {
    const stateSelections = state.stateSelections[stateCode] || {};
    const accordionOpen = state.accordionOpen[stateCode] || false;

    return (
      <div key={stateCode} className="border-b border-gray-200 pb-2">
        <button
          onClick={() => toggleAccordion(stateCode)}
          className="w-full flex items-center justify-between py-2 text-left font-medium text-gray-900 hover:text-blue-600"
        >
          <span className="text-base font-medium">{stateCode}</span>
          {accordionOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {accordionOpen && (
          <div className="ml-4 space-y-2">
            {config.types.map((type: string) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={stateSelections[type] || false}
                  onChange={(e) => updateStateSelection(stateCode, type, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
            
            {config.yearLevels && (
              <div className="ml-4 space-y-1">
                <div className="text-xs font-medium text-gray-500 mb-1">Year Levels:</div>
                {config.yearLevels.map((year: number) => (
                  <label key={year} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={stateSelections[`year_${year}`] || false}
                      onChange={(e) => updateStateSelection(stateCode, `year_${year}`, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Year {year}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catchments-sidebar-title"
      style={{ 
        zIndex: 99998,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        pointerEvents: 'auto'
      }}
    >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 id="catchments-sidebar-title" className="text-lg font-semibold text-gray-900">
              School Catchments
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Global Type Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Global Type</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={state.globalTypes.primary}
                    onChange={(e) => updateGlobalType('primary', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">All Primary</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={state.globalTypes.secondary}
                    onChange={(e) => updateGlobalType('secondary', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">All Secondary</span>
                </label>
              </div>
            </div>

            {/* State Accordions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">By State</h2>
              <div className="space-y-2">
                {Object.entries(STATE_CONFIGS).map(([stateCode, config]) =>
                  renderStateAccordion(stateCode, config)
                )}
              </div>
            </div>

            {/* Legend */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
              <div className="space-y-2">
                {Object.entries(TYPE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700 font-medium">{type}</span>
                      <span className="text-xs text-gray-500">({TYPE_STATE_MAPPING[type as keyof typeof TYPE_STATE_MAPPING]})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

                           {/* Footer */}
                 <div className="p-4 border-t border-gray-200">
                   <div className="flex justify-center gap-4 mb-3">
                     <button
                                             onClick={() => {
                        // Apply current filter state
                        onFilterChange(state);
                      }}
                       className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                       style={{ 
                         backgroundColor: '#2563eb',
                         color: 'white',
                         minWidth: '70px'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.backgroundColor = '#1d4ed8';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.backgroundColor = '#2563eb';
                       }}
                       onMouseDown={(e) => {
                         e.currentTarget.style.backgroundColor = '#1e40af';
                       }}
                       onMouseUp={(e) => {
                         e.currentTarget.style.backgroundColor = '#1d4ed8';
                       }}
                     >
                       Apply
                     </button>
                     <button
                       onClick={() => {
                         // Reset to empty state (all unchecked)
                         const emptyState = {
                           globalTypes: { primary: false, secondary: false },
                           stateSelections: {},
                           accordionOpen: {}
                         };
                         setState(emptyState);
                         onFilterChange(emptyState);
                       }}
                       className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all duration-150"
                       style={{ 
                         backgroundColor: '#e5e7eb',
                         color: '#374151',
                         minWidth: '70px'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.backgroundColor = '#d1d5db';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.backgroundColor = '#e5e7eb';
                       }}
                       onMouseDown={(e) => {
                         e.currentTarget.style.backgroundColor = '#9ca3af';
                       }}
                       onMouseUp={(e) => {
                         e.currentTarget.style.backgroundColor = '#d1d5db';
                       }}
                     >
                       Reset
                     </button>
                   </div>
                   <p className="text-xs text-gray-500">
                     Data: Unified GeoJSON (2023–2026). NSW: 4,185 features, VIC: 3,129 features, QLD: 1,534 features, SA: 128 features.
                   </p>
                 </div>
               </div>
             </div>
         );
       };
