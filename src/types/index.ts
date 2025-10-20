export interface BusinessRule {
  id: string;
  ruleNo: number;
  description: string;
  qcComment: string;
  smComment: string;
  status: 'Pass' | 'Fail' | 'N/A' | 'Open';
  moduleName: string;
  businessRule: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: 'QC' | 'SM';
  timestamp: string;
  threadId: string;
  isRead?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  ruleId: string;
  status: 'Open' | 'Closed';
  actionStatus: 'Action Required' | 'In Progress' | 'On Hold' | 'Completed' | 'Error' | 'No Error';
  priority: 'P1' | 'P2' | 'P3';
  comments: Comment[];
  dueDate: string; // SLA due date
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  moduleName: string;
  status: string[];
  threadStatus: string[];
  businessRule: string[];
  threadTitle: string[];
}

export interface ChatPanelState {
  isOpen: boolean;
  ruleId: string | null;
  threadId: string | null;
  context: 'businessRule' | 'thread';
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type Theme = 'light' | 'dark';