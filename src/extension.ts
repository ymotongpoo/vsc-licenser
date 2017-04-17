//    Copyright 2016, 2017 Yoshi Yamaguchi
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

"use strict";
// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { notations } from "./notation";
import { License } from "./licenses/type";
import { AL2 } from "./licenses/al2";
import { BSD3 } from "./licenses/bsd3";
import { BSD2 } from "./licenses/bsd2";
import { GPLv2 } from "./licenses/gplv2";
import { GPLv3 } from "./licenses/gplv3";
import { LGPLv3 } from "./licenses/lgplv3";
import { AGPLv3 } from "./licenses/agplv3";
import { MIT } from "./licenses/mit";
import { MPLv2 } from "./licenses/mplv2";
import { CCBY3 } from "./licenses/ccby30";
import { CCBY4 } from "./licenses/ccby40";
import { CCBYNC3 } from "./licenses/ccbync30";
import { CCBYNC4 } from "./licenses/ccbync40";
import { CCBYNCND3 } from "./licenses/ccbyncnd30";
import { CCBYNCND4 } from "./licenses/ccbyncnd40";
import { CCBYNCSA3 } from "./licenses/ccbyncsa30";
import { CCBYNCSA4 } from "./licenses/ccbyncsa40";
import { CCBYND3 } from "./licenses/ccbynd30";
import { CCBYND4 } from "./licenses/ccbynd40";
import { CCBYSA3 } from "./licenses/ccbysa30";
import { CCBYSA4 } from "./licenses/ccbysa40";
import { CC01 } from "./licenses/cczero1";
import path = require("path");
import os = require("os");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("'licenser' is activated.");

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let licenser = new Licenser();
    context.subscriptions.push(licenser);
}

// constants for default properties.
const defaultLicenseType: string = "AL2";
const defaultLicenseFilename: string = "LICENSE";

// Licenser handles LICENSE file creation and license header insertion.
class Licenser {
    private licenseTemplate: string;
    private licenseType: string;
    private author: string;
    private licenserSetting: vscode.WorkspaceConfiguration;
    private _disposable: vscode.Disposable;

    constructor() {
        this.licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = this.licenserSetting.get<string>("license", undefined);
        if (licenseType === undefined) {
            vscode.window.showWarningMessage("set your preferred license as 'licenser.license' in configuration. Apache License version 2.0 will be used as default.")
            licenseType = defaultLicenseType;
        }
        this.licenseType = licenseType

        this.author = this.getAuthor();
        console.log("Licenser.author: " + this.author);

        const subscriptions: vscode.Disposable[] = [];
        vscode.commands.registerCommand("extension.createLicenseFile", () => { this.create() });
        vscode.commands.registerCommand("extension.anyLicenseHeader", () => { this.arbitrary() });
        vscode.commands.registerCommand("extension.insertLicenseHeader", () => { this.insert() });
        vscode.window.onDidChangeActiveTextEditor(this._onDidChangeActiveTextEditor, this, subscriptions)
    }

    /**
     * create generates LICENSE file and save it in opened workspace.
     */
    create() {
        const root = vscode.workspace.rootPath;
        if (root === undefined) {
            vscode.window.showErrorMessage("No directory is opened.");
            return;
        }
        const license = this.getLicense(this.licenseType);

        const uri = vscode.Uri.parse("untitled:" + root + path.sep + defaultLicenseFilename);
        vscode.workspace.openTextDocument(uri).then((doc) => {
            vscode.window.showTextDocument(doc).then((editor) => {
                editor.edit((ed) => {
                    ed.insert(doc.positionAt(0), license.termsAndConditions());
                }).then((done) => {
                    if (done) {
                        doc.save().then((saved) => {
                            vscode.window.showInformationMessage(`Successfully saved: ${uri}`);
                        }, (reason) => {
                            console.log("saved", reason);
                        });
                    }
                }, (reason) => {
                    console.log("ed.insert", reason);
                    vscode.window.showErrorMessage(reason);
                })
            })
        }, (reason) => {
            console.log("openTextDocument", reason);
            vscode.window.showErrorMessage(reason);
        });
    }

    _insert(license: License) {
        const editor = vscode.window.activeTextEditor;
        const doc = editor.document;
        const langId = editor.document.languageId;
        const header = this.getLicenseHeader(license, langId);

        // handle shebang
        const firstLine = doc.getText(new vscode.Range(0, 0, 1, 0));
        const position = this.findInsertionPosition(firstLine, langId);
        editor.edit((ed) => {
            console.log("header:", header);
            ed.insert(doc.positionAt(position), header);
        }).then((done) => {
            if (done) {
                doc.save().then((saved) => {
                    console.log("Inserted license header");
                }, (reason) => {
                    console.log("doc.save", reason);
                })
            }
        }, (reason) => {
            console.log("editor.edit", reason);
            vscode.window.showErrorMessage(reason);
        });
    }

    /**
     * insert embeds license header text into the first line of the opened file.
     */
    insert() {
        const license = this.getLicense(this.licenseType);
        this._insert(license);
    }

    arbitrary() {
        vscode.window.showInputBox({
            prompt: "Specify the license short name to insert. (see package.json for all the candidates)",
            placeHolder: "AL2",
        }).then((shortName) => {
            if (shortName !== undefined) {
                const license = this.getLicense(shortName);
                this._insert(license);
            }
        })
    }

    /**
     * findInsertionPosition returns the position to which insert() should insert
     * @param range header text area (usually first line of the file.)
     * @param langId language ID
     */
    private findInsertionPosition(range: string, langId: string): number {
        console.log("firstLine: " + range);
        switch (langId) {
            case "php":
                return range.startsWith("<?php") ? range.length : 0;
            default:
                return range.startsWith("#!") ? range.length : 0;
        }
    }

    private _onDidChangeActiveTextEditor() {
        vscode.window.onDidChangeActiveTextEditor(e => {
            const doc = e.document;
            const contents = doc.getText();
            if (contents.length > 0) {
                return;
            }
            for (let id in notations) {
                if (id === doc.languageId) {
                    this.insert();
                }
            }
        });
    }

    /**
     * getLicense returns License instance with licenser.license setting.
     * @param typ License type specified in settings.json.
     */
    private getLicense(typ: string): License {
        let license: License;
        let projectName = this.licenserSetting.get<string>("projectName", undefined);
        console.log("Project Name from settings: " + projectName);
        if (projectName !== undefined && projectName === "") {
            let root = vscode.workspace.rootPath;
            projectName = path.basename(root);
        }
        console.log("Project Name used: " + projectName);

        switch (typ.toLowerCase()) {
            case "agplv3":
                license = new AGPLv3(this.author);
                break;
            case "al2":
                license = new AL2(this.author);
                break;
            case "bsd2":
                license = new BSD2(this.author);
                break;
            case "bsd3":
                license = new BSD3(this.author);
                break;
            case "gplv2":
                license = new GPLv2(this.author, projectName);
                break;
            case "gplv3":
                license = new GPLv3(this.author, projectName);
                break;
            case "lgplv3":
                license = new LGPLv3(this.author);
                break;
            case "mit":
                license = new MIT(this.author);
                break;
            case "mplv2":
                license = new MPLv2(this.author);
                break;
            case "cc-by-3":
                license = new CCBY3(this.author, projectName);
                break;
            case "cc-by-4":
                license = new CCBY4(this.author, projectName);
                break;
            case "cc-by-sa-3":
                license = new CCBYSA3(this.author, projectName);
                break;
            case "cc-by-nd-4":
                license = new CCBYND4(this.author, projectName);
                break;
            case "cc-by-nc-3":
                license = new CCBYNC3(this.author, projectName);
                break;
            case "cc-by-nc-4":
                license = new CCBYNC4(this.author, projectName);
                break;
            case "cc-by-nc-sa-3":
                license = new CCBYNCSA3(this.author, projectName);
                break;
            case "cc-by-nc-sa-4":
                license = new CCBYNCSA4(this.author, projectName);
                break;
            case "cc-by-nc-nd-3":
                license = new CCBYNCND3(this.author, projectName);
                break;
            case "cc-by-nc-nd-4":
                license = new CCBYNCND4(this.author, projectName);
                break;
            default:
                license = new AL2(this.author);
                break;
        }
        return license;
    }

    /**
     * getLicenseHeader returns license header string.
     * @param license License instance initialized from lincenser.license.
     * @param langId language ID for the file working on.
     */
    private getLicenseHeader(license: License, langId: string): string {
        let notation = notations[langId] ? notations[langId] : notations["plaintext"]; // return plaintext's comment when langId is unexpected.

        const preferSingleLineStyle = this.licenserSetting.get<boolean>("useSingleLineStyle", true);
        const [l, r] = notation.multi;
        if (preferSingleLineStyle) {
            if (notation.hasSingle()) {
                return this.singleLineCommentHeader(license, notation.single);
            } else if (notation.hasMulti()) {
                return this.multiLineCommentHeader(license, l, r, notation.ornament);
            }
        } else {
            if (notation.hasMulti()) {
                return this.multiLineCommentHeader(license, l, r, notation.ornament);
            } else if (notation.hasSingle()) {
                return this.singleLineCommentHeader(license, notation.single);
            }
        }
    }

    /**
     * singleLineCommentHeader returns license header string with single line comment style.
     * @param license License instance initialzed from licenser.license.
     * @param token single line comment token.
     */
    private singleLineCommentHeader(license: License, token: string): string {
        let original = license.header().split("\n");
        let header = "";
        for (let i in original) {
            if (original.length > 0) {
                header += token + " " + original[i] + "\n";
            } else {
                header += token;
            }
        }
        return header + "\n";
    }

    /**
     * multiLineCommentHeader returns license header string with multiple line comment style.
     * @param license License instance initialized from licenser.License.
     * @param start multiplie line comment start string.
     * @param end multiple line comment end string.
     * @param ornament multiple line comment ornament string.
     */
    private multiLineCommentHeader(license: License, start, end, ornament: string): string {
        let original = license.header().split("\n");
        let header = start + "\n";

        for (let i in original) {
            if (original.length > 0) {
                header += ornament + original[i] + "\n";
            }
        }
        header += end + "\n";
        return header + "\n";
    }

    /**
     * getAuthor fetches author name string from one of the followings in this order.
     *   1. licenser.author
     *   2. OS environment.
     */
    private getAuthor(): string {
        let author = this.licenserSetting.get<string>("author", undefined);
        console.log("Author from setting: " + author);
        if (author !== undefined && author.length !== 0) {
            return author;
        }
        vscode.window.showWarningMessage("set author name as ’licenser.author’ in configuration. OS username will be used as default.")
        switch (os.platform()) {
            case "win32":
                const userprofile = process.env.USERPROFILE
                if (userprofile === undefined) {
                    vscode.window.showErrorMessage("Set USERPROFILE in your environment variables.")
                }
                author = userprofile.split(path.sep)[2];
                break;
            case "darwin":
                author = process.env.USER;
                break;
            case "linux":
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
