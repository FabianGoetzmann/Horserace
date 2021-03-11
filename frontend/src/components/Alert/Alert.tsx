import React from "react";
import PropTypes from "prop-types";
import { Alert as ChakraAlert, AlertIcon, Box, AlertTitle, AlertDescription } from "@chakra-ui/react";

type AlertTypes = "error" | "success" | "info" | "warning";

const ALERT_STATUSES: AlertTypes[] = ["error", "success", "warning", "info"];

export interface IAlertComponentProps {
	title: string;
	description?: string;
	status: AlertTypes;
}

const Alert = (props: IAlertComponentProps) => {
	const { title, description, status = "error" } = props;

	if (!ALERT_STATUSES.includes(status)) {
		return null;
	}

	return (
		<ChakraAlert mb="4" status={status}>
			<AlertIcon />
			{description ? (
				<Box flex="1">
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription display="block">{description}</AlertDescription>
				</Box>
			) : (
				<Box>{title}</Box>
			)}
		</ChakraAlert>
	);
};

Alert.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	status: PropTypes.oneOf(ALERT_STATUSES),
};

export default Alert;
