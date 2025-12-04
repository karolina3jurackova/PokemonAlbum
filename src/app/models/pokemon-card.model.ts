export interface PokemonCard {
    uuid: string;
    name: string;
    type: string;
    rarity: string;
    hp: number;
    imageFilePath?: string;
    imageWebviewPath?: string;
    createdAt: number;
}