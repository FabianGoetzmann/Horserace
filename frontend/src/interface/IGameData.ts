import { CardSuit } from "./CardSuit";
import { ICard } from "./ICard";
import { IPlayerInfo } from "./IPlayerInfo";

interface IStatistics {
	roundsPlayed: number;
}

export interface ICardPositions {
	clubs: number;
	diamonds: number;
	hearts: number;
	spades: number;
}

export interface ICurentGame {
	gameState: "waiting" | "finished" | "active";
	cardPositions: ICardPositions;
	positionRequiredForWin: number;
	lastDrawnCard?: ICard;
	winner?: CardSuit;
	flippedFalteringCards?: ICard[];
}

export interface IGameData {
	allPlayersReady: boolean;
	players: IPlayerInfo[];
	statistics: IStatistics;
	currentGame: ICurentGame;
}
