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
import { License } from './licenses/type';
import { AL2 } from './licenses/al2';
import { BSD } from './licenses/bsd';
import { GPLv2 } from './licenses/gplv2';
import { GPLv3 } from './licenses/gplv3';
import { MIT } from './licenses/mit';
import path = require('path');

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
    let create = vscode.commands.registerCommand('extension.createLicenseFile', () => {
        licenser.create();
    });
    let insert = vscode.commands.registerCommand('extension.insertLicenseHeader', () => {
        licenser.insert();
    });

    context.subscriptions.push(create);
    context.subscriptions.push(insert);
}

// constants for default properties.
const defaultLicenseType: string = 'AL2';
const defaultAuthor: string = 'John Doe'
const defaultLicenseFilename: string = 'LICENSE';

// map between languageId and its comment notation.
// TODO(ymotongpoo): check correct languageId.
// TODO(ymotongpoo): consider PHP's case. (comment can't start from line 1.)  
const commentNotation = {
    'go': '//',
    'javascript': '//',
    'typescript': '//',
    'java': '//',
    'cpp': '//',
    'csharp': '//',
    'fsharp': '//',
    'shellscript': '#',
    'python': '#',
    'ruby': '#',
    'perl': '#',
    'erlang': '%%',
    'lisp': ';;',
    'haskell': '--',

    'html': '<!-- -->',
    'ocaml': '(* *)',
    'css': '/* */',
    'c': '/* */',

    'php': '//',
}


// Licenser handles LICENSE file creation and license header insertion. 
class Licenser {
    private licenseTemplate: string;
    private licenseType: string;
    private author: string;
    private licenserSetting: vscode.WorkspaceConfiguration;

    constructor() {
        this.licenserSetting = vscode.workspace.getConfiguration('licenser');
        let licenseType = this.licenserSetting.get<string>('license', undefined);
        if (licenseType === undefined) {
            vscode.window.showWarningMessage("set your preferred license as 'licenser.license' in configuration. Apache License version 2.0 will be used as default.")
            licenseType = defaultLicenseType;
        }
        this.licenseType = licenseType

        let author = this.licenserSetting.get<string>('author', undefined);
        if (author === undefined) {
            vscode.window.showWarningMessage("set author name as 'licenser.author' in configuration. 'John Doe' will be used as default.")
            author = defaultAuthor;
        }
        this.author = author;
    }

    create() {
        let root = vscode.workspace.rootPath;
        if (root == undefined) {
            vscode.window.showErrorMessage("No directory is opened.");
            return;
        }
        let license = this.getLicense(this.licenseType);

        let uri = vscode.Uri.parse('untitled:' + root + '/' + defaultLicenseFilename);
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
                })
            })
        });
    }

    insert() {
        let editor = vscode.window.activeTextEditor;
        let doc = editor.document;
        let langId = editor.document.languageId;
        let license = this.getLicense(this.licenseType);
        let header = this.getLicenseHeader(license, langId);

        editor.edit((ed) => {
            console.log(header);
            ed.insert(doc.positionAt(0), header);
        }).then((done) => {
            if (done) {
                doc.save().then((saved) => {
                    console.log('Inserted license header');
                })
            }
        });
    }

    private getLicense(typ: string): License {
        let license: License;
        let projectName = this.licenserSetting.get<string>("projectName", undefined);
        if (projectName === undefined) {
            let root = vscode.workspace.rootPath;
            projectName = path.basename(root);
            vscode.window.showWarningMessage('')
        }
        switch (this.licenseType.toLowerCase()) {
            case 'al2':
                license = new AL2(this.author);
                break;
            case 'bsd':
                license = new BSD(this.author);
                break;
            case 'gplv2':
                license = new GPLv2(this.author, projectName);
            case 'gplv3':
                license = new GPLv3(this.author, projectName);
                break;
            case 'MIT':
                license = new MIT(this.author);
                break;
            default:
                license = new AL2(this.author);
                break;
        }
        return license;
    }

    private getLicenseHeader(license: License, langId: string): string {
        let notation = <string>commentNotation[langId];
        let tokens = notation.split(' ');
        if (tokens.length === 1) {
            return this.singleLineCommentHeader(license, tokens[0]);
        } else if (tokens.length === 2) {
            return this.multiLineCommentHeader(license, tokens[0], tokens[1]);
        }
    }

    private singleLineCommentHeader(license: License, token: string): string {
        let original = license.header().split('\n');
        let header = '';
        for (let i in original) {
            header += token + ' ' + original[i] + '\n';
        }
        return header;
    }

    private multiLineCommentHeader(license: License, start, end: string): string {
        let original = license.header().split('\n');
        let header = start + '\n';

        for (let i in original) {
            header += ' ' + original[i] + '\n';
        }
        header += end + '\n';
        return header;
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}