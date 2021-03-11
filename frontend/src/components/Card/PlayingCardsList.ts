const PUBLIC_URL = process.env.PUBLIC_URL;

console.log(PUBLIC_URL);

type PlayingCardList = {
	[key: string]: string;
};

const PlayingCardsList: PlayingCardList = {};
const suits = ["c", "d", "h", "s"];
const faces = ["j", "q", "k"];

let addSuits = (i: any, PlayingCardsList: PlayingCardList) => {
	for (let suit of suits) {
		PlayingCardsList[i + suit] = require("./cardImages/png/" + i + suit + ".png").default;
		PlayingCardsList[i + suit + "_rotated"] = require("./cardImages/png/" + i + suit + "_rotated.png").default;
	}
};

for (let i = 1; i <= 10; i++) {
	addSuits(i, PlayingCardsList);
}

for (let face of faces) {
	addSuits(face, PlayingCardsList);
}

PlayingCardsList.flipped = require("./cardImages/png/flipped.png").default;
PlayingCardsList.flipped_rotated = require("./cardImages/png/flipped_rotated.png").default;

export default PlayingCardsList;
