import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url"; // Import for converting meta URL

// Define __dirname using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { BannerPlugin } = webpack;

export default {
	entry: "./index.js", // Entry point for the application
	output: {
		filename: "bundle.mjs", // Use .mjs for ESM compatibility
		path: path.resolve(__dirname, "dist"), // Output directory
		clean: true, // Clean the output folder before build
		libraryTarget: "module", // Ensure ESM output
		chunkFormat: "commonjs", // Explicitly set chunk format for Node.js
	},
	target: "node", // Ensure Webpack targets Node.js
	experiments: {
		outputModule: true, // Enable ESM output module
	},
	resolve: {
		extensions: [".js"], // Resolve JS files
	},
	module: {
		rules: [
			{
				test: /\.js$/, // Transpile JS files
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
	mode: "production", // Set mode to production for optimized builds
	plugins: [
		// Add BannerPlugin to include the shebang
		new BannerPlugin({
			banner: "#!/usr/bin/env node", // Shebang to indicate Node.js executable
			raw: true, // Ensure the shebang is not commented out
		}),
	],
};
