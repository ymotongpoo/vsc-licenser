//    Copyright 2016 David Lechner, Yoshi Yamaguchi
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

import { License } from "./type";
import path = require("path");
import fs = require("fs");

export class Custom {
    public author: string;
    public year: string;
    public project: string;
    public customTermsAndConditions: string;
    public customHeader: string;
    public filePath: path.ParsedPath;

    constructor(author: string, project: string, customTermsAndConditions: string, customTermsAndConditionsFile: string, customHeader: string, customHeaderFile: string, filePath: string, ) {
        this.author = author;
        let date = new Date();
        this.year = date.getFullYear().toString();
        this.project = project;
        this.customTermsAndConditions = customTermsAndConditions;
        this.customHeader = customHeader;
        this.filePath = path.parse(filePath);

        if (customTermsAndConditionsFile) {
            this.customHeader = fs.readFileSync(customTermsAndConditionsFile).toString();
        }

        if (customHeaderFile) {
            this.customHeader = fs.readFileSync(customHeaderFile).toString();
        }
    }

    private replaceVariables(text: string): string {
        text = text.replace(/@AUTHOR@/g, this.author);
        text = text.replace(/@YEAR@/g, this.year);
        text = text.replace(/@PROJECT@/g, this.project);
        text = text.replace(/@FILE@/g, this.filePath.base);
        return text;
    }

    public termsAndConditions(): string {
        let template = this.replaceVariables(this.customTermsAndConditions);
        return template;
    }

    public header(): string {
        let template = this.replaceVariables(this.customHeader);
        return template;
    }
}
