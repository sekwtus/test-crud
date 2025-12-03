import { Employee } from '../types';

const DB_KEY = 'hr_nexus_db_v1';

// Seed data to make the app look good initially
const SEED_DATA: Employee[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Chen',
    email: 'alice.chen@example.com',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    status: 'Active',
    joinedDate: '2023-01-15',
    bio: 'Passionate frontend developer with 8 years of experience in React ecosystems. Loves optimizing performance and accessibility.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    avatarUrl: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'm.johnson@example.com',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
    joinedDate: '2022-11-01',
    bio: 'Product visionary focused on user-centric design and agile methodologies. Expert in turning chaos into roadmaps.',
    skills: ['Agile', 'JIRA', 'Product Strategy', 'User Research'],
    avatarUrl: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 's.connor@example.com',
    role: 'Security Specialist',
    department: 'IT Security',
    status: 'On Leave',
    joinedDate: '2021-05-20',
    bio: 'Dedicated to protecting corporate assets. Vigilant against cyber threats and skynet implementations.',
    skills: ['Cybersecurity', 'Network Analysis', 'Penetration Testing'],
    avatarUrl: 'https://picsum.photos/200/200?random=3'
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DatabaseService {
  private getStore(): Employee[] {
    const stored = localStorage.getItem(DB_KEY);
    if (!stored) {
      localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    return JSON.parse(stored);
  }

  private saveStore(data: Employee[]) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }

  async getAll(): Promise<Employee[]> {
    await delay(300); // Simulate network
    return this.getStore();
  }

  async getById(id: string): Promise<Employee | undefined> {
    await delay(200);
    const employees = this.getStore();
    return employees.find(e => e.id === id);
  }

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    await delay(500);
    const employees = this.getStore();
    const newEmployee: Employee = {
      ...employee,
      id: Math.random().toString(36).substr(2, 9),
      avatarUrl: `https://picsum.photos/200/200?random=${Date.now()}`
    };
    employees.push(newEmployee);
    this.saveStore(employees);
    return newEmployee;
  }

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    await delay(400);
    const employees = this.getStore();
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    const updated = { ...employees[index], ...updates };
    employees[index] = updated;
    this.saveStore(employees);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await delay(400);
    const employees = this.getStore();
    const filtered = employees.filter(e => e.id !== id);
    this.saveStore(filtered);
  }
}

export const db = new DatabaseService();