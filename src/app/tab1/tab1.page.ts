import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { CardStorageService } from '../services/card-storage.service';
import { PokemonCard } from '../models/pokemon-card.model';

@Component({
  selector: 'app-tab1',
  standalone: true,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class Tab1Page {
  cards: PokemonCard[] = [];

  constructor(
    private cardStorage: CardStorageService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    await this.cardStorage.load();
    this.cards = this.cardStorage.cards;
  }

  openDetail(card: PokemonCard) {
    this.router.navigate(['/card', card.uuid]);
  }
}