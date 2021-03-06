import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('liml.start', () => {
			const editor = vscode.window.visibleTextEditors[0];
			const wp = new WebviewPanel(context.extensionPath, editor);
		})
	);
}

class WebviewPanel {
	private _extPath: string;
	private _panel: vscode.WebviewPanel;
	private _editor: vscode.TextEditor;

	constructor(extPath: string, editor: vscode.TextEditor) {
		this._extPath = extPath;
		this._editor = editor;
		this._panel = vscode.window.createWebviewPanel(
			'liml',
			'LIML editor',
			vscode.ViewColumn.Beside,
			{ enableScripts: true }
		);
		
		this._panel.webview.html = getWebviewContent(this._extPath);
		this._panel.webview.postMessage({
			command: 'liml',
			data: vscode.workspace.textDocuments[0].getText()
		});
		this._panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case "liml":
					console.log('get message from webview: ' + message.data)
					let textDocument =  vscode.workspace.textDocuments[0];
					let invalidRange = new vscode.Range(0, 0, textDocument!.lineCount, 0);
					let fullRange = textDocument!.validateRange(invalidRange);
					this._editor.edit(edit => edit.replace(fullRange, message.data));
					return;
			}
		}, null);
	}
}

function getWebviewContent(extPath: string) {
	const scriptPathOnDisk = vscode.Uri.file(path.join(extPath, 'dist', 'bundle.js'));
	console.log(scriptPathOnDisk);
	const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LIML Editor</title>
</head>
<body>
	<script>
	const vscode = acquireVsCodeApi();
	</script>
	<div id="root"></div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
}