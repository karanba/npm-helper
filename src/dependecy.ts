import * as vscode from 'vscode';
import * as path from 'path';

export class Dependency extends vscode.TreeItem {
    private _folderName: string = '';

    constructor(
        public readonly label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public isExist: boolean,
        public isSatisfied: boolean,
        public isDev: boolean,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.contextValue = 'module';
    }

    get tooltip(): string {
        if (this.isSatisfied && this.isExist) {
            return `${this.label}-${this.version}`;
        } else if (!this.isExist) {
            return `${this.label}-${this.version} - missing module!`;
        } else {
            return `${this.label}-${this.version} - module version not satisfied!`;

        }

    }

    get description(): string {
        return this.version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources/svg/',
            this.isExist && this.isSatisfied ? 'folder-ok.svg' :
                !this.isExist ? 'folder-mising.svg' : 'folder-empty.svg'),

        dark: path.join(__filename, '..', '..', 'resources/svg/',
            this.isExist && this.isSatisfied ? 'folder-ok.svg' :
                !this.isExist ? 'folder-mising.svg' : 'folder-empty.svg')
    };

    contextValue = 'dependency';
}