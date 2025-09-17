import React, { useRef, useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { Popover, MenuItem, MenuSectionHeader, MenuSeparator } from './Popover';

export interface ChipMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  section?: string;
}

interface ChipProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  items?: ChipMenuItem[];
  disabled?: boolean;
  variant?: 'default' | 'active' | 'disabled';
  className?: string;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  icon: Icon,
  label,
  value,
  items = [],
  disabled = false,
  variant = 'default',
  className = '',
  onClick
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const chipRef = useRef<HTMLButtonElement>(null);

  const handleChipClick = () => {
    if (disabled) return;
    
    if (items.length > 0) {
      setIsPopoverOpen(!isPopoverOpen);
    } else if (onClick) {
      onClick();
    }
  };

  const handleItemClick = (item: ChipMenuItem) => {
    item.onClick();
    setIsPopoverOpen(false);
  };

  const closePopover = () => setIsPopoverOpen(false);

  // Group items by section
  const groupedItems = items.reduce((acc, item) => {
    const section = item.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, ChipMenuItem[]>);

  // Variant styles
  const variantStyles = {
    default: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300',
    active: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300',
    disabled: 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
  };

  const iconStyles = {
    default: 'text-gray-500',
    active: 'text-blue-500',
    disabled: 'text-gray-400'
  };

  const chevronStyles = {
    default: 'text-gray-400',
    active: 'text-blue-400',
    disabled: 'text-gray-300'
  };

  return (
    <div className="relative">
      <button
        ref={chipRef}
        onClick={handleChipClick}
        disabled={disabled}
        className={`
          flex items-center gap-4 px-4 py-2.5 rounded-lg border text-sm font-medium w-full
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${variantStyles[variant]}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        style={{ minHeight: '40px' }}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${iconStyles[variant]}`} />
        <span className="flex-1 text-left min-w-0">
          <div className="leading-tight">
            <div className="font-medium">{label}</div>
            {value && <div className="text-gray-600 text-xs leading-tight overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{value}</div>}
          </div>
        </span>
        {items.length > 0 && (
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${chevronStyles[variant]} ${isPopoverOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {items.length > 0 && (
        <Popover
          isOpen={isPopoverOpen}
          onClose={closePopover}
          triggerRef={chipRef}
          placement="bottom-start"
        >
          <div className="py-2">
            {Object.entries(groupedItems).map(([section, sectionItems], sectionIndex) => (
              <div key={section}>
                {sectionIndex > 0 && <MenuSeparator />}
                {section !== 'default' && (
                  <MenuSectionHeader>{section}</MenuSectionHeader>
                )}
                {sectionItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    icon={item.icon && <item.icon className="w-4 h-4" />}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </div>
            ))}
          </div>
        </Popover>
      )}
    </div>
  );
};
