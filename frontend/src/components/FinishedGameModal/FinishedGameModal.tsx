import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Flex,
	Box,
	Table,
	Tbody,
	Th,
	Thead,
	Text,
	Tr,
	Td,
	HStack,
} from "@chakra-ui/react";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardSuit from "components/PlayerTable/Player/CardSuit";
import PlayerNew from "components/PlayerTable/Player/PlayerNew";
import { CardSuit as CardSuitType } from "interface/CardSuit";
import { IPlayerInfo } from "interface/IPlayerInfo";
import React from "react";

interface IFinishedGameModal {
	isOpen: boolean;
	playerWon: IPlayerInfo[];
	suitWinner: CardSuitType;
	myself: IPlayerInfo;
	startNewGame: any;
	[key: string]: any;
}
const FinishedGameModal = (props: IFinishedGameModal) => {
	console.log(props.playerWon);
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Modal isOpen={props.isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Flex flexDirection="row" alignItems="center">
						<Box mr="8px">Winner</Box>
						<CardSuit suit={props.suitWinner} />
					</Flex>
				</ModalHeader>
				<ModalBody>
					{props.playerWon.length > 0 ? (
						<>
							<Box mb={4}>The following players may redeem their bets:</Box>
							<Table variant="simple" colorScheme="linkedin">
								<Thead>
									<Tr>
										<Th>
											{props.gamemaster && (
												<Box>
													<FontAwesomeIcon icon={faCrown} />
												</Box>
											)}
										</Th>
										<Th>Name</Th>
										<Th>Bet</Th>
									</Tr>
								</Thead>
								<Tbody>
									{props.playerWon.map((player) => {
										return (
											<Tr key={player.id}>
												<Td></Td>
												<Td>{player.name}</Td>
												<Td>
													<HStack>
														<Box>{player.bet}</Box>
														<Box>on</Box>
														{player.bettedOnSuit && <CardSuit suit={player.bettedOnSuit} />}
													</HStack>
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						</>
					) : (
						<Flex direction="row" alignItems="center">
							Nobody has bet on the winer
						</Flex>
					)}
				</ModalBody>

				<ModalFooter>
					{props.myself.gamemaster ? (
						<Button colorScheme="blue" onClick={props.startNewGame}>
							Start New Game
						</Button>
					) : (
						<Box color="gray">Wait for the gamemaster to start a new game</Box>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default FinishedGameModal;
