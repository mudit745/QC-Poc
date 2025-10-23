import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Settings, Download, Search, X, RotateCcw } from 'lucide-react';
import { FilterState, Theme, Thread, BusinessRule } from '../types';

interface SearchableDropdownProps {
  filterKey: string;
  label: string;
  values: string[];
  options: string[];
  searchValue: string;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onSearchChange: (key: string, value: string) => void;
  onClearSearch: (key: string) => void;
  isActive: boolean;
  onFocus: (key: string) => void;
  onClose: () => void;
}

interface SingleSelectDropdownProps {
  filterKey: string;
  label: string;
  value: string;
  options: string[];
  searchValue: string;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onSearchChange: (key: string, value: string) => void;
  onClearSearch: (key: string) => void;
  isActive: boolean;
  onFocus: (key: string) => void;
  onClose: () => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ 
  filterKey, 
  label, 
  values, 
  options, 
  searchValue, 
  onFilterChange, 
  onSearchChange, 
  onClearSearch,
  isActive,
  onFocus,
  onClose
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={isActive ? searchValue : (values.length === 1 && values[0] === 'All' ? 'All' : `${values.length} selected`)}
            onChange={(e) => onSearchChange(filterKey, e.target.value)}
            onFocus={() => onFocus(filterKey)}
            onBlur={() => {
              // Keep dropdown open briefly to allow clicking on options
              setTimeout(() => {
                if (!isActive) {
                  onClearSearch(filterKey);
                }
              }, 200);
            }}
            placeholder={isActive ? `Search ${label.toLowerCase()}...` : `Search ${label.toLowerCase()}...`}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchValue && (
            <button
              onClick={() => onClearSearch(filterKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isActive && options.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = values.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => {
                    onFilterChange(filterKey as keyof FilterState, option);
                    onClearSearch(filterKey);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 ${
                    isSelected ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                    isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </button>
              );
            })}
            {options.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No matches found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({ 
  filterKey, 
  label, 
  value, 
  options, 
  searchValue, 
  onFilterChange, 
  onSearchChange, 
  onClearSearch,
  isActive,
  onFocus,
  onClose
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={isActive ? searchValue : value}
            onChange={(e) => onSearchChange(filterKey, e.target.value)}
            onFocus={() => onFocus(filterKey)}
            onBlur={() => {
              // Keep dropdown open briefly to allow clicking on options
              setTimeout(() => {
                if (!isActive) {
                  onClearSearch(filterKey);
                }
              }, 200);
            }}
            placeholder={isActive ? `Search ${label.toLowerCase()}...` : `Search ${label.toLowerCase()}...`}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchValue && (
            <button
              onClick={() => onClearSearch(filterKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isActive && options.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onFilterChange(filterKey as keyof FilterState, option);
                  onClearSearch(filterKey);
                  // Close the dropdown after selection
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  option === value ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No matches found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  theme: Theme;
  onThemeToggle: () => void;
  threads: Thread[];
  businessRules: BusinessRule[];
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  theme,
  onThemeToggle,
  threads,
  businessRules,
  onExport
}) => {
  const [searchQueries, setSearchQueries] = useState<{
    moduleName: string;
    businessRule: string;
    status: string;
    threadStatus: string;
    threadTitle: string;
  }>({
    moduleName: '',
    businessRule: '',
    status: '',
    threadStatus: '',
    threadTitle: ''
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        // Clear all search queries when clicking outside
        setSearchQueries({
          moduleName: '',
          businessRule: '',
          status: '',
          threadStatus: '',
          threadTitle: ''
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = useCallback((filterKey: string, searchValue: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [filterKey]: searchValue
    }));
  }, []);

  const clearSearch = useCallback((filterKey: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [filterKey]: ''
    }));
  }, []);

  const handleFocus = useCallback((filterKey: string) => {
    setActiveDropdown(filterKey);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    // Get the first available module name or default to 'All'
    const defaultModule = businessRules.length > 0 ? businessRules[0].moduleName : 'All';
    
    // Reset all filters to their default values
    onFilterChange({
      moduleName: defaultModule,
      status: ['All'],
      threadStatus: ['All'],
      businessRule: ['All'],
      threadTitle: ['All']
    });
    
    // Clear all search queries
    setSearchQueries({
      moduleName: '',
      businessRule: '',
      status: '',
      threadStatus: '',
      threadTitle: ''
    });
    
    // Close any open dropdowns
    setActiveDropdown(null);
  }, [onFilterChange, businessRules]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    // Handle moduleName as single string
    if (key === 'moduleName') {
      onFilterChange({
        ...filters,
        [key]: value,
        // Reset business rule filter when module changes
        businessRule: ['All']
      });
      return;
    }
    
    const currentValues = filters[key] as string[];
    let newValues: string[];
    
    if (value === 'All') {
      // If "All" is selected, clear all other selections and keep only "All"
      newValues = ['All'];
    } else {
      // Toggle the value in the array
      if (currentValues.includes(value)) {
        // Remove the value
        newValues = currentValues.filter(v => v !== value);
        // If no values left, add "All"
        if (newValues.length === 0) {
          newValues = ['All'];
        }
      } else {
        // Add the value and remove "All" if it exists
        newValues = [...currentValues.filter(v => v !== 'All'), value];
      }
    }
    
    // If business rule filter changes, reset thread title filter
    if (key === 'businessRule') {
      onFilterChange({
        ...filters,
        [key]: newValues,
        threadTitle: ['All'] // Reset thread title filter when business rule changes
      });
    } else {
      onFilterChange({
        ...filters,
        [key]: newValues
      });
    }
  };

  // Generate dynamic module names from business rules
  const dynamicModuleNames = useMemo(() => {
    const uniqueModules = Array.from(new Set(businessRules.map(rule => rule.moduleName)));
    return ['All', ...uniqueModules];
  }, [businessRules]);

  // Filter options based on search queries
  const filteredModuleNames = useMemo(() => {
    if (!searchQueries.moduleName) return dynamicModuleNames;
    return dynamicModuleNames.filter(module => 
      module.toLowerCase().includes(searchQueries.moduleName.toLowerCase())
    );
  }, [dynamicModuleNames, searchQueries.moduleName]);

  // Generate cascading business rule options based on selected module name
  const cascadingBusinessRuleOptions = useMemo(() => {
    if (filters.moduleName === 'All') {
      // When "All" is selected, show all business rule descriptions
      const allRules = Array.from(new Set(businessRules.map(rule => rule.description)));
      return ['All', ...allRules];
    }
    
    // Find business rules that belong to the selected module
    const moduleRules = businessRules.filter(rule => rule.moduleName === filters.moduleName);
    if (moduleRules.length === 0) {
      // If no rules match, show all business rule descriptions
      const allRules = Array.from(new Set(businessRules.map(rule => rule.description)));
      return ['All', ...allRules];
    }
    
    // Extract unique business rule descriptions from rules belonging to this module
    const uniqueRules = Array.from(new Set(moduleRules.map(rule => rule.description)));
    
    return ['All', ...uniqueRules];
  }, [filters.moduleName, businessRules]);

  const filteredBusinessRules = useMemo(() => {
    if (!searchQueries.businessRule) return cascadingBusinessRuleOptions;
    return cascadingBusinessRuleOptions.filter(rule => 
      rule.toLowerCase().includes(searchQueries.businessRule.toLowerCase())
    );
  }, [cascadingBusinessRuleOptions, searchQueries.businessRule]);

  // Generate dynamic status options from business rules
  const dynamicStatusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(businessRules.map(rule => rule.status)));
    return ['All', ...uniqueStatuses];
  }, [businessRules]);

  const filteredStatusOptions = useMemo(() => {
    if (!searchQueries.status) return dynamicStatusOptions;
    return dynamicStatusOptions.filter(status => 
      status.toLowerCase().includes(searchQueries.status.toLowerCase())
    );
  }, [dynamicStatusOptions, searchQueries.status]);

  // Generate dynamic thread status options from threads
  const dynamicThreadStatusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(threads.map(thread => thread.actionStatus)));
    return ['All', ...uniqueStatuses];
  }, [threads]);

  const filteredThreadStatusOptions = useMemo(() => {
    if (!searchQueries.threadStatus) return dynamicThreadStatusOptions;
    return dynamicThreadStatusOptions.filter(status => 
      status.toLowerCase().includes(searchQueries.threadStatus.toLowerCase())
    );
  }, [dynamicThreadStatusOptions, searchQueries.threadStatus]);

  // Generate cascading thread title options based on selected business rule
  const cascadingThreadTitleOptions = useMemo(() => {
    if (filters.businessRule.includes('All')) {
      // When "All" is selected, show all thread titles from all threads
      const allTitles = Array.from(new Set(threads.map(thread => thread.title)));
      return ['All', ...allTitles];
    }
    
    // Find threads that belong to any of the selected business rules
    const selectedRules = businessRules.filter(rule => filters.businessRule.includes(rule.description));
    if (selectedRules.length === 0) {
      // If no rules match, show all thread titles
      const allTitles = Array.from(new Set(threads.map(thread => thread.title)));
      return ['All', ...allTitles];
    }
    
    // Find threads that belong to any of the selected business rules
    const selectedRuleIds = selectedRules.map(rule => rule.id);
    const ruleThreads = threads.filter(thread => selectedRuleIds.includes(thread.ruleId));
    
    // Extract unique thread titles from threads belonging to these rules
    const uniqueTitles = Array.from(new Set(ruleThreads.map(thread => thread.title)));
    
    return ['All', ...uniqueTitles];
  }, [filters.businessRule, threads, businessRules]);

  const filteredThreadTitleOptions = useMemo(() => {
    if (!searchQueries.threadTitle) return cascadingThreadTitleOptions;
    return cascadingThreadTitleOptions.filter(title => 
      title.toLowerCase().includes(searchQueries.threadTitle.toLowerCase())
    );
  }, [cascadingThreadTitleOptions, searchQueries.threadTitle]);


  return (
    <header className="bg-white dark:bg-gray-800 shadow-soft border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              QC Checklist
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onExport}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Export data to Excel"
            >
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
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

        <div className="flex items-end gap-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
            <SingleSelectDropdown
              filterKey="moduleName"
              label="Module Name"
              value={filters.moduleName}
              options={filteredModuleNames}
              searchValue={searchQueries.moduleName}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              onClearSearch={clearSearch}
              isActive={activeDropdown === 'moduleName'}
              onFocus={handleFocus}
              onClose={() => setActiveDropdown(null)}
            />

            <SearchableDropdown
              filterKey="businessRule"
              label="Business Rule"
              values={filters.businessRule}
              options={filteredBusinessRules}
              searchValue={searchQueries.businessRule}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              onClearSearch={clearSearch}
              isActive={activeDropdown === 'businessRule'}
              onFocus={handleFocus}
              onClose={() => setActiveDropdown(null)}
            />

            <SearchableDropdown
              filterKey="status"
              label="Rule Status"
              values={filters.status}
              options={filteredStatusOptions}
              searchValue={searchQueries.status}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              onClearSearch={clearSearch}
              isActive={activeDropdown === 'status'}
              onFocus={handleFocus}
              onClose={() => setActiveDropdown(null)}
            />

            <SearchableDropdown
              filterKey="threadStatus"
              label="Finding Status"
              values={filters.threadStatus}
              options={filteredThreadStatusOptions}
              searchValue={searchQueries.threadStatus}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              onClearSearch={clearSearch}
              isActive={activeDropdown === 'threadStatus'}
              onFocus={handleFocus}
              onClose={() => setActiveDropdown(null)}
            />

            <SearchableDropdown
              filterKey="threadTitle"
              label="Finding Title"
              values={filters.threadTitle}
              options={filteredThreadTitleOptions}
              searchValue={searchQueries.threadTitle}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              onClearSearch={clearSearch}
              isActive={activeDropdown === 'threadTitle'}
              onFocus={handleFocus}
              onClose={() => setActiveDropdown(null)}
            />
          </div>
          <button
            onClick={handleClearAllFilters}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors duration-200 flex-shrink-0"
            title="Clear all filters"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;