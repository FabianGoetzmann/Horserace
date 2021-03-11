import Card, { CardInfo, CardSuit } from "./Card";
import CardDeck from "./CardDeck";
import InvalidGameStateError from "./Errors/InvalidGameStateError";
import Racetrack, { Positions } from "./Racetrack";
type GameState = "waiting" | "finished" | "active";

export const POSITIONS_REQUIRED_FOR_WIN = 7;

export type GameInfo = {
	gameState: GameState;
	positionRequiredForWin: number;
	cardPositions: Positions;
	winner?: CardSuit;
	lastDrawnCard?: CardInfo;
	flippedFalteringCards?: CardInfo[];
};

export interface IGame {
	state: GameState;
	positionRequiredForWin: number;
	cardDeck: CardDeck;
	// falteringCards: Card[];
	nextMove(): CardSuit | null;
	history: any;
	winner?: CardSuit;
	initializeNewGame(): void;
	getGameInfo(): GameInfo;
	getWinner(): CardSuit | null;

	racetrack: Racetrack;
}

export default class Game implements IGame {
	state!: GameState;
	positionRequiredForWin: number;
	cardDeck!: CardDeck;
	history: any;
	racetrack!: Racetrack;
	winner?: CardSuit;

	constructor(POSITIONS_REQUIRED_FOR_WIN = 7) {
		this.positionRequiredForWin = POSITIONS_REQUIRED_FOR_WIN;
		this.initializeNewGame();
	}

	nextMove(): CardSuit | null {
		if (this.state === "finished") {
			throw new Error("New Game Should be started first!");
		}

		if (this.state === "waiting") {
			this.state = "active";
		}
		// From now on the state can only be active

		let winner;

		if (this.racetrack.shouldFalteringCardBeFlipped()) {
			this.racetrack.flipFalteringCard();
		} else {
			const drawnCard = this.cardDeck.drawCard();
			winner = this.racetrack.nextMove(drawnCard);
		}

		if (winner) {
			// console.log(`Suit ${winner} has won`);
			this.state = "finished";
			this.winner = winner;
			return winner;
		}

		return null;
	}

	initializeNewGame = () => {
		this.state = "waiting";
		this.cardDeck = new CardDeck();
		this.cardDeck.initialize();
		// last one is never flipped since there can only be one winner
		const falteringCards = this.cardDeck.drawMultipleCards(this.positionRequiredForWin - 1);
		this.racetrack = new Racetrack(this.positionRequiredForWin, falteringCards);
	};

	getWinner = () => {
		if (this.winner) {
			return this.winner;
		}
		return null;
	};

	getGameInfo = () => {
		const gameInfo: GameInfo = {
			gameState: this.state,
			positionRequiredForWin: this.positionRequiredForWin,
			cardPositions: this.racetrack.getPositions(),
		};

		const lastDrawnCard = this.cardDeck.lastDrawn;
		if (lastDrawnCard) {
			gameInfo["lastDrawnCard"] = lastDrawnCard.getCardInfo();
		}

		if (this.winner) {
			gameInfo["winner"] = this.winner;
		}

		const flippedFalteringCards = this.racetrack.getFlippedFalteringCardsInfo();
		if (flippedFalteringCards.length > 0) {
			gameInfo["flippedFalteringCards"] = flippedFalteringCards;
		}

		return gameInfo;
	};
}
