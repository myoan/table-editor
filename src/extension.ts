import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('liml.start', () => {
			// Create and show panel
			const panel = vscode.window.createWebviewPanel(
				'catCoding',
				'Cat Coding',
				vscode.ViewColumn.One,
				{ enableScripts: true }
			);
		
			// And set its HTML content
			panel.webview.html = getWebviewContent(context.extensionPath);
		})
	);
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
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
	<div id="root"></div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
}