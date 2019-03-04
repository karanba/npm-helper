import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as semver from 'semver';

import { Dependency } from './dependecy';

export class DependencyNodeProvider implements vscode.TreeDataProvider<Dependency> {

    private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;
    private _packages: ((key: any, value: any) => any) | undefined;
    private _packageJsonPath: string | undefined;
    private nonExistingModules = new Array<ModuleInfo>();
    private unSatisfiedModules = new Array<ModuleInfo>();
    private _dependecies: Dependency[] = new Array<Dependency>();

    constructor(private workspaceRoot: string | undefined) {
        if (!this.workspaceRoot) {
            return;
        }

        this._packageJsonPath = path.join(this.workspaceRoot, './package.json');
        if (this._packageJsonPath) {
            this._dependecies = this.getPackages(this._packageJsonPath);
        }
    }

    getPackages(packageJsonPath: string): Dependency[] {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return [];
        }

        this.nonExistingModules = new Array<ModuleInfo>();
        this.unSatisfiedModules = new Array<ModuleInfo>();


        if (this.pathExists(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

            const toDep = (moduleName: string, version: string, isDev: boolean): Dependency => {

                if (this.workspaceRoot && this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
                    var modulePackageJsonPath = path.join(this.workspaceRoot, 'node_modules', moduleName, 'package.json');
                    let isSatisfied = false;
                    if (this.pathExists(modulePackageJsonPath)) {
                        const modulePackageJson = JSON.parse(fs.readFileSync(modulePackageJsonPath, 'utf-8'));
                        if (modulePackageJson.version) {
                            const moduleVersion = modulePackageJson.version;
                            isSatisfied = semver.satisfies(moduleVersion, version);
                            if (!isSatisfied) {
                                this.nonExistingModules.push(new ModuleInfo(moduleName, version, isDev));
                            }
                        }
                    }

                    return new Dependency(moduleName, version,
                        vscode.TreeItemCollapsibleState.None,
                        true,
                        isSatisfied, isDev);
                } else {
                    this.unSatisfiedModules.push(new ModuleInfo(moduleName, version, isDev));

                    return new Dependency(
                        moduleName,
                        version,
                        vscode.TreeItemCollapsibleState.None,
                        false, false, isDev,
                        {
                            command: 'extension.openPackageOnNpm',
                            title: '',
                            arguments: [moduleName]
                        });
                }
            };

            const deps = packageJson.dependencies
                ? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep], false))
                : [];

            const devDeps = packageJson.devDependencies
                ? Object.keys(packageJson.devDependencies).map(dep => toDep(dep, packageJson.devDependencies[dep], true))
                : [];

            if (this.nonExistingModules.length > 0 || this.unSatisfiedModules.length > 0) {
                vscode.window.showErrorMessage('Some modules are missing or not has proper version! You could try \'npm install\'');
            }

            return deps.concat(devDeps);
        }

        return [];
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]> {
        if (element) {
            switch (element.label) {
                case 'All':
                    var normalDeps = new Dependency('Normal', '', vscode.TreeItemCollapsibleState.Expanded,
                        this.nonExistingModules.find(x => !x.isDev) === undefined,
                        this.unSatisfiedModules.find(x => !x.isDev) === undefined,
                        false);

                    var devDeps = new Dependency('Dev', '', vscode.TreeItemCollapsibleState.Expanded,
                        this.nonExistingModules.find(x => x.isDev) === undefined,
                        this.unSatisfiedModules.find(x => x.isDev) === undefined,
                        false);
                    return Promise.resolve([normalDeps, devDeps]);
                case 'Normal':
                    return Promise.resolve(this._dependecies.filter(x => !x.isDev));
                    break;
                case 'Dev':
                    return Promise.resolve(this._dependecies.filter(x => x.isDev));
                    break;
                default:
                    return undefined;
            }
        } else {
            var root = new Dependency('All', 'Dependecies', vscode.TreeItemCollapsibleState.Expanded,
                this.nonExistingModules.length < 1,
                this.unSatisfiedModules.length < 1,
                false);
            return Promise.resolve([root]);
        }
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }

        return true;
    }
}

class ModuleInfo {
    private _name: string;
    private _version: string;
    public isDev: boolean;

    constructor(name: string, version: string, isDev: boolean) {
        this._name = name;
        this._version = version;
        this.isDev = isDev;
    }

    getInfo() {
        return `${this._name}-${this._version}`;
    }

}