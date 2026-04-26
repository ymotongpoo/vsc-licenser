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
import { BSD0 } from "./licenses/0bsd";
import { BSD3 } from "./licenses/bsd3";
import { BSD2 } from "./licenses/bsd2";
import { BSL1 } from "./licenses/bsl1";
import { BUSL11 } from "./licenses/busl1_1";
import { EUPL12 } from "./licenses/eupl12";
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

    // Listener for auto-updating Last Modified on Save
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document) => {
            licenser.updateLastModified(document);
        })
    );

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
    ["0BSD", { displayName: "0BSD", creatorFn: (author, _) => new BSD0(author) }],
    ["BSD3", { displayName: "BSD3", creatorFn: (author, _) => new BSD3(author) }],
    ["BSD2", { displayName: "BSD2", creatorFn: (author, _) => new BSD2(author) }],
    ["BSL1", { displayName: "BSL1", creatorFn: (author, _) => new BSL1(author) }],
    ["BUSL-1.1", { displayName: "BUSL-1.1", creatorFn: (author, _) => new BUSL11(author) }],
    ["EUPL-1.2", { displayName: "EUPL-1.2", creatorFn: (author, _) => new EUPL12(author)}],
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
    ["UNL", { displayName: "UNL", creatorFn: (author, _) => new UNL(author) }],
    ["WTFPL", { displayName: "WTFPL", creatorFn: (author, _) => new WTFPL(author) }],
    ["ZLIB", { displayName: "zlib", creatorFn: (author, _) => new Zlib(author) }],
]);

// Licenser handles LICENSE file creation and license header insertion.
class Licenser {
    private licenseTemplate!: string;
    private author: string;
    private _disposable!: vscode.Disposable;

    constructor() {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license", "AL2"); // Or use ""
        if (licenseType === undefined) {
            vscode.window.showWarningMessage("set your preferred license as 'licenser.license' in configuration. Apache License version 2.0 will be used as default.")
            licenseType = defaultLicenseType;
        }

        this.author = this.getAuthor();
        console.log("Licenser.author: " + this.author);

        this._disposable = vscode.Disposable.from(
            vscode.commands.registerCommand("extension.createLicenseFile", () => { this.create() }),
            vscode.commands.registerCommand("extension.anyLicenseHeader", () => { this.arbitrary() }),
            vscode.commands.registerCommand("extension.insertLicenseHeader", () => { this.insert() }),
            vscode.commands.registerCommand("extension.insertMultipleLicenseHeaders", (context) => { this.insertMultiple(context) }),
            vscode.commands.registerCommand("extension.updateLicenseHeader", () => { this.update() }),
            vscode.commands.registerCommand("extension.updateMultipleLicenseHeaders", (context) => { this.updateMultiple(context) }),
            vscode.commands.registerCommand("extension.InsertLicensesOnEntireWorkspace", () => { this.insertMultiple(null) }),
            vscode.commands.registerCommand("extension.UpdateLicensesOnEntireWorkspace", () => { this.updateMultiple(null) }),
            vscode.window.onDidChangeActiveTextEditor(this._onDidChangeActiveTextEditor, this)
        );
    }

    /**
     * create generates LICENSE file and save it in opened workspace.
     */
    create() {
        const root = vscode.workspace.rootPath;
        const licesnerSetting = vscode.workspace.getConfiguration("licenser");
        const autosave = !licesnerSetting.get<boolean>("disableAutoSave", false);
        if (!root) {
            vscode.window.showErrorMessage("No directory is opened.");
            return;
        }

        this._chooseLicenseType().then(licenseType => {
            if (licenseType !== null && licenseType !== undefined) {
                const license = this.getLicense(licenseType);
                this._doCreateLicense(root, license, autosave);
            }
        });
    }

    private _chooseLicenseType(): Thenable<string> {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license");

        if (licenseType === null || licenseType === undefined || licenseType.toLowerCase() == chooseFromList) {
            return vscode.window.showQuickPick(Array.from(availableLicenses.values()).map(info => info.displayName)) as Thenable<string>;
        }

        return new Promise((resolve, _) => resolve(licenseType));
    }

    private _doCreateLicense(root: String, license: License, autoSave: boolean) {
        const uri = vscode.Uri.parse("untitled:" + root + path.sep + defaultLicenseFilename);
        vscode.workspace.openTextDocument(uri).then((doc) => {
            vscode.window.showTextDocument(doc).then((editor) => {
                editor.edit((ed) => {
                    ed.insert(doc.positionAt(0), license.termsAndConditions());
                }).then((done) => {
                    if (done && autoSave) {
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

    private _insert(license: License, autosave: boolean) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const doc = editor.document;
        const langId = editor.document.languageId;
        const header = this.getLicenseHeader(license, langId, doc.fileName);

        // handle shebang
        const firstLine = doc.getText(new vscode.Range(0, 0, 1, 0));
        const position = this.findInsertionPosition(firstLine, langId);
        editor.edit((ed) => {
            console.log("header:", header);
            ed.insert(doc.positionAt(position), header);
        }).then((done) => {
            if (done && autosave) {
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

    private async _insertMultiple(license: License, dirPath: string) {
        const dirContents = fs.readdirSync(dirPath);
        const dirs = dirContents.filter((item) => {
            return this._isDir(path.join(dirPath, item)) && !item.startsWith('.') && item !== 'node_modules';
        });
        const files = dirContents.filter((item) => {
            return !this._isDir(path.join(dirPath, item)) && !item.startsWith('.');
        });
        for (const dir of dirs) {
            await this._insertMultiple(license, path.join(dirPath, dir));
        }
        
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let excludedFileExtensions = licenserSetting.get<string[]>("excludeFileExtensions", []).map(ext => ext.toLowerCase());

        for (const file of files) {
            const fileExtension = path.extname(file).replace('.', '').toLowerCase();
            if (excludedFileExtensions.includes(fileExtension)) {
                continue;
            }

            let langId: string = "plaintext";
            const fullPath = path.join(dirPath, file);
            const openSetting = vscode.Uri.file(fullPath);
            try {
                const doc = await vscode.workspace.openTextDocument(openSetting);
                langId = doc.languageId;
            } catch (err) {
                console.log(`Failed to open text document ${fullPath}:`, err);
                continue;
            }
            if (!notations[langId]) {
                continue;
            }
            const header = this.getLicenseHeader(license, langId, fullPath);
            let fileContent = fs.readFileSync(fullPath) + '';
            if (!fileContent.includes(header)) {
                const firstLine = fileContent.split('\n', 1)[0] +'\n';
                const position = this.findInsertionPosition(firstLine, langId);
                const newFileContent = fileContent.substring(0, position) + header + fileContent.substring(position);
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
        }
    }

    private _update(license: License, autosave: boolean) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const doc = editor.document;
        const langId = doc.languageId;
        const header = this.getLicenseHeader(license, langId, doc.fileName);

        const content = doc.getText();
        const firstLine = content.split('\n', 1)[0] + '\n';
        const position = this.findInsertionPosition(firstLine, langId);
        const contentWithoutOldHeader = this.stripOldHeader(content, langId);
        
        if (contentWithoutOldHeader === content) {
            vscode.window.showInformationMessage("No existing license header found to update.");
            return;
        }
        
        const newContent = contentWithoutOldHeader.substring(0, position) + header + contentWithoutOldHeader.substring(position);
        
        if (content !== newContent) {
            const fullRange = new vscode.Range(
                doc.positionAt(0),
                doc.positionAt(content.length)
            );
            editor.edit((ed) => {
                ed.replace(fullRange, newContent);
            }).then((done) => {
                if (done && autosave) {
                    doc.save().then(() => {
                        console.log("Updated license header");
                    });
                }
            }, (reason) => {
                console.log("editor.edit", reason);
                vscode.window.showErrorMessage(reason);
            });
        }
    }

    private async _updateMultiple(license: License, dirPath: string) {
        const dirContents = fs.readdirSync(dirPath);
        const dirs = dirContents.filter((item) => {
            return this._isDir(path.join(dirPath, item)) && !item.startsWith('.') && item !== 'node_modules';
        });
        const files = dirContents.filter((item) => {
            return !this._isDir(path.join(dirPath, item)) && !item.startsWith('.');
        });
        for (const dir of dirs) {
            await this._updateMultiple(license, path.join(dirPath, dir));
        }
        
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let excludedFileExtensions = licenserSetting.get<string[]>("excludeFileExtensions", []).map(ext => ext.toLowerCase());

        for (const file of files) {
            const fileExtension = path.extname(file).replace('.', '').toLowerCase();
            if (excludedFileExtensions.includes(fileExtension)) {
                continue;
            }

            let langId: string = "plaintext";
            const fullPath = path.join(dirPath, file);
            const openSetting = vscode.Uri.file(fullPath);
            try {
                const doc = await vscode.workspace.openTextDocument(openSetting);
                langId = doc.languageId;
            } catch (err) {
                console.log(`Failed to open text document ${fullPath}:`, err);
                continue;
            }
            
            if (!notations[langId]) {
                continue;
            }

            const header = this.getLicenseHeader(license, langId, fullPath);
            let fileContent = fs.readFileSync(fullPath, 'utf8');
            const firstLine = fileContent.split('\n', 1)[0] + '\n';
            const position = this.findInsertionPosition(firstLine, langId);
            const contentWithoutOldHeader = this.stripOldHeader(fileContent, langId);
            
            if (contentWithoutOldHeader === fileContent) {
                console.log(`No existing license header found in ${file}, skipping update.`);
                continue;
            }

            const newFileContent = contentWithoutOldHeader.substring(0, position) + header + contentWithoutOldHeader.substring(position);
            
            if (fileContent !== newFileContent) {
                try {
                    fs.writeFileSync(fullPath, newFileContent);
                    console.log("Updated license header in " + file);
                } catch (e) {
                    console.log("Error updating file", e);
                    vscode.window.showErrorMessage("Error updating license header in files");
                }
            } else {
                console.log("File license header is already up-to-date");
            }
        }
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
        let licenseType = licenserSetting.get<string>("license", defaultLicenseType);
        const autosave = !licenserSetting.get<boolean>("disableAutoSave", false);
        const license = this.getLicense(licenseType);
        this._insert(license, autosave);
    }

    /**
     * insertMultiple embeds license header text into the first line of all files within a selected directory.
     */
    insertMultiple(context: any) {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license", defaultLicenseType);
        const license = this.getLicense(licenseType);
        let folderPath = context != null && context != undefined ? context.fsPath: vscode.workspace.rootPath;
        if (folderPath) {
            this._insertMultiple(license, folderPath).catch(err => console.error(err));
        }
    }

    /**
     * update replaces the existing license header in the opened file.
     */
    update() {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license", defaultLicenseType);
        const autosave = !licenserSetting.get<boolean>("disableAutoSave", false);
        const license = this.getLicense(licenseType);
        this._update(license, autosave);
    }

    /**
     * updateMultiple replaces the existing license header in all files within a selected directory.
     */
    updateMultiple(context: any) {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let licenseType = licenserSetting.get<string>("license", defaultLicenseType);
        const license = this.getLicense(licenseType);
        let folderPath = context != null && context != undefined ? context.fsPath : vscode.workspace.rootPath;
        if (folderPath) {
            this._updateMultiple(license, folderPath).catch(err => console.error(err));
        }
    }

    arbitrary() {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        const autosave = !licenserSetting.get<boolean>("disableAutoSave", false);
        vscode.window.showInputBox({
            prompt: "Specify the license short name to insert. (see package.json for all the candidates)",
            placeHolder: "AL2",
        }).then((shortName) => {
            if (shortName !== undefined) {
                const license = this.getLicense(shortName);
                this._insert(license, autosave);
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

    private tryStripNotation(contentAfterShebang: string, notation: any, originalContent: string, position: number): string {
        const multiL = notation.multi ? notation.multi[0] : undefined;
        const multiR = notation.multi ? notation.multi[1] : undefined;
        const single = notation.single;
        
        if (multiL && multiR) {
            const escapedL = multiL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const escapedR = multiR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const multiRegex = new RegExp(`^\\s*${escapedL}[\\s\\S]*?${escapedR}\\s*\\n?`);
            const match = contentAfterShebang.match(multiRegex);
            // Remove the block only if it looks like a license or copyright header
            if (match && (match[0].toLowerCase().includes('copyright') || match[0].toLowerCase().includes('license'))) {
                return originalContent.substring(0, position) + contentAfterShebang.replace(multiRegex, '');
            }
        }
        
        if (single) {
            const escapedSingle = single.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const singleRegex = new RegExp(`^(?:\\s*${escapedSingle}.*(?:\\r?\\n|$))+`);
            const match = contentAfterShebang.match(singleRegex);
            if (match && (match[0].toLowerCase().includes('copyright') || match[0].toLowerCase().includes('license'))) {
                return originalContent.substring(0, position) + contentAfterShebang.replace(singleRegex, '');
            }
        }
        
        return originalContent;
    }

    private stripOldHeader(content: string, langId: string): string {
        const firstLine = content.split('\n', 1)[0] + '\n';
        const position = this.findInsertionPosition(firstLine, langId);
        const contentAfterShebang = content.substring(position);
        
        let preferredNotation = notations[langId] ? notations[langId] : notations["plaintext"];
        
        // 1. Try stripping with the proper notation for this language
        let strippedContent = this.tryStripNotation(contentAfterShebang, preferredNotation, content, position);
        if (strippedContent !== content) {
            return strippedContent;
        }

        // 2. If no valid header found, try all other notations to "repair" broken/incorrect headers
        for (const key in notations) {
            const notation = notations[key];
            if (notation === preferredNotation) continue;

            strippedContent = this.tryStripNotation(contentAfterShebang, notation, content, position);
            if (strippedContent !== content) {
                return strippedContent; // Successfully removed a broken header
            }
        }
        
        return content;
    }

    private _onDidChangeActiveTextEditor(e: vscode.TextEditor | undefined) {
        if (!e) {
            return;
        }
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let autoInsertionDisabled = licenserSetting.get<boolean>("disableAutoHeaderInsertion");
        if (autoInsertionDisabled) {
            return;
        }

        const fileName = path.basename(e.document.fileName);
        if (fileName.includes(".") && !fileName.endsWith(".")) {
            const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLocaleLowerCase();

            let excludedFileExtensions = licenserSetting.get<string[]>("excludeFileExtensions", []);

            const isInExcludedInList = excludedFileExtensions.some((ext) => {
                return ext.toLocaleLowerCase() === fileExtension;
            });

            if (isInExcludedInList) {
                console.log("File: " + fileName + " excluded based on extension: " + fileExtension);
                return;
            }
        }
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
    }

    /**
     * getLicense returns License instance with licenser.license setting.
     * @param typ License type specified in settings.json.
     */
    private getLicense(typ: string): License {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let projectName = licenserSetting.get<string>("projectName", "");
        console.log("Project Name from settings: " + projectName);
        let root = vscode.workspace.rootPath;
        if (projectName === "" && root) {
            projectName = path.basename(root);
        }
        console.log("Project Name used: " + projectName);
        const licenseKey = typ.toUpperCase();

        if (licenseKey === "CUSTOM") {
            let customTermsAndConditions = licenserSetting.get<string>("customTermsAndConditions", "");
            let customTermsAndConditionsFile = licenserSetting.get<string>("customTermsAndConditionsFile", "");
            let customHeader = licenserSetting.get<string>("customHeader", "");
            let customHeaderFile = licenserSetting.get<string>("customHeaderFile", "");
            const editor = vscode.window.activeTextEditor;
            let fileName = editor ? editor.document.fileName : "";
            return new Custom(this.author, projectName, customTermsAndConditions, customTermsAndConditionsFile, customHeader, customHeaderFile, fileName);
        }

        let info = availableLicenses.get(licenseKey);
        if (info === null || info === undefined) {
            info = availableLicenses.get(defaultLicenseType);
        }

        if (!info) {
            throw new Error(`License type '${licenseKey}' is not available and default license '${defaultLicenseType}' could not be found.`);
        }

        return info.creatorFn(this.author, projectName);
    }

    /**
     * getLicenseHeader returns license header string.
     * @param license License instance initialized from lincenser.license.
     * @param langId language ID for the file working on.
     */
    private getLicenseHeader(license: License, langId: string, fileName?: string): string {
        let notation = notations[langId] ? notations[langId] : notations["plaintext"]; // return plaintext's comment when langId is unexpected.
        let licenserSetting = vscode.workspace.getConfiguration("licenser");

        const spdxFormatEnabled = licenserSetting.get<boolean>("useSPDXLicenseFormat",false);
        const preferSingleLineStyle = licenserSetting.get<boolean>("useSingleLineStyle", true);
        const [l, r] = notation.multi;

        if (preferSingleLineStyle) {
            if (notation.hasSingle()) {
                return this.singleLineCommentHeader(license, notation.single, spdxFormatEnabled, fileName);
            } else if (notation.hasMulti()) {
                return this.multiLineCommentHeader(license, l, r, notation.ornament, spdxFormatEnabled, fileName);
            }
        } else {
            if (notation.hasMulti()) {
                return this.multiLineCommentHeader(license, l, r, notation.ornament, spdxFormatEnabled, fileName);
            } else if (notation.hasSingle()) {
                return this.singleLineCommentHeader(license, notation.single, spdxFormatEnabled, fileName);
            }
        }
        return "";
    }

    /**
     * singleLineCommentHeader returns license header string with single line comment style.
     * @param license License instance initialzed from licenser.license.
     * @param token single line comment token.
     */
    private singleLineCommentHeader(license: License, token: string, spdxFormat? : boolean, fileName?: string): string {
        let original : string[];
        let activeFile = fileName;
        if (!activeFile) {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return ""; 
            activeFile = editor.document.fileName || "";
        }
        if (!activeFile) return ""; // Guard against no open file

        if (spdxFormat) {
            original = license.spdxHeader().split("\n");
        } else {
            original = license.header().split("\n");
        }

        let header = "";
        for (let line of original) {
            line = this.replacePlaceholders(line, activeFile);
            header += (original.length > 0) ? (token + " " + line + "\n") : token;
        }
        return header;
    }

    /**
     * multiLineCommentHeader returns license header string with multiple line comment style.
     * @param license License instance initialized from licenser.License.
     * @param start multiplie line comment start string.
     * @param end multiple line comment end string.
     * @param ornament multiple line comment ornament string.
     */
    private multiLineCommentHeader(license: License, start: string, end: string, ornament: string, spdxFormat? : boolean, fileName?: string): string {
        let original: string[];
        let header = start + "\n";
        let activeFile = fileName;
        if (!activeFile) {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return ""; 
            activeFile = editor.document.fileName || "";
        }
        if (!activeFile) return ""; // Guard against no open file

        if (spdxFormat == true) {
            original = license.spdxHeader().split("\n");
        } else {
            original = license.header().split("\n");
        }

        for (let line of original) {
            line = this.replacePlaceholders(line, activeFile);
            if (original.length > 0) {
                header += ornament + " " + line + "\n";
            }
        }
        header += end + "\n";
        return header;
    }

    /**
     * getAuthor fetches author name string from one of the followings in this order.
     *   1. licenser.author in workspace setting
     *   2. licenser.author in user setting
     *   3. OS environment.
     */
    private getAuthor(): string {
        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        let author = licenserSetting.get<string>("author", process.env.USER || "Unknown-Author");
        console.log("Author from setting: " + author);
        if (author !== undefined && author.length !== 0) {
            return author;
        }
        try {
            const userInfo = os.userInfo();
            if (userInfo && userInfo.username) {
                author = userInfo.username;
            }
        } catch (e) {
            vscode.window.showWarningMessage("set author name as ’licenser.author’ in configuration. OS username will be used as default.");
            author = process.env.USER || process.env.USERNAME || "Unknown-Author";
        }
        return author;
    }

    public dispose() {
        this._disposable.dispose();
    }

    private replacePlaceholders(text: string, fileName: string): string {
        const stats = fs.statSync(fileName);
        
        // @FILENAME@ -> subdir/filename.ext
        // We use workspace root to get the relative path
        const relativePath = vscode.workspace.asRelativePath(fileName);
    
        // Dates formatting (YYYY-MM-DD)
        const createdDate = this.getFileCreatedDate(fileName);
        const modifiedDate = stats.mtime.toISOString().split('T')[0];
    
        return text
            .replace(/@FILENAME@/g, relativePath)
            .replace(/@FILE@/g, relativePath) // Fallback for standard @FILE@
            .replace(/@CREATED@/g, createdDate)
            .replace(/@LAST_MODIFIED@/g, modifiedDate);
    }

    private getFileCreatedDate(filePath: string): string {
        try {
            const stats = fs.statSync(filePath);
            return stats.birthtime.toISOString().split('T')[0];
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    }

    public async updateLastModified(document: vscode.TextDocument) {
        // Prevent running on VS Code settings or workspace files where the template might be stored
        const fileName = path.basename(document.fileName);
        if (fileName === 'settings.json' || fileName.endsWith('.code-workspace')) {
            return;
        }

        let licenserSetting = vscode.workspace.getConfiguration("licenser");
        const autoUpdate = licenserSetting.get<boolean>("autoUpdateLastModified", true);
        
        if (!autoUpdate) return;
    
        // Only check the top of the file where the header is located to avoid modifying random code
        const maxLinesToCheck = Math.min(document.lineCount, 50);
        // Regex looks for "lastModified: 2026-04-26
        const lastModifiedRegex = /(lastModified:\s*)(@LAST_MODIFIED@|\d{4}-\d{2}-\d{2})/;
        const currentTime = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let changed = false;
        
        const edit = new vscode.WorkspaceEdit();

        for (let i = 0; i < maxLinesToCheck; i++) {
            const line = document.lineAt(i);
            if (lastModifiedRegex.test(line.text)) {
                const newText = line.text.replace(lastModifiedRegex, `$1${currentTime}`);
                if (newText !== line.text) {
                    edit.replace(document.uri, line.range, newText);
                    changed = true;
                }
                break; // Stop after finding the first match
            }
        }

        if (changed) {
            await vscode.workspace.applyEdit(edit);
            // Save the document again after the edit
            document.save();
        }
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}
