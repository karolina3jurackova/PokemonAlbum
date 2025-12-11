import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonSearchbar,
} from '@ionic/angular/standalone';

import { PokemonCard } from '../models/pokemon-card.model';
import { CardCloudService } from '../services/card-cloud.service';
import { CardStorageService } from '../services/card-storage.service';

@Component({
  selector: 'app-tab1',
  standalone: true,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonContent,
    IonSearchbar,
    FormsModule,
  ],
})
export class Tab1Page {
  cards: PokemonCard[] = [];
  searchTerm = '';

  constructor(
    private cardCloud: CardCloudService,
    private cardStorage: CardStorageService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    try {
      this.cards = await this.cardCloud.loadCards();
      console.log('[TAB1] Loaded cards from cloud:', this.cards.length);

      await this.cardStorage.replaceAll(this.cards);
    } catch (err) {
      console.error('[TAB1] Error loading cards from cloud:', err);
      this.cards = [];
      await this.cardStorage.replaceAll([]);
    }
  }

  get filteredCards(): PokemonCard[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.cards;

    return this.cards.filter((c) =>
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.type && c.type.toLowerCase().includes(term)) ||
      (c.rarity && c.rarity.toLowerCase().includes(term)) ||
      (c.hp !== undefined && c.hp.toString().includes(term))
    );
  }

  openDetail(card: PokemonCard) {
    this.router.navigate(['/card', card.uuid]);
  }
}