console.log("Client-side code running");

const button = document.getElementById("myButton");
button.addEventListener("click", function (e) {
	const Http = new XMLHttpRequest();
	const url = "http://46.101.149.241:5000/updateGame";
	Http.open("GET", url);
	Http.send();
});
