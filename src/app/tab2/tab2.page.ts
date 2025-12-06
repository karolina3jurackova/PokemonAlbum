// src/app/tab2/tab2.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PhotoService } from '../services/photo.service';
import { CardStorageService } from '../services/card-storage.service';
import { PokemonCard } from '../models/pokemon-card.model';

import { Camera, CameraResultType } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
    await this.photoService.loadSaved();
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const fileName = `${new Date().getTime()}.jpeg`;

    // uloženie súboru do permanentného úložiska
    await Filesystem.writeFile({
      path: fileName,
      data: image.base64String!,
      directory: Directory.Data,
    });

    // získanie URI použiteľného v aplikácii
    const savedImage = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Data,
    });

    this.previewPath = savedImage.uri; // → toto zobrazíš v HTML
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