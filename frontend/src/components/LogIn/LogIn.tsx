import { Box, Button, Flex, Heading, Input, useToast } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
// import React, { useState } from "react";
import socket from "../../socket";

const DEFAULT_PLAYER_NAME = process.env.NODE_ENV === "production" ? "" : `Player ${Math.floor(Math.random() * 20)}`;

interface ILogInProps {
	gameId: string;
	joinedLobby: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn = (props: ILogInProps) => {
	const [userName, setUserName] = useState(DEFAULT_PLAYER_NAME);

	const toast = useToast();
	const toastIdRef = React.useRef<string | number>();

	const joinGame = () => {
		// Reset errer if exists
		if (toastIdRef.current) {
			toast.close(toastIdRef.current);
		}

		const gameId = props.gameId;
		console.log(socket);
		socket.emit("joinGame", { userName, gameLobbyName: gameId }, (err: any, done: any) => {
			if (err) {
				toastIdRef.current = toast({
					title: err.title,
					description: err.description,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			} else if (done) {
				props.joinedLobby(true);
			}
		});
	};

	return (
		<Flex direction="column" alignItems="center">
			<Heading size="lg" mb="8px">
				Provide a Username
			</Heading>
			<Box maxWidth="200px">
				<Input
					height="60px"
					placeholder="Username"
					mb="8px"
					maxLength={16}
					value={userName}
					onChange={(evt) => setUserName(evt.target.value)}
				/>
				<Button textTransform="uppercase" width="100%" height="60px" background="green.300" onClick={joinGame}>
					Join
				</Button>
			</Box>
		</Flex>
	);
};

export default LogIn;
