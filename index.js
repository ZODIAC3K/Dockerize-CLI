#!/usr/bin/env node
import figlet from "figlet";
// import chalk from "chalk";
import { spawn } from "child_process";
import { execSync } from "child_process";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import { writeFile, readFile } from "fs/promises";
import path from "path";

let heading = figlet.textSync("Dockerize-CLI", {
	font: "standard",
	horizontalLayout: "fitted",
	verticalLayout: "fitted",
	width: 80,
	whitespaceBreak: true,
});

console.log(heading);

const menu_questions = [
	{
		type: "list",
		name: "action",
		message: "What would you like to do?",
		choices: [
			"Create a Frontend Project",
			"Create a Backend Project",
			"Create Both",
			"Exit",
		],
	},
];

function checkIfPnpmExists() {
	try {
		execSync("pnpm --version", { stdio: "ignore" });
		return true;
	} catch (err) {
		return false;
	}
}

const frontend_questions = [
	{
		type: "input",
		name: "project_name",
		message: "Enter the project name",
	},
	{
		type: "list",
		name: "frontend_framework",
		message: "Choose a frontend framework",
		choices: ["React", "Vue", "Angular"],
	},
	{
		type: "confirm",
		name: "use_typescript",
		message: "Do you want to use TypeScript?",
	},
	{
		type: "confirm",
		name: "use_docker",
		message: "Do you want to use Docker?",
	},
];

async function createFrontendProject() {
	const { project_name, frontend_framework, use_docker, use_typescript } =
		await inquirer.prompt(frontend_questions);
	if (project_name == "" || project_name == ".") {
		console.log("Project Name Cannot be empty or .");
		console.log("Exiting...");
		process.exit(0);
	}
	console.log(`Creating ${frontend_framework} project...`);

	// Step 1: Install the selected framework
	if (frontend_framework === "React") {
		console.log(`Creating React project with Vite...`);

		const packageManager = checkIfPnpmExists() ? "pnpm" : "npm";

		// Adjust template based on whether user wants TypeScript or not
		const template = use_typescript ? "react-ts" : "react";

		const createAppCommand =
			packageManager === "pnpm"
				? ["create", "vite", project_name, "--template", template]
				: [
						"create",
						"vite@latest",
						project_name,
						"--template",
						template,
				  ];

		console.log(`Using ${packageManager} to install React with Vite.`);
		const createApp = spawn(packageManager, createAppCommand, {
			stdio: "inherit",
		});

		createApp.on("close", (code) => {
			if (code === 0) {
				console.log(
					`React project created successfully with Vite using ${packageManager}!`
				);
				// Step 2: Set up Docker if user chose to
				if (use_docker) {
					setupDocker(project_name);
					setupDockerCompose(project_name);
				}
				updateDevScript(project_name); // Update the dev script to use Vite with host
			} else {
				console.error(
					`Error: React project creation failed with code ${code}`
				);
			}
		});
	} else if (frontend_framework === "Vue") {
		const createVueApp = spawn(
			"npm",
			["init", "vue@latest", project_name],
			{
				stdio: "inherit",
			}
		);

		createVueApp.on("close", (code) => {
			if (code === 0) {
				console.log("Vue project created successfully!");
			} else {
				console.error(
					`Error: Vue project creation failed with code ${code}`
				);
			}
		});
	} else if (frontend_framework === "Angular") {
		const createAngularApp = spawn(
			"npx",
			["@angular/cli", "new", project_name],
			{
				stdio: "inherit",
			}
		);

		createAngularApp.on("close", (code) => {
			if (code === 0) {
				console.log("Angular project created successfully!");
			} else {
				console.error(
					`Error: Angular project creation failed with code ${code}`
				);
			}
		});
	}
}

async function updateDevScript(project_name) {
	const packageJsonPath = path.join(project_name, "package.json");

	try {
		// Read the package.json file
		const data = await readFile(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(data);

		// Check if scripts and dev exist
		if (packageJson.scripts && packageJson.scripts.dev) {
			// Update the dev script
			packageJson.scripts.dev = "vite --host";

			// Write the updated package.json back to the file
			await writeFile(
				packageJsonPath,
				JSON.stringify(packageJson, null, 2)
			);
			console.log(
				`Updated dev script in ${packageJsonPath} to "vite --host"`
			);
		} else {
			console.error(
				"The scripts section or dev script does not exist in package.json"
			);
		}
	} catch (err) {
		console.error("Error updating package.json:", err);
	}
}

async function setupDocker(project_name) {
	console.log("Setting up Docker...");
	const dockerfileContent = `
# Set the base image for the React app (using Vite)
FROM node:20-alpine3.18

# Create a new user called 'app' and add it to the group 'app'
RUN addgroup app && adduser -S -G app app

# Set the app user as the user to run the app in the container
USER app

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Change user to root to give ownership of /app directory to 'app' user
USER root
RUN chown -R app:app /app
USER app

# Install dependencies
RUN npm install

# Copy the rest of the files to the working directory
COPY . .

# Expose port 5173 (Vite default port)
EXPOSE 5173

# Command to run the app with hot reload using Vite
CMD ["npm", "run", "dev"]
    `;

	const dockerignoreContent = `
node_modules
dist
    `;

	const projectPath = `./${project_name}`;

	try {
		// Write Dockerfile and .dockerignore
		await writeFile(`${projectPath}/Dockerfile`, dockerfileContent);
		await writeFile(`${projectPath}/.dockerignore`, dockerignoreContent);

		console.log("Docker setup complete.");
		console.log(
			`Run 'docker build -t ${project_name}-image .' in the ${project_name} directory.`
		);
		console.log(
			`Then run 'docker run -p 5173:5173 ${project_name}-image'.`
		);
	} catch (err) {
		console.error("Error during Docker setup:", err);
	}
}

async function setupDockerCompose(project_name) {
	console.log("Setting up Docker Compose...");

	// Define the content of docker-compose.dev.yml (development with hot reload)
	const dockerComposeDevContent = `
version: "3.8"

services:
  web:
    build: ./
    volumes:
      - ./:/app
      - node_modules_cached_frontend:/app/node_modules
    ports:
      - 5173:5173
    environment:
      VITE_API_URL: http://localhost:8000
    develop:
      watch:
        - path: ./package.json
          action: rebuild
        - path: ./package-lock.json
          action: rebuild
        - path: ./
          target: /app
          action: sync

volumes:
  node_modules_cached_frontend:
    `;

	// Define the content of docker-compose.yml (production)
	const dockerComposeProdContent = `
version: "3.8"

services:
  web:
    build: ./${project_name}
    ports:
      - 5173:5173
    environment:
      VITE_API_URL: http://localhost:8000
    volumes:
      - ./${project_name}/dist:/app
    `;

	const projectPath = `./${project_name}`;

	try {
		// Write both docker-compose files inside the project directory
		await writeFile(
			`${projectPath}/docker-compose.yml`,
			dockerComposeDevContent
		);
		await writeFile(
			`${projectPath}/docker-compose.prod.yml`,
			dockerComposeProdContent
		);

		console.log("Docker Compose setup complete.");
		console.log(
			`For development, run 'docker-compose up' in the ${project_name} directory.`
		);
		console.log(
			`For production, run 'docker-compose  -f docker-compose.prod.yml up' in the ${project_name} directory.`
		);
	} catch (err) {
		console.error("Error during Docker Compose setup:", err);
	}
}

const user_selection_menu = async () => {
	const { action } = await inquirer.prompt(menu_questions);
	if (action == "Create a Frontend Project") {
		createFrontendProject();
	} else if (action == "Create a Backend Project") {
		console.log("Backend Project Created");
	} else if (action == "Create Both") {
		console.log("Both Frontend and Backend Project Created");
	} else {
		let str = "Exiting...";
		const exit_text = chalkAnimation.karaoke(str);

		setTimeout(() => {
			exit_text.stop();
			process.exit(0);
		}, 1800);
	}
};
user_selection_menu();
