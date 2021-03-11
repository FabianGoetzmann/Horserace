import Card, { CardSuit } from "./Card";
import CardDeckError from "./Errors/CardDeckError";

export interface ICardDeck {
	lastDrawn?: Card;
	deck: Card[];

	initialize(): void;
	drawCard(): Card;
	drawMultipleCards(amount: number): Card[];
	getLastDrawnCard(): Card | undefined;
}

// EXCLUDE Ace because it is used as gamecard
export const possibleValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
export const possibleSuits: CardSuit[] = ["hearts", "diamonds", "spades", "clubs"];

export default class CardDeck implements ICardDeck {
	deck: Card[] = [];
	lastDrawn?: Card;

	initialize(): void {
		this.deck = [];
		for (const suit of possibleSuits) {
			for (const value of possibleValues) {
				this.deck.push(new Card(suit, value));
			}
		}
		this.shuffle(this.deck);
	}

	drawCard(drawnDuringActiveGame = true): Card {
		if (this.deck.length > 0) {
			const card = this.deck.shift() as Card;
			if (drawnDuringActiveGame) {
				this.lastDrawn = card;
			}
			return card;
		}
		throw new CardDeckError("Empty Deck. Cannot draw any more cards.");
	}

	drawMultipleCards(amount: number): Card[] {
		if (amount > this.deck.length) {
			throw new CardDeckError("Amount to be drawn is bigger than the size of the current deck");
		}

		const drawnCards: Card[] = [];
		while (amount) {
			drawnCards.push(this.drawCard(false));
			amount -= 1;
		}

		return drawnCards;
	}

	shuffle = <T>(array: T[]) => {
		let currentIndex = array.length,
			temporaryValue: T,
			randomIndex: number;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};

	getLastDrawnCard = () => {
		return this.lastDrawn;
	};
}
