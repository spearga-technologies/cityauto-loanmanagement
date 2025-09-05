import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import type { User } from "@/lib/users";

// This is a simplified user creation. In a real app, you'd handle auth.
// For now, we're just creating a document in Firestore.

type UserInput = Omit<User, 'id' | 'photoUrl' | 'aadharUrl'> & {
    photo: File;
    aadhar: File;
}

const sampleUsers: User[] = [
    {
        id: 'USR001',
        fullName: 'Abu Bakar',
        email: 'abu.bakar@example.com',
        phone: '9876543210',
        whatsappNumber: '9876543210',
        address: '123 Darul Aman, Kuala Lumpur',
        photoUrl: 'https://picsum.photos/seed/abu/100/100',
        aadharNumber: '111122223333',
        aadharUrl: 'https://picsum.photos/seed/abu_aadhar/300/200',
        pan: 'ABUPK1234F'
    },
    {
        id: 'USR002',
        fullName: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@example.com',
        phone: '9123456780',
        whatsappNumber: '9123456780',
        address: '456 Jalan Merdeka, Johor Bahru',
        photoUrl: 'https://picsum.photos/seed/siti/100/100',
        aadharNumber: '444455556666',
        aadharUrl: 'https://picsum.photos/seed/siti_aadhar/300/200',
        pan: 'SITIN5678G'
    },
    {
        id: 'USR003',
        fullName: 'Ramesh Kumar',
        email: 'ramesh.kumar@example.com',
        phone: '8765432109',
        whatsappNumber: '8765432109',
        address: '789 Little India, Penang',
        photoUrl: 'https://picsum.photos/seed/ramesh/100/100',
        aadharNumber: '777788889999',
        aadharUrl: 'https://picsum.photos/seed/ramesh_aadhar/300/200',
        pan: 'RAMEK9012H'
    },
     {
        id: 'USR004',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        whatsappNumber: '1234567890',
        address: '123 Main St, Anytown, USA',
        photoUrl: 'https://picsum.photos/seed/john/100/100',
        aadharNumber: '123456789012',
        aadharUrl: 'https://picsum.photos/seed/john_aadhar/300/200',
        pan: 'ABCDE1234F'
    },
     {
        id: 'USR005',
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '0987654321',
        whatsappNumber: '0987654321',
        address: '456 Oak Ave, Anytown, USA',
        photoUrl: 'https://picsum.photos/seed/jane/100/100',
        aadharNumber: '210987654321',
        aadharUrl: 'https://picsum.photos/seed/jane_aadhar/300/200',
        pan: 'FGHIJ5678K'
    }
];


export async function getAllUsers(): Promise<User[]> {
  // In a real app, you would fetch from Firestore.
  // For this demo, we are returning a hardcoded list of sample users.
  // You can switch to Firestore fetching by uncommenting the code below.
  return Promise.resolve(sampleUsers);
  /*
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User);
    });
    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
  */
}

export async function createUser(userData: UserInput): Promise<User | null> {
    try {
        // This function will add a user to the sampleUsers array for the demo.
        // In a real app, this would write to Firestore.
        const uniqueId = `USR${(sampleUsers.length + 1).toString().padStart(3, '0')}`;
        
        // Mocking file upload
        const photoUrl = URL.createObjectURL(userData.photo);
        const aadharUrl = URL.createObjectURL(userData.aadhar);
        
        const newUser: User = {
            id: uniqueId,
            ...userData,
            photoUrl,
            aadharUrl,
        };
        
        sampleUsers.push(newUser);
        console.log("New user added to sample data:", newUser);
        
        return newUser;

    } catch (error) {
        console.error("Error creating new user: ", error);
        return null;
    }
}
