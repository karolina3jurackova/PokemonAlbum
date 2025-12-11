import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { PokemonCard } from '../models/pokemon-card.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CardCloudService {
  constructor(private auth: AuthService) { }

  private getUserCardsCollection() {
    const uid = this.auth.currentUserId;
    if (!uid) throw new Error('User not logged in');

    return collection(db, 'users', uid, 'cards');
  }

  async saveCard(card: PokemonCard) {
    const colRef = this.getUserCardsCollection();
    await addDoc(colRef, card);
  }

  async loadCards(): Promise<PokemonCard[]> {
    const uid = this.auth.currentUserId;
    if (!uid) return [];

    const snap = await getDocs(this.getUserCardsCollection());
    return snap.docs.map((d) => d.data() as PokemonCard);
  }

  async deleteCard(uuid: string): Promise<void> {
    const colRef = this.getUserCardsCollection();

    const q = query(colRef, where('uuid', '==', uuid));
    const snap = await getDocs(q);

    const deletes = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletes);
  }
}