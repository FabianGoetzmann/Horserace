import { Box, Image } from "@chakra-ui/react";
import { ICard } from "interface/ICard";
import { ICardPositions } from "interface/IGameData";
import React, { useEffect, useRef, useState } from "react";
import PlayingCardsList from "./PlayingCardsList";
import test from "./cardImages/kd.svg";
import "./Card.css";

type ICardFlipped = {
	flipped: boolean;
};

interface Props {
	rotate90Degree?: boolean;
	maxSize?: string;
}

const Card = (props: Props & (ICard | ICardFlipped)) => {
	const getCardImage = () => {
		if ("flipped" in props) {
			return PlayingCardsList[`flipped${props.rotate90Degree ? "_rotated" : ""}`];
		} else {
			return PlayingCardsList[props.value + props.suit[0] + `${props.rotate90Degree ? "_rotated" : ""}`];
		}
	};

	const getStyle = () => {
		if ("flipped" in props) {
			return {
				maxHeight: "90px",
			};
		} else {
			return {
				maxHeight: "90px",
			};
		}
	};

	return (
		<>
			<Box display="block">
				<Image className="playing-card" src={getCardImage()} style={getStyle()} />
			</Box>
		</>
	);
};

export default Card;
