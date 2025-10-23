import { BusinessRule, Thread } from '../types';

// Helper function to get recent dates
const getRecentDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Helper function to get due dates
const getDueDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export const mockBusinessRules: BusinessRule[] = [
  // Warehouse Safety Checks Module
  {
    id: 'rule-1',
    ruleNo: 1,
    description: 'All warehouse personnel must wear safety helmets at all times',
    qcComment: 'Helmet compliance is critical for safety',
    smComment: 'Ensure helmets are properly fitted and maintained',
    status: 'Fail', // Will be auto-updated based on findings
    moduleName: 'Warehouse Safety Checks',
    businessRule: 'Safety Compliance',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    severity: 'Critical',
    isNA: false,
    hasPassedNoComments: false
  },
  {
    id: 'rule-2',
    ruleNo: 2,
    description: 'Emergency exits must remain unobstructed at all times',
    qcComment: 'Exit pathways are clear and marked',
    smComment: 'Regular inspections scheduled',
    status: 'Pass', // Will be auto-updated based on findings
    moduleName: 'Warehouse Safety Checks',
    businessRule: 'Emergency Procedures',
    createdAt: '2024-01-17T10:15:00Z',
    updatedAt: '2024-01-17T10:15:00Z',
    severity: 'Major',
    isNA: false,
    hasPassedNoComments: false
  },
  {
    id: 'rule-3',
    ruleNo: 3,
    description: 'Loading dock safety protocols must be followed',
    qcComment: 'Loading procedures need standardization',
    smComment: 'Safety barriers installed and maintained',
    status: 'Fail', // Will be auto-updated based on findings
    moduleName: 'Warehouse Safety Checks',
    businessRule: 'Loading Operations',
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-19T14:30:00Z',
    severity: 'Major',
    isNA: false,
    hasPassedNoComments: false
  },

  // Equipment Management Module
  {
    id: 'rule-4',
    ruleNo: 4,
    description: 'Forklift operators must complete safety training annually',
    qcComment: 'Training records need to be updated',
    smComment: 'Annual training scheduled for all operators',
    status: 'Pass', // Will be auto-updated based on findings
    moduleName: 'Equipment Management',
    businessRule: 'Training Requirements',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    severity: 'Major',
    isNA: false,
    hasPassedNoComments: false
  },
  {
    id: 'rule-5',
    ruleNo: 5,
    description: 'All electrical equipment must be inspected monthly',
    qcComment: 'Monthly inspections are up to date',
    smComment: 'Electrical safety protocols implemented',
    status: 'Pass', // Will be auto-updated based on findings
    moduleName: 'Equipment Management',
    businessRule: 'Maintenance Schedule',
    createdAt: '2024-01-21T11:30:00Z',
    updatedAt: '2024-01-21T11:30:00Z',
    severity: 'Critical',
    isNA: false,
    hasPassedNoComments: false
  },

  // Quality Control Module
  {
    id: 'rule-6',
    ruleNo: 6,
    description: 'Product labeling must be accurate and visible',
    qcComment: 'Labeling standards need improvement',
    smComment: 'New labeling system implemented',
    status: 'Fail', // Will be auto-updated based on findings
    moduleName: 'Quality Control',
    businessRule: 'Data Accuracy',
    createdAt: '2024-01-22T14:15:00Z',
    updatedAt: '2024-01-22T14:15:00Z',
    severity: 'Significant',
    isNA: false,
    hasPassedNoComments: false
  },
  {
    id: 'rule-7',
    ruleNo: 7,
    description: 'Quality control sampling procedures must be followed',
    qcComment: 'Sampling procedures are standardized',
    smComment: 'QC protocols updated and documented',
    status: 'Pass', // Will be auto-updated based on findings
    moduleName: 'Quality Control',
    businessRule: 'Sampling Procedures',
    createdAt: '2024-01-23T16:45:00Z',
    updatedAt: '2024-01-23T16:45:00Z',
    severity: 'Major',
    isNA: false,
    hasPassedNoComments: false
  },

  // Environmental Controls Module
  {
    id: 'rule-8',
    ruleNo: 8,
    description: 'Temperature logs must be maintained for cold storage',
    qcComment: 'Temperature monitoring system operational',
    smComment: 'Automated logging system installed',
    status: 'Pass', // Will be auto-updated based on findings
    moduleName: 'Environmental Controls',
    businessRule: 'Temperature Monitoring',
    createdAt: '2024-01-24T08:30:00Z',
    updatedAt: '2024-01-24T08:30:00Z',
    severity: 'Critical',
    isNA: false,
    hasPassedNoComments: false
  }
];

export const mockThreads: Thread[] = [
  // Warehouse Safety Checks Module - Rule 1: Mixed scenarios (should be Fail)
  {
    id: 'thread-1',
    title: 'Helmet compliance issues',
    ruleId: 'rule-1',
    status: 'Open',
    actionStatus: 'Non-Error', // Changed to Non-Error for testing
    priority: 'P1',
    comments: [
      {
        id: 'comment-1',
        text: 'URGENT: Multiple safety violations found. Need immediate action.',
        author: 'QC',
        timestamp: getRecentDate(5),
        threadId: 'thread-1',
        isRead: false
      },
      {
        id: 'comment-2',
        text: 'Working on emergency helmet order. Should arrive by Friday.',
        author: 'SM',
        timestamp: getRecentDate(4),
        threadId: 'thread-1',
        isRead: true
      }
    ],
    dueDate: getDueDate(5),
    createdAt: getRecentDate(5),
    updatedAt: getRecentDate(4)
  },
  {
    id: 'thread-2',
    title: 'Helmet training completion',
    ruleId: 'rule-1',
    status: 'Closed',
    actionStatus: 'Non-Error', // This should contribute to Pass
    priority: 'P2',
    comments: [
      {
        id: 'comment-3',
        text: 'Training completed successfully for all personnel.',
        author: 'SM',
        timestamp: getRecentDate(3),
        threadId: 'thread-2',
        isRead: true
      }
    ],
    dueDate: getDueDate(3),
    createdAt: getRecentDate(3),
    updatedAt: getRecentDate(3)
  },

  // Warehouse Safety Checks Module - Rule 2: All Non-Error and Mere Observation (should be Pass)
  {
    id: 'thread-3',
    title: 'Exit pathway inspection',
    ruleId: 'rule-2',
    status: 'Open',
    actionStatus: 'Non-Error', // This should contribute to Pass
    priority: 'P2',
    comments: [
      {
        id: 'comment-4',
        text: 'Exit pathways are clear and properly marked.',
        author: 'QC',
        timestamp: getRecentDate(2),
        threadId: 'thread-3',
        isRead: false
      }
    ],
    dueDate: getDueDate(2),
    createdAt: getRecentDate(2),
    updatedAt: getRecentDate(2)
  },
  {
    id: 'thread-4',
    title: 'Emergency lighting check',
    ruleId: 'rule-2',
    status: 'Closed',
    actionStatus: 'Mere Observation', // This should contribute to Pass
    priority: 'P3',
    comments: [
      {
        id: 'comment-5',
        text: 'Emergency lighting is functioning properly.',
        author: 'SM',
        timestamp: getRecentDate(1),
        threadId: 'thread-4',
        isRead: true
      }
    ],
    dueDate: getDueDate(1),
    createdAt: getRecentDate(1),
    updatedAt: getRecentDate(1)
  },

  // Warehouse Safety Checks Module - Rule 3: All Error findings (should be Fail)
  {
    id: 'thread-5',
    title: 'Loading dock safety violations',
    ruleId: 'rule-3',
    status: 'Open',
    actionStatus: 'Error', // This will make rule Fail
    priority: 'P1',
    comments: [
      {
        id: 'comment-6',
        text: 'Multiple safety violations found at loading dock.',
        author: 'QC',
        timestamp: getRecentDate(6),
        threadId: 'thread-5',
        isRead: false
      }
    ],
    dueDate: getDueDate(6),
    createdAt: getRecentDate(6),
    updatedAt: getRecentDate(6)
  },
  {
    id: 'thread-6',
    title: 'Forklift operator training',
    ruleId: 'rule-3',
    status: 'Closed',
    actionStatus: 'Error', // This will make rule Fail
    priority: 'P2',
    comments: [
      {
        id: 'comment-7',
        text: 'Training requirements not met by several operators.',
        author: 'QC',
        timestamp: getRecentDate(7),
        threadId: 'thread-6',
        isRead: false
      }
    ],
    dueDate: getDueDate(7),
    createdAt: getRecentDate(7),
    updatedAt: getRecentDate(7)
  },

  // Equipment Management Module - Rule 4: All Non-Error (should be Pass)
  {
    id: 'thread-7',
    title: 'Forklift training records update',
    ruleId: 'rule-4',
    status: 'Open',
    actionStatus: 'Non-Error', // Should contribute to Pass
    priority: 'P2',
    comments: [
      {
        id: 'comment-8',
        text: 'Training records have been updated successfully.',
        author: 'SM',
        timestamp: getRecentDate(3),
        threadId: 'thread-7',
        isRead: true
      }
    ],
    dueDate: getDueDate(3),
    createdAt: getRecentDate(3),
    updatedAt: getRecentDate(3)
  },

  // Equipment Management Module - Rule 5: Mixed status (should be Pass)
  {
    id: 'thread-8',
    title: 'Electrical equipment inspection',
    ruleId: 'rule-5',
    status: 'Closed',
    actionStatus: 'Non-Error', // Should contribute to Pass
    priority: 'P1',
    comments: [
      {
        id: 'comment-9',
        text: 'Monthly electrical inspection completed successfully.',
        author: 'QC',
        timestamp: getRecentDate(2),
        threadId: 'thread-8',
        isRead: true
      }
    ],
    dueDate: getDueDate(2),
    createdAt: getRecentDate(2),
    updatedAt: getRecentDate(2)
  },
  {
    id: 'thread-9',
    title: 'Electrical safety protocol review',
    ruleId: 'rule-5',
    status: 'Open',
    actionStatus: 'Mere Observation', // Should contribute to Pass
    priority: 'P3',
    comments: [
      {
        id: 'comment-10',
        text: 'Safety protocols are being reviewed and updated.',
        author: 'SM',
        timestamp: getRecentDate(1),
        threadId: 'thread-9',
        isRead: true
      }
    ],
    dueDate: getDueDate(1),
    createdAt: getRecentDate(1),
    updatedAt: getRecentDate(1)
  },

  // Quality Control Module - Rule 6: All Error (should be Fail)
  {
    id: 'thread-10',
    title: 'Product labeling accuracy issues',
    ruleId: 'rule-6',
    status: 'Open',
    actionStatus: 'Error', // Will make rule Fail
    priority: 'P1',
    comments: [
      {
        id: 'comment-11',
        text: 'Multiple products found with incorrect or missing labels.',
        author: 'QC',
        timestamp: getRecentDate(4),
        threadId: 'thread-10',
        isRead: false
      }
    ],
    dueDate: getDueDate(4),
    createdAt: getRecentDate(4),
    updatedAt: getRecentDate(4)
  },

  // Quality Control Module - Rule 7: All Non-Error (should be Pass)
  {
    id: 'thread-11',
    title: 'QC sampling procedure implementation',
    ruleId: 'rule-7',
    status: 'Closed',
    actionStatus: 'Non-Error', // Should contribute to Pass
    priority: 'P2',
    comments: [
      {
        id: 'comment-12',
        text: 'New sampling procedures implemented successfully.',
        author: 'SM',
        timestamp: getRecentDate(2),
        threadId: 'thread-11',
        isRead: true
      }
    ],
    dueDate: getDueDate(2),
    createdAt: getRecentDate(2),
    updatedAt: getRecentDate(2)
  },

  // Environmental Controls Module - Rule 8: All Non-Error (should be Pass)
  {
    id: 'thread-12',
    title: 'Temperature monitoring system check',
    ruleId: 'rule-8',
    status: 'Open',
    actionStatus: 'Non-Error', // Should contribute to Pass
    priority: 'P2',
    comments: [
      {
        id: 'comment-13',
        text: 'Temperature monitoring system is functioning correctly.',
        author: 'QC',
        timestamp: getRecentDate(1),
        threadId: 'thread-12',
        isRead: true
      }
    ],
    dueDate: getDueDate(1),
    createdAt: getRecentDate(1),
    updatedAt: getRecentDate(1)
  }
];

// Note: All filter options are now generated dynamically from the data above
// No static arrays needed - filters will automatically accommodate new data