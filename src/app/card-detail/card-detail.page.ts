import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CardStorageService } from '../services/card-storage.service';
import { PokemonCard } from '../models/pokemon-card.model';

@Component({
    selector: 'app-card-detail',
    standalone: true,
    templateUrl: './card-detail.page.html',
    styleUrls: ['./card-detail.page.scss'],
    imports: [CommonModule, IonicModule],
})
export class CardDetailPage {
    card?: PokemonCard;

    constructor(
        private route: ActivatedRoute,
        private cardStorage: CardStorageService
    ) { }

    async ionViewWillEnter() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;

        await this.cardStorage.load();
        this.card = this.cardStorage.cards.find((c) => c.uuid === id);
    }
}