import Alert from "components/Alert/Alert";
import React, { useState } from "react";

export interface IAlertProps {
	setAlert: React.Dispatch<React.SetStateAction<AlertContent | null>>;
}

interface AlertContent {
	message: string;
	title: string;
	status: "error";
}

const withAlert = <P extends IAlertProps>(WrappedComponent: React.ComponentType<P>): React.FunctionComponent<P> => {
	return (props) => {
		const [alert, setAlert] = useState<AlertContent | null>(null);
		// TODO: scroll to view
		// const myRef = useRef(null);

		const renderAlert = (alertObj: AlertContent | null) => {
			if (alertObj && alertObj.title && alertObj.message && alertObj.status) {
				console.log("RENDER ALERT");
				return <Alert title={alertObj.title} description={alertObj.message} status={alertObj.status} />;
			}
			return null;
		};

		return (
			<>
				{renderAlert(alert)}
				<WrappedComponent {...(props as any)} setAlert={setAlert} />
			</>
		);
	};
};

export default withAlert;
