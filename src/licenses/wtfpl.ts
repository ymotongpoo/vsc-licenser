//    Copyright 2018 Yoshi Yamaguchi
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

export class WTFPL {
  public author: string;
  public year: string;

  constructor(author: string) {
    this.author = author;
    const date = new Date();
    this.year = date.getFullYear().toString();
  }

  public termsAndConditions(): string {
    const template = `DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
Version 2, December 2004

Copyright (C) ${this.year} ${this.author}

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.`;
    return template;
  }

  public header(): string {
    const template = `Copyright ${this.year} ${this.author}.
Use of this source code is governed by the WTFPL
license that can be found in the LICENSE file.`;
    return template;
  }
}
