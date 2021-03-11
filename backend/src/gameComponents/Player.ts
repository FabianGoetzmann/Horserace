import { CardSuit } from "./Card";
import InvalidInputError from "./Errors/InvalidInputError";

export const MAX_LENGTH_NAME = 16;

export interface IPlayer extends PlayerInfo {
	joinedLobby: Date;

	setReady(ready: boolean): void;
	setBet(bet: number): void;
	setRepeatBet(repeat: boolean): void;
	resetBet(): void;
	setGamemaster(b: boolean): void;
	setSuit(suit: CardSuit): void;
	getPlayerInfo(): PlayerInfo;
	resetSuit(): void;
}

export type PlayerInfo = {
	id: string;
	name: string;
	bet?: number;
	ready: boolean;
	repeatBetAtNewRound: boolean;
	gamemaster: boolean;
	bettedOnSuit?: CardSuit;
	isInGame: boolean;
};

export default class Player implements IPlayer {
	id: string;
	name!: string;
	bet?: number | undefined;
	bettedOnSuit?: CardSuit;
	ready: boolean;
	repeatBetAtNewRound: boolean;
	gamemaster: boolean;
	isInGame: boolean;
	joinedLobby: Date;

	constructor(id: string, name: string, gamemaster: boolean = false) {
		this.id = id;

		if (this.validateName(name)) {
			this.name = name;
		}

		this.ready = false;
		this.repeatBetAtNewRound = false;
		this.gamemaster = gamemaster;
		this.isInGame = true;
		this.joinedLobby = new Date();
	}

	setSuit(suit: CardSuit): void {
		if (!suit) {
			throw new InvalidInputError("No suit value was provided");
		}

		const possibleSuits: CardSuit[] = ["hearts", "diamonds", "spades", "clubs"];
		if (!possibleSuits.includes(suit)) {
			throw new InvalidInputError("Provided wrong suit value");
		}

		this.bettedOnSuit = suit;
	}

	validateName = (name: string) => {
		if (name.length > MAX_LENGTH_NAME) {
			throw new InvalidInputError(`Provided name is too long. At most ${MAX_LENGTH_NAME} characters allowed.`);
		}

		return true;
	};

	resetSuit = () => {
		this.bettedOnSuit = undefined;
	};

	setReady(ready: boolean): void {
		this.ready = ready;
	}

	setBet(bet: number): void {
		if (isNaN(bet)) {
			throw new InvalidInputError("Bet must be a number");
		}
		if (bet < 0) {
			throw new InvalidInputError("No negative values as bet allowed");
		}
		this.bet = bet;
	}

	setIsInGame(b: boolean): void {
		this.isInGame = b;
	}

	resetBet(): void {
		this.bet = undefined;
	}

	setRepeatBet(repeat: boolean): void {
		this.repeatBetAtNewRound = repeat;
	}

	setGamemaster(b: boolean): void {
		this.gamemaster = b;
	}

	getPlayerInfo = (): PlayerInfo => {
		const playerInfo: PlayerInfo = {
			id: this.id,
			name: this.name,
			ready: this.ready,
			repeatBetAtNewRound: this.repeatBetAtNewRound,
			gamemaster: this.gamemaster,
			isInGame: this.isInGame,
		};

		if (this.bettedOnSuit) {
			playerInfo["bettedOnSuit"] = this.bettedOnSuit;
		}

		if (this.bet || this.bet === 0) {
			playerInfo["bet"] = this.bet;
		}

		return playerInfo;
	};
}
