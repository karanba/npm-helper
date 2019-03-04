import * as vscode from 'vscode';

const getTerminal = () => {
	var activeTerminal = vscode.window.activeTerminal;
	if (activeTerminal) {
		return activeTerminal;
	}

	return vscode.window.createTerminal('thg');
};

export const runCommand = (command: string) => {

	var activeTerminal = getTerminal();
	if (activeTerminal) {		
		activeTerminal.sendText(command);
	} else {
		vscode.window.showInformationMessage("Could not get active terminal");
	}

};