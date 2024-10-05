import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// Function to create docker-compose.yml for database and GUI
async function createDatabaseDockerCompose(
	project_name,
	database_name,
	database_gui
) {
	const projectDir = path.resolve(project_name);

	// Ensure the project directory exists
	if (!fs.existsSync(projectDir)) {
		fs.mkdirSync(projectDir, { recursive: true });
	}

	const dbConfigs = {
		MongoDB: `
  ${project_name}:
    image: mongo:latest
    container_name: ${project_name}
    ports:
      - "27017:27017"
    volumes:
      - ./data/db:/data/db
`,
		PostgreSQL: `
  ${project_name}:
    image: postgres:latest
    container_name: ${project_name}
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${project_name}
    ports:
      - "5432:5432"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
`,
		MySQL: `
  ${project_name}:
    image: mysql:latest
    container_name: ${project_name}
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: ${project_name}
    ports:
      - "3306:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql
`,
		Redis: `
  ${project_name}:
    image: redis:latest
    container_name: ${project_name}
    ports:
      - "6379:6379"
    volumes:
      - ./data/redis:/data
`,
	};

	const guiConfigs = {
		"PgAdmin4 (RDBMS)": `
  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    depends_on:
      - ${project_name}
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: password
    ports:
      - "5050:80"
`,
		"Adminer (RDBMS)": `
  adminer:
    image: adminer
    container_name: adminer
    depends_on:
      - ${project_name}
    ports:
      - "8080:8080"
`,
		"RedisInsight (NoSQL)": `
  redisinsight:
    image: redislabs/redisinsight:latest
    container_name: redisinsight
    depends_on:
      - ${project_name}
    ports:
      - "8001:8001"
`,
		"DBeaver (RDBMS)": `
  dbeaver:
    image: dbeaver/cloudbeaver:latest
    container_name: dbeaver
    depends_on:
      - ${project_name}
    ports:
      - "8081:8080"
`,
		"No GUI": "",
	};

	// Combine database and GUI configurations
	const dbConfig = dbConfigs[database_name];
	const guiConfig = guiConfigs[database_gui];

	if (!dbConfig) {
		console.error(`Unsupported database: ${database_name}`);
		return;
	}

	if (!guiConfig && database_gui !== "No GUI") {
		console.error(`Unsupported GUI: ${database_gui}`);
		return;
	}

	// Compose the docker-compose.yml content
	const dockerComposeContent = `
version: "3.8"

services:${dbConfig}${guiConfig}
`;

	try {
		// Write the docker-compose.yml file
		await writeFile(
			path.join(projectDir, "docker-compose.yml"),
			dockerComposeContent.trim()
		);
		console.log("Docker Compose file created successfully.");

		// Build credentials data to save
		let credentials = `===============================
Database: ${database_name}
DB Name or Container Name or HOST Name/Address: ${project_name}
Port: ${
			database_name === "PostgreSQL"
				? "5432"
				: database_name === "MySQL"
				? "3306"
				: "27017"
		}
`;

		switch (database_name) {
			case "PostgreSQL":
				credentials += `Username: user
Password: password
===============================\n`;
				break;
			case "MySQL":
				credentials += `Username: root
Password: password
===============================\n`;
				break;
			case "MongoDB":
				credentials += `No username/password needed for development.\n===============================\n`;
				break;
			case "Redis":
				credentials += `No username/password needed for development.\n===============================\n`;
				break;
			default:
				console.log("Unsupported database.");
		}

		// Add GUI details if applicable
		if (database_gui !== "No GUI") {
			credentials += `GUI: ${database_gui}
`;

			switch (database_gui) {
				case "PgAdmin4 (RDBMS)":
					credentials += `URL: http://localhost:5050
Username: admin@admin.com
Password: password
===============================\n`;
					break;
				case "Adminer (RDBMS)":
					credentials += `URL: http://localhost:8080
===============================\n`;
					break;
				case "MongoDB Compass (NoSQL)":
					credentials += `Connection to MongoDB at localhost:27017
===============================\n`;
					break;
				case "RedisInsight (NoSQL)":
					credentials += `URL: http://localhost:8001
===============================\n`;
					break;
				case "DBeaver (RDBMS)":
					credentials += `URL: http://localhost:8081
===============================\n`;
					break;
			}
		}

		// Save the credentials to credential_db.txt
		const credentialFilePath = path.join(projectDir, "credential_db.txt");
		console.log(credentials);
		await writeFile(credentialFilePath, credentials);
		console.log(`Credentials saved to ${credentialFilePath}`);
	} catch (err) {
		console.error("Error writing Docker Compose or credentials file:", err);
	}
}

export { createDatabaseDockerCompose };
