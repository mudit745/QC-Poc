import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import * as XLSX from 'xlsx';
import Header from './components/Header';
import DataTable from './components/DataTable';
import ChatPanel from './components/ChatPanel';
import AddRuleModal from './components/AddRuleModal';
import { useTheme } from './hooks/useTheme';
import { Thread, Comment, FilterState, ChatPanelState, BusinessRule } from './types';
import { mockBusinessRules, mockThreads } from './data/mockData';

function App() {
  const { theme, toggleTheme } = useTheme();
  
  const [filters, setFilters] = useState<FilterState>({
    moduleName: 'Warehouse Safety Checks',
    status: ['All'],
    threadStatus: ['All'],
    businessRule: ['All'],
    threadTitle: ['All']
  });

  const [chatPanel, setChatPanel] = useState<ChatPanelState>({
    isOpen: false,
    ruleId: null,
    threadId: null,
    context: 'businessRule',
    position: { x: window.innerWidth - 450, y: 100 },
    size: { width: 400, height: 500 }
  });

  const [openThreads, setOpenThreads] = useState<Set<string>>(new Set());
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>(mockBusinessRules);
  const [addRuleModalOpen, setAddRuleModalOpen] = useState(false);
  const [customStatusValues, setCustomStatusValues] = useState<string[]>([]);

  // Function to automatically update rule status based on findings
  const updateRuleStatus = useCallback((ruleId: string) => {
    const ruleThreads = threads.filter(thread => thread.ruleId === ruleId);
    
    console.log(`Updating rule ${ruleId}:`, ruleThreads.map(t => ({ title: t.title, actionStatus: t.actionStatus })));
    
    if (ruleThreads.length === 0) {
      // No findings - keep current status
      return;
    }
    
    // Check if any finding is Error
    const hasErrorFinding = ruleThreads.some(thread => thread.actionStatus === 'Error');
    console.log(`Has error finding: ${hasErrorFinding}`);
    
    if (hasErrorFinding) {
      // Auto-set to Fail if any finding is Error
      console.log(`Setting rule ${ruleId} to Fail`);
      setBusinessRules(prev => prev.map(rule => 
        rule.id === ruleId && rule.status !== 'Fail'
          ? { ...rule, status: 'Fail', updatedAt: new Date().toISOString() }
          : rule
      ));
    } else {
      // Check if all findings are Non-Error or Mere Observation (regardless of open/closed status)
      const allAcceptableStatus = ruleThreads.every(thread => 
        thread.actionStatus === 'Non-Error' || thread.actionStatus === 'Mere Observation'
      );
      
      console.log(`All acceptable status: ${allAcceptableStatus}`);
      
      if (allAcceptableStatus) {
        // Auto-set to Pass if all findings have acceptable action status
        console.log(`Setting rule ${ruleId} to Pass`);
        setBusinessRules(prev => prev.map(rule => {
          if (rule.id === ruleId && rule.status !== 'Pass') {
            // Check if this rule has any comments across all its threads
            const hasComments = ruleThreads.some(thread => 
              thread.comments && thread.comments.length > 0
            );
            
            return { 
              ...rule, 
              status: 'Pass', 
              updatedAt: new Date().toISOString(),
              hasPassedNoComments: !hasComments
            };
          }
          return rule;
        }));
      }
    }
  }, [threads]);

  // Update rule statuses on component mount and when threads change
  useEffect(() => {
    // Get all unique rule IDs from threads
    const ruleIds = Array.from(new Set(threads.map(thread => thread.ruleId)));
    
    // Update status for each rule
    ruleIds.forEach(ruleId => {
      setTimeout(() => updateRuleStatus(ruleId), 100);
    });
  }, [threads, updateRuleStatus]);

  // Filter business rules based on current filters
  const filteredRules = useMemo(() => {
    return businessRules.filter((rule: BusinessRule) => {
      const moduleMatch = filters.moduleName === 'All' || rule.moduleName === filters.moduleName;
      const statusMatch = filters.status.includes('All') || filters.status.includes(rule.status);
      const businessRuleMatch = filters.businessRule.includes('All') || filters.businessRule.includes(rule.description);
      
      // If thread title filter is applied, only show rules that have threads matching the filter
      let threadTitleMatch = true;
      if (!filters.threadTitle.includes('All')) {
        const ruleThreads = threads.filter(thread => thread.ruleId === rule.id);
        threadTitleMatch = ruleThreads.some(thread => filters.threadTitle.includes(thread.title));
      }
      
      return moduleMatch && statusMatch && businessRuleMatch && threadTitleMatch;
    });
  }, [filters, threads, businessRules]);

  // Get threads for the currently selected rule or specific thread
  const currentRuleThreads = useMemo(() => {
    if (!chatPanel.ruleId) return [];
    
    let filteredThreads = threads;
    
    // Apply thread status filter
    if (!filters.threadStatus.includes('All')) {
      filteredThreads = filteredThreads.filter(thread => filters.threadStatus.includes(thread.status));
    }
    
    // Apply thread title filter
    if (!filters.threadTitle.includes('All')) {
      filteredThreads = filteredThreads.filter(thread => filters.threadTitle.includes(thread.title));
    }
    
    // Sort threads: Open threads first, then Closed threads
    filteredThreads = filteredThreads.sort((a, b) => {
      if (a.status === 'Open' && b.status === 'Closed') return -1;
      if (a.status === 'Closed' && b.status === 'Open') return 1;
      return 0; // Keep original order for threads with same status
    });
    
    if (chatPanel.context === 'thread' && chatPanel.threadId) {
      // For individual thread context, return only that specific thread
      return filteredThreads.filter(thread => thread.id === chatPanel.threadId);
    } else {
      // For business rule context, return all filtered threads for that rule
      return filteredThreads.filter(thread => thread.ruleId === chatPanel.ruleId);
    }
  }, [threads, chatPanel.ruleId, chatPanel.threadId, chatPanel.context, filters.threadTitle, filters.threadStatus]);

  // Get the current rule being discussed
  const currentRule = useMemo(() => {
    if (!chatPanel.ruleId) return null;
    return businessRules.find((rule: BusinessRule) => rule.id === chatPanel.ruleId) || null;
  }, [chatPanel.ruleId, businessRules]);

  const handleOpenChat = (ruleId: string, threadId?: string) => {
    const chatKey = threadId ? `${ruleId}-${threadId}` : ruleId;
    
    if (openThreads.has(chatKey)) {
      // Close the chat panel
      setOpenThreads(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatKey);
        return newSet;
      });
      setChatPanel(prev => ({ 
        ...prev, 
        isOpen: false, 
        ruleId: null, 
        threadId: null,
        context: 'businessRule'
      }));
    } else {
      // Open the chat panel
      setOpenThreads(prev => new Set(prev).add(chatKey));
      setChatPanel(prev => ({ 
        ...prev, 
        isOpen: true, 
        ruleId,
        threadId: threadId || null,
        context: threadId ? 'thread' : 'businessRule',
        position: { x: window.innerWidth - 450, y: 100 }
      }));
    }
  };

  const handleCloseChat = () => {
    if (chatPanel.ruleId) {
      const chatKey = chatPanel.threadId ? `${chatPanel.ruleId}-${chatPanel.threadId}` : chatPanel.ruleId;
      setOpenThreads(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatKey);
        return newSet;
      });
    }
    setChatPanel(prev => ({ 
      ...prev, 
      isOpen: false, 
      ruleId: null, 
      threadId: null,
      context: 'businessRule'
    }));
  };

  const handleAddThread = (ruleId: string, title: string, firstComment?: string) => {
    const now = new Date();
    const dueDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // P2: 3 days SLA
    
    const comments = firstComment ? [{
      id: `comment-${Date.now()}`,
      text: firstComment,
      author: 'QC' as const,
      timestamp: now.toISOString(),
      threadId: `thread-${Date.now()}`,
      isRead: false
    }] : [];
    
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title,
      ruleId,
      status: 'Open',
      actionStatus: 'Error',
      priority: 'P2',
      comments,
      dueDate: dueDate.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    setThreads(prev => [...prev, newThread]);
    
    // Update rule status after adding thread
    setTimeout(() => updateRuleStatus(ruleId), 100);
  };

  const handleAddRule = (moduleName: string, description: string, severity: string) => {
    const newRule: BusinessRule = {
      id: `rule-${Date.now()}`,
      ruleNo: Math.max(...businessRules.map(r => r.ruleNo), 0) + 1,
      description: description,
      qcComment: '',
      smComment: '',
      status: 'Open',
      moduleName: moduleName,
      businessRule: description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      severity: severity as 'Critical' | 'Major' | 'Significant',
      isNA: false,
      hasPassedNoComments: false
    };
    
    setBusinessRules(prev => [...prev, newRule]);
  };

  const handleAddRuleClick = () => {
    setAddRuleModalOpen(true);
  };

  const handleAddRuleConfirm = (description: string, severity: string) => {
    handleAddRule('Warehouse Safety Checks', description, severity);
    setAddRuleModalOpen(false);
  };

  const handleAddComment = (threadId: string, text: string, author: 'QC' | 'SM') => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text,
      author,
      timestamp: new Date().toISOString(),
      threadId,
      isRead: false
    };

    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { 
            ...thread, 
            comments: [...thread.comments, newComment],
            updatedAt: new Date().toISOString()
          }
        : thread
    ));
  };

  const handleToggleThread = (threadId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const handleCloseThread = (threadId: string) => {
    setThreads(prev => {
      const updatedThreads = prev.map(thread => 
        thread.id === threadId 
          ? { 
              ...thread, 
              status: thread.status === 'Open' ? 'Closed' as const : 'Open' as const,
              updatedAt: new Date().toISOString()
            }
          : thread
      );
      
      // Update rule status after closing/opening thread
      const updatedThread = updatedThreads.find(t => t.id === threadId);
      if (updatedThread) {
        setTimeout(() => updateRuleStatus(updatedThread.ruleId), 100);
      }
      
      return updatedThreads;
    });
  };

  const handleActionStatusChange = (threadId: string, newActionStatus: string) => {
    setThreads(prev => {
      const updatedThreads = prev.map(thread => 
        thread.id === threadId 
          ? { 
              ...thread, 
              actionStatus: newActionStatus as any,
              updatedAt: new Date().toISOString()
            }
          : thread
      );
      
      // Update rule status after changing action status
      const updatedThread = updatedThreads.find(t => t.id === threadId);
      if (updatedThread) {
        setTimeout(() => updateRuleStatus(updatedThread.ruleId), 100);
      }
      
      return updatedThreads;
    });
  };

  const handlePriorityChange = (threadId: string, newPriority: string) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { 
            ...thread, 
            priority: newPriority as 'P1' | 'P2' | 'P3',
            updatedAt: new Date().toISOString()
          }
        : thread
    ));
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setChatPanel(prev => ({ ...prev, position }));
  };

  const handleSizeChange = (size: { width: number; height: number }) => {
    setChatPanel(prev => ({ ...prev, size }));
  };

  const handleRuleStatusChange = (ruleId: string, newStatus: string) => {
    setBusinessRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        let updatedRule = { 
          ...rule, 
          status: newStatus as any,
          updatedAt: new Date().toISOString()
        };
        
        // If manually setting to Pass, check for comments
        if (newStatus === 'Pass') {
          const ruleThreads = threads.filter(thread => thread.ruleId === ruleId);
          const hasComments = ruleThreads.some(thread => 
            thread.comments && thread.comments.length > 0
          );
          updatedRule.hasPassedNoComments = !hasComments;
        }
        
        return updatedRule;
      }
      return rule;
    }));
  };

  const handleRuleSeverityChange = (ruleId: string, newSeverity: string) => {
    setBusinessRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { 
            ...rule, 
            severity: newSeverity as any,
            updatedAt: new Date().toISOString()
          }
        : rule
    ));
  };

  const handleToggleRow = (ruleId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const handleExport = () => {
    // Prepare data for export based on current filters
    const exportData = [];
    
    // Add header row - REMOVING 'Updated At', 'Due Date', 'Thread Updated At', 'Comments Count'
    exportData.push([
      'Module Name',
      'Rule No',
      'Business Rule Description',
      'Status',
      'Created At',
      'Thread Title',
      'Thread Status',
      'Action Status',
      'Priority',
      'Thread Created At'
    ]);

    // Process each business rule and its threads
    filteredRules.forEach((rule) => {
      const ruleThreads = threads.filter(thread => thread.ruleId === rule.id);
      
      // Apply thread-level filters
      let filteredThreads = ruleThreads;
      if (!filters.threadStatus.includes('All')) {
        filteredThreads = filteredThreads.filter(thread => filters.threadStatus.includes(thread.status));
      }
      if (!filters.threadTitle.includes('All')) {
        filteredThreads = filteredThreads.filter(thread => filters.threadTitle.includes(thread.title));
      }

      // Sort threads: Open threads first, then Closed threads
      filteredThreads = filteredThreads.sort((a, b) => {
        if (a.status === 'Open' && b.status === 'Closed') return -1;
        if (a.status === 'Closed' && b.status === 'Open') return 1;
        return 0; // Keep original order for threads with same status
      });

      if (filteredThreads.length === 0) {
        // If no threads match filters, still export the business rule
        exportData.push([
          rule.moduleName,
          rule.ruleNo,
          rule.description,
          rule.status,
          new Date(rule.createdAt).toLocaleDateString(),
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A'
        ]);
      } else {
        // Export each thread as a separate row
        filteredThreads.forEach((thread) => {
          exportData.push([
            rule.moduleName,
            rule.ruleNo,
            rule.description,
            rule.status,
            new Date(rule.createdAt).toLocaleDateString(),
            thread.title,
            thread.status,
            thread.actionStatus,
            thread.priority,
            new Date(thread.createdAt).toLocaleDateString()
          ]);
        });
      }
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    
    // Set column widths
    ws['!cols'] = [
      { width: 20 }, // Module Name
      { width: 10 }, // Rule No
      { width: 40 }, // Business Rule Description
      { width: 15 }, // Status
      { width: 12 }, // Created At
      { width: 30 }, // Thread Title
      { width: 15 }, // Thread Status
      { width: 20 }, // Action Status
      { width: 10 }, // Priority
      { width: 12 }  // Thread Created At
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'QC Data');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `QC_Export_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  const actionStatusOptions = ['Error', 'Non-Error', 'Mere Observation'];
  const priorityOptions = [
    { value: 'P1', label: 'P1 - Severe' },
    { value: 'P2', label: 'P2 - Moderate' },
    { value: 'P3', label: 'P3 - Low' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        filters={filters}
        onFilterChange={setFilters}
        theme={theme}
        onThemeToggle={toggleTheme}
        threads={threads}
        businessRules={businessRules}
        onExport={handleExport}
      />

      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Configuration Section */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Configuration: Warehouse Safety Checks
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="config-na-checkbox"
                    checked={filters.isNA || false}
                    onChange={(e) => setFilters({
                      ...filters,
                      isNA: e.target.checked,
                      naReason: e.target.checked ? (filters.naReason || '') : ''
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="config-na-checkbox" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    N/A
                  </label>
                </div>
                {filters.isNA && (
                  <div className="flex items-center space-x-2">
                    <label htmlFor="na-reason" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reason:
                    </label>
                    <input
                      type="text"
                      id="na-reason"
                      value={filters.naReason || ''}
                      onChange={(e) => setFilters({
                        ...filters,
                        naReason: e.target.value
                      })}
                      placeholder="Enter reason for N/A..."
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleAddRuleClick}
                disabled={filters.isNA}
                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white transition-colors duration-200 ${
                  filters.isNA 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Rule
              </button>
            </div>
          </div>
          <DataTable
            rules={filteredRules}
            threads={threads}
            expandedRows={expandedRows}
            onToggleRow={handleToggleRow}
            expandedThreads={expandedThreads}
            onToggleThread={handleToggleThread}
            onCloseThread={handleCloseThread}
            onOpenChat={handleOpenChat}
            onActionStatusChange={handleActionStatusChange}
            onPriorityChange={handlePriorityChange}
            onAddThread={handleAddThread}
            onAddComment={handleAddComment}
            onRuleStatusChange={handleRuleStatusChange}
            onRuleSeverityChange={handleRuleSeverityChange}
            actionStatusOptions={actionStatusOptions}
            priorityOptions={priorityOptions}
            threadStatusFilter={filters.threadStatus}
            threadTitleFilter={filters.threadTitle}
            businessRuleFilter={filters.businessRule}
            isNA={filters.isNA || false}
            customStatusValues={customStatusValues}
            onAddCustomStatus={(status: string) => setCustomStatusValues(prev => [...prev, status])}
          />
        </motion.div>
      </main>

      <ChatPanel
        isOpen={chatPanel.isOpen}
        onClose={handleCloseChat}
        rule={currentRule}
        threads={currentRuleThreads}
        context={chatPanel.context}
        onAddThread={handleAddThread}
        onAddComment={handleAddComment}
        onToggleThread={handleToggleThread}
        onCloseThread={handleCloseThread}
        onActionStatusChange={handleActionStatusChange}
        onPriorityChange={handlePriorityChange}
        position={chatPanel.position}
        size={chatPanel.size}
        onPositionChange={handlePositionChange}
        onSizeChange={handleSizeChange}
      />

      {/* Add Rule Modal */}
      <AddRuleModal
        isOpen={addRuleModalOpen}
        onClose={() => setAddRuleModalOpen(false)}
        onConfirm={handleAddRuleConfirm}
        moduleName="Warehouse Safety Checks"
      />
    </div>
  );
}

export default App;