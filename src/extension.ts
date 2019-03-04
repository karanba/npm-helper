'use strict';

import * as vscode from 'vscode';
import { DependencyNodeProvider } from './dependecyNodeProvider';
import * as commandManager from './commandManager';
import { Dependency } from './dependecy';

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

	let goToHomeDisposal =
		vscode.commands.registerCommand('dependencies.goToHome',
			(item: Dependency) => {
				commandManager.runCommand(`npm home ${item.label}`);
			});

	let checkRestoreDisposable = vscode.commands.registerCommand('dependencies.checkRestore', (uri) => {
		checkRestore();
	});
	context.subscriptions.push(checkRestoreDisposable);
}

export function deactivate() { }
