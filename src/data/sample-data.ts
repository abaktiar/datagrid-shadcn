export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  priority?: 'High' | 'Medium' | 'Low';
  department?: string;
  notes?: string;
}

const seedUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T09:00:00Z',
    priority: 'High',
    department: 'Engineering',
    notes: 'Team lead for frontend development',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2023-07-15T14:30:00Z',
    priority: 'Medium',
    department: 'Marketing',
    notes: 'Content strategy specialist',
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: '2024-01-10T08:15:00Z',
    createdAt: '2023-08-20T11:00:00Z',
    priority: 'Low',
    department: 'Sales',
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    role: 'Editor',
    status: 'pending',
    lastLogin: '2024-01-12T13:20:00Z',
    createdAt: '2023-09-05T16:45:00Z',
  },
  {
    id: '5',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-16T09:10:00Z',
    createdAt: '2023-05-10T10:15:00Z',
  },
  {
    id: '6',
    firstName: 'Diana',
    lastName: 'Davis',
    email: 'diana.davis@example.com',
    role: 'Viewer',
    status: 'active',
    lastLogin: '2024-01-13T12:30:00Z',
    createdAt: '2023-10-01T08:00:00Z',
  },
  {
    id: '7',
    firstName: 'Edward',
    lastName: 'Miller',
    email: 'edward.miller@example.com',
    role: 'Editor',
    status: 'inactive',
    lastLogin: '2024-01-08T15:45:00Z',
    createdAt: '2023-11-12T13:30:00Z',
  },
  {
    id: '8',
    firstName: 'Fiona',
    lastName: 'Wilson',
    email: 'fiona.wilson@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-17T11:20:00Z',
    createdAt: '2023-04-25T15:45:00Z',
  },
  {
    id: '9',
    firstName: 'George',
    lastName: 'Moore',
    email: 'george.moore@example.com',
    role: 'Viewer',
    status: 'pending',
    lastLogin: '2024-01-11T14:10:00Z',
    createdAt: '2023-12-03T09:20:00Z',
  },
  {
    id: '10',
    firstName: 'Helen',
    lastName: 'Taylor',
    email: 'helen.taylor@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2024-01-16T17:30:00Z',
    createdAt: '2023-03-18T12:00:00Z',
  },
  {
    id: '11',
    firstName: 'Ian',
    lastName: 'Anderson',
    email: 'ian.anderson@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15T08:45:00Z',
    createdAt: '2023-07-22T10:30:00Z',
  },
  {
    id: '12',
    firstName: 'Julia',
    lastName: 'Thomas',
    email: 'julia.thomas@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: '2024-01-09T16:20:00Z',
    createdAt: '2023-08-14T14:15:00Z',
  },
  {
    id: '13',
    firstName: 'Kevin',
    lastName: 'Jackson',
    email: 'kevin.jackson@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2024-01-17T10:15:00Z',
    createdAt: '2023-09-30T11:45:00Z',
  },
  {
    id: '14',
    firstName: 'Laura',
    lastName: 'White',
    email: 'laura.white@example.com',
    role: 'Admin',
    status: 'pending',
    lastLogin: '2024-01-12T13:50:00Z',
    createdAt: '2023-06-08T16:20:00Z',
  },
  {
    id: '15',
    firstName: 'Michael',
    lastName: 'Harris',
    email: 'michael.harris@example.com',
    role: 'Viewer',
    status: 'active',
    lastLogin: '2024-01-16T12:05:00Z',
    createdAt: '2023-10-25T09:30:00Z',
  },
];

const FIRST_NAMES = [
  'Aaron', 'Beatrice', 'Caleb', 'Daphne', 'Elena', 'Felix', 'Gabriella', 'Henry',
  'Isabel', 'Jasper', 'Kira', 'Liam', 'Maya', 'Nathan', 'Olivia', 'Preston',
  'Quinn', 'Rosa', 'Samuel', 'Tara', 'Ulysses', 'Vera', 'Wesley', 'Xena',
  'Yusuf', 'Zara', 'Adrian', 'Bianca', 'Cyrus', 'Delia', 'Ezra', 'Freya',
  'Grant', 'Hazel', 'Imani', 'Jonas', 'Kendra', 'Lukas', 'Mira', 'Nico',
];

const LAST_NAMES = [
  'Adams', 'Bennett', 'Carter', 'Diaz', 'Evans', 'Foster', 'Garcia', 'Hughes',
  'Iverson', 'Jenkins', 'Khan', 'Lopez', 'Martinez', 'Nguyen', 'Owens', 'Patel',
  'Quincy', 'Rivera', 'Sanchez', 'Tanaka', 'Underwood', 'Vasquez', 'Walker', 'Xu',
  'Young', 'Zhang', 'Bailey', 'Cooper', 'Dixon', 'Ellis', 'Fischer', 'Graham',
];

const DOMAINS = ['example.com', 'corp.io', 'mail.dev', 'workspace.co', 'company.net'];
const ROLES = ['Admin', 'Editor', 'Viewer'];
const STATUSES: Array<User['status']> = ['active', 'active', 'active', 'inactive', 'pending'];
const PRIORITIES: Array<NonNullable<User['priority']>> = ['High', 'Medium', 'Medium', 'Low'];
const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'Design', 'Product',
  'Operations', 'Finance', 'HR', 'Legal', 'Support', 'Research',
];
const NOTE_TEMPLATES: Array<string | null> = [
  'Working on Q1 deliverables',
  'On parental leave next quarter',
  'Mentoring two junior team members',
  'Lead reviewer for migration project',
  'Requested workstation upgrade',
  'Cross-team liaison for analytics',
  'Recently promoted to senior role',
  null, null, null, null,
];

// Deterministic integer hash — produces stable pseudo-random picks across reloads
// so the demo dataset is identical for every visitor (avoids hydration jitter).
function pick<T>(arr: T[], index: number, salt: number): T {
  const h = Math.imul(index ^ salt, 2654435761) >>> 0;
  return arr[h % arr.length];
}

const REF_TIME = Date.UTC(2024, 0, 17, 12, 0, 0);
const DAY_MS = 86_400_000;

function generateUser(index: number): User {
  const id = String(index + 1);
  const firstName = pick(FIRST_NAMES, index, 0x9e37);
  const lastName = pick(LAST_NAMES, index, 0x7f4a);
  const domain = pick(DOMAINS, index, 0x51ed);
  const role = pick(ROLES, index, 0x27d4);
  const status = pick(STATUSES, index, 0x1b87);
  const priority = pick(PRIORITIES, index, 0x6c8e);
  const department = pick(DEPARTMENTS, index, 0x3a4d);
  const notes = pick(NOTE_TEMPLATES, index, 0x4f12);

  const lastLoginDays = pick([0, 1, 2, 3, 4, 5, 7, 10, 14, 21, 30, 45, 60], index, 0x2c91);
  const createdAtDays = 90 + (Math.imul(index, 1103515245) >>> 16) % 540;

  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`,
    role,
    status,
    lastLogin: new Date(REF_TIME - lastLoginDays * DAY_MS).toISOString(),
    createdAt: new Date(REF_TIME - createdAtDays * DAY_MS).toISOString(),
    priority,
    department,
    notes: notes ?? undefined,
  };
}

const TOTAL = 1000;
const generated: User[] = Array.from(
  { length: TOTAL - seedUsers.length },
  (_, i) => generateUser(i + seedUsers.length)
);

export const sampleUsers: User[] = [...seedUsers, ...generated];
