import io from "socket.io-client";
const URL = process.env.NODE_ENV === "production" ? "http://46.101.149.241:5000" : "http://localhost:5000/";
const socket: SocketIOClient.Socket = io(URL, { autoConnect: false });

export default socket;
