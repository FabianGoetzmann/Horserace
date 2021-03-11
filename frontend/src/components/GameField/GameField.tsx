import { Box, Button, Flex, HStack, position, Table, Tbody, Td, Tfoot, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import Card from "components/Card/Card";
import PlayerNew from "components/PlayerTable/Player/PlayerNew";
import { CardSuit } from "interface/CardSuit";
import { ICard } from "interface/ICard";
import { ICardPositions, IGameData, ICurentGame } from "interface/IGameData";
import React from "react";

interface IGameFieldProps {
	gameData: ICurentGame;
	allPlayersReady: boolean;
	myselfGameMaster: boolean;
	drawCard: any;
	startNewGame: any;
}

export const GameField = (props: IGameFieldProps) => {
	const renderTemp = (rowLength: number, mode: "header" | "body", cardSuit?: CardSuit, cardPosition?: number) => {
		const cardsInRow: any[] = [];

		if (mode === "header") {
			cardsInRow.push(<Box flex="1 1 0px" mr="1.5%"></Box>);

			for (let i = 0; i < rowLength; i++) {
				if (props.gameData.flippedFalteringCards && props.gameData.flippedFalteringCards[i]) {
					const falteringCard = props.gameData.flippedFalteringCards[i];
					cardsInRow.push(
						<Box flex="1 1 0px" mr="1.5%">
							<Card suit={falteringCard.suit} value={falteringCard.value} rotate90Degree={true} />
						</Box>
					);
				} else {
					cardsInRow.push(
						<Box flex="1 1 0px" mr="1.5%">
							<Card flipped={true} rotate90Degree={true} />
						</Box>
					);
				}
			}
		} else {
			if (!cardSuit || (!cardPosition && cardPosition !== 0)) {
				return;
			}
			for (let i = 0; i <= rowLength; i++) {
				if (i === cardPosition) {
					cardsInRow.push(
						<Box flex="1 1 0px" mr="1.5%">
							<Card suit={cardSuit} value={"1"} rotate90Degree={true} />
						</Box>
					);
				} else {
					cardsInRow.push(<Box flex="1 1 0px" mr="1.5%"></Box>);
				}
			}
		}

		return cardsInRow;
	};

	const SPACE_BETWEEN_ROWS = "24px";

	return (
		<Box>
			<Box mt={16} maxWidth="1600px">
				<Flex mb={SPACE_BETWEEN_ROWS}>{renderTemp(props.gameData.positionRequiredForWin, "header")}</Flex>
				<Flex mb={SPACE_BETWEEN_ROWS}>
					{renderTemp(props.gameData.positionRequiredForWin, "body", "hearts", props.gameData.cardPositions.hearts)}
				</Flex>
				<Flex mb={SPACE_BETWEEN_ROWS}>
					{renderTemp(props.gameData.positionRequiredForWin, "body", "spades", props.gameData.cardPositions.spades)}
				</Flex>
				<Flex mb={SPACE_BETWEEN_ROWS}>
					{renderTemp(props.gameData.positionRequiredForWin, "body", "diamonds", props.gameData.cardPositions.diamonds)}
				</Flex>
				<Flex>
					{renderTemp(props.gameData.positionRequiredForWin, "body", "clubs", props.gameData.cardPositions.clubs)}
				</Flex>
			</Box>
			<Box>
				<Flex mt="24px">
					<Card flipped={true} />
					{props.gameData.lastDrawnCard && (
						<Card suit={props.gameData.lastDrawnCard.suit} value={props.gameData.lastDrawnCard.value} />
					)}
				</Flex>
			</Box>
			<Box>
				{props.allPlayersReady && props.myselfGameMaster && <Button onClick={props.drawCard}>Draw Card</Button>}
				{props.gameData.gameState === "finished" && <Button onClick={props.startNewGame}>Start New Game</Button>}
			</Box>
		</Box>
	);
};
