export type Loan = {
  id: string;
  applicant: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  term: number; // in months
  interestRate: number; // percentage
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  applicationDate: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  payments: Payment[];
  outstandingBalance: number;
};

export type Payment = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category?: 'principal' | 'interest' | 'fees' | 'other';
};

export const loans: Loan[] = [
  {
    id: 'LF001',
    applicant: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/avatars/01.png',
    },
    amount: 25000,
    term: 60,
    interestRate: 5.5,
    status: 'Approved',
    applicationDate: '2023-10-15',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      vin: '12345ABCDE',
    },
    payments: [
      { id: 'P01', date: '2023-11-15', amount: 477.42, description: 'Monthly Payment' },
      { id: 'P02', date: '2023-12-15', amount: 477.42, description: 'Online Transfer' },
    ],
    outstandingBalance: 24045.16,
  },
  {
    id: 'LF002',
    applicant: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: '/avatars/02.png',
    },
    amount: 35000,
    term: 72,
    interestRate: 6.2,
    status: 'Pending',
    applicationDate: '2023-11-01',
    vehicle: {
      make: 'Honda',
      model: 'CR-V',
      year: 2023,
      vin: '67890FGHIJ',
    },
    payments: [],
    outstandingBalance: 35000,
  },
  {
    id: 'LF003',
    applicant: {
      name: 'Sam Wilson',
      email: 'sam.wilson@example.com',
      avatar: '/avatars/03.png',
    },
    amount: 15000,
    term: 48,
    interestRate: 4.9,
    status: 'Paid',
    applicationDate: '2020-05-20',
    vehicle: {
      make: 'Ford',
      model: 'Focus',
      year: 2019,
      vin: 'KLMNO12345',
    },
    payments: [],
    outstandingBalance: 0,
  },
  {
    id: 'LF004',
    applicant: {
      name: 'Emily Clark',
      email: 'emily.clark@example.com',
      avatar: '/avatars/04.png',
    },
    amount: 45000,
    term: 60,
    interestRate: 5.8,
    status: 'Approved',
    applicationDate: '2023-09-28',
    vehicle: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      vin: 'PQRST67890',
    },
    payments: [
      { id: 'P01', date: '2023-10-28', amount: 865.25, description: 'Scheduled Payment' },
    ],
    outstandingBalance: 44134.75,
  },
  {
    id: 'LF005',
    applicant: {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      avatar: '/avatars/05.png',
    },
    amount: 22000,
    term: 36,
    interestRate: 7.1,
    status: 'Rejected',
    applicationDate: '2023-11-05',
    vehicle: {
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2020,
      vin: 'UVWXYZ1234',
    },
    payments: [],
    outstandingBalance: 22000,
  },
];

export const getLoanById = (id: string): Loan | undefined => {
  return loans.find(loan => loan.id === id);
}
