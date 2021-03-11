import {
	Box,
	Center,
	Checkbox,
	Flex,
	NumberInput,
	NumberInputField,
	Image,
	HStack,
	Tr,
	Td,
	Button,
	Select,
	Tooltip,
} from "@chakra-ui/react";
import { IPlayerInfo } from "interface/IPlayerInfo";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import CardSuit from "./CardSuit";

import "./Player.css";

export interface IInteractibeTableRow {
	changeReadyState(ready: boolean, newBet: number): void;
	myBet: number;
	setBet: React.Dispatch<React.SetStateAction<number>>;
	myReady: boolean;
	kickPlayer: any;
	assignGameMaster(playerId: string): any;
	myself: IPlayerInfo;

	mySuit: any;
	setMySuit: any;
	disableReadyCheck: boolean;
}

export interface IPlayerProps extends IPlayerInfo {}

const Player = (props: IPlayerProps & IInteractibeTableRow) => {
	const [checkReadyDisabled, setCheckReadyDisabled] = useState(false);
	const [checkRepeatBetDisabled, setCheckRepeatBetDisabled] = useState(false);

	const changeReadyStateTimelock = (evt: React.ChangeEvent<HTMLInputElement>) => {
		if (checkReadyDisabled) {
			return;
		}
		setCheckReadyDisabled(true);
		props.changeReadyState(evt.target.checked, props.myBet);

		const LOCK_TIME = 500;
		setTimeout(() => setCheckReadyDisabled(false), LOCK_TIME);
	};

	// const changeRepeatBetTimelock = (evt: React.ChangeEvent<HTMLInputElement>) => {
	// 	if (checkRepeatBetDisabled) {
	// 		return;
	// 	}
	// 	setCheckReadyDisabled(true);
	// 	props.changeReadyState(evt.target.checked, props.myBet);

	// 	const LOCK_TIME = 500;
	// 	setTimeout(() => setCheckReadyDisabled(false), LOCK_TIME);
	// };

	return (
		<Tr>
			<Td>
				{props.gamemaster && (
					<Box>
						<FontAwesomeIcon icon={faCrown} />
					</Box>
				)}
				{!props.gamemaster && props.myself.gamemaster && (
					<Tooltip label="Assign Admin">
						<Box onClick={() => props.assignGameMaster(props.id)}>
							<FontAwesomeIcon icon={faCrown} className="assign-gamemaster" />
						</Box>
					</Tooltip>
				)}
			</Td>
			<Td>
				<Box>{props.name}</Box>
			</Td>
			<Td>
				{props.self ? (
					<>
						<HStack spacing="10px">
							<NumberInput
								defaultValue={props.myBet}
								max={100}
								precision={0}
								isDisabled={props.myReady || props.disableReadyCheck}
								keepWithinRange={true}
								onChange={(valueString) => props.setBet(parseInt(valueString))}
							>
								<NumberInputField width="70px" />
							</NumberInput>
							<Box>on</Box>
							<Select
								defaultValue={"hearts"}
								width="90px"
								fontSize="24px"
								isDisabled={props.myReady || props.disableReadyCheck}
								color={props.mySuit === "diamonds" || props.mySuit === "hearts" ? "red" : "black"}
								onChange={(evt) => props.setMySuit(evt.target.value)}
							>
								<option style={{ color: "red" }} value="hearts">
									♥
								</option>
								<option style={{ color: "black" }} value="spades">
									♠
								</option>
								<option style={{ color: "red" }} value="diamonds">
									♦
								</option>
								<option style={{ color: "black" }} value="clubs">
									♣
								</option>
							</Select>
						</HStack>
					</>
				) : (
					<>
						{props.ready && props.bettedOnSuit && (
							<HStack>
								<Box>{props.bet}</Box>
								<Box>on</Box>
								<CardSuit suit={props.bettedOnSuit} />
							</HStack>
						)}
					</>
				)}
			</Td>
			<Td>
				<Box ml="5px">
					{props.self ? (
						<Checkbox
							isChecked={props.myReady}
							colorScheme="green"
							isDisabled={checkReadyDisabled || props.disableReadyCheck}
							onChange={(evt) => changeReadyStateTimelock(evt)}
						></Checkbox>
					) : (
						<Checkbox
							isChecked={props.ready}
							isReadOnly={true}
							isFocusable={false}
							isDisabled={true}
							colorScheme="green"
							onChange={(evt) => changeReadyStateTimelock(evt)}
						></Checkbox>
					)}
				</Box>
			</Td>
			{props.myself.gamemaster && (
				<Td>{props.id !== props.myself.id && <Button onClick={() => props.kickPlayer(props.id)}>Kick</Button>}</Td>
			)}
			{/* <Td>Repeat</Td> */}
		</Tr>
	);
};

export default Player;
