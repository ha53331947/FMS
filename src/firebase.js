import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNSo7_eL-xDdQv6ZB5CPC2z9BVQZ3fhqw",
  authDomain: "haris-14.firebaseapp.com",
  databaseURL: "https://haris-14.firebaseio.com/",
  projectId: "haris-14",
  storageBucket: "haris-14.firebasestorage.app",
  messagingSenderId: "562678004715",
  appId: "1:562678004715:web:46e10fbe74876cee7037ae",
  measurementId: "G-G4B23NH4JK"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);