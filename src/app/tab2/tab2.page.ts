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
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
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
  lastPhotoFilePath: string | null = null;

  constructor(
    private photoService: PhotoService,
    private cardStorage: CardStorageService,
    private cardCloud: CardCloudService,
    private platform: Platform,
    private auth: AuthService
  ) { }

  async ionViewWillEnter() {
    await this.photoService.loadSaved();
  }

  // ====== FOTO – WEB + MOBIL ======
  async takePhoto() {
    const isHybrid = this.platform.is('hybrid');

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      // hybrid: dostaneme path/webPath, web: priamo dataUrl
      resultType: isHybrid ? CameraResultType.Uri : CameraResultType.DataUrl,
      // hybrid: Prompt (kamera + galéria), web: iba Photos (file picker)
      source: isHybrid ? CameraSource.Prompt : CameraSource.Photos,
    });

    if (isHybrid) {
      // natívna appka – uložíme do filesystemu a dostaneme webviewPath
      const saved = await this.savePicture(image);
      this.lastPhotoFilePath = saved.filepath;
      this.previewPath = saved.webviewPath;
    } else {
      // web – stačí dataUrl, nič nepíšeme do filesystemu
      this.previewPath = image.dataUrl ?? null;
      this.lastPhotoFilePath = null;
    }
  }

  // používa sa len v natívnej appke (hybrid)
  private async savePicture(photo: { path?: string; webPath?: string | null }) {
    let base64Data: string | Blob;

    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await this.convertBlobToBase64(blob)) as string;
    }

    const fileName = `${Date.now()}.jpeg`;

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath!,
      };
    }
  }

  private convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
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

    const card: PokemonCard = {
      uuid: crypto.randomUUID(),
      name: this.name.trim(),
      type: this.type.trim(),
      rarity: this.rarity.trim(),
      hp: this.hp,
      imageFilePath: this.lastPhotoFilePath,
      imageWebviewPath: this.previewPath,
      createdAt: Date.now(),
      ownerId: this.auth.currentUserId ?? null,
    };

    await this.cardStorage.add(card);
    await this.cardCloud.saveCard(card);

    // reset formulára
    this.name = '';
    this.type = '';
    this.rarity = '';
    this.hp = null;
    this.previewPath = null;
    this.lastPhotoFilePath = null;
  }
}