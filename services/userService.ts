import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '@/config/firebase'; // Sesuaikan dengan config firebase kamu

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
  createdAt: any;
  lastLoginAt: any;
}

export const syncUserData = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Pengguna Baru: Simpan data awal ke Firestore
    const newUserData: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || null,
      providerId: user.providerData[0]?.providerId || 'password',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };

    await setDoc(userRef, newUserData);
  } else {
    // Pengguna Lama: Update waktu login terakhir
    await setDoc(
      userRef,
      {
        lastLoginAt: serverTimestamp(),
        // Update photo/displayName jika berubah dari Google
        displayName: user.displayName || userSnap.data().displayName,
        photoURL: user.photoURL || userSnap.data().photoURL,
      },
      { merge: true }
    );
  }
};