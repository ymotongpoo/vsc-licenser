//    Copyright 2020 Estevão Souza <tevocsouza@gmail.com>
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

export class BSD0 {  // Because class definition can't start with numbers
    public author: string;
    public year: string;

    constructor(author: string) {
        this.author = author;
        let date = new Date();
        this.year = date.getFullYear().toString();
    }

    public termsAndConditions(): string {
        let template = `  Zero-Clause BSD / Free Public License 1.0.0 (0BSD)

  Permission to use, copy, modify, and/or distribute this software for any purpose
  with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.`

        return template;
    }

    public header(): string {
        let template = `Copyright ${ this.year } ${ this.author }. All rights reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file.`;
        return template;
    }

    public spdxHeader(): string
    {
        let template = `Copyright ${ this.year } ${ this.author }.
SPDX-License-Identifier: 0BSD`
        return template;
    }
}
