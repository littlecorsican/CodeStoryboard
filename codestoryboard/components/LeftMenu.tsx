'use client';

import { PageType } from '@/enums/_enums';
import { useState } from 'react';
import { useGlobal } from '@/contexts/GlobalContext';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  children?: MenuItem[];
  onClick?: () => void;
}

interface LeftMenuProps {
  onOpenCreateNewStep: () => void;
  onOpenCreateNewDbTemplate: () => void;
}

export default function LeftMenu({ onOpenCreateNewStep, onOpenCreateNewDbTemplate }: LeftMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['projects', 'code', 'tools']);
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const { setPage } = useGlobal();
  
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      children: [
        { 
          id: 'goto_board', 
          label: 'Board', 
          icon: '📂', 
          onClick: () => {
            setPage(PageType.BOARD);
          }
        },
        { 
          id: 'goto_db_templates', 
          label: 'Db Templates', 
          icon: '📂', 
          onClick: () => {
            setPage(PageType.DBTEMPLATE);
          }
        },
      ]
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📁',
      children: [
        { 
          id: 'open_flow', 
          label: 'Open Flow', 
          icon: '📂', 
          href: '/projects',
          onClick: () => {
            console.log('Opening flow...');
            // Add file picker or flow opening logic
          }
        },
        { 
          id: 'export_flow', 
          label: 'Export Flow', 
          icon: '🕒', 
          href: '/projects/recent',
          onClick: () => {
            console.log('Exporting flow...');
            // Add export functionality
          }
        },
      ]
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: '💻',
      children: [
        { 
          id: 'add_new_step', 
          label: 'Add New Step', 
          icon: '📝', 
          onClick: () => {
            onOpenCreateNewStep();
          }
        },
        { 
          id: 'add_new_db_template', 
          label: 'Add New Db Template', 
          icon: '💾', 
          onClick: () => {
            onOpenCreateNewDbTemplate();
          }
        },
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: '🔧',
      children: [
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      href: '/settings'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else {
      setActiveItem(item.id);
      
      // Execute custom onClick handler if provided
      if (item.onClick) {
        item.onClick();
      }
      
      // Handle navigation here
      if (item.href) {
        console.log(`Navigating to: ${item.href}`);
      }
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={`
            w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-left transition-all duration-200
            hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mx-2
            ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
            ${level > 0 ? 'ml-6 text-sm' : 'font-medium'}
          `}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {hasChildren && (
            <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">CodeStoryboard</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Development Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {/* <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-300 text-sm">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
