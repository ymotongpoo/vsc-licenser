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

/**
 * Notation class holds comment notation information of each programming language.
 * TODO(ymotongpoo): add default recommended commenting style in Enum.
 * TODO(ymotongpoo): consider PHP"s case and shebang. (comment can"t start from line 1.)
 */
class Notation {
    private _languageId: string;
    private _multi: [string, string];
    private _single: string;
    private _ornament: string;

    constructor(id: string, multi: [string, string], single: string, ornament: string) {
        this._languageId = id;
        this._multi = multi;
        this._single = single;
        this._ornament = ornament;
    }

    get languageId(): string {
        return this._languageId;
    }

    get multi(): [string, string] {
        return this._multi;
    }

    get single(): string {
        return this._single;
    }

    get ornament(): string {
        return this._ornament;
    }

    /**
     * hasMulti returns if the Notation instance has multiple line comment style tokens.
     */
    hasMulti(): Boolean {
        const [l, r] = this._multi;
        return l.length > 0 && r.length > 0;
    }

    /**
     * hasSingle returns if the Notation instance has single line comment style tokens.
     */
    hasSingle(): Boolean {
        return this._single.length > 0;
    }
}

// init
const go = new Notation("go", ["/**", " */"], "//", " *");
const javascript = new Notation("javascript", ["/**", " */"], "//", " * ");
const typescript = new Notation("typescript", ["/**", " */"], "//", " * ");
const java = new Notation("java", ["/**", " */"], "//", " *");
const cpp = new Notation("cpp", ["/**", " */"], "//", " *");
const csharp = new Notation("csharp", ["/**", " */"], "//", " * ");
const fsharp = new Notation("fsharp", ["(**", " *)"], "//", " * ");
const shellscript = new Notation("shellscript", ["<<LICENSE", ">>"], "#", " ");
const python = new Notation("python", ['"""', '"""'], "#", " ");
const ruby = new Notation("ruby", ["=begin", "=end"], "#", " ");
const perl = new Notation("perl", ["=pod", "=cut"], "#", " ");
const html = new Notation("html", ["<!--", "-->"], "", " ");
const css = new Notation("css", ["/**", " */"], "", " *");
const scss = new Notation("scss", ["/**", " */"], "//", " * ");
const c = new Notation("c", ["/**", " */"], "", " * ");
const xml = new Notation("xml", ["<!--", "-->"], "", "");
const php = new Notation("php", ["/**", " */"], "//", " * ");
const rust = new Notation("rust", ["/**", " */"], "//", " * ");
const swift = new Notation("swift", ["/**", " */"], "//", " * ");
const objectivec = new Notation("objective-c", ["/**", " */"], "//", " * ");
const dockerfile = new Notation("dockerfile", ["", ""], "#", " ");
const groovy = new Notation("groovy", ["/**", " */"], "//", " * ");
const bat = new Notation("bat", ["", ""], "rem", "");
const ini = new Notation("ini", ["", ""], ";", "");
const makefile = new Notation("makefile", ["", ""], "#", "");

const ocaml = new Notation("ocaml", ["(**", " *)"], "", " * ");
const lisp = new Notation("lisp", ["", ""], ";;", "");
const haskell = new Notation("haskell", ["{--", "-}"], "--", " - ");

// map betweeen languageId and its comment notations.
// LanguageId is listed here.
// https://code.visualstudio.com/docs/languages/identifiers
export const notations: {[key: string]: Notation} = {
    "go": go,
    "javascript": javascript,
    "typescript": typescript,
    "java": java,
    "csharp": csharp,
    "fsharp": fsharp,
    "shellscript": shellscript,
    "python": python,
    "ruby": ruby,
    "perl": perl,
    "html": html,
    "css": css,
    "scss": scss,
    "sass": scss,
    "c": c,
    "xml": xml,
    "php": php,
    "rust": rust,
    "swift": swift,
    "objective-c": objectivec,
    "dockerfile": dockerfile,
    "makefile": makefile,
    "groovy": groovy,
    "bat": bat,
    "ini": ini,
    "javascriptreact": javascript,
    "typescriptreact": typescript,
    "clojure": lisp,

    "ocaml": ocaml,
    "lisp": lisp,
    "haskell": haskell,
}