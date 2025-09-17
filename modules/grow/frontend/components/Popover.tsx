import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  className?: string;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export const Popover: React.FC<PopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = '',
  placement = 'bottom-start'
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // Removed unused flipped state
  const popoverRef = useRef<HTMLDivElement>(null);

  // Calculate position and handle flipping
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = 0;
    let left = 0;
    let shouldFlip = false;

    // Calculate initial position based on placement
    switch (placement) {
      case 'bottom-start':
        top = triggerRect.bottom + 8;
        left = triggerRect.left;
        shouldFlip = triggerRect.bottom + popoverRect.height + 8 > viewportHeight;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + 8;
        left = triggerRect.right - popoverRect.width;
        shouldFlip = triggerRect.bottom + popoverRect.height + 8 > viewportHeight;
        break;
      case 'top-start':
        top = triggerRect.top - popoverRect.height - 8;
        left = triggerRect.left;
        shouldFlip = triggerRect.top - popoverRect.height - 8 < 0;
        break;
      case 'top-end':
        top = triggerRect.top - popoverRect.height - 8;
        left = triggerRect.right - popoverRect.width;
        shouldFlip = triggerRect.top - popoverRect.height - 8 < 0;
        break;
    }

    // Handle flipping
    if (shouldFlip) {
      if (placement.startsWith('bottom')) {
        top = triggerRect.top - popoverRect.height - 8;
      } else {
        top = triggerRect.bottom + 8;
      }
      // Removed setFlipped call
    } else {
      // Removed setFlipped call
    }

    // Ensure popover stays within viewport bounds
    if (left < 0) left = 8;
    if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width - 8;
    }
    if (top < 0) top = 8;
    if (top + popoverRect.height > viewportHeight) {
      top = viewportHeight - popoverRect.height - 8;
    }

    setPosition({ top, left });
  }, [placement, triggerRef]);

  // Update position when popover opens or window resizes
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, updatePosition]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !popoverRef.current) return;

    const focusableElements = popoverRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Return focus to trigger element
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={`fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[280px] max-w-[320px] ${className}`}
      style={{
        top: position.top,
        left: position.left,
      }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>,
    document.body
  );
};

// Menu item component for use within Popover
interface MenuItemProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  children,
  onClick,
  disabled = false,
  className = ''
}) => (
  <button
    className={`w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 ${className}`}
    onClick={onClick}
    disabled={disabled}
    style={{ minHeight: '36px' }}
  >
    {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
    <span className="flex-1">{children}</span>
  </button>
);

// Section header component
interface MenuSectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const MenuSectionHeader: React.FC<MenuSectionHeaderProps> = ({
  children,
  className = ''
}) => (
  <div className={`px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide ${className}`}>
    {children}
  </div>
);

// Separator component
export const MenuSeparator: React.FC = () => (
  <div className="border-t border-gray-200 my-1" />
);
