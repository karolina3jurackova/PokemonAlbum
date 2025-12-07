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
        onAuthStateChanged(auth, (user) => {
            this._currentUser = user;
            console.log('[AUTH] onAuthStateChanged =>', user?.uid ?? null);
        });
        // DIAGNOSTIKA API KEY -> RIEŠENIE PROBLÉMU S LOGINOM
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
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        this._currentUser = cred.user;
        console.log('[AUTH] REGISTER OK:', cred.user.uid);
        return cred.user;
    }

    async login(email: string, password: string): Promise<User> {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        this._currentUser = cred.user;
        console.log('[AUTH] LOGIN OK:', cred.user.uid);
        return cred.user;
    }

    async logout() {
        await signOut(auth);
        this._currentUser = null;
        console.log('[AUTH] LOGOUT');
    }
}