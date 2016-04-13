'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { License } from './licenses/type';
import { AL2 } from './licenses/al2';
import { BSD } from './licenses/bsd';
import { GPLv3 } from './licenses/gplv3';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"licenser" is activated.');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let licenseFileCreator = new LicenseFileCreator();
    let licenseHeaderInserter = new LicenseHeaderInserter();
    let create = vscode.commands.registerCommand('extension.createLicenseFile', () => {
        licenseFileCreator.exec();
    });
    let insert = vscode.commands.registerCommand('extension.insertLicenseHeader', () => {
        licenseHeaderInserter.exec();
    });

    context.subscriptions.push(create);
    context.subscriptions.push(insert);
}

const defaultLicense: string = "AL2";
const defaultLicenseFilename: string = "LICENSE";

// createLicenseFile create
class LicenseFileCreator {
    private licenseTemplate: string;
    private licenseType: string;
    private author: string;

    constructor() {
        let licenserSetting = vscode.workspace.getConfiguration('licenser');
        this.licenseType = licenserSetting.get<string>('License', "AL2");
        this.author = licenserSetting.get<string>('Author', "");
        console.log('license type: ' + this.licenseType);
    }

    exec() {
        let path = vscode.workspace.rootPath;
        if (path == undefined) {
            vscode.window.showErrorMessage("No directory is opened.");
            return;
        }

        let license: License;
        console.log(this.licenseType);
        switch (this.licenseType.toLowerCase()) {
            case 'al2':
                license = new AL2(this.author);
                break;
            case 'bsd':
                license = new BSD(this.author);
                break;
            case 'gplv3':
                license = new GPLv3(this.author);
                break;
            default:
                license = new AL2(this.author);
                break;
        }

        let uri = vscode.Uri.parse('untitled:' + path + '/' + defaultLicenseFilename);
        vscode.workspace.openTextDocument(uri).then((doc) => {
            vscode.window.showTextDocument(doc).then((editor) => {
                editor.edit((edit) => {
                    edit.insert(doc.positionAt(0), license.termsAndConditions());
                }).then((done) => {
                    if (done) {
                        doc.save().then((saved) => {
                            vscode.window.showInformationMessage(`Successfully saved: ${ uri }`);
                        })
                    }
                })
            })
        });
    }


}

class LicenseHeaderInserter {
    constructor() {
        console.log("license header inserter")
    }

    exec() {
        vscode.window.showInformationMessage('Insert License Header');
    }
}


// this method is called when your extension is deactivated
export function deactivate() {
}