
export type Admin = {
    id: string;
    fullName: string;
    username: string;
    phone: string;
    address: string;
    photoUrl: string;
};

export const admins: Admin[] = [
    {
        id: 'ADM001',
        fullName: 'Admin User',
        username: 'admin',
        phone: '(555) 123-4567',
        address: '123 Admin Way, Suite 100, Management City, USA',
        photoUrl: 'https://picsum.photos/id/1005/100/100'
    },
    {
        id: 'ADM002',
        fullName: 'Jane Manager',
        username: 'janem',
        phone: '(555) 987-6543',
        address: '456 Overseer Blvd, Controltown, USA',
        photoUrl: 'https://picsum.photos/id/1011/100/100'
    },
     {
        id: 'ADM003',
        fullName: 'System Operator',
        username: 'sysop',
        phone: '(555) 555-5555',
        address: '789 Root Access Rd, Serverville, USA',
        photoUrl: 'https://picsum.photos/id/1025/100/100'
    },
];

export const getAdminById = (id: string): Admin | undefined => {
  return admins.find(admin => admin.id === id);
}
