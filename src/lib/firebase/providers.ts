import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, storage, auth } from "./config";
import type { Provider } from "@/lib/providers";

export async function getAllProviders(): Promise<Provider[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "providers"));
    const providers: Provider[] = [];
    querySnapshot.forEach((doc) => {
      providers.push({ id: doc.id, ...doc.data() } as Provider);
    });
    return providers;
  } catch (error) {
    console.error("Error fetching providers: ", error);
    return [];
  }
}

export async function createProvider(providerData: Omit<Provider, 'id' | 'photoUrl'> & { photo: File, password_raw: string }): Promise<Provider | null> {
    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, `${providerData.username}@loanflow.app`, providerData.password_raw);
        const user = userCredential.user;

        // 2. Upload photo to Firebase Storage
        const photoRef = ref(storage, `provider_photos/${user.uid}/${providerData.photo.name}`);
        const snapshot = await uploadBytes(photoRef, providerData.photo);
        const photoUrl = await getDownloadURL(snapshot.ref);

        // 3. Add provider document to Firestore
        const { photo, password_raw, ...firestoreData } = providerData;
        const docRef = await addDoc(collection(db, "providers"), {
            ...firestoreData,
            authUid: user.uid,
            photoUrl: photoUrl,
            role: "loan",
            createdAt: serverTimestamp(),
        });
        
        return {
            id: docRef.id,
            ...firestoreData,
            photoUrl: photoUrl,
            role: "loan"
        };

    } catch (error) {
        console.error("Error creating new provider: ", error);
        // TODO: Handle user creation failure (e.g., delete the user from Auth if Firestore write fails)
        return null;
    }
}
