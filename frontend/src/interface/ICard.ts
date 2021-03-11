export type CardSuit = "clubs" | "spades" | "hearts" | "diamonds";

export type CardValue = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "j" | "q" | "k";

export interface ICard {
	suit: CardSuit;
	value: CardValue;
}
