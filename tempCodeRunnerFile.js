setupDockerForReact(project_name);
					setupDockerComposeForReact(project_name);
					updateDevScripForReact(project_name); // Update the dev script in package.json to use Vite --host. This is required for Docker