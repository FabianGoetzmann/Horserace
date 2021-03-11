import React from "react";
import { Box, Flex, Link, Text } from "@chakra-ui/react";

import { Link as ReachLink } from "react-router-dom";

export default class MainPage extends React.PureComponent {
	render() {
		return (
			<Flex w="100%" h="60px" px={5} py={4} justifyContent="space-between" alignItems="center" bg="#191e2b">
				<Flex flexDirection="row" justifyContent="center" alignItems="center">
					<Link as={ReachLink} to="/">
						<Text color="white" fontWeight="bold">
							HorseRace
						</Text>
					</Link>
				</Flex>
			</Flex>
		);
	}
}
