import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, storage, auth } from "./config";
import type { Admin } from "@/lib/admins";

export async function getAllAdmins(): Promise<Admin[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "admins"));
    const admins: Admin[] = [];
    querySnapshot.forEach((doc) => {
      admins.push({ id: doc.id, ...doc.data() } as Admin);
    });
    return admins;
  } catch (error) {
    console.error("Error fetching admins: ", error);
    return [];
  }
}

export async function createAdmin(adminData: Omit<Admin, 'id' | 'photoUrl'> & { photo: File, password_raw: string }): Promise<Admin | null> {
    try {
        // 1. Create user in Firebase Auth
        // Note: Firebase Auth requires an email and password. We'll use a placeholder email format.
        const userCredential = await createUserWithEmailAndPassword(auth, `${adminData.username}@loanflow.app`, adminData.password_raw);
        const user = userCredential.user;

        // 2. Upload photo to Firebase Storage
        const photoRef = ref(storage, `admin_photos/${user.uid}/${adminData.photo.name}`);
        const snapshot = await uploadBytes(photoRef, adminData.photo);
        const photoUrl = await getDownloadURL(snapshot.ref);

        // 3. Add admin document to Firestore
        const { photo, password_raw, ...firestoreData } = adminData;
        const docRef = await addDoc(collection(db, "admins"), {
            ...firestoreData,
            authUid: user.uid,
            photoUrl: photoUrl,
            createdAt: serverTimestamp(),
        });
        
        return {
            id: docRef.id,
            ...firestoreData,
            photoUrl: photoUrl,
        };

    } catch (error) {
        console.error("Error creating new admin: ", error);
        // TODO: Handle user creation failure (e.g., delete the user from Auth if Firestore write fails)
        return null;
    }
}
