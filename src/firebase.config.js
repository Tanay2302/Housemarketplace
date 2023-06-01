// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyD_hV776x4yHh2jjUT260vMWJktstXqpos",
  authDomain: "house-marketplace-app-52a5c.firebaseapp.com",
  projectId: "house-marketplace-app-52a5c",
  storageBucket: "house-marketplace-app-52a5c.appspot.com",
  messagingSenderId: "9475233588",
  appId: "1:9475233588:web:3e87cdbe0c950a03323761"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore()