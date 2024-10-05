import figlet from "figlet";

let heading = figlet.textSync("Dockerize-CLI", {
	font: "standard",
	horizontalLayout: "fitted",
	verticalLayout: "fitted",
	width: 80,
	whitespaceBreak: true,
});

export { heading };
