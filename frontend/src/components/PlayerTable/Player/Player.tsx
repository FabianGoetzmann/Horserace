import { Box, Center, Checkbox, Flex, NumberInput, NumberInputField, Image, HStack } from "@chakra-ui/react";
import { IPlayerInfo } from "interface/IPlayerInfo";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

interface IPlayerProps extends IPlayerInfo {
	changeReadyState(ready: boolean, newBet: number): void;
	myBet: number;
	setBet: React.Dispatch<React.SetStateAction<number>>;
	myReady: boolean;
}

const Player = (props: IPlayerProps) => {
	const [checkReadyDisabled, setCheckReadyDisabled] = useState(false);
	const [checkRepeatBet, setCheckRepeatBet] = useState(false);

	const changeReadyStateTimelock = (evt: React.ChangeEvent<HTMLInputElement>) => {
		if (checkReadyDisabled) {
			return;
		}
		setCheckReadyDisabled(true);
		props.changeReadyState(evt.target.checked, props.myBet);

		const LOCK_TIME = 500;
		setTimeout(() => setCheckReadyDisabled(false), LOCK_TIME);
	};

	const generateComponentsForSelf = () => {
		return (
			<Flex>
				<HStack spacing="24px">
					<Box>{props.myBet}</Box>
					<Box>
						<NumberInput
							defaultValue={props.myBet}
							max={100}
							precision={0}
							keepWithinRange={true}
							onChange={(valueString) => props.setBet(parseInt(valueString))}
						>
							<NumberInputField height="30px" width="80px" />
						</NumberInput>
					</Box>
					<Checkbox
						isChecked={props.myReady}
						colorScheme="green"
						disabled={checkReadyDisabled}
						onChange={(evt) => changeReadyStateTimelock(evt)}
					>
						Ready
					</Checkbox>

					<Checkbox
						isChecked={props.myReady}
						colorScheme="green"
						disabled={checkReadyDisabled}
						onChange={(evt) => changeReadyStateTimelock(evt)}
					>
						Repeat bet
					</Checkbox>
				</HStack>
			</Flex>
		);
	};

	return (
		<Flex border="1px solid black" height="46px" alignContent="center">
			<Center>
				{props.gamemaster && (
					<Box>
						<FontAwesomeIcon icon={faCrown} />
					</Box>
				)}

				<Box>{props.name}</Box>

				{props.self ? (
					<>{generateComponentsForSelf()}</>
				) : (
					<>
						<Box>{props.bet}</Box>
						<Box>
							<NumberInput defaultValue={props.bet}>
								<NumberInputField height="30px" width="80px" />
							</NumberInput>
						</Box>
						<Checkbox isChecked={props.ready} colorScheme="green"></Checkbox>
					</>
				)}
			</Center>
		</Flex>
	);
};

export default Player;
