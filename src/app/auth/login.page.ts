import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import {
    IonContent,
    IonInput,
    IonButton,
    IonTitle,
    IonText,
} from '@ionic/angular/standalone';

import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    imports: [IonContent, IonInput, IonButton, IonTitle, IonText, FormsModule, NgIf],
})
export class LoginPage {
    email = '';
    password = '';
    mode: 'login' | 'register' = 'login';
    errorMessage = '';

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    async onSubmit() {
        this.errorMessage = '';

        const email = this.email.trim();
        const password = this.password.trim();

        if (!email || !password) {
            this.errorMessage = 'Zadaj email a heslo.';
            alert(this.errorMessage);
            return;
        }

        console.log('[LOGIN PAGE] onSubmit, mode =', this.mode);

        try {
            let user;

            if (this.mode === 'login') {
                user = await this.auth.login(email, password);
                console.log('[LOGIN PAGE] LOGIN success:', user?.uid);
            } else {
                user = await this.auth.register(email, password);
                console.log('[LOGIN PAGE] REGISTER success:', user?.uid);
            }
            // Hladanie problému v aplikácii, nefunkčný login
            const ok = await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
            console.log('[LOGIN PAGE] navigate result =', ok);
        } catch (err: any) {
            console.error('[LOGIN PAGE] AUTH ERROR RAW:', err);

            const code: string | undefined = err?.code;
            let msg = err?.message || 'Prihlásenie zlyhalo.';

            switch (code) {
                case 'auth/invalid-email':
                    msg = 'Email nemá platný formát.';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    msg = 'Nesprávny email alebo heslo.';
                    break;
                case 'auth/email-already-in-use':
                    msg = 'Tento email už má účet. Skús sa prihlásiť.';
                    break;
                case 'auth/network-request-failed':
                    msg = 'Problém s pripojením na internet.';
                    break;
                case 'auth/too-many-requests':
                    msg = 'Príliš veľa pokusov. Skús to o chvíľu.';
                    break;
            }

            this.errorMessage = msg;
            alert(`${msg}\n\n${code ?? ''}`);
        }
    }

    toggleMode() {
        this.mode = this.mode === 'login' ? 'register' : 'login';
        this.errorMessage = '';
        console.log('[LOGIN PAGE] mode switched to', this.mode);
    }
}