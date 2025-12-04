// src/app/tab2/tab2.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PhotoService } from '../services/photo.service';
import { CardStorageService } from '../services/card-storage.service';
import { PokemonCard } from '../models/pokemon-card.model';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class Tab2Page {
  name = '';
  type = '';
  rarity = '';
  hp: number | null = null;

  previewPath?: string;
  lastPhotoFilePath?: string;

  constructor(
    private photoService: PhotoService,
    private cardStorage: CardStorageService
  ) { }

  async ionViewWillEnter() {
    // načítame existujúce fotky (nie je nutné, ale neuškodí)
    await this.photoService.loadSaved();
  }

  async takePhoto() {
    console.log('Klik na ODFOTIŤ KARTIČKU');  // 👈 pomocný log

    try {
      await this.photoService.addNewToGallery();
      const photo = this.photoService.photos[0];

      if (!photo) {
        alert('Žiadna fotka sa nevrátila');
        return;
      }

      this.previewPath = photo.webviewPath;
      this.lastPhotoFilePath = photo.filepath;

      console.log('Foto OK', photo);
    } catch (err) {
      console.error('Chyba pri fotení/výbere fotky', err);
      alert('Nepodarilo sa získať fotku. Pozri konzolu pre viac info.');
    }
  }

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

    const card: PokemonCard = {
      uuid: crypto.randomUUID(),
      name: this.name.trim(),
      type: this.type.trim(),
      rarity: this.rarity.trim(),
      hp: this.hp,
      imageFilePath: this.lastPhotoFilePath,
      imageWebviewPath: this.previewPath,
      createdAt: Date.now(),
    };

    await this.cardStorage.add(card);

    this.name = '';
    this.type = '';
    this.rarity = '';
    this.hp = null;
    this.previewPath = undefined;
    this.lastPhotoFilePath = undefined;
  }
}