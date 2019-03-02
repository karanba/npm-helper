import * as vscode from 'vscode';
import * as path from 'path';
import { Dependency } from './dependecy';

export class DependencyNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;
    
    constructor(){

    }

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: any): vscode.ProviderResult<Dependency[]> {
        const childs = new Array<Dependency>();
        childs.push(new Dependency('Test', '1', vscode.TreeItemCollapsibleState.Collapsed));
        return Promise.resolve(childs);
    }
}