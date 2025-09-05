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

export async function getAllUsers(): Promise<User[]> {
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
}

export async function createUser(userData: UserInput): Promise<User | null> {
    try {
        // Use email to create a unique ID for storage to avoid collisions
        const uniqueId = userData.email.replace(/[^a-zA-Z0-9]/g, '_');

        // 1. Upload photo to Firebase Storage
        const photoRef = ref(storage, `user_photos/${uniqueId}/${userData.photo.name}`);
        const photoSnapshot = await uploadBytes(photoRef, userData.photo);
        const photoUrl = await getDownloadURL(photoSnapshot.ref);

        // 2. Upload aadhar to Firebase Storage
        const aadharRef = ref(storage, `user_aadhar/${uniqueId}/${userData.aadhar.name}`);
        const aadharSnapshot = await uploadBytes(aadharRef, userData.aadhar);
        const aadharUrl = await getDownloadURL(aadharSnapshot.ref);

        // 3. Add user document to Firestore
        const { photo, aadhar, ...firestoreData } = userData;
        
        const finalData = {
            ...firestoreData,
            photoUrl,
            aadharUrl,
            createdAt: serverTimestamp(),
        }

        const docRef = await addDoc(collection(db, "users"), finalData);
        
        return {
            id: docRef.id,
            ...firestoreData,
            photoUrl,
            aadharUrl,
        };

    } catch (error) {
        console.error("Error creating new user: ", error);
        return null;
    }
}
