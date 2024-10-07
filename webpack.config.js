import webpack from "webpack";
import path from "path";

const { BannerPlugin } = webpack;

export default {
	entry: "./index.js", // Point to your entry file
	output: {
		filename: "bundle.mjs", // Use .mjs for ESM compatibility
		path: path.resolve("dist"), // Output directory
		clean: true, // Clean the output folder before build
		libraryTarget: "module", // Ensure ESM output
		chunkFormat: "commonjs", // Explicitly set chunk format for Node.js
	},
	target: "node", // Ensure Webpack targets Node.js
	experiments: {
		outputModule: true, // Enable ESM output module
	},
	resolve: {
		extensions: [".js"],
	},
	module: {
		rules: [
			{
				test: /\.js$/, // Transpile JS files
				exclude: /node_modules/,
				use: {
					loader: "babel-loader", // Use Babel for transpiling
					options: {
						presets: ["@babel/preset-env"], // Babel preset for modern JS
					},
				},
			},
		],
	},
	mode: "production", // Set mode to production
	plugins: [
		// Add BannerPlugin to include the shebang
		new BannerPlugin({
			banner: "#!/usr/bin/env node",
			raw: true, // Ensure the shebang is not commented out
		}),
	],
};
