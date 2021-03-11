import { Box, Table, TableCaption, Tbody, Td, Tfoot, Th, Thead, Tr, Text, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { IPlayerInfo } from "../../interface/IPlayerInfo";
import Player from "./Player/Player";
import PlayerNew, { IInteractibeTableRow } from "./Player/PlayerNew";

interface Props extends IInteractibeTableRow {
	players: IPlayerInfo[];
}

function PlayerTable(props: Props): ReactElement {
	return (
		<Box mt={7}>
			<Heading as="h4">Players</Heading>
			<Table variant="simple" colorScheme="linkedin">
				<Thead>
					<Tr>
						<Th></Th>
						<Th>Name</Th>
						<Th>Bet</Th>
						<Th>Ready</Th>
						{props.myself.gamemaster && <Th>Ban</Th>}
						{/* <Th>Repeat</Th> */}
					</Tr>
				</Thead>
				<Tbody>
					{props.players.map((player) => {
						if (!player.isInGame) {
							console.log("BOI NICHT IN GAME");
							return null;
						}

						return (
							<PlayerNew
								key={player.name}
								{...player}
								changeReadyState={props.changeReadyState}
								myBet={props.myBet}
								setBet={props.setBet}
								myReady={props.myReady}
								kickPlayer={props.kickPlayer}
								assignGameMaster={props.assignGameMaster}
								myself={props.myself}
								mySuit={props.mySuit}
								setMySuit={props.setMySuit}
								disableReadyCheck={props.disableReadyCheck}
							/>
						);
					})}
				</Tbody>
				<Tfoot>
					<Tr>
						<Th>Players: {props.players.length}</Th>
						<Th></Th>
						<Th></Th>
					</Tr>
				</Tfoot>
			</Table>

			{/* {props.players
				.filter((p) => !p.isInGame)
				.map((player) => {
					return <Box>Warteliste: {player.name}</Box>;
				})} */}
		</Box>
	);
}

export default PlayerTable;
