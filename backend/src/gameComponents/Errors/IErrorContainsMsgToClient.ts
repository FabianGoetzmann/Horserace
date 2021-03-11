export interface IErrorContainsMsgToClient extends Error {
	error: {
		title?: string;
		description: string;
	};
}
