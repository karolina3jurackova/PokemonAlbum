import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { PokemonCard } from '../models/pokemon-card.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CardCloudService {
  constructor(private auth: AuthService) { }

  async saveCard(card: PokemonCard) {
    const uid = this.auth.currentUserId;
    if (!uid) throw new Error('User not logged in');

    const colRef = collection(db, 'users', uid, 'cards');
    await addDoc(colRef, card);
  }

  async loadCards(): Promise<PokemonCard[]> {
    const uid = this.auth.currentUserId;
    if (!uid) return [];

    const snap = await getDocs(collection(db, 'users', uid, 'cards'));
    return snap.docs.map((d) => d.data() as PokemonCard);
  }
}