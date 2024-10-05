#!/usr/bin/env node

import { spawn } from "child_process";

import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";

import { heading } from "./src/ui/heading.js";
import { checkIfPnpmExists } from "./src/misc/checkIfPnpmExists.js";
import {
	frontend_questions,
	menu_questions,
	backend_questions,
	database_questions,
	fullstack_questions,
} from "./src/menu/menu_prompts.js";
import {
	updateDevScripForReact,
	setupDockerForReact,
	setupDockerComposeForReact,
	createReactApp,
} from "./src/docker/frontend/react/data.js";

import { createDatabaseDockerCompose } from "./src/docker/database/data.js";

import { createExpressApp } from "./src/docker/backend/node/data.js";

console.log(heading);

const packageManager = checkIfPnpmExists() ? "pnpm" : "npm"; // Check if pnpm is installed and use it else use npm

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

		const template = use_typescript ? "react-ts" : "react"; // Use TypeScript template if user chose to use TypeScript else use React template

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

		console.log(`Using ${packageManager}`);
		const createApp = spawn(packageManager, createAppCommand, {
			stdio: "inherit",
		});

		createApp.on("close", (code) => {
			if (code === 0) {
				if (use_docker) {
					// setupDockerForReact(project_name);
					// setupDockerComposeForReact(project_name);
					// updateDevScripForReact(project_name); // Update the dev script in package.json to use Vite --host. This is required for Docker
					createReactApp(project_name);
				}
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
				console.log("WILL ADD SUPPORT SOON FOR VUE");
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
				console.log("WILL ADD SUPPORT SOON FOR ANGULAR");
			} else {
				console.error(
					`Error: Angular project creation failed with code ${code}`
				);
			}
		});
	}
}

async function createBackendProject() {
	const {
		project_name,
		backend_framework,
		use_docker,
		use_typescript,
		js_type_module,
	} = await inquirer.prompt(backend_questions);
	if (project_name == "" || project_name == ".") {
		console.log("Project Name Cannot be empty or .");
		console.log("Exiting...");
		process.exit(0);
	}
	console.log(`Creating ${backend_framework} project...`);

	// Step 1: Install the selected framework
	if (backend_framework === "Express") {
		createExpressApp(
			project_name,
			js_type_module,
			use_docker,
			use_typescript
		);
	} else if (backend_framework === "Fastify") {
		const createFastifyApp = spawn(
			"npx",
			["fastify-cli", "generate", project_name],
			{
				stdio: "inherit",
			}
		);

		createFastifyApp.on("close", (code) => {
			if (code === 0) {
				console.log("WILL ADD SUPPORT SOON FOR FASTIFY");
			} else {
				console.error(
					`Error: Fastify project creation failed with code ${code}`
				);
			}
		});
	} else if (backend_framework === "NestJS") {
		const createNestJSApp = spawn(
			"npx",
			["@nestjs/cli", "new", project_name],
			{
				stdio: "inherit",
			}
		);

		createNestJSApp.on("close", (code) => {
			if (code === 0) {
				console.log("WILL ADD SUPPORT SOON FOR NESTJS");
			} else {
				console.error(
					`Error: NestJS project creation failed with code ${code}`
				);
			}
		});
	}
}

const user_selection_menu = async () => {
	const { action } = await inquirer.prompt(menu_questions);
	if (action == "Create a Frontend Project") {
		createFrontendProject();
	} else if (action == "Create a Backend Project") {
		createBackendProject();
	} else if (action == "Create a Database") {
		const { project_name, database_name, database_gui } =
			await inquirer.prompt(database_questions);
		if (project_name == "" || project_name == ".") {
			console.log("Project Name Cannot be empty or .");
			console.log("Exiting...");
			process.exit(0);
		}

		if (database_gui == "No GUI") {
			console.log("Creating Database without GUI");
		}
		createDatabaseDockerCompose(project_name, database_name, database_gui);
	} else if (action == "Create a Fullstack Project") {
		const {
			project_name,
			stack_name,
			use_redis,
			use_typescript,
			use_docker,
		} = await inquirer.prompt(fullstack_questions);

		if (project_name == "" || project_name == ".") {
			console.log("Project Name Cannot be empty or .");
			console.log("Exiting...");
			process.exit(0);
		}

		if (stack_name == "MERN") {
			console.log("MERN Stack Project Created");
		} else if (stack_name == "NEXT") {
			console.log("NEXT Stack Project Created");
		} else {
			console.log("CUSTOM Stack Project Created");
		}
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
