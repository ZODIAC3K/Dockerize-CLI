import { execSync } from "child_process";
function checkIfPnpmExists() {
	try {
		execSync("pnpm --version", { stdio: "ignore" });
		return true;
	} catch (err) {
		return false;
	}
}

export { checkIfPnpmExists };
