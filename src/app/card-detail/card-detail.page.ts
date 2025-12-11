import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { CardStorageService } from '../services/card-storage.service';
import { CardCloudService } from '../services/card-cloud.service';
import { PokemonCard } from '../models/pokemon-card.model';

@Component({
    selector: 'app-card-detail',
    standalone: true,
    templateUrl: './card-detail.page.html',
    styleUrls: ['./card-detail.page.scss'],
    imports: [IonicModule],
})
export class CardDetailPage {
    card?: PokemonCard;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cardStorage: CardStorageService,
        private cardCloud: CardCloudService
    ) { }

    async ionViewWillEnter() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;

        await this.cardStorage.load();
        this.card = this.cardStorage.cards.find((c) => c.uuid === id);
    }

    async deleteCard() {
        if (!this.card) return;

        const ok = confirm(`Naozaj chceš zmazať kartičku „${this.card.name}“?`);
        if (!ok) return;


        await this.cardStorage.delete(this.card.uuid);

        await this.cardCloud.deleteCard(this.card.uuid);

        this.router.navigate(['/tabs', 'tab1']);
    }
}