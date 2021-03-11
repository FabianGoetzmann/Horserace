import axios from "axios";

interface CreateGameResponse {
	gameId: string;
}

console.log(process.env.NODE_ENV, process.env.BACKEND_IP);

const buildBaseURL = () => {
	if (process.env.NODE_ENV === "production") {
		// TODO
		return "http://46.101.149.241/";
	} else {
		// Development
		return "http://localhost:5000";
	}
};

export const API = axios.create({
	baseURL: buildBaseURL(),
});

export default {
	createNewGame: () => API.post<CreateGameResponse>("/game"),
	devGame: () => API.get("updateGame"),
};
