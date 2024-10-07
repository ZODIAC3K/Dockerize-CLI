import figlet from "figlet";
import { readFileSync } from "fs";

figlet.parseFont("standard", readFileSync("./src/fonts/standard.flf", "utf8"));

let heading = figlet.textSync("Dockerize-CLI", {
	font: "standard",
	horizontalLayout: "fitted",
	verticalLayout: "fitted",
	width: 80,
	whitespaceBreak: true,
});

export { heading };
