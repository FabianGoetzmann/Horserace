import { CardSuit } from "./CardSuit";

export interface IPlayerInfo {
	id: string;
	name: string;
	bet?: number;
	self: boolean;
	ready: boolean;
	repeatBetAtNewRound: boolean;
	gamemaster: boolean;
	bettedOnSuit?: CardSuit;
	isInGame: boolean;
}
