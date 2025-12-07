import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const canMatchAuth: CanMatchFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.currentUser) {
        return true;
    }

    // nie je prihlásený → pošli na /login
    router.navigateByUrl('/login');
    return false;
};