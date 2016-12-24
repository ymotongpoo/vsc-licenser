//    Copyright 2016 Yoshi Yamaguchi
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { notations } from './notation';
import { License } from './licenses/type';
import { AL2 } from './licenses/al2';
import { BSD3 } from './licenses/bsd3';
import { BSD2 } from './licenses/bsd2';
import { GPLv2 } from './licenses/gplv2';
import { GPLv3 } from './licenses/gplv3';
import { LGPLv3 } from './licenses/lgplv3';
import { AGPLv3 } from './licenses/agplv3';
import { MIT } from './licenses/mit';
import { MPLv2 } from './licenses/mplv2';
import path = require('path');
import os = require('os');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"licenser" is activated.');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let licenser = new Licenser();
    context.subscriptions.push(licenser);
}

// constants for default properties.
const defaultLicenseType: string = 'AL2';
const defaultLicenseFilename: string = 'LICENSE';

// Licenser handles LICENSE file creation and license header insertion.
class Licenser {
    private licenseTemplate: string;
    private licenseType: string;
    private author: string;
    private licenserSetting: vscode.WorkspaceConfiguration;
    private _disposable: vscode.Disposable;

    constructor() {
        this.licenserSetting = vscode.workspace.getConfiguration('licenser');
        let licenseType = this.licenserSetting.get<string>('license', undefined);
        if (licenseType === undefined) {
            vscode.window.showWarningMessage("set your preferred license as 'licenser.license' in configuration. Apache License version 2.0 will be used as default.")
            licenseType = defaultLicenseType;
        }
        this.licenseType = licenseType

        this.author = this.getAuthor();
        console.log('Licenser.author: ' + this.author);

        const subscriptions: vscode.Disposable[] = [];
        vscode.commands.registerCommand('extension.createLicenseFile', () => { this.create() });
        vscode.commands.registerCommand('extension.insertLicenseHeader', () => { this.insert() });
        vscode.window.onDidChangeActiveTextEditor(this._onDidChangeActiveTextEditor, this, subscriptions)
    }

    create() {
        const root = vscode.workspace.rootPath;
        if (root == undefined) {
            vscode.window.showErrorMessage("No directory is opened.");
            return;
        }
        const license = this.getLicense(this.licenseType);

        const uri = vscode.Uri.parse('untitled:' + root + path.sep + defaultLicenseFilename);
        vscode.workspace.openTextDocument(uri).then((doc) => {
            vscode.window.showTextDocument(doc).then((editor) => {
                editor.edit((ed) => {
                    ed.insert(doc.positionAt(0), license.termsAndConditions());
                }).then((done) => {
                    if (done) {
                        doc.save().then((saved) => {
                            vscode.window.showInformationMessage(`Successfully saved: ${uri}`);
                        })
                    }
                }, (reason) => {
                    console.log(reason);
                    vscode.window.showErrorMessage(reason);
                })
            })
        }, (reason) => {
            console.log(reason);
            vscode.window.showErrorMessage(reason);
        });
    }

    insert() {
        const editor = vscode.window.activeTextEditor;
        const doc = editor.document;
        const langId = editor.document.languageId;
        const license = this.getLicense(this.licenseType);
        const header = this.getLicenseHeader(license, langId);

        // handle shebang
        const firstLine = doc.getText(new vscode.Range(0, 0, 1, 0));
        console.log('fisrtLine: ' + firstLine);
        const position = firstLine.startsWith('#!') ? firstLine.length : 0;

        editor.edit((ed) => {
            console.log(header);
            ed.insert(doc.positionAt(position), header);
        }).then((done) => {
            if (done) {
                doc.save().then((saved) => {
                    console.log('Inserted license header');
                })
            }
        });
    }

    private _onDidChangeActiveTextEditor() {
        vscode.window.onDidChangeActiveTextEditor(e => {
            const doc = e.document;
            const contents = doc.getText();
            if (contents.length > 0) {
                return;
            }
            for (let id in notations) {
                if (id == doc.languageId) {
                    this.insert();
                }
            }
        });
    }

    private getLicense(typ: string): License {
        let license: License;
        let projectName = this.licenserSetting.get<string>('projectName', undefined);
        console.log('Project Name from settings: ' + projectName);
        if (projectName !== undefined && projectName === '') {
            let root = vscode.workspace.rootPath;
            projectName = path.basename(root);
        }
        console.log('Project Name used: ' + projectName);

        switch (this.licenseType.toLowerCase()) {
            case 'apglv3':
                license = new AGPLv3(this.author);
                break;
            case 'al2':
                license = new AL2(this.author);
                break;
            case 'bsd2':
                license = new BSD2(this.author);
                break;
            case 'bsd3':
                license = new BSD3(this.author);
                break;
            case 'gplv2':
                license = new GPLv2(this.author, projectName);
                break;
            case 'gplv3':
                license = new GPLv3(this.author, projectName);
                break;
            case 'lgplv3':
                license = new LGPLv3(this.author);
                break;
            case 'mit':
                license = new MIT(this.author);
                break;
            case 'mpl':
                license = new MPLv2(this.author);
                break;
            default:
                license = new AL2(this.author);
                break;
        }
        return license;
    }

    private getLicenseHeader(license: License, langId: string): string {
        let notation = notations[langId];

        // TODO(ymotongpoo): enhance setting option to reflect user's preference.
        // such as licenser.preferSingleLineStyle.
        if (notation.hasSingle()) {
            return this.singleLineCommentHeader(license, notation.single);
        } else if (notation.hasMulti) {
            const [l, r] = notation.multi;
            return this.multiLineCommentHeader(license, l, r, notation.ornament);
        }
    }

    private singleLineCommentHeader(license: License, token: string): string {
        let original = license.header().split('\n');
        let header = '';
        for (let i in original) {
            if (original.length > 0) {
                header += token + ' ' + original[i] + '\n';
            } else {
                header += token;
            }
        }
        return header + '\n';
    }

    private multiLineCommentHeader(license: License, start, end, ornament: string): string {
        let original = license.header().split('\n');
        let header = start + '\n';

        for (let i in original) {
            if (original.length > 0) {
                header += ornament + original[i] + '\n';
            }
        }
        header += end + '\n';
        return header + '\n';
    }

    private getAuthor(): string {
        let author = this.licenserSetting.get<string>('author', undefined);
        console.log("Author from setting: " + author);
        if (author !== undefined && author.length !== 0) {
            return author;
        }
        vscode.window.showWarningMessage("set author name as 'licenser.author' in configuration. OS username will be used as default.")
        switch (os.platform()) {
            case 'win32':
                const userprofile = process.env.USERPROFILE
                if (userprofile === undefined) {
                    vscode.window.showErrorMessage("Set USERPROFILE in your environment variables.")
                }
                author = userprofile.split(path.sep)[2];
                break;
            case 'darwin':
                author = process.env.USER;
                break;
            case 'linux':
                author = process.env.USER;
                break;
            default:
                vscode.window.showErrorMessage("Unsupported OS.")
                break;
        }
        return author;
    }

    public dispose() {
        this._disposable.dispose();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
