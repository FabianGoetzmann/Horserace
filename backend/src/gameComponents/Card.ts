export type CardSuit = "clubs" | "spades" | "hearts" | "diamonds";

// type CardValues = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", ];

export type CardInfo = {
	suit: CardSuit;
	value: string;
};

interface ICard extends CardInfo {
	getCardInfo(): CardInfo;
}

export default class Card implements ICard {
	suit: CardSuit;
	value: string;

	constructor(type: CardSuit, value: string) {
		this.suit = type;
		this.value = value;
	}

	getCardInfo = () => {
		return {
			value: this.value,
			suit: this.suit,
		};
	};
}
