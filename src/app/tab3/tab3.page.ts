import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { CardStorageService } from '../services/card-storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonText,
  ],
})
export class Tab3Page {
  userEmail: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cardStorage: CardStorageService
  ) {
    this.userEmail = this.auth.currentUser?.email ?? null;
  }

  async logout() {
    console.log('[TAB3] logging out…');

    await this.auth.logout();
    await this.cardStorage.clear();

    this.router.navigateByUrl('/login', {
      replaceUrl: true,
    });

    console.log('[TAB3] logout success');
  }
}