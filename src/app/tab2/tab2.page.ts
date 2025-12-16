import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardCloudService } from '../services/card-cloud.service';

import {
  IonHeader,
  IonContent,
  IonInput,
  IonButton,
  IonImg,
} from '@ionic/angular/standalone';

import { PhotoService } from '../services/photo.service';
import { CardStorageService } from '../services/card-storage.service';
import { PokemonCard } from '../models/pokemon-card.model';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonInput,
    IonButton,
    IonImg,
    FormsModule,
  ],
})
export class Tab2Page {
  name = '';
  type = '';
  rarity = '';
  hp: number | null = null;

  previewPath: string | null = null;

  constructor(
    private photoService: PhotoService,
    private cardStorage: CardStorageService,
    private cardCloud: CardCloudService,
    private auth: AuthService
  ) { }

  async ionViewWillEnter() {
    await this.photoService.loadSaved();
  }

  // ====== FOTO – WEB + iOS/Android (base64 + zmenšené) ======
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      width: 800,
    });

    this.previewPath = image.dataUrl ?? null;
  }

  // ====== ULOŽENIE KARTY ======
  async onSave() {
    if (
      !this.name.trim() ||
      !this.type.trim() ||
      !this.rarity.trim() ||
      this.hp == null
    ) {
      alert('Vyplň názov, typ, raritu a HP');
      return;
    }

    if (!this.previewPath) {
      const ok = confirm(
        'Nemáš pridanú fotku. Naozaj chceš uložiť kartu bez obrázka?'
      );
      if (!ok) return;
    }

    const card: PokemonCard = {
      uuid: crypto.randomUUID(),
      name: this.name.trim(),
      type: this.type.trim(),
      rarity: this.rarity.trim(),
      hp: this.hp,
      imageFilePath: null,
      imageWebviewPath: this.previewPath,
      createdAt: Date.now(),
      ownerId: this.auth.currentUserId ?? null,
    };

    // uložiť lokálne (na offline) + do Firestore
    await this.cardStorage.add(card);
    await this.cardCloud.saveCard(card);

    // reset formulára
    this.name = '';
    this.type = '';
    this.rarity = '';
    this.hp = null;
    this.previewPath = null;
  }
}