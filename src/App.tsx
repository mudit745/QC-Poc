import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import Header from './components/Header';
import DataTable from './components/DataTable';
import ChatPanel from './components/ChatPanel';
import { useTheme } from './hooks/useTheme';
import { Thread, Comment, FilterState, ChatPanelState, BusinessRule } from './types';
import { mockBusinessRules, mockThreads, moduleNames, statusOptions, threadStatusOptions, businessRuleOptions, threadTitleOptions } from './data/mockData';

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

  // Filter business rules based on current filters
  const filteredRules = useMemo(() => {
    return mockBusinessRules.filter((rule: BusinessRule) => {
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
  }, [filters, threads]);

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
    return mockBusinessRules.find((rule: BusinessRule) => rule.id === chatPanel.ruleId) || null;
  }, [chatPanel.ruleId]);

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

  const handleAddThread = (ruleId: string, title: string) => {
    const now = new Date();
    const dueDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // P2: 3 days SLA
    
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title,
      ruleId,
      status: 'Open',
      actionStatus: 'Action Required',
      priority: 'P2',
      comments: [],
      dueDate: dueDate.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    setThreads(prev => [...prev, newThread]);
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
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { 
            ...thread, 
            status: thread.status === 'Open' ? 'Closed' : 'Open',
            updatedAt: new Date().toISOString()
          }
        : thread
    ));
  };

  const handleActionStatusChange = (threadId: string, newActionStatus: string) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { 
            ...thread, 
            actionStatus: newActionStatus as any,
            updatedAt: new Date().toISOString()
          }
        : thread
    ));
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

  const actionStatusOptions = ['Action Required', 'In Progress', 'Completed', 'On Hold', 'No Error', 'Error'];
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
        moduleNames={moduleNames}
        statusOptions={statusOptions}
        threadStatusOptions={threadStatusOptions}
        businessRuleOptions={businessRuleOptions}
        threadTitleOptions={threadTitleOptions}
        threads={threads}
        businessRules={mockBusinessRules}
        onExport={handleExport}
      />

      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
            actionStatusOptions={actionStatusOptions}
            priorityOptions={priorityOptions}
            threadStatusFilter={filters.threadStatus}
            threadTitleFilter={filters.threadTitle}
            businessRuleFilter={filters.businessRule}
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
    </div>
  );
}

export default App;