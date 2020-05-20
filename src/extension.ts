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
import { Custom } from "./licenses/custom";
import { AL2 } from "./licenses/al2";
import { BSD0 } from "./licenses/bsd0";
import { BSD3 } from "./licenses/bsd3";
import { BSD2 } from "./licenses/bsd2";
import { BSL1 } from "./licenses/bsl1";
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
import { UNL } from "./licenses/unl";
import { WTFPL } from "./licenses/wtfpl";
import { Zlib } from "./licenses/zlib";
import path = require("path");
import fs = require("fs");
import os = require("os");
import { isNullOrUndefined } from "util";

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
const chooseFromList: string = "choose from list";

// map with available licenses
type LicenseCreatorFn = (a:string, b:string) => License;
type LicenseInfo = {displayName:string, creatorFn: LicenseCreatorFn};

const availableLicenses: Map<string, LicenseInfo> = new Map<string, LicenseInfo>([
    ["AL2", { displayName: "AL2", creatorFn: (author, _) => new AL2(author) }],
    ["BSD0", { displayName: "BSD0", creatorFn: (author, _) => new BSD0(author) }],
    ["BSD3", { displayName: "BSD3", creatorFn: (author, _) => new BSD3(author) }],
    ["BSD2", { displayName: "BSD2", creatorFn: (author, _) => new BSD2(author) }],
    ["BSL1", { displayName: "BSL1", creatorFn: (author, _) => new BSL1(author) }],
    ["GPLV2", { displayName: "GPLv2", creatorFn: (author, projectName) => new GPLv2(author, projectName) }],
    ["GPLV3", { displayName: "GPLv3", creatorFn: (author, projectName) => new GPLv3(author, projectName) }],
    ["LGPLV3", { displayName: "LGPLv3", creatorFn: (author, projectName) => new LGPLv3(author, projectName) }],
    ["AGPLV3", { displayName: "AGPLv3", creatorFn: (author, _) => new AGPLv3(author) }],
    ["MIT", { displayName: "MIT", creatorFn: (author, _) => new MIT(author) }],
    ["MPLV2", { displayName: "MPLv2", creatorFn: (author, _) => new MPLv2(author) }],
    ["CC-BY-3", { displayName: "CC-BY-3", creatorFn: (author, projectName) => new CCBY3(author, projectName) }],
    ["CC-BY-4", { displayName: "CC-BY-4", creatorFn: (author, projectName) => new CCBY4(author, projectName) }],
    ["CC-BY-NC-3", { displayName: "CC-BY-NC-3", creatorFn: (author, projectName) => new CCBYNC3(author, projectName) }],
    ["CC-BY-NC-4", { displayName: "CC-BY-NC-4", creatorFn: (author, projectName) => new CCBYNC4(author, projectName) }],
    ["CC-BY-NC-ND-3", { displayName: "CC-BY-NC-ND-3", creatorFn: (author, projectName) => new CCBYNCND3(author, projectName) }],
    ["CC-BY-NC-ND-4", { displayName: "CC-BY-NC-ND-4", creatorFn: (author, projectName) => new CCBYNCND4(author, projectName) }],
    ["CC-BY-NC-SA-3", { displayName: "CC-BY-NC-SA-3", creatorFn: (author, projectName) => new CCBYNCSA3(author, projectName) }],
    ["CC-BY-NC-SA-4", { displayName: "CC-BY-NC-SA-4", creatorFn: (author, projectName) => new CCBYNCSA4(author, projectName) }],
    ["CC-BY-ND-3", { displayName: "CC-BY-ND-3", creatorFn: (author, projectName) => new CCBYND3(author, projectName) }],
    ["CC-BY-ND-4", { displayName: "CC-BY-ND-4", creatorFn: (author, projectName) => new CCBYND4(author, projectName) }],
    ["CC-BY-SA-3", { displayName: "CC-BY-SA-3", creatorFn: (author, projectName) => new CCBYSA3(author, projectName) }],
    ["CC-BY-SA-4", { displayName: "CC-BY-SA-4", creatorFn: (author, projectName) => new CCBYSA4(author, projectName) }],
    ["CC0-1", { displayName: "CC0-1", creatorFn: (author, projectName) => new CC01(author, projectName) }],
    ["UNL", { displayName: "UNL", creatorFn: (author, _) => new WTFPL(author) }],
    ["WTFPL", { displayName: "WTFPL", creatorFn: (author, _) => new WTFPL(author) }],
    ["ZLIB", { displayName: "zlib", creatorFn: (author, _) => new Zlib(author) }],
]);

// Licenser handles LICENSE file creation and license header insertion.
class Licenser {
    private licenseTemplate: string;
    private author: string;
    private _disposable: vscode.Disposable;

    constructor() {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license", undefined);
        if (licenseType === undefined) {
            vscode.window.showWarningMessage("set your preferred license as 'licenser.license' in configuration. Apache License version 2.0 will be used as default.")
            licenseType = defaultLicenseType;
        }

        this.author = this.getAuthor();
        console.log("Licenser.author: " + this.author);

        const subscriptions: vscode.Disposable[] = [];
        vscode.commands.registerCommand("extension.createLicenseFile", () => { this.create() });
        vscode.commands.registerCommand("extension.anyLicenseHeader", () => { this.arbitrary() });
        vscode.commands.registerCommand("extension.insertLicenseHeader", () => { this.insert() });
        vscode.commands.registerCommand("extension.insertMultipleLicenseHeaders", (context) => { this.insertMultiple(context) });
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

        this._chooseLicenseType().then(licenseType => {
            if (!isNullOrUndefined(licenseType)) {
                const license = this.getLicense(licenseType);
                this._doCreateLicense(root, license);
            }
        });
    }

    private _chooseLicenseType(): Thenable<string> {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license");

        if (isNullOrUndefined(licenseType) || licenseType.toLowerCase() == chooseFromList) {
            return vscode.window.showQuickPick(Array.from(availableLicenses.values()).map(info => info.displayName));
        }

        return new Promise((resolve, _) => resolve(licenseType));
    }

    private _doCreateLicense(root: String, license: License) {
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

    private _insert(license: License) {
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

    private _insertMultiple(license: License, dirPath: string) {
        const dirContents = fs.readdirSync(dirPath);
        const dirs = dirContents.filter((item) => {
            return this._isDir(path.join(dirPath, item));
        });
        const files = dirContents.filter((item) => {
            return !this._isDir(path.join(dirPath, item));
        });
        dirs.forEach((dir) => {
            this._insertMultiple(license, path.join(dirPath, dir));
        });
        files.forEach(async (file) => {
            let langId = null;
            const fullPath = path.join(dirPath, file);
            const openSetting = vscode.Uri.parse("file:///" + fullPath);
            await vscode.workspace.openTextDocument(openSetting).then(doc => {
                langId = doc.languageId;
            });
            const header = this.getLicenseHeader(license, langId);
            let fileContent = fs.readFileSync(fullPath);
            if (!fileContent.includes(header)) {
                const newFileContent = header + fileContent;
                try {
                    fs.writeFileSync(fullPath, newFileContent);
                    console.log("Inserted license header");
                } catch (e) {
                    console.log("Error adding to files", e);
                    vscode.window.showErrorMessage("Error adding license header to files");
                }
            } else {
                console.log("File already contains license header");
            }
        });
    }

    private _isDir(resourcePath: string) {
        try {
            const stat = fs.lstatSync(resourcePath);
            return stat.isDirectory();
        } catch (e) {
            return false;
        }
    }

    /**
     * insert embeds license header text into the first line of the opened file.
     */
    insert() {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license");
        const license = this.getLicense(licenseType);
        this._insert(license);
    }

    /**
     * insertMultiple embeds license header text into the first line of all files within a selected directory.
     */
    insertMultiple(context) {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license");
        const license = this.getLicense(licenseType);
        let folderPath = context.fsPath;
        this._insertMultiple(license, folderPath);
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
            let licenserSetting = vscode.workspace.getConfiguration("licenser");
            let autoInsertionDisabled = licenserSetting.get<boolean>("disableAutoHeaderInsertion");
            if (autoInsertionDisabled) {
                return;
            }
            const fileName = path.win32.basename(e.document.fileName);
            if (fileName !== defaultLicenseFilename) {
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
            }
        });
    }

    /**
     * getLicense returns License instance with licenser.license setting.
     * @param typ License type specified in settings.json.
     */
    private getLicense(typ: string): License {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let projectName = licenserSetting.get<string>("projectName", undefined);
        console.log("Project Name from settings: " + projectName);
        if (projectName !== undefined && projectName === "") {
            let root = vscode.workspace.rootPath;
            projectName = path.basename(root);
        }
        console.log("Project Name used: " + projectName);
        const licenseKey = typ.toUpperCase();

        if (licenseKey === "CUSTOM") {
            let customTermsAndConditions = licenserSetting.get<string>("customTermsAndConditions");
            let customTermsAndConditionsFile = licenserSetting.get<string>("customTermsAndConditionsFile");
            let customHeader = licenserSetting.get<string>("customHeader");
            let customHeaderFile = licenserSetting.get<string>("customHeaderFile");
            let fileName = vscode.window.activeTextEditor.document.fileName;
            return new Custom(this.author, projectName, customTermsAndConditions, customTermsAndConditionsFile, customHeader, customHeaderFile, fileName);
        }

        let info = availableLicenses.get(licenseKey);
        if (isNullOrUndefined(info)) {
            info = availableLicenses.get(defaultLicenseType);
        }

        return info.creatorFn(this.author, projectName);
    }

    /**
     * getLicenseHeader returns license header string.
     * @param license License instance initialized from lincenser.license.
     * @param langId language ID for the file working on.
     */
    private getLicenseHeader(license: License, langId: string): string {
        let notation = notations[langId] ? notations[langId] : notations["plaintext"]; // return plaintext's comment when langId is unexpected.

        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        const preferSingleLineStyle = licenserSetting.get<boolean>("useSingleLineStyle", true);
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
        for (const line of original) {
            if (original.length > 0) {
                header += token + " " + line + "\n";
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

        for (const line of original) {
            if (original.length > 0) {
                header += ornament + " " + line + "\n";
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
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let author = licenserSetting.get<string>("author", undefined);
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
