import { BusinessRule, Thread } from '../types';

export const mockBusinessRules: BusinessRule[] = [
  {
    id: 'rule-1',
    ruleNo: 1,
    description: 'All warehouse personnel must wear safety helmets at all times',
    qcComment: 'Helmet compliance is critical for safety',
    smComment: 'Ensure helmets are properly fitted and maintained',
    status: 'Pass',
    moduleName: 'Warehouse Safety Checks',
    businessRule: 'Safety Compliance',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'rule-2',
    ruleNo: 2,
    description: 'Emergency exits must remain unobstructed at all times',
    qcComment: 'Exit pathways are clear and marked',
    smComment: 'Regular inspections scheduled',
    status: 'Pass',
    moduleName: 'Warehouse Safety Checks',
    businessRule: 'Emergency Procedures',
    createdAt: '2024-01-17T10:15:00Z',
    updatedAt: '2024-01-17T10:15:00Z'
  },
  {
    id: 'rule-3',
    ruleNo: 3,
    description: 'Loading dock safety protocols must be followed',
    qcComment: 'Loading procedures need standardization',
    smComment: 'Safety barriers installed and maintained',
    status: 'Open',
    moduleName: 'Warehouse Safety Checks',
    businessRule: 'Loading Operations',
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-19T14:30:00Z'
  },
  {
    id: 'rule-4',
    ruleNo: 1,
    description: 'Forklift operators must complete safety training annually',
    qcComment: 'Training records need to be updated',
    smComment: 'Schedule refresher training sessions',
    status: 'Fail',
    moduleName: 'Equipment Management',
    businessRule: 'Training Requirements',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z'
  },
  {
    id: 'rule-5',
    ruleNo: 2,
    description: 'All electrical equipment must be inspected monthly',
    qcComment: 'Monthly inspections are behind schedule',
    smComment: 'Hiring additional electrician for inspections',
    status: 'Fail',
    moduleName: 'Equipment Management',
    businessRule: 'Maintenance Schedule',
    createdAt: '2024-01-20T07:45:00Z',
    updatedAt: '2024-01-20T07:45:00Z'
  },
  {
    id: 'rule-6',
    ruleNo: 1,
    description: 'Temperature logs must be maintained for cold storage',
    qcComment: 'Temperature monitoring is within acceptable range',
    smComment: 'Backup monitoring system installed',
    status: 'Pass',
    moduleName: 'Quality Control',
    businessRule: 'Environmental Controls',
    createdAt: '2024-01-19T12:30:00Z',
    updatedAt: '2024-01-19T12:30:00Z'
  },
  {
    id: 'rule-7',
    ruleNo: 1,
    description: 'Chemical storage areas must have proper ventilation',
    qcComment: 'Ventilation system working correctly',
    smComment: 'Regular maintenance performed',
    status: 'Pass',
    moduleName: 'Environmental Controls',
    businessRule: 'Safety Compliance',
    createdAt: '2024-01-21T09:20:00Z',
    updatedAt: '2024-01-21T09:20:00Z'
  },
  {
    id: 'rule-8',
    ruleNo: 1,
    description: 'Inventory must be scanned and updated daily',
    qcComment: 'Daily scanning process needs improvement',
    smComment: 'Implement automated scanning system',
    status: 'Open',
    moduleName: 'Inventory Management',
    businessRule: 'Data Accuracy',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z'
  },
  {
    id: 'rule-9',
    ruleNo: 2,
    description: 'Product labeling must be accurate and visible',
    qcComment: 'Labeling accuracy is within acceptable limits',
    smComment: 'Automated labeling system installed',
    status: 'Pass',
    moduleName: 'Quality Control',
    businessRule: 'Data Accuracy',
    createdAt: '2024-01-23T13:25:00Z',
    updatedAt: '2024-01-23T13:25:00Z'
  },
  {
    id: 'rule-10',
    ruleNo: 1,
    description: 'Fire suppression systems must be tested quarterly',
    qcComment: 'Fire system tests are overdue',
    smComment: 'Scheduling emergency fire system inspection',
    status: 'Fail',
    moduleName: 'Emergency Procedures',
    businessRule: 'Safety Compliance',
    createdAt: '2024-01-24T14:00:00Z',
    updatedAt: '2024-01-24T14:00:00Z'
  },
  {
    id: 'rule-11',
    ruleNo: 2,
    description: 'Personal protective equipment inventory tracking',
    qcComment: 'PPE inventory system needs improvement',
    smComment: 'Implementing RFID tracking for PPE',
    status: 'Open',
    moduleName: 'Inventory Management',
    businessRule: 'Training Requirements',
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-01-25T08:30:00Z'
  },
  {
    id: 'rule-12',
    ruleNo: 2,
    description: 'Warehouse lighting must meet minimum standards',
    qcComment: 'Lighting levels are adequate throughout facility',
    smComment: 'LED upgrade completed successfully',
    status: 'Pass',
    moduleName: 'Environmental Controls',
    businessRule: 'Safety Compliance',
    createdAt: '2024-01-26T10:15:00Z',
    updatedAt: '2024-01-26T10:15:00Z'
  },
  {
    id: 'rule-13',
    ruleNo: 3,
    description: 'Material handling equipment daily inspection',
    qcComment: 'Daily inspections not being documented properly',
    smComment: 'Training staff on proper documentation',
    status: 'Fail',
    moduleName: 'Equipment Management',
    businessRule: 'Maintenance Schedule',
    createdAt: '2024-01-27T12:45:00Z',
    updatedAt: '2024-01-27T12:45:00Z'
  },
  {
    id: 'rule-14',
    ruleNo: 3,
    description: 'Quality control sampling procedures',
    qcComment: 'Sampling procedures are being followed correctly',
    smComment: 'Statistical process control implemented',
    status: 'Pass',
    moduleName: 'Quality Control',
    businessRule: 'Data Accuracy',
    createdAt: '2024-01-28T15:20:00Z',
    updatedAt: '2024-01-28T15:20:00Z'
  },
  {
    id: 'rule-15',
    ruleNo: 1,
    description: 'Hazardous material handling protocols',
    qcComment: 'Hazmat protocols need updating for new regulations',
    smComment: 'Consulting with safety experts for updates',
    status: 'Open',
    moduleName: 'Environmental Controls',
    businessRule: 'Emergency Procedures',
    createdAt: '2024-01-29T09:00:00Z',
    updatedAt: '2024-01-29T09:00:00Z'
  }
];

// Helper function to generate recent dates
const getRecentDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const getDueDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export const mockThreads: Thread[] = [
  // P1 - Critical/Overdue threads (realistic overdue days)
  {
    id: 'thread-1',
    title: 'Helmet compliance issues',
    ruleId: 'rule-1',
    status: 'Open',
    actionStatus: 'Action Required',
    priority: 'P1',
    comments: [
      {
        id: 'comment-1',
        text: 'URGENT: Multiple safety violations found. Need immediate action.',
        author: 'QC',
        timestamp: getRecentDate(22),
        threadId: 'thread-1',
        isRead: false
      },
      {
        id: 'comment-2',
        text: 'Working on emergency helmet order. Should arrive by Friday.',
        author: 'SM',
        timestamp: getRecentDate(21),
        threadId: 'thread-1',
        isRead: true
      },
      {
        id: 'comment-3',
        text: 'Still waiting for helmets. This is affecting operations.',
        author: 'QC',
        timestamp: getRecentDate(20),
        threadId: 'thread-1',
        isRead: false
      }
    ],
    dueDate: getDueDate(-20), // 20 days overdue
    createdAt: getRecentDate(22),
    updatedAt: getRecentDate(20)
  },
  {
    id: 'thread-2',
    title: 'Fire suppression system',
    ruleId: 'rule-1',
    status: 'Open',
    actionStatus: 'Action Required',
    priority: 'P1',
    comments: [
      {
        id: 'comment-4',
        text: 'Fire suppression system inspection is 2 weeks overdue. Critical safety issue.',
        author: 'QC',
        timestamp: getRecentDate(15),
        threadId: 'thread-2',
        isRead: false
      },
      {
        id: 'comment-5',
        text: 'Emergency inspection scheduled for tomorrow. Fire department notified.',
        author: 'SM',
        timestamp: getRecentDate(14),
        threadId: 'thread-2',
        isRead: true
      }
    ],
    dueDate: getDueDate(-13), // 13 days overdue
    createdAt: getRecentDate(15),
    updatedAt: getRecentDate(14)
  },
  {
    id: 'thread-3',
    title: 'Electrical safety violations',
    ruleId: 'rule-1',
    status: 'Open',
    actionStatus: 'Action Required',
    priority: 'P1',
    comments: [
      {
        id: 'comment-6',
        text: 'CRITICAL: Electrical safety violations found during inspection.',
        author: 'QC',
        timestamp: getRecentDate(8),
        threadId: 'thread-3',
        isRead: false
      },
      {
        id: 'comment-7',
        text: 'Contract electrician unavailable. Looking for emergency contractor.',
        author: 'SM',
        timestamp: getRecentDate(7),
        threadId: 'thread-3',
        isRead: true
      }
    ],
    dueDate: getDueDate(-7), // 7 days overdue
    createdAt: getRecentDate(8),
    updatedAt: getRecentDate(7)
  },

  // P2 - In Progress threads (recent updates)
  {
    id: 'thread-4',
    title: 'Forklift training schedule',
    ruleId: 'rule-1',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P2',
    comments: [
      {
        id: 'comment-8',
        text: 'Training sessions scheduled for next month',
        author: 'SM',
        timestamp: getRecentDate(3),
        threadId: 'thread-4',
        isRead: false
      },
      {
        id: 'comment-9',
        text: 'How many operators need training? Need to plan resources accordingly.',
        author: 'QC',
        timestamp: getRecentDate(2),
        threadId: 'thread-4',
        isRead: true
      },
      {
        id: 'comment-10',
        text: 'We have 8 operators who need certification. Training will be split into 2 sessions.',
        author: 'SM',
        timestamp: getRecentDate(1),
        threadId: 'thread-4',
        isRead: false
      }
    ],
    dueDate: getDueDate(1), // Due tomorrow
    createdAt: getRecentDate(3),
    updatedAt: getRecentDate(1)
  },
  {
    id: 'thread-5',
    title: 'Daily scanning process improvement',
    ruleId: 'rule-1',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P2',
    comments: [
      {
        id: 'comment-11',
        text: 'Current scanning process is taking too long. Need automation.',
        author: 'QC',
        timestamp: getRecentDate(5),
        threadId: 'thread-5',
        isRead: false
      },
      {
        id: 'comment-12',
        text: 'Looking into RFID solutions. Will have proposal by end of week.',
        author: 'SM',
        timestamp: getRecentDate(4),
        threadId: 'thread-5',
        isRead: true
      },
      {
        id: 'comment-13',
        text: 'Also consider barcode scanning as interim solution?',
        author: 'QC',
        timestamp: getRecentDate(3),
        threadId: 'thread-5',
        isRead: true
      }
    ],
    dueDate: getDueDate(2), // Due in 2 days
    createdAt: getRecentDate(5),
    updatedAt: getRecentDate(3)
  },
  {
    id: 'thread-6',
    title: 'Loading dock safety updates',
    ruleId: 'rule-1',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P2',
    comments: [
      {
        id: 'comment-14',
        text: 'New loading equipment requires updated safety protocols',
        author: 'QC',
        timestamp: getRecentDate(6),
        threadId: 'thread-6',
        isRead: false
      },
      {
        id: 'comment-15',
        text: 'Drafting new procedures. Will need QC review before implementation.',
        author: 'SM',
        timestamp: getRecentDate(5),
        threadId: 'thread-6',
        isRead: true
      },
      {
        id: 'comment-16',
        text: 'Should we include training for new protocols?',
        author: 'QC',
        timestamp: getRecentDate(4),
        threadId: 'thread-6',
        isRead: true
      }
    ],
    dueDate: getDueDate(3), // Due in 3 days
    createdAt: getRecentDate(6),
    updatedAt: getRecentDate(4)
  },

  // P2 - Completed threads
  {
    id: 'thread-7',
    title: 'Exit pathway maintenance',
    ruleId: 'rule-2',
    status: 'Closed',
    actionStatus: 'Completed',
    priority: 'P2',
    comments: [
      {
        id: 'comment-17',
        text: 'All exit pathways have been cleared and marked',
        author: 'QC',
        timestamp: getRecentDate(10),
        threadId: 'thread-7',
        isRead: true
      },
      {
        id: 'comment-18',
        text: 'Emergency lighting has also been tested and is working properly.',
        author: 'SM',
        timestamp: getRecentDate(9),
        threadId: 'thread-7',
        isRead: true
      }
    ],
    dueDate: getDueDate(-10), // Completed 10 days ago
    createdAt: getRecentDate(12),
    updatedAt: getRecentDate(9)
  },
  {
    id: 'thread-8',
    title: 'Temperature monitoring system',
    ruleId: 'rule-2',
    status: 'Closed',
    actionStatus: 'No Error',
    priority: 'P2',
    comments: [
      {
        id: 'comment-19',
        text: 'Temperature monitoring system is working correctly',
        author: 'QC',
        timestamp: getRecentDate(8),
        threadId: 'thread-8',
        isRead: true
      },
      {
        id: 'comment-20',
        text: 'Backup monitoring system installed and tested successfully.',
        author: 'SM',
        timestamp: getRecentDate(7),
        threadId: 'thread-8',
        isRead: true
      }
    ],
    dueDate: getDueDate(-8), // Verified 8 days ago
    createdAt: getRecentDate(10),
    updatedAt: getRecentDate(7)
  },

  // P3 - Low priority threads
  {
    id: 'thread-9',
    title: 'PPE inventory system upgrade',
    ruleId: 'rule-2',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P3',
    comments: [
      {
        id: 'comment-21',
        text: 'Current PPE tracking is manual and error-prone',
        author: 'QC',
        timestamp: getRecentDate(7),
        threadId: 'thread-9',
        isRead: false
      },
      {
        id: 'comment-22',
        text: 'RFID system being implemented. Should improve accuracy significantly.',
        author: 'SM',
        timestamp: getRecentDate(6),
        threadId: 'thread-9',
        isRead: true
      },
      {
        id: 'comment-23',
        text: 'When will the new system be operational?',
        author: 'QC',
        timestamp: getRecentDate(5),
        threadId: 'thread-9',
        isRead: true
      },
      {
        id: 'comment-24',
        text: 'Targeting next month for full implementation.',
        author: 'SM',
        timestamp: getRecentDate(4),
        threadId: 'thread-9',
        isRead: false
      }
    ],
    dueDate: getDueDate(5), // Due in 5 days
    createdAt: getRecentDate(7),
    updatedAt: getRecentDate(4)
  },
  {
    id: 'thread-10',
    title: 'Equipment inspection documentation',
    ruleId: 'rule-2',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P3',
    comments: [
      {
        id: 'comment-25',
        text: 'Daily equipment inspections not being properly documented',
        author: 'QC',
        timestamp: getRecentDate(9),
        threadId: 'thread-10',
        isRead: false
      },
      {
        id: 'comment-26',
        text: 'Implementing digital inspection forms. Training staff this week.',
        author: 'SM',
        timestamp: getRecentDate(8),
        threadId: 'thread-10',
        isRead: true
      }
    ],
    dueDate: getDueDate(4), // Due in 4 days
    createdAt: getRecentDate(9),
    updatedAt: getRecentDate(8)
  },

  // On Hold threads
  {
    id: 'thread-11',
    title: 'Hazmat protocol updates',
    ruleId: 'rule-3',
    status: 'Open',
    actionStatus: 'On Hold',
    priority: 'P3',
    comments: [
      {
        id: 'comment-27',
        text: 'New hazmat regulations require protocol updates',
        author: 'QC',
        timestamp: getRecentDate(12),
        threadId: 'thread-11',
        isRead: false
      },
      {
        id: 'comment-28',
        text: 'Consulting with regulatory experts. Process may take several weeks.',
        author: 'SM',
        timestamp: getRecentDate(11),
        threadId: 'thread-11',
        isRead: true
      }
    ],
    dueDate: getDueDate(6), // Due in 6 days
    createdAt: getRecentDate(12),
    updatedAt: getRecentDate(11)
  },

  // Skipped threads
  {
    id: 'thread-12',
    title: 'Chemical storage ventilation',
    ruleId: 'rule-3',
    status: 'Closed',
    actionStatus: 'Error',
    priority: 'P3',
    comments: [
      {
        id: 'comment-29',
        text: 'Ventilation system upgrade no longer needed due to process changes.',
        author: 'QC',
        timestamp: getRecentDate(15),
        threadId: 'thread-12',
        isRead: true
      },
      {
        id: 'comment-30',
        text: 'Agreed. Process modification eliminates the need for additional ventilation.',
        author: 'SM',
        timestamp: getRecentDate(14),
        threadId: 'thread-12',
        isRead: true
      }
    ],
    dueDate: getDueDate(-15), // Skipped 15 days ago
    createdAt: getRecentDate(17),
    updatedAt: getRecentDate(14)
  },

  // Additional threads for more comprehensive testing
  {
    id: 'thread-13',
    title: 'Product labeling accuracy',
    ruleId: 'rule-3',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P2',
    comments: [
      {
        id: 'comment-31',
        text: 'Labeling accuracy audit completed. Minor improvements needed.',
        author: 'QC',
        timestamp: getRecentDate(1),
        threadId: 'thread-13',
        isRead: false
      },
      {
        id: 'comment-32',
        text: 'Automated labeling system is being fine-tuned. Should improve accuracy.',
        author: 'SM',
        timestamp: getRecentDate(0),
        threadId: 'thread-13',
        isRead: true
      }
    ],
    dueDate: getDueDate(2), // Due in 2 days
    createdAt: getRecentDate(1),
    updatedAt: getRecentDate(0)
  },
  {
    id: 'thread-14',
    title: 'Warehouse lighting upgrade',
    ruleId: 'rule-3',
    status: 'Closed',
    actionStatus: 'Completed',
    priority: 'P2',
    comments: [
      {
        id: 'comment-33',
        text: 'LED lighting upgrade completed successfully.',
        author: 'QC',
        timestamp: getRecentDate(5),
        threadId: 'thread-14',
        isRead: true
      },
      {
        id: 'comment-34',
        text: 'Energy savings and improved lighting levels achieved.',
        author: 'SM',
        timestamp: getRecentDate(4),
        threadId: 'thread-14',
        isRead: true
      }
    ],
    dueDate: getDueDate(-5), // Completed 5 days ago
    createdAt: getRecentDate(7),
    updatedAt: getRecentDate(4)
  },
  {
    id: 'thread-15',
    title: 'Quality control sampling procedures',
    ruleId: 'rule-3',
    status: 'Closed',
    actionStatus: 'No Error',
    priority: 'P2',
    comments: [
      {
        id: 'comment-35',
        text: 'Statistical process control implementation verified and working.',
        author: 'QC',
        timestamp: getRecentDate(6),
        threadId: 'thread-15',
        isRead: true
      },
      {
        id: 'comment-36',
        text: 'Sampling procedures are being followed correctly.',
        author: 'SM',
        timestamp: getRecentDate(5),
        threadId: 'thread-15',
        isRead: true
      }
    ],
    dueDate: getDueDate(-6), // Verified 6 days ago
    createdAt: getRecentDate(8),
    updatedAt: getRecentDate(5)
  },

  // Additional threads for better demonstration
  {
    id: 'thread-16',
    title: 'Safety equipment calibration',
    ruleId: 'rule-4',
    status: 'Open',
    actionStatus: 'Action Required',
    priority: 'P1',
    comments: [
      {
        id: 'comment-37',
        text: 'Safety equipment calibration is overdue. Need immediate attention.',
        author: 'QC',
        timestamp: getRecentDate(12),
        threadId: 'thread-16',
        isRead: false
      },
      {
        id: 'comment-38',
        text: 'Scheduling calibration with certified technician.',
        author: 'SM',
        timestamp: getRecentDate(11),
        threadId: 'thread-16',
        isRead: true
      }
    ],
    dueDate: getDueDate(-12), // 12 days overdue
    createdAt: getRecentDate(12),
    updatedAt: getRecentDate(11)
  },
  {
    id: 'thread-17',
    title: 'Workplace safety training update',
    ruleId: 'rule-4',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P2',
    comments: [
      {
        id: 'comment-39',
        text: 'Safety training materials need updating for new regulations.',
        author: 'QC',
        timestamp: getRecentDate(4),
        threadId: 'thread-17',
        isRead: false
      },
      {
        id: 'comment-40',
        text: 'Working with safety consultant to update training content.',
        author: 'SM',
        timestamp: getRecentDate(3),
        threadId: 'thread-17',
        isRead: true
      }
    ],
    dueDate: getDueDate(1), // Due tomorrow
    createdAt: getRecentDate(4),
    updatedAt: getRecentDate(3)
  },
  {
    id: 'thread-18',
    title: 'Emergency response drill planning',
    ruleId: 'rule-4',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P2',
    comments: [
      {
        id: 'comment-41',
        text: 'Quarterly emergency response drill needs to be scheduled.',
        author: 'QC',
        timestamp: getRecentDate(6),
        threadId: 'thread-18',
        isRead: false
      },
      {
        id: 'comment-42',
        text: 'Coordinating with emergency services for drill date.',
        author: 'SM',
        timestamp: getRecentDate(5),
        threadId: 'thread-18',
        isRead: true
      }
    ],
    dueDate: getDueDate(3), // Due in 3 days
    createdAt: getRecentDate(6),
    updatedAt: getRecentDate(5)
  },
  {
    id: 'thread-19',
    title: 'Inventory audit compliance check',
    ruleId: 'rule-4',
    status: 'Open',
    actionStatus: 'In Progress',
    priority: 'P3',
    comments: [
      {
        id: 'comment-43',
        text: 'Monthly inventory audit compliance needs review.',
        author: 'QC',
        timestamp: getRecentDate(8),
        threadId: 'thread-19',
        isRead: false
      },
      {
        id: 'comment-44',
        text: 'Implementing new audit procedures for better compliance.',
        author: 'SM',
        timestamp: getRecentDate(7),
        threadId: 'thread-19',
        isRead: true
      }
    ],
    dueDate: getDueDate(5), // Due in 5 days
    createdAt: getRecentDate(8),
    updatedAt: getRecentDate(7)
  },
  {
    id: 'thread-20',
    title: 'Environmental monitoring system upgrade',
    ruleId: 'rule-4',
    status: 'Open',
    actionStatus: 'On Hold',
    priority: 'P3',
    comments: [
      {
        id: 'comment-45',
        text: 'Environmental monitoring system needs upgrade for better accuracy.',
        author: 'QC',
        timestamp: getRecentDate(10),
        threadId: 'thread-20',
        isRead: false
      },
      {
        id: 'comment-46',
        text: 'Waiting for budget approval for system upgrade.',
        author: 'SM',
        timestamp: getRecentDate(9),
        threadId: 'thread-20',
        isRead: true
      }
    ],
    dueDate: getDueDate(7), // Due in 7 days
    createdAt: getRecentDate(10),
    updatedAt: getRecentDate(9)
  }
];

export const moduleNames = [
  'Warehouse Safety Checks',
  'Equipment Management',
  'Inventory Management',
  'Quality Control',
  'Environmental Controls',
  'Emergency Procedures'
];

export const statusOptions = [
  'All',
  'Pass',
  'Fail',
  'N/A',
  'Open'
];

export const threadStatusOptions = [
  'All',
  'Open',
  'Closed'
];

export const businessRuleOptions = [
  'All',
  'All warehouse personnel must wear safety helmets at all times',
  'Emergency exits must remain unobstructed at all times',
  'Loading dock safety protocols must be followed',
  'Forklift operators must complete safety training annually',
  'All electrical equipment must be inspected monthly',
  'Material handling equipment daily inspection',
  'Temperature logs must be maintained for cold storage',
  'Product labeling must be accurate and visible',
  'Quality control sampling procedures',
  'Fire suppression systems must be tested quarterly',
  'Personal protective equipment inventory tracking',
  'Chemical storage areas must have proper ventilation',
  'Warehouse lighting must meet minimum standards',
  'Hazardous material handling protocols'
];

export const threadTitleOptions = [
  'All',
  'Helmet compliance issues',
  'Fire suppression system',
  'Electrical safety violations',
  'Forklift training schedule',
  'Daily scanning process improvement',
  'Loading dock safety updates',
  'Emergency exit obstruction',
  'PPE inventory tracking',
  'Chemical storage ventilation',
  'Temperature monitoring system',
  'Product labeling accuracy',
  'Quality sampling procedures',
  'Hazardous material protocols',
  'Warehouse lighting standards',
  'Equipment inspection schedule'
];