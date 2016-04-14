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
const defaultLicense: string = "AL2";
const defaultLicenseFilename: string = "LICENSE";

// map between languageId and its comment notation.
// TODO(ymotongpoo): check correct languageId.
// TODO(ymotongpoo): consider PHP's case. (comment can't start from line 1.)  
const commentNotation = {
    "go": "//",
    "javascript": "//",
    "typescript": "//",
    "java": "//",
    "csharp": "//",
    "shellscript": "#",
    "python": "#",
    "ruby": "#",
    "perl": "#",
    "erlang": "%%",
    "lisp": ";;",
    "haskell": "--",

    "html": "<!-- -->",
    "ocaml": "(* *)",
    "css": "/* */",
    "c": "/* */",

    "php": "//"
}


// Licenser handles LICENSE file creation and license header insertion. 
class Licenser {
    private licenseTemplate: string;
    private licenseType: string;
    private author: string;

    constructor() {
        let licenserSetting = vscode.workspace.getConfiguration('licenser');
        this.licenseType = licenserSetting.get<string>('License', "AL2");
        this.author = licenserSetting.get<string>('Author', "");
    }

    create() {
        let path = vscode.workspace.rootPath;
        if (path == undefined) {
            vscode.window.showErrorMessage("No directory is opened.");
            return;
        }
        let license = this.getLicense(this.licenseType);

        let uri = vscode.Uri.parse('untitled:' + path + '/' + defaultLicenseFilename);
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
        console.log(header);

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
        header += 'end' + '\n';
        return header;
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}