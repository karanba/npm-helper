'use strict';

import * as vscode from 'vscode';
import { DependencyNodeProvider } from './dependecyNodeProvider';

const checkRestore = () => {
	//var packageJson = require('./package.json');
	//console.log(packageJson),
}

export function activate(context: vscode.ExtensionContext) {
	const dependencyNodeProvider = new DependencyNodeProvider(vscode.workspace.rootPath);

	let dependencyNodeProviderDisposal =
		vscode.window.registerTreeDataProvider('dependencies',
			dependencyNodeProvider);
	context.subscriptions.push(dependencyNodeProviderDisposal);

	let refreshEntryDisposal =
		vscode.commands.registerCommand('dependencies.refreshEntry',
			() => { 
				dependencyNodeProvider.refresh(); 
			});
	context.subscriptions.push(refreshEntryDisposal);

	let checkRestoreDisposable = vscode.commands.registerCommand('dependencies.checkRestore', (uri) => {
		checkRestore();
	});
	context.subscriptions.push(checkRestoreDisposable);
}

export function deactivate() { }
