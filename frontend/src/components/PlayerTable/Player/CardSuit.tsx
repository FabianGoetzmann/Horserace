import { Box } from "@chakra-ui/react";
import { CardSuit as ICardSuit } from "interface/CardSuit";
import React from "react";

interface ICardSuitProps {
	suit: ICardSuit;
	showSuitName?: boolean;
}

const CardSuit = (props: ICardSuitProps) => {
	const generateSuit = () => {
		switch (props.suit) {
			case "hearts":
				return <Box color="red">♥</Box>;
			case "clubs":
				return <Box>♣</Box>;
			case "diamonds":
				return <Box color="red">♦</Box>;
			case "spades": //
				return <Box>♠</Box>;
			default:
				return null;
		}
	};

	return <Box fontSize="24px">{generateSuit()}</Box>;
};

export default CardSuit;
