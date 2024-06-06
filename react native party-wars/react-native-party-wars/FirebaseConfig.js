import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5s0zfI-_urwPm8Xm6sAiYLHAeXS3X6VA",
  authDomain: "party-wars-89a30.firebaseapp.com",
  projectId: "party-wars-89a30",
  storageBucket: "party-wars-89a30.appspot.com",
  messagingSenderId: "266857735675",
  appId: "1:266857735675:web:f5e3d30940d201284d575e",
  measurementId: "G-ZJ69FS6NH9"
};

const app = initializeApp(firebaseConfig);

// Verifica si Firebase Analytics es compatible
isSupported().then((supported) => {
  if (supported) {
    // Solo inicializa Analytics si es compatible
    const analytics = getAnalytics(app);
  } else {
  }
}).catch((error) => {
  console.error("Error al verificar el soporte de Firebase Analytics:", error);
});

const storage = getStorage(app);

export { storage };
