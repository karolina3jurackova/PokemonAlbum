import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
    getAuth,
    initializeAuth,
    inMemoryPersistence,
} from 'firebase/auth';

import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
    apiKey: "AIzaSyCqgVferX_EuQsirxDkTn98BU7_yh84T3E",
    authDomain: "pokemonalbumpt2.firebaseapp.com",
    projectId: "pokemonalbumpt2",
    storageBucket: "pokemonalbumpt2.firebasestorage.app",
    messagingSenderId: "1040586741770",
    appId: "1:1040586741770:web:a09f3046bb83aef798e7f3",
    measurementId: "G-P0LL3D4SWD"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = Capacitor.isNativePlatform()
    ? initializeAuth(app, {
        persistence: inMemoryPersistence,
    })
    : getAuth(app);