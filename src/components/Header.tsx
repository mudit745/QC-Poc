import React from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { FilterState, Theme, Thread, BusinessRule } from '../types';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  theme: Theme;
  onThemeToggle: () => void;
  moduleNames: string[];
  statusOptions: string[];
  threadStatusOptions: string[];
  businessRuleOptions: string[];
  threadTitleOptions: string[];
  threads: Thread[];
  businessRules: BusinessRule[];
}

const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  theme,
  onThemeToggle,
  moduleNames,
  statusOptions,
  threadStatusOptions,
  businessRuleOptions,
  threadTitleOptions,
  threads,
  businessRules
}) => {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    // If business rule filter changes, reset thread title filter
    if (key === 'businessRule') {
      onFilterChange({
        ...filters,
        [key]: value,
        threadTitle: 'All' // Reset thread title filter when business rule changes
      });
    } else {
      onFilterChange({
        ...filters,
        [key]: value
      });
    }
  };

  // Generate cascading thread title options based on selected business rule
  const getCascadingThreadTitleOptions = () => {
    if (filters.businessRule === 'All') {
      return threadTitleOptions;
    }
    
    // Find the selected business rule by description
    const selectedRule = businessRules.find(rule => rule.description === filters.businessRule);
    if (!selectedRule) {
      return threadTitleOptions;
    }
    
    // Find threads that belong to this business rule
    const ruleThreads = threads.filter(thread => thread.ruleId === selectedRule.id);
    
    // Extract unique thread titles from threads belonging to this rule
    const uniqueTitles = Array.from(new Set(ruleThreads.map(thread => thread.title)));
    
    return ['All', ...uniqueTitles];
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-soft border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              QC Checklist
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configuration: {filters.moduleName || 'Warehouse Safety Checks'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Module Name
            </label>
            <select
              value={filters.moduleName}
              onChange={(e) => handleFilterChange('moduleName', e.target.value)}
              className="input-field"
            >
              {moduleNames.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Rule
            </label>
            <select
              value={filters.businessRule}
              onChange={(e) => handleFilterChange('businessRule', e.target.value)}
              className="input-field"
            >
              {businessRuleOptions.map((rule) => (
                <option key={rule} value={rule}>
                  {rule}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thread Status
            </label>
            <select
              value={filters.threadStatus}
              onChange={(e) => handleFilterChange('threadStatus', e.target.value)}
              className="input-field"
            >
              {threadStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thread Title
            </label>
            <select
              value={filters.threadTitle}
              onChange={(e) => handleFilterChange('threadTitle', e.target.value)}
              className="input-field"
            >
              {getCascadingThreadTitleOptions().map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;