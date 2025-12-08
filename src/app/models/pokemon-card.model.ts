export interface PokemonCard {
    uuid: string;
    name: string;
    type: string;
    rarity: string;
    hp: number;
    imageFilePath?: string | null;
    imageWebviewPath?: string | null;
    createdAt: number;
    ownerId?: string | null;
}