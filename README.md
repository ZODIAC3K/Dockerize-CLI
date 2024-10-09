# Dockerize-CLI

**Dockerize-CLI** is a versatile command-line tool designed to simplify the setup of Dockerized applications for frontend, backend, or full-stack development. It automates the generation of `Dockerfiles`, `docker-compose.yml`, and environment configurations, saving developers time and effort while ensuring a smooth and reproducible development workflow.

## Installation

You can install Dockerize-CLI globally using either `npm` or `pnpm`:

### Using npm
```bash
npm install -g @zodiac3k/dockerize-cli
```

### Using pnpm
```bash
pnpm install -g @zodiac3k/dockerize-cli
```

## Usage

After installation, you can run the CLI tool using the following command:

```bash
dct
```

Alternatively, you can use `npm` or `pnpm` to invoke it:

```bash
npm dct
```

or

```bash
pnpm dct
```

## Features

Dockerize-CLI provides options to quickly scaffold your project and choose the relevant technologies. Here's an overview of the available options:

- **Frontend**: 
    - Technology: React (supports TypeScript, CommonJS, or ES Modules)
- **Backend**: 
    - Technology: Node.js (supports TypeScript, CommonJS, or ES Modules)
- **Database**:
    - Supported Databases: PostgreSQL, MongoDB, MySQL, Redis
    - Database GUIs:
        - PgAdmin4 (RDBMS)
        - Adminer (RDBMS)
        - DBeaver (RDBMS)
        - RedisInsight (NoSQL)
        - No GUI
- **Full Stack**: *Work in progress*

### Example Workflow

1. Run `dct` to start the interactive prompt.
2. Choose whether you want to set up a **frontend**, **backend**, **database**, or **full stack** project.
3. Give your project a name and select the desired technologies.
4. The tool will set up the project and ask if you'd like to Dockerize it.
5. If you are creating a JavaScript/Node.js application, you can also opt for TypeScript support.

This makes it easy to get started with a Dockerized environment for quick and efficient development.

## Full Stack Support

Full-stack support is currently a work in progress. Stay tuned for updates.

## Why Dockerize-CLI?

Dockerize-CLI is a quick and easy way to scaffold projects that are fully Dockerized. It sets up a working development environment with Docker support, which streamlines the process of spinning up containers and sharing your environment with teammates.

## Contributing

If you have suggestions or feature requests, feel free to let me know! This project is open-source, and contributions are always welcome. If you'd like to contribute, you can find the GitHub repository here:

[GitHub Repo](#[Dockerize-CLI](https://github.com/ZODIAC3K/Dockerize-CLI.git))

## License

This project is licensed under ISC.

---

Feel free to reach out with any feedback or ideas, and thank you for using Dockerize-CLI!