import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here

const firebaseConfig = {
    apiKey: "AIzaSyDxm92c4B0Wb9YktqTDD5JUr33zAwK0V6c",
    authDomain: "summative-229bd.firebaseapp.com",
    projectId: "summative-229bd",
    storageBucket: "summative-229bd.firebasestorage.app",
    messagingSenderId: "299251446301",
    appId: "1:299251446301:web:7b79ea8c626c33efb50cf4"
  };
  
const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };