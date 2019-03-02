'use strict';

import * as vscode from 'vscode';
import { DependencyNodeProvider } from './dependecyNodeProvider';

const checkRestore = () => {
	//var packageJson = require('./package.json');
	//console.log(packageJson),
}

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
	const dependencyNodeProvider = new DependencyNodeProvider();
	vscode.window.registerTreeDataProvider('dependencies', dependencyNodeProvider);


	let checkRestoreDisposable = vscode.commands.registerCommand('extension.checkRestore', (uri) => {
		checkRestore();
	});

	context.subscriptions.push(checkRestoreDisposable);
}



export function deactivate() { 

}
