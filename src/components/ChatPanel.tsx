import React, { useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { X, Plus, MessageCircle, Clock, Lock, Unlock, Maximize2, ChevronDown, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thread, BusinessRule } from '../types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  rule: BusinessRule | null;
  threads: Thread[];
  context: 'businessRule' | 'thread';
  onAddThread: (ruleId: string, title: string) => void;
  onAddComment: (threadId: string, text: string, author: 'QC' | 'SM') => void;
  onToggleThread: (threadId: string) => void;
  onCloseThread: (threadId: string) => void;
  onActionStatusChange: (threadId: string, newActionStatus: string) => void;
  onPriorityChange: (threadId: string, newPriority: string) => void;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  rule,
  threads,
  context,
  onAddThread,
  onAddComment,
  onToggleThread,
  onCloseThread,
  onActionStatusChange,
  onPriorityChange,
  position,
  size,
  onPositionChange,
  onSizeChange
}) => {
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(() => {
    // For thread context, expand the thread by default
    if (context === 'thread' && threads.length > 0) {
      return new Set([threads[0].id]);
    }
    // For business rule context, start with all threads collapsed
    return new Set();
  });
  const [newComments, setNewComments] = useState<{ [threadId: string]: string }>({});
  const [closeThreadDialog, setCloseThreadDialog] = useState<{
    isOpen: boolean;
    thread: Thread | null;
  }>({ isOpen: false, thread: null });
  const [closureComment, setClosureComment] = useState('');
  const [autoSized, setAutoSized] = useState(false);
  const [screenBounds, setScreenBounds] = useState({ width: window.innerWidth, height: window.innerHeight });

  const toggleThreadExpansion = (threadId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(threadId)) {
      newExpanded.delete(threadId);
    } else {
      newExpanded.add(threadId);
    }
    setExpandedThreads(newExpanded);
  };

  const handleCloseThreadClick = (thread: Thread) => {
    // Reset closure comment when opening dialog
    setClosureComment('');
    
    if (thread.status === 'Closed') {
      // Thread is closed, reopen it directly
      onToggleThread(thread.id);
    } else {
      // Thread is open, check if it can be closed
      if (thread.actionStatus === 'No Error' || thread.actionStatus === 'Error') {
        // Can close the thread, show dialog
        setCloseThreadDialog({ isOpen: true, thread });
      } else {
        // Cannot close thread, show warning
        setCloseThreadDialog({ isOpen: true, thread });
      }
    }
  };

  const handleConfirmCloseThread = () => {
    if (closeThreadDialog.thread) {
      // Add closure comment if provided
      if (closureComment.trim()) {
        onAddComment(closeThreadDialog.thread.id, `[Thread Closed] ${closureComment.trim()}`, 'QC');
      }
      
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

  const handleAddThread = () => {
    if (newThreadTitle.trim() && rule) {
      onAddThread(rule.id, newThreadTitle.trim());
      setNewThreadTitle('');
      setShowNewThreadForm(false);
    }
  };

  const handleAddComment = (threadId: string, author: 'QC' | 'SM') => {
    const commentText = newComments[threadId];
    if (commentText?.trim()) {
      onAddComment(threadId, commentText.trim(), author);
      setNewComments(prev => ({ ...prev, [threadId]: '' }));
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    const classes = status === 'Open' 
      ? `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
      : `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    
    return (
      <span className={classes}>
        {status}
      </span>
    );
  };

  const getActionStatusBadge = (actionStatus: string) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    let classes = '';
    
    switch (actionStatus) {
      case 'Action Required':
        classes = `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
        break;
      case 'In Progress':
        classes = `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
        break;
      case 'On Hold':
        classes = `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
        break;
      case 'Completed':
        classes = `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
        break;
      case 'Verified':
        classes = `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
        break;
      case 'Skipped':
        classes = `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
        break;
      default:
        classes = `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
    
    return (
      <span className={classes}>
        {actionStatus}
      </span>
    );
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
    
    return (
      <span className={classes}>
        {priority}
      </span>
    );
  };

  const actionStatusOptions = [
    'Action Required',
    'In Progress', 
    'On Hold',
    'Completed',
    'No Error',
    'Error'
  ];

  const priorityOptions = [
    { value: 'P1', label: 'P1 - Severe' },
    { value: 'P2', label: 'P2 - Moderate' },
    { value: 'P3', label: 'P3 - Low' }
  ];

  // Function to calculate thread urgency and overdue status
  const getThreadUrgencyInfo = (thread: Thread) => {
    const now = new Date();
    const updatedAt = new Date(thread.updatedAt);
    const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate urgency based on priority and days since update
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
    
    // Adjust urgency based on action status
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

  // Function to get urgency badge styling
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

  // Function to calculate optimal chat panel size
  const calculateOptimalSize = useCallback(() => {
    if (context === 'thread' && threads.length > 0) {
      const thread = threads[0];
      const commentCount = thread.comments.length;
      
      // Base dimensions
      let baseWidth = 400;
      let baseHeight = 300;
      
      // Adjust width based on content
      const maxCommentLength = Math.max(...thread.comments.map(c => c.text.length), 0);
      if (maxCommentLength > 50) {
        baseWidth = Math.min(600, Math.max(400, maxCommentLength * 8));
      }
      
      // Adjust height based on comment count
      const headerHeight = 140; // Header, status, controls
      const commentHeight = commentCount * 90; // Approximate height per comment
      const inputHeight = 120; // Input area (input field + buttons + padding)
      const padding = 60; // Padding and margins
      
      baseHeight = Math.min(800, Math.max(400, headerHeight + commentHeight + inputHeight + padding));
      
      return {
        width: baseWidth,
        height: baseHeight
      };
    } else if (context === 'businessRule') {
      // For business rule context, show multiple threads
      const threadCount = threads.length;
      const baseWidth = 450;
      const baseHeight = Math.min(700, Math.max(400, 200 + (threadCount * 150)));
      
      return {
        width: baseWidth,
        height: baseHeight
      };
    }
    
    return { width: 400, height: 300 };
  }, [context, threads]);

  // Function to ensure chat panel stays within screen boundaries
  const calculateOptimalPosition = useCallback((newSize: { width: number; height: number }) => {
    const margin = 20; // Margin from screen edges
    const maxX = screenBounds.width - newSize.width - margin;
    const maxY = screenBounds.height - newSize.height - margin;
    
    // Ensure position stays within bounds
    const boundedX = Math.max(margin, Math.min(position.x, maxX));
    const boundedY = Math.max(margin, Math.min(position.y, maxY));
    
    return { x: boundedX, y: boundedY };
  }, [position.x, position.y, screenBounds]);

  // Function to ensure size doesn't exceed screen bounds
  const calculateBoundedSize = useCallback((optimalSize: { width: number; height: number }) => {
    const margin = 40; // Margin from screen edges
    const maxWidth = screenBounds.width - margin;
    const maxHeight = screenBounds.height - margin;
    
    return {
      width: Math.min(optimalSize.width, maxWidth),
      height: Math.min(optimalSize.height, maxHeight)
    };
  }, [screenBounds]);

  // Auto-size the chat panel when it opens or content changes
  useEffect(() => {
    if (isOpen && !autoSized) {
      const optimalSize = calculateOptimalSize();
      const boundedSize = calculateBoundedSize(optimalSize);
      const optimalPosition = calculateOptimalPosition(boundedSize);
      
      onSizeChange(boundedSize);
      onPositionChange(optimalPosition);
      setAutoSized(true);
    }
  }, [isOpen, threads, context, autoSized, onSizeChange, onPositionChange, calculateOptimalSize, calculateBoundedSize, calculateOptimalPosition]);

  // Reset auto-sized flag when chat panel closes
  useEffect(() => {
    if (!isOpen) {
      setAutoSized(false);
    }
  }, [isOpen]);

  // Update screen bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenBounds({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure threads start collapsed for business rule context
  useEffect(() => {
    if (context === 'businessRule' && threads.length > 0) {
      // Only reset expanded threads when context changes, not when threads are updated
      setExpandedThreads(new Set());
    }
  }, [context]);

  if (!isOpen || !rule) return null;

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => {
        // Use the actual drag position, but ensure it stays within bounds
        const margin = 20;
        const maxX = screenBounds.width - size.width - margin;
        const maxY = screenBounds.height - size.height - margin;
        
        const boundedX = Math.max(margin, Math.min(d.x, maxX));
        const boundedY = Math.max(margin, Math.min(d.y, maxY));
        
        onPositionChange({ x: boundedX, y: boundedY });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newSize = {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height)
        };
        const boundedSize = calculateBoundedSize(newSize);
        const boundedPosition = calculateOptimalPosition(boundedSize);
        
        onSizeChange(boundedSize);
        onPositionChange(boundedPosition);
      }}
      minWidth={300}
      minHeight={200}
      maxWidth={screenBounds.width - 40}
      maxHeight={screenBounds.height - 40}
      bounds="window"
      className="z-50"
      dragHandleClassName="chat-header"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 chat-header cursor-move">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {context === 'thread' 
                ? `Thread: ${threads[0]?.title || 'Discussion'}`
                : `Discussion: ${rule?.description}`
              }
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Calculate 80% of screen dimensions
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                const maximizedWidth = Math.floor(screenWidth * 0.8);
                const maximizedHeight = Math.floor(screenHeight * 0.8);
                
                // Center the chatbox
                const centerX = Math.floor((screenWidth - maximizedWidth) / 2);
                const centerY = Math.floor((screenHeight - maximizedHeight) / 2);
                
                
                onSizeChange({ width: maximizedWidth, height: maximizedHeight });
                onPositionChange({ x: centerX, y: centerY });
              }}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title="Maximize to 80% of screen and center"
            >
              <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          </div>
        </div>

        {/* Threads List or Single Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {threads.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No discussion threads yet</p>
            </div>
          ) : context === 'thread' ? (
            // Single thread view - show comments directly
            threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Thread Header - Simplified */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(thread.status)}
                      
                      {/* Action Status */}
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
                      
                      {/* Priority */}
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
                    
                    {/* Toggle Switch */}
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
                  </div>
                </div>

                {/* Thread Comments - Always visible in thread context */}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="p-4">
                    {thread.comments.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No comments yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4 px-2">
                        {thread.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className={`flex ${comment.author === 'QC' ? 'justify-start' : 'justify-end'} mb-4`}
                          >
                            <div className={`flex max-w-[75%] ${comment.author === 'QC' ? 'flex-row space-x-3' : 'flex-row-reverse space-x-reverse space-x-3'}`}>
                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                  comment.author === 'QC' 
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-green-500 text-white'
                                }`}>
                                  {comment.author}
                                </div>
                              </div>
                              
                              {/* Message Content */}
                              <div className="flex-1 min-w-0">
                                <div className={`flex items-center mb-1 ${comment.author === 'QC' ? 'justify-start' : 'justify-end'}`}>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(comment.timestamp)}
                                  </span>
                                </div>
                                <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-full break-words ${
                                  comment.author === 'QC' 
                                    ? 'bg-blue-500 text-white rounded-bl-md'
                                    : 'bg-green-500 text-white rounded-br-md'
                                }`}>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    
                    {/* Add Comment Form for Thread Context - Only for open threads */}
                    {thread.status === 'Open' && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newComments[thread.id] || ''}
                            onChange={(e) => setNewComments(prev => ({ ...prev, [thread.id]: e.target.value }))}
                            placeholder="Type your message..."
                            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none break-words"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAddComment(thread.id, 'QC')}
                              className="px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                            >
                              QC
                            </button>
                            <button
                              onClick={() => handleAddComment(thread.id, 'SM')}
                              className="px-3 py-2 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                            >
                              SM
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Closed Thread Message */}
                    {thread.status === 'Closed' && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Lock className="h-4 w-4" />
                          <span>This thread is closed. No new comments can be added.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Business rule context - show thread list
            threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Thread Header */}
                <div
                  className="p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => toggleThreadExpansion(thread.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {/* Collapse/Expand Icon */}
                      {expandedThreads.has(thread.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      )}
                      
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {thread.title}
                      </h4>
                      
                      {/* Status and Priority Info - Simplified */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {getStatusBadge(thread.status)}
                        
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thread Comments */}
                <AnimatePresence>
                  {expandedThreads.has(thread.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-4">
                        <div className="space-y-4 px-2">
                        {thread.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className={`flex ${comment.author === 'QC' ? 'justify-start' : 'justify-end'} mb-4`}
                          >
                            <div className={`flex max-w-[75%] ${comment.author === 'QC' ? 'flex-row space-x-3' : 'flex-row-reverse space-x-reverse space-x-3'}`}>
                              {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                comment.author === 'QC' 
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-green-500 text-white'
                              }`}>
                                {comment.author}
                              </div>
                            </div>
                              
                              {/* Message Content */}
                            <div className="flex-1 min-w-0">
                                <div className={`flex items-center mb-1 ${comment.author === 'QC' ? 'justify-start' : 'justify-end'}`}>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(comment.timestamp)}
                                </span>
                              </div>
                                <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-full break-words ${
                                  comment.author === 'QC' 
                                    ? 'bg-blue-500 text-white rounded-bl-md'
                                    : 'bg-green-500 text-white rounded-br-md'
                                }`}>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {comment.text}
                              </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                            </div>

                        {/* Add Comment Form for Individual Thread - Only for open threads */}
                        {thread.status === 'Open' && (
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={newComments[thread.id] || ''}
                                onChange={(e) => setNewComments(prev => ({ ...prev, [thread.id]: e.target.value }))}
                                placeholder="Type your message..."
                                className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none break-words"
                              />
                              <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddComment(thread.id, 'QC')}
                                  className="px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                              >
                                QC
                              </button>
                              <button
                                onClick={() => handleAddComment(thread.id, 'SM')}
                                  className="px-3 py-2 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                              >
                                SM
                              </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Closed Thread Message */}
                        {thread.status === 'Closed' && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                              <Lock className="h-4 w-4" />
                              <span>This thread is closed. No new comments can be added.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}


        </div>

        {/* Add New Thread - Only show for business rule context */}
        {context === 'businessRule' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!showNewThreadForm ? (
              <button
                onClick={() => setShowNewThreadForm(true)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>New Thread</span>
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Thread title..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddThread}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    Create Thread
                  </button>
                  <button
                    onClick={() => {
                      setShowNewThreadForm(false);
                      setNewThreadTitle('');
                    }}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

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
                              Please change the status to either <strong>No Error</strong> or <strong>Error</strong> before closing.
                            </p>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                              <p className="text-xs text-amber-800 dark:text-amber-200">
                                <strong>Note:</strong> Only threads with "No Error" or "Error" status can be closed.
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
    </Rnd>
  );
};

export default ChatPanel;