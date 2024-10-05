import { writeFile, readFile } from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import fs from "fs";

// Function to create an Express app
async function createExpressApp(project_name, js_type_module, use_docker) {
	// Validate project name
	if (project_name === "" || project_name === ".") {
		console.log("Project Name cannot be empty or '.'");
		console.log("Exiting...");
		process.exit(0);
	}

	const projectDir = path.resolve(project_name);

	// Ensure the project directory exists
	if (!fs.existsSync(projectDir)) {
		fs.mkdirSync(projectDir, { recursive: true });
	}

	console.log(`Creating Express project in ${projectDir}...`);

	const createExpressApp = spawn("npm", ["init", "-y"], {
		stdio: "inherit",
		cwd: projectDir, // Create in the project directory
	});

	createExpressApp.on("close", async (code) => {
		if (code === 0) {
			console.log("Express project initialized successfully.");

			const packageJsonPath = path.join(projectDir, "package.json");

			try {
				// Read the package.json file
				const data = await readFile(packageJsonPath, "utf-8");
				const packageJson = JSON.parse(data);

				// Add "type": "module" if js_type_module is true
				if (js_type_module) {
					packageJson.type = "module";
				}

				// Write the updated package.json back to the file
				await writeFile(
					packageJsonPath,
					JSON.stringify(packageJson, null, 2)
				);
				console.log(
					`Updated package.json to include "type": "module".`
				);

				// Create index.js file with basic Express code
				const indexJsContent = `
import express from 'express';

const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`;

				await writeFile(
					path.join(projectDir, "index.js"),
					indexJsContent
				);
				console.log("Created index.js with basic Express code.");

				// Install Express
				const installExpress = spawn("npm", ["install", "express"], {
					stdio: "inherit",
					cwd: projectDir, // Install in the project directory
				});

				installExpress.on("close", async (installCode) => {
					if (installCode === 0) {
						console.log("Express installed successfully.");

						// Create Docker-related files if use_docker is true
						if (use_docker) {
							await createDockerFiles(projectDir);
						}
					} else {
						console.error(
							`Error: Express installation failed with code ${installCode}`
						);
					}
				});
			} catch (err) {
				console.error(
					"Error updating package.json or creating index.js:",
					err
				);
			}
		} else {
			console.error(
				`Error: Express project initialization failed with code ${code}`
			);
		}
	});
}

// Function to create Docker files
async function createDockerFiles(projectDir) {
	const dockerignoreContent = `
node_modules
dist
`;

	const dockerfileContent = `
# Set the base image for the Express app
FROM node:20-alpine3.18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files to the working directory
COPY . .

# Expose port 8000
EXPOSE 8000

# Command to run the app
CMD ["node", "index.js"]
`;

	const dockerComposeDevContent = `


services:
  web:
    build: ./
    ports:
      - 8000:8000
    volumes:
      - ./:/app
    environment:
      NODE_ENV: development
`;

	const dockerComposeProdContent = `


services:
  web:
    build: ./
    ports:
      - 8000:8000
    environment:
      NODE_ENV: production
`;

	try {
		// Function to write files if they do not exist
		const writeIfNotExists = async (filePath, content) => {
			if (!fs.existsSync(filePath)) {
				await writeFile(filePath, content);
				console.log(`Created ${filePath}`);
			} else {
				console.log(`${filePath} already exists. Skipping creation.`);
			}
		};

		// Write .dockerignore, Dockerfile, docker-compose.yml, and docker-compose.prod.yml
		await writeIfNotExists(
			path.join(projectDir, ".dockerignore"),
			dockerignoreContent
		);
		await writeIfNotExists(
			path.join(projectDir, "Dockerfile"),
			dockerfileContent
		);
		await writeIfNotExists(
			path.join(projectDir, "docker-compose.yml"),
			dockerComposeDevContent
		);
		await writeIfNotExists(
			path.join(projectDir, "docker-compose.prod.yml"),
			dockerComposeProdContent
		);

		console.log("Docker setup complete.");
	} catch (err) {
		console.error("Error during Docker setup:", err);
	}
}
export { createExpressApp };
