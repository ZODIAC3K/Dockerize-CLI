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

const menu_questions = [
	{
		type: "list",
		name: "action",
		message: "What would you like to do?",
		choices: [
			"Create a Frontend Project",
			"Create a Backend Project",
			"Create a Database",
			"Create a Fullstack Project",
			"Exit",
		],
	},
];

const backend_questions = [
	{
		type: "input",
		name: "project_name",
		message: "Enter the project name",
	},
	{
		type: "list",
		name: "backend_framework",
		message: "Choose a backend framework",
		choices: ["Express", "Fastify", "NestJS"],
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
	{
		type: "confirm",
		name: "js_type_module",
		message: "Do you want to use a ES Modules?",
	},
];

const database_questions = [
	{
		type: "input",
		name: "project_name",
		message: "Enter the project name",
	},
	{
		type: "list",
		name: "database_name",
		message: "Choose a database",
		choices: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
	},
	{
		type: "list",
		name: "database_gui",
		message: "Choose a database GUI",
		choices: [
			"PgAdmin4 (RDBMS)",
			"Adminer (RDBMS)",
			"DBeaver (RDBMS)",
			"RedisInsight (NoSQL)",
			"No GUI",
		],
	},
];

const fullstack_questions = [
	{
		type: "input",
		name: "project_name",
		message: "Enter the project name",
	},
	{
		type: "list",
		name: "stack_name",
		message: "Choose a STACK",
		choices: ["MERN", "NEXT", "CUSTOM"],
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
	{
		type: "confirm",
		name: "use_redis",
		message: "Do you want to use Redis?",
	},
];

export {
	frontend_questions,
	menu_questions,
	backend_questions,
	database_questions,
	fullstack_questions,
};
