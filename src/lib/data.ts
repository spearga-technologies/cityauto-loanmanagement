export type Loan = {
  id: string;
  applicant: {
    id: string;
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
    photoUrl: string;
  };
  guarantors: {
      name: string;
      phone: string;
  }[];
  documents: {
    signatureUrl: string;
    rcBookUrl: string;
  };
  payments: Payment[];
  outstandingBalance: number;
  repaymentSchedule: ScheduledPayment[];
};

export type Payment = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category?: 'principal' | 'interest' | 'fees' | 'other';
};

export type ScheduledPayment = {
    id: string;
    dueDate: string;
    amount: number;
    status: 'Due' | 'Paid' | 'Partially Paid' | 'Overdue';
    amountPaid?: number;
    paymentDate?: string;
    paymentMethod?: 'Cash' | 'UPI' | 'Bank Transfer';
    paymentReference?: string;
}

export const loans: Loan[] = [
  {
    id: 'LF001',
    applicant: {
      id: 'USR001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/avatars/01.png',
    },
    amount: 50000,
    term: 24,
    interestRate: 12.5,
    status: 'Approved',
    applicationDate: '2023-10-15',
    vehicle: {
      make: 'Honda',
      model: 'Activa 6G',
      year: 2022,
      vin: '12345ABCDEFGHIJKL',
      photoUrl: 'https://picsum.photos/seed/scooter/600/400',
    },
     guarantors: [
      { name: 'Guarantor One', phone: '555-0101' },
      { name: 'Guarantor Two', phone: '555-0102' }
    ],
    documents: {
        signatureUrl: 'https://picsum.photos/200/100',
        rcBookUrl: 'https://picsum.photos/300/200',
    },
    payments: [
      { id: 'P01', date: '2023-11-15', amount: 2365.7, description: 'Monthly Payment' },
      { id: 'P02', date: '2023-12-15', amount: 2365.7, description: 'Online Transfer' },
    ],
    outstandingBalance: 45268.6,
    repaymentSchedule: [
        { id: 'SCH01', dueDate: '2023-11-15', amount: 2365.70, status: 'Paid', amountPaid: 2365.70, paymentDate: '2023-11-14', paymentMethod: 'UPI', paymentReference: 'UPI12345' },
        { id: 'SCH02', dueDate: '2023-12-15', amount: 2365.70, status: 'Paid', amountPaid: 2365.70, paymentDate: '2023-12-15', paymentMethod: 'Bank Transfer', paymentReference: 'BANK67890' },
        { id: 'SCH03', dueDate: '2024-01-15', amount: 2365.70, status: 'Due' },
        { id: 'SCH04', dueDate: '2024-02-15', amount: 2365.70, status: 'Due' },
    ]
  },
  {
    id: 'LF002',
    applicant: {
      id: 'USR002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: '/avatars/02.png',
    },
    amount: 75000,
    term: 36,
    interestRate: 14.2,
    status: 'Pending',
    applicationDate: '2023-11-01',
    vehicle: {
      make: 'TVS',
      model: 'Jupiter 125',
      year: 2023,
      vin: '67890FGHIJKLMNOPQR',
      photoUrl: 'https://picsum.photos/600/400',
    },
    guarantors: [
      { name: 'Guarantor Three', phone: '555-0103' },
    ],
    documents: {
        signatureUrl: 'https://picsum.photos/200/100',
        rcBookUrl: 'https://picsum.photos/300/200',
    },
    payments: [],
    outstandingBalance: 75000,
    repaymentSchedule: [],
  },
  {
    id: 'LF003',
    applicant: {
      id: 'USR003',
      name: 'Sam Wilson',
      email: 'sam.wilson@example.com',
      avatar: '/avatars/03.png',
    },
    amount: 40000,
    term: 24,
    interestRate: 11.9,
    status: 'Paid',
    applicationDate: '2021-05-20',
    vehicle: {
      make: 'Suzuki',
      model: 'Access 125',
      year: 2021,
      vin: 'KLMNO12345PQRSTUV',
      photoUrl: 'https://picsum.photos/600/400',
    },
     guarantors: [
      { name: 'Guarantor Four', phone: '555-0104' }
    ],
    documents: {
        signatureUrl: 'https://picsum.photos/200/100',
        rcBookUrl: 'https://picsum.photos/300/200',
    },
    payments: [],
    outstandingBalance: 0,
    repaymentSchedule: [],
  },
  {
    id: 'LF004',
    applicant: {
      id: 'USR004',
      name: 'Emily Clark',
      email: 'emily.clark@example.com',
      avatar: '/avatars/04.png',
    },
    amount: 90000,
    term: 36,
    interestRate: 13.8,
    status: 'Approved',
    applicationDate: '2023-09-28',
    vehicle: {
      make: 'Bajaj',
      model: 'Chetak',
      year: 2023,
      vin: 'PQRST67890UVWXYZA',
      photoUrl: 'https://picsum.photos/600/400',
    },
     guarantors: [
      { name: 'Guarantor Five', phone: '555-0105' },
    ],
    documents: {
        signatureUrl: 'https://picsum.photos/200/100',
        rcBookUrl: 'https://picsum.photos/300/200',
    },
    payments: [
      { id: 'P01', date: '2023-10-28', amount: 3094.5, description: 'Scheduled Payment' },
    ],
    outstandingBalance: 86905.5,
    repaymentSchedule: [],
  },
  {
    id: 'LF005',
    applicant: {
      id: 'USR005',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      avatar: '/avatars/05.png',
    },
    amount: 65000,
    term: 24,
    interestRate: 15.1,
    status: 'Rejected',
    applicationDate: '2023-11-05',
    vehicle: {
      make: 'Hero',
      model: 'Maestro Edge',
      year: 2022,
      vin: 'UVWXYZ1234ABCDEFG',
      photoUrl: 'https://picsum.photos/600/400',
    },
     guarantors: [
      { name: 'Guarantor Six', phone: '555-0106' },
      { name: 'Guarantor Seven', phone: '555-0107' }
    ],
    documents: {
        signatureUrl: 'https://picsum.photos/200/100',
        rcBookUrl: 'https://picsum.photos/300/200',
    },
    payments: [],
    outstandingBalance: 65000,
    repaymentSchedule: [],
  },
];

export const getLoanById = (id: string): Loan | undefined => {
  return loans.find(loan => loan.id === id);
}

    