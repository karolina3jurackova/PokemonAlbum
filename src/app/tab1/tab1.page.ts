// src/app/tab1/tab1.page.ts
import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { CardStorageService } from '../services/card-storage.service';
import { PokemonCard } from '../models/pokemon-card.model';

@Component({
  selector: 'app-tab1',
  standalone: true,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [FormsModule, IonicModule],
})
export class Tab1Page {
  cards: PokemonCard[] = [];
  searchTerm = '';

  constructor(
    private cardStorage: CardStorageService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    await this.cardStorage.load();
    this.cards = this.cardStorage.cards;
  }

  onSearch(event: CustomEvent) {
    this.searchTerm = (event.detail?.value || '').toString();
  }

  // karty zobrazené v gride
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