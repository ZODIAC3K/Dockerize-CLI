import { writeFile, readFile } from "fs/promises";
import path from "path";

async function createReactApp(project_name) {
	setupDockerForReact(project_name);
	setupDockerComposeForReact(project_name);
	updateDevScripForReact(project_name);
}

async function updateDevScripForReact(project_name) {
	const packageJsonPath = path.join(project_name, "package.json");

	try {
		const data = await readFile(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(data);

		if (packageJson.scripts && packageJson.scripts.dev) {
			packageJson.scripts.dev = "vite --host";

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

async function setupDockerForReact(project_name) {
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
		// Write/Create Dockerfile and .dockerignore
		await writeFile(`${projectPath}/Dockerfile`, dockerfileContent);
		await writeFile(`${projectPath}/.dockerignore`, dockerignoreContent);

		// console.log("DockerFile and .dockerignore Created.");
		// console.log(
		// 	`Run 'docker build -t ${project_name}-image .' in the ${project_name} directory.`
		// );
		// console.log(
		// 	`Then run 'docker run -p 5173:5173 ${project_name}-image'.`
		// );
	} catch (err) {
		console.error("Error during Docker setup:", err);
	}
}

async function setupDockerComposeForReact(project_name) {
	console.log("Setting up Docker Compose...");

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
      VITE_API_URL: http://localhost:5173
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

	const dockerComposeProdContent = `
version: "3.8"

services:
  web:
    build: ./${project_name}
    ports:
      - 5173:5173
    environment:
      VITE_API_URL: http://localhost:5173
    volumes:
      - ./${project_name}/dist:/app
    `;

	const projectPath = `./${project_name}`;

	try {
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

export {
	updateDevScripForReact,
	setupDockerForReact,
	setupDockerComposeForReact,
	createReactApp,
};
