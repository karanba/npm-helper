'use strict';
const vscode = require('vscode');



const checkRestore = () => {
	//var packageJson = require('./package.json');
	//console.log(packageJson),
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "NPM Helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let checkRestoreDisposable = vscode.commands.registerCommand('extension.checkRestore', (uri) => {
		checkRestore();
	});

	context.subscriptions.push(checkRestoreDisposable);
}


// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
