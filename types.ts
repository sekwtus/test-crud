export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinedDate: string;
  bio: string;
  skills: string[];
  avatarUrl?: string;
}

export enum ViewState {
  LIST = 'LIST',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DETAILS = 'DETAILS',
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}