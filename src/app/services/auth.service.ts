import { Injectable } from '@angular/core';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth } from '../firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _currentUser: User | null = null;

    constructor() {
        console.log('[AUTH] service constructed');

        onAuthStateChanged(auth, (user) => {
            this._currentUser = user;
            console.log('[AUTH] onAuthStateChanged =>', user?.uid ?? null);
        });

        // DIAGNOSTIKA KONFIGURÁCIE (API KEY)
        try {
            const apiKey = (auth.app.options as any)?.apiKey;
            console.log(
                '%c[FIREBASE] API KEY:',
                'color:#00bfff;font-weight:bold;',
                apiKey
            );
        } catch (e) {
            console.error('[FIREBASE] Cannot read apiKey:', e);
        }
    }

    get currentUser(): User | null {
        return this._currentUser;
    }

    get currentUserId(): string | null {
        return this._currentUser?.uid ?? null;
    }

    async register(email: string, password: string): Promise<User> {
        console.log('[AUTH] register() CALLED with', email);

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            this._currentUser = cred.user;
            console.log('[AUTH] REGISTER OK:', cred.user.uid);
            return cred.user;
        } catch (err) {
            console.error('[AUTH] REGISTER ERROR RAW:', err);
            throw err;
        }
    }

    async login(email: string, password: string): Promise<User> {
        console.log('[AUTH] login() CALLED with', email);

        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            this._currentUser = cred.user;
            console.log('[AUTH] LOGIN OK:', cred.user.uid);
            return cred.user;
        } catch (err) {
            console.error('[AUTH] LOGIN ERROR RAW:', err);
            throw err;
        }
    }

    async logout() {
        console.log('[AUTH] logout() CALLED');
        await signOut(auth);
        this._currentUser = null;
        console.log('[AUTH] LOGOUT DONE');
    }
}