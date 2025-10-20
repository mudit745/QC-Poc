import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, MessageCircle, Plus, X, AlertTriangle, Calendar, Lock } from 'lucide-react';
import { BusinessRule, Thread, Comment } from '../types';
import AddThreadModal from './AddThreadModal';

interface DataTableProps {
  rules: BusinessRule[];
  threads: Thread[];
  expandedRows: Set<string>;
  onToggleRow: (ruleId: string) => void;
  expandedThreads: Set<string>;
  onToggleThread: (threadId: string) => void;
  onCloseThread: (threadId: string) => void;
  onOpenChat: (ruleId: string, threadId?: string) => void;
  onActionStatusChange: (threadId: string, status: string) => void;
  onPriorityChange: (threadId: string, priority: string) => void;
  onAddThread: (ruleId: string, title: string) => void;
  actionStatusOptions: string[];
  priorityOptions: { value: string; label: string }[];
  threadStatusFilter: string[];
  threadTitleFilter: string[];
  businessRuleFilter: string[];
}

const DataTable: React.FC<DataTableProps> = ({
  rules,
  threads,
  expandedRows,
  onToggleRow,
  expandedThreads,
  onToggleThread,
  onCloseThread,
  onOpenChat,
  onActionStatusChange,
  onPriorityChange,
  onAddThread,
  actionStatusOptions,
  priorityOptions,
  threadStatusFilter,
  threadTitleFilter,
  businessRuleFilter
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [selectedRuleDescription, setSelectedRuleDescription] = useState<string>('');
  const [closeThreadDialog, setCloseThreadDialog] = useState<{
    isOpen: boolean;
    thread: Thread | null;
  }>({ isOpen: false, thread: null });
  const [closureComment, setClosureComment] = useState('');

  const groupedRules = useMemo(() => {
    const groups: { [key: string]: BusinessRule[] } = {};
    rules.forEach(rule => {
      const module = rule.moduleName;
      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(rule);
    });
    return groups;
  }, [rules]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'Inactive':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'Draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

  const getLatestQCCommentForThread = (threadId: string): Comment | null => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return null;

    let latestComment: Comment | null = null;
    let latestTimestamp = '';

    thread.comments.forEach(comment => {
      if (comment.author === 'QC' && comment.timestamp > latestTimestamp) {
        latestComment = comment;
        latestTimestamp = comment.timestamp;
      }
    });

    return latestComment;
  };

  const getLatestSMCommentForThread = (threadId: string): Comment | null => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return null;

    let latestComment: Comment | null = null;
    let latestTimestamp = '';

    thread.comments.forEach(comment => {
      if (comment.author === 'SM' && comment.timestamp > latestTimestamp) {
        latestComment = comment;
        latestTimestamp = comment.timestamp;
      }
    });

    return latestComment;
  };

  const getActionStatusBadge = (actionStatus: string) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    let classes = '';
    
    switch (actionStatus) {
      case 'Pending':
        classes = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        break;
      case 'In Progress':
        classes = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        break;
      case 'Completed':
        classes = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        break;
      case 'On Hold':
        classes = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        break;
      default:
        classes = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    
    return `${baseClasses} ${classes}`;
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    let classes = '';
    
    switch (priority) {
      case 'P1':
        classes = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        break;
      case 'P2':
        classes = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        break;
      case 'P3':
        classes = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        break;
      default:
        classes = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    
    return `${baseClasses} ${classes}`;
  };

  const getUnreadCount = (thread: Thread) => {
    return thread.comments.filter(comment => !comment.isRead).length;
  };

  // ServiceNow-style urgency calculation
  const getThreadUrgencyInfo = (thread: Thread) => {
    const now = new Date();
    const updatedAt = new Date(thread.updatedAt);
    const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // ServiceNow-style SLA calculations
    let urgencyLevel = 'low';
    let overdueDays = 0;
    
    if (thread.priority === 'P1') {
      urgencyLevel = daysSinceUpdate > 1 ? 'critical' : 'high';
      overdueDays = Math.max(0, daysSinceUpdate - 1);
    } else if (thread.priority === 'P2') {
      urgencyLevel = daysSinceUpdate > 3 ? 'high' : 'medium';
      overdueDays = Math.max(0, daysSinceUpdate - 3);
    } else if (thread.priority === 'P3') {
      urgencyLevel = daysSinceUpdate > 7 ? 'medium' : 'low';
      overdueDays = Math.max(0, daysSinceUpdate - 7);
    }
    
    // Escalate urgency based on action status
    if (thread.actionStatus === 'Action Required' && overdueDays > 0) {
      urgencyLevel = 'critical';
    }
    
    return {
      urgencyLevel,
      overdueDays,
      daysSinceUpdate,
      isOverdue: overdueDays > 0
    };
  };

  // ServiceNow-style urgency badge
  const getUrgencyBadge = (urgencyLevel: string, overdueDays: number) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    
    if (urgencyLevel === 'critical' || overdueDays > 0) {
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
    } else if (urgencyLevel === 'high') {
      return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
    } else if (urgencyLevel === 'medium') {
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    } else {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    }
  };

  // Calculate SLA information
  const getSLAInfo = (thread: Thread) => {
    const now = new Date();
    const dueDate = new Date(thread.dueDate);
    const createdAt = new Date(thread.createdAt);
    
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = now > dueDate;
    const overdueDays = isOverdue ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return {
      daysUntilDue,
      daysSinceCreated,
      isOverdue,
      overdueDays,
      dueDateFormatted: formatDate(thread.dueDate),
      createdAtFormatted: formatDate(thread.createdAt)
    };
  };


  const handleAddThread = (ruleId: string, description: string) => {
    setSelectedRuleId(ruleId);
    setSelectedRuleDescription(description);
    setModalOpen(true);
  };

  const handleModalConfirm = (title: string) => {
    onAddThread(selectedRuleId, title);
    setModalOpen(false);
    setSelectedRuleId('');
    setSelectedRuleDescription('');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRuleId('');
    setSelectedRuleDescription('');
  };

  const handleCloseThreadClick = (thread: Thread) => {
    // Reset closure comment when opening dialog
    setClosureComment('');
    
    if (thread.status === 'Closed') {
      // Thread is already closed, show warning that it cannot be reopened
      setCloseThreadDialog({ isOpen: true, thread });
    } else {
      // Thread is open, check if it can be closed
      if (thread.actionStatus === 'No Error' || thread.actionStatus === 'Error') {
        // Can close the thread
        setCloseThreadDialog({ isOpen: true, thread });
      } else {
        // Cannot close thread, show warning
        setCloseThreadDialog({ isOpen: true, thread });
      }
    }
  };

  const handleConfirmCloseThread = () => {
    if (closeThreadDialog.thread) {
      // Close the thread
      onCloseThread(closeThreadDialog.thread.id);
      setCloseThreadDialog({ isOpen: false, thread: null });
      setClosureComment('');
    }
  };

  const handleCancelCloseThread = () => {
    setCloseThreadDialog({ isOpen: false, thread: null });
    setClosureComment('');
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Rule No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(groupedRules).map(([module, ruleGroup]) => (
            <React.Fragment key={module}>
              {ruleGroup.map((rule) => {
                let ruleThreads = threads.filter(thread => thread.ruleId === rule.id);
                
                // Apply thread status filter
                if (!threadStatusFilter.includes('All')) {
                  ruleThreads = ruleThreads.filter(thread => threadStatusFilter.includes(thread.status));
                }
                
                // Apply thread title filter (cascading - only if business rule is selected)
                if (!threadTitleFilter.includes('All')) {
                  ruleThreads = ruleThreads.filter(thread => threadTitleFilter.includes(thread.title));
                }
                
                // Sort threads: Open threads first, then Closed threads
                ruleThreads = ruleThreads.sort((a, b) => {
                  if (a.status === 'Open' && b.status === 'Closed') return -1;
                  if (a.status === 'Closed' && b.status === 'Open') return 1;
                  return 0; // Keep original order for threads with same status
                });
                
                const isExpanded = expandedRows.has(rule.id);
                
                return (
                  <React.Fragment key={rule.id}>
                    {/* Main Rule Row */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {rule.ruleNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        <div className="font-medium">{rule.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(rule.status)}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onOpenChat(rule.id, undefined)}
                            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md transition-colors duration-200"
                            title="Open business rule chat"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAddThread(rule.id, rule.description)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            New thread
                          </button>
                          <button
                            onClick={() => onToggleRow(rule.id)}
                            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md transition-colors duration-200"
                            title={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Threads Section */}
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={4} className="px-0">
                          <div className="bg-white dark:bg-gray-800">
                            {ruleThreads.length > 0 && (
                              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Discussion Threads ({ruleThreads.length})
                                  </h4>
                                  {/* Master Expand/Collapse All Button */}
                                  <button
                                    onClick={() => {
                                      const allThreadIds = ruleThreads.map(t => t.id);
                                      const allExpanded = allThreadIds.every(id => expandedThreads.has(id));
                                      if (allExpanded) {
                                        // Collapse all
                                        allThreadIds.forEach(id => {
                                          if (expandedThreads.has(id)) {
                                            onToggleThread(id);
                                          }
                                        });
                                      } else {
                                        // Expand all
                                        allThreadIds.forEach(id => {
                                          if (!expandedThreads.has(id)) {
                                            onToggleThread(id);
                                          }
                                        });
                                      }
                                    }}
                                    className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    title="Toggle all threads"
                                  >
                                    {ruleThreads.every(t => expandedThreads.has(t.id)) ? (
                                      <>
                                        <ChevronDown className="h-3 w-3" />
                                        <span>Collapse All</span>
                                      </>
                                    ) : (
                                      <>
                                        <ChevronRight className="h-3 w-3" />
                                        <span>Expand All</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  {ruleThreads.map((thread) => {
                                    const latestQCComment = getLatestQCCommentForThread(thread.id);
                                    const latestSMComment = getLatestSMCommentForThread(thread.id);
                                    
                                    return (
                                      <div
                                        key={thread.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden"
                                      >
                                        {/* Thread Header - Non-clickable, with dedicated expand/collapse button */}
                                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                                            {/* Dedicated Expand/Collapse Button */}
                                            <button
                                              onClick={() => onToggleThread(thread.id)}
                                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex-shrink-0"
                                              title={expandedThreads.has(thread.id) ? 'Collapse thread' : 'Expand thread'}
                                            >
                                              {expandedThreads.has(thread.id) ? (
                                                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                              )}
                                            </button>
                                            
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                              thread.status === 'Open' ? 'bg-green-500' : 'bg-gray-400'
                                            }`} />
                                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                              {thread.title}
                                            </h5>
                                            
                                            {/* Enhanced Thread Information - Always visible */}
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                thread.status === 'Open' 
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                              }`}>
                                                {thread.status}
                                              </span>
                                              
                                              
                                              {/* Priority Badge */}
                                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                thread.priority === 'P1' 
                                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                  : thread.priority === 'P2'
                                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                              }`}>
                                                {thread.priority}
                                              </span>
                                              
                                              
                                              {/* Thread Creation Date */}
                                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Opened: {formatDate(thread.createdAt)}
                                              </span>
                                              
                                            </div>
                                          </div>
                                          
                                          {/* Action Buttons - Right Side */}
                                          <div className="flex items-center space-x-2 flex-shrink-0">
                                            
                                            <div className="flex items-center">
                                              <button
                                                onClick={() => handleCloseThreadClick(thread)}
                                                className={`relative inline-flex h-6 w-16 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                  thread.status === 'Open' 
                                                    ? 'bg-green-500 focus:ring-green-500' 
                                                    : 'bg-gray-400 focus:ring-gray-400'
                                                }`}
                                                title={thread.status === 'Open' ? 'Close thread' : 'Reopen thread'}
                                              >
                                                <span
                                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                    thread.status === 'Open' ? 'translate-x-1' : 'translate-x-11'
                                                  }`}
                                                />
                                                <span className={`absolute text-xs font-medium text-white transition-opacity duration-200 ${
                                                  thread.status === 'Open' ? 'right-1 opacity-100' : 'left-1 opacity-100'
                                                }`}>
                                                  {thread.status === 'Open' ? 'Open' : 'Closed'}
                                                </span>
                                              </button>
                                            </div>
                                            
                                            <button
                                              onClick={() => onOpenChat(rule.id, thread.id)}
                                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                              title="Open thread discussion"
                                            >
                                              <MessageCircle className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                            </button>
                                          </div>
                                        </div>
                                        
                                        {/* Thread Content - Only shown when expanded */}
                                        <AnimatePresence>
                                          {expandedThreads.has(thread.id) && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: 'auto' }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2 }}
                                              className="border-t border-gray-200 dark:border-gray-600"
                                            >
                                              <div className="p-4">
                                            
                                            {/* Action Status */}
                                            <div className="flex items-center space-x-2 mb-3">
                                              <select
                                                value={thread.actionStatus}
                                                onChange={(e) => onActionStatusChange(thread.id, e.target.value)}
                                                disabled={thread.status === 'Closed'}
                                                className={`text-xs border-0 rounded-full px-2 py-1 font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors duration-200 ${
                                                  thread.status === 'Closed'
                                                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed opacity-60'
                                                    : thread.actionStatus === 'Action Required' 
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    : thread.actionStatus === 'In Progress'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : thread.actionStatus === 'Completed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : thread.actionStatus === 'On Hold'
                                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                  : thread.actionStatus === 'No Error'
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                  : thread.actionStatus === 'Error'
                                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                }`}
                                                title={thread.status === 'Closed' ? 'Cannot change status - thread is closed' : 'Change action status'}
                                              >
                                                {actionStatusOptions.map((status) => (
                                                  <option key={status} value={status}>
                                                    {status}
                                                  </option>
                                                ))}
                                              </select>
                                              <select
                                                value={thread.priority}
                                                onChange={(e) => onPriorityChange(thread.id, e.target.value)}
                                                disabled={thread.status === 'Closed'}
                                                className={`text-xs border-0 rounded-full px-2 py-1 font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors duration-200 ${
                                                  thread.status === 'Closed'
                                                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed opacity-60'
                                                    : thread.priority === 'P1' 
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    : thread.priority === 'P2'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : thread.priority === 'P3'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                }`}
                                                title={thread.status === 'Closed' ? 'Cannot change priority - thread is closed' : 'Change priority'}
                                              >
                                                {priorityOptions.map((priority) => (
                                                  <option key={priority.value} value={priority.value}>
                                                    {priority.label}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                            
                                            {/* Latest Comments - Aligned with column headers */}
                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                              {/* QC Comment Column */}
                                              <div className="text-xs">
                                                <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">QC Comment:</div>
                                                {latestQCComment ? (
                                                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                                    <div className="text-gray-700 dark:text-gray-300 mb-1">
                                                      {latestQCComment.text}
                                                    </div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                                                      {formatDate(latestQCComment.timestamp)}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                                                    No QC comments yet
                                                  </div>
                                                )}
                                              </div>
                                              
                                              {/* SM Comment Column */}
                                              <div className="text-xs">
                                                <div className="font-medium text-green-600 dark:text-green-400 mb-1">SM Comment:</div>
                                                {latestSMComment ? (
                                                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                                    <div className="text-gray-700 dark:text-gray-300 mb-1">
                                                      {latestSMComment.text}
                                                    </div>
                                                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                                                      {formatDate(latestSMComment.timestamp)}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                                                    No SM comments yet
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {/* Add Thread Modal */}
      <AddThreadModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        ruleDescription={selectedRuleDescription}
      />

      {/* Close Thread Confirmation Dialog */}
      <AnimatePresence>
        {closeThreadDialog.isOpen && closeThreadDialog.thread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity backdrop-blur-sm"></div>

            {/* Modal Panel */}
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      closeThreadDialog.thread.status === 'Open' ? 'bg-orange-500' : 'bg-gray-400'
                    }`} />
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                      {closeThreadDialog.thread.status === 'Closed' 
                        ? 'Cannot Reopen Thread' 
                        : 'Close Thread Confirmation'
                      }
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={handleCancelCloseThread}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Thread: {closeThreadDialog.thread.title}
                    </h4>
                    
                    {closeThreadDialog.thread.status === 'Closed' ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                          <Lock className="h-5 w-5" />
                          <span className="text-sm font-medium">This thread is already closed.</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          According to system requirements, closed threads cannot be reopened. 
                          If you need to continue the discussion, please create a new thread.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {closeThreadDialog.thread.actionStatus === 'No Error' || closeThreadDialog.thread.actionStatus === 'Error' ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                              <Lock className="h-5 w-5" />
                              <span className="text-sm font-medium">Ready to close thread</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              This thread has been marked as <strong>{closeThreadDialog.thread.actionStatus}</strong> and can be closed.
                              Once closed, this thread cannot be reopened.
                            </p>
                            
                            {/* Closure Comment Field */}
                            <div className="space-y-2">
                              <label htmlFor="closure-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Closure Comment (Optional)
                              </label>
                              <textarea
                                id="closure-comment"
                                value={closureComment}
                                onChange={(e) => setClosureComment(e.target.value)}
                                placeholder="Add a comment explaining why this thread is being closed..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200 resize-none"
                                rows={3}
                                maxLength={500}
                              />
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {closureComment.length}/500 characters
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                              <Lock className="h-5 w-5" />
                              <span className="text-sm font-medium">Cannot close thread yet</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              This thread cannot be closed because its status is <strong>{closeThreadDialog.thread.actionStatus}</strong>.
                              Please change the status to either <strong>Verified</strong> or <strong>Skipped</strong> before closing.
                            </p>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                              <p className="text-xs text-amber-800 dark:text-amber-200">
                                <strong>Note:</strong> Only threads with "Verified" or "Skipped" status can be closed.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {closeThreadDialog.thread.status === 'Closed' ? (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleCancelCloseThread}
                    >
                      Understood
                    </button>
                  ) : closeThreadDialog.thread.actionStatus === 'No Error' || closeThreadDialog.thread.actionStatus === 'Error' ? (
                    <>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleConfirmCloseThread}
                      >
                        Close Thread
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleCancelCloseThread}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleCancelCloseThread}
                    >
                      Change Status First
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataTable;