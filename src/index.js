import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Home,
  Upload,
} from "./components";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDST-3lmViRVvpSDzc-faFsdgPAcfa17r0",
  authDomain: "vandyhacks-2022-8ae39.firebaseapp.com",
  databaseURL: "https://vandyhacks-2022-8ae39-default-rtdb.firebaseio.com",
  projectId: "vandyhacks-2022-8ae39",
  storageBucket: "vandyhacks-2022-8ae39.appspot.com",
  messagingSenderId: "560748642471",
  appId: "1:560748642471:web:0086216597f5f639de1b82",
  measurementId: "G-EM5X462PLC"
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  </Router>
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);