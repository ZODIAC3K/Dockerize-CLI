// import figlet from "figlet";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Get the current module's directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Construct the path to the font file
// const fontPath = path.join(__dirname, "standard.flf");

// // Read the font file
// let font;
// try {
// 	font = fs.readFileSync(fontPath, "utf8"); // Read the font file
// } catch (error) {
// 	console.error("Error reading the font file:", error.message);
// 	process.exit(1); // Exit if the font file is not found
// }

// // Register the custom font
// figlet.parseFont("customStandard", font);

// // Generate the heading using the loaded font
// let heading = figlet.textSync("Dockerize-CLI", {
// 	font: "customStandard", // Use the registered custom font
// 	horizontalLayout: "fitted",
// 	verticalLayout: "fitted",
// 	width: 80,
// 	whitespaceBreak: true,
// });

import chalk from "chalk";

let heading = chalk.cyan("Dockerize-CLI");

export { heading };
