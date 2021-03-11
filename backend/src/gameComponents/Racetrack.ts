import Card, { CardInfo, CardSuit } from "./Card";
import InvalidInputError from "./Errors/InvalidInputError";

export type Positions = {
	clubs: number;
	spades: number;
	hearts: number;
	diamonds: number;
};

type FalteringCardInfo = {
	[key: string]: {
		card: Card;
		flipped: boolean;
	};
};

interface IRacetrack {
	positions: Positions;
	positionRequiredForWin: number;
	highestCommonPosition: number;
	falteringCards: FalteringCardInfo;

	nextMove(drawnCard: Card): CardSuit | null;
}

export default class Racetrack implements IRacetrack {
	positions: Positions;
	positionRequiredForWin: number;
	highestCommonPosition: number;
	highestSuitPosition: Positions;
	falteringCards: FalteringCardInfo = {};

	constructor(positionRequiredForWin: number = 7, falteringCards: Card[]) {
		if (positionRequiredForWin < 0) {
			throw new InvalidInputError("Value must be at least 0");
		}
		this.positionRequiredForWin = positionRequiredForWin;
		this.highestCommonPosition = 0;

		this.positions = {
			clubs: 0,
			spades: 0,
			hearts: 0,
			diamonds: 0,
		};

		this.highestSuitPosition = {
			clubs: 0,
			spades: 0,
			hearts: 0,
			diamonds: 0,
		};

		for (let i = 0; i < falteringCards.length; i++) {
			this.falteringCards[i + 1] = {
				card: falteringCards[i],
				flipped: false,
			};
		}
	}

	/* 
		Processes the Game with the next drawn card.
		Return the winning suit if one exists
	*/
	nextMove(drawnCard: Card): CardSuit | null {
		const suit = drawnCard.suit;
		this.positions[suit] = this.positions[suit] + 1;
		this.highestSuitPosition[suit] = this.highestSuitPosition[suit] + 1;

		this.highestCommonPosition = Math.min(...Object.values(this.positions));
		// console.log(`Updated ${drawnCard.suit} position to ${this.positions[suit]}`);
		console.log("Highest common position: " + this.highestCommonPosition);
		// Check For winner
		if (this.positions[suit] === this.positionRequiredForWin) {
			return suit as CardSuit;
		} else {
			return null;
		}
	}

	shouldFalteringCardBeFlipped = () => {
		if (this.falteringCards[this.highestCommonPosition]) {
			return !this.falteringCards[this.highestCommonPosition].flipped;
		}
		return false;
	};

	flipFalteringCard = () => {
		const falteringCardSuit = this.falteringCards[this.highestCommonPosition].card.suit;
		this.falteringCards[this.highestCommonPosition].flipped = true;
		console.log(`${falteringCardSuit} Position before falteringCard: ${this.positions[falteringCardSuit]}`);

		if (this.positions[falteringCardSuit] > 0) {
			this.positions[falteringCardSuit] -= 1;
		}

		console.log(`${falteringCardSuit} Position AFTER falteringCard: ${this.positions[falteringCardSuit]}`);
	};

	getPositions = (): Positions => {
		return this.positions;
	};

	getFlippedFalteringCardsInfo = () => {
		const flippedFalteringCard: CardInfo[] = [];
		// Object.values etc. do not guarantee object property order
		for (let i = 0; i < this.positionRequiredForWin; i++) {
			if (this.falteringCards[i] && this.falteringCards[i].flipped) {
				flippedFalteringCard.push(this.falteringCards[i].card.getCardInfo());
			}
		}
		return flippedFalteringCard;
	};
}
