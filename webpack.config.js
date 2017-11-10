const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './src/app.ts',
	output: {
		path: __dirname + '/dist',
		filename: 'app.js'
	},
	devServer: {
		contentBase: "./dist",
		historyApiFallback: true,
		inline: true
	},
	module: {
		loaders: [{
			test: /\.ts$/,
			loader: 'ts-loader'
		}]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + "/src/index.html"
		}),
		new CopyWebpackPlugin([{
			from: __dirname + '/static'
		}])
	],
}