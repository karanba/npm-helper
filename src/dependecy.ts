import * as vscode from 'vscode';
import * as path from 'path';

export class Dependency extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        return `${this.label}-${this.version}`;
    }

    get description(): string {
        return this.version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources/svg/', 'light', 'folder.svg'),
        dark: path.join(__filename, '..', '..', 'resources/svg/', 'dark', 'folder.svg')
    };

    contextValue = 'dependency';
}