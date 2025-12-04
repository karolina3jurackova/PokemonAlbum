// src/app/services/card-storage.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { PokemonCard } from '../models/pokemon-card.model';

const KEY = 'pokemon_cards';

@Injectable({ providedIn: 'root' })
export class CardStorageService {
    cards: PokemonCard[] = [];

    constructor() {
        console.log('CardStorageService initialized');
    }

    async load(): Promise<void> {
        const { value } = await Preferences.get({ key: KEY });
        this.cards = value ? JSON.parse(value) : [];
    }

    private async save() {
        await Preferences.set({ key: KEY, value: JSON.stringify(this.cards) });
    }

    async add(card: PokemonCard) {
        this.cards.unshift(card);
        await this.save();
    }

    async clear() {
        this.cards = [];
        await this.save();
    }
}
