import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  setDoc,
  getDocs
} from 'firebase/firestore';

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
    const docRef = doc(colRef, card.uuid);

    await setDoc(docRef, card, { merge: true });
  }

  async loadCards(): Promise<PokemonCard[]> {
    const uid = this.auth.currentUserId;
    if (!uid) return [];

    const colRef = collection(db, 'users', uid, 'cards');
    const snap = await getDocs(colRef);

    return snap.docs.map((d) => {
      const data = d.data() as PokemonCard;
      return {
        ...data,
        uuid: data.uuid ?? d.id,
      };
    });
  }

}