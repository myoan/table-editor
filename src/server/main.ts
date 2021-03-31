import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let wp: WebviewPanel;
	context.subscriptions.push(
		vscode.commands.registerCommand('liml.start', () => {
			const editor = vscode.window.visibleTextEditors[0];
			wp = new WebviewPanel(context.extensionPath, editor);
		})
	);

	vscode.workspace.onDidChangeTextDocument(editor => {
			if (editor === undefined) {
				return;
			}
			if (editor.document.languageId !== "yaml") {
				return;
			}
			wp.panel.webview.postMessage({
				command: 'liml',
				data: editor.document.getText()
			});
		},
		null,
		context.subscriptions
	);
}

export class WebviewPanel {
	panel: vscode.WebviewPanel;
	private _extPath: string;
	private _editor: vscode.TextEditor;

	constructor(extPath: string, editor: vscode.TextEditor) {
		this._extPath = extPath;
		this._editor = editor;
		this.panel = vscode.window.createWebviewPanel(
			'liml',
			'LIML editor',
			vscode.ViewColumn.Beside,
			// vscode.ViewColumn.One,
			{ enableScripts: true }
		);
		
		this.panel.webview.html = this.getWebviewContent();
		this.panel.webview.postMessage({
			command: 'liml',
			data: vscode.workspace.textDocuments[0].getText()
		});
		this.panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case "liml":
					console.log('get message from webview: ' + message.data);
					let textDocument =  vscode.workspace.textDocuments[0];
					let invalidRange = new vscode.Range(0, 0, textDocument!.lineCount, 0);
					let fullRange = textDocument!.validateRange(invalidRange);
					this._editor.edit(edit => edit.replace(fullRange, message.data));
					return;
			}
		}, null);
	}

	scriptUri(): vscode.Uri {
		const scriptPathOnDisk = vscode.Uri.file(path.join(this._extPath, 'dist', 'bundle.js'));
		return scriptPathOnDisk.with({ scheme: 'vscode-resource' });
	}

	cssUri(): vscode.Uri {
		const cssPathOnDisk = vscode.Uri.file(path.join(this._extPath, 'public', 'main.css'));
		return cssPathOnDisk.with({ scheme: 'vscode-resource' });
	}

	/*
	getWebviewContent(): string {
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
		<script src="${this.scriptUri()}"></script>
	</body>
	</html>`;
	}
	*/

	getWebviewContent(): string {
		return (`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="${this.cssUri()}">
				<title>Table Editor</title>
			</head>
			<body>
				<script>
					const vscode = acquireVsCodeApi();
				</script>
				<canvas id="sheet"></canvas>
				<div id="input-layer"></div>
				<script src="${this.scriptUri()}"></script>
			</body>
			</html>`)
	}
}