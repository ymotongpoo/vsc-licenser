# Licenser

An extension for adding license headers and LICENSE files into your workspace.
You can find this extension on [Marketplace for VS Code](https://marketplace.visualstudio.com/items?itemName=ymotongpoo.licenser).

## Install

Launch VS Code, go to the *Quick Open* menu (`Ctrl+P` on Windows/Linux, `⌘P` on macOS), and type:

```
ext install licenser
```

## Commands and features

This extension provides shortcuts to insert license headers to source code files and
to create a LICENSE file based on the configurations in `settings.json`. This extension
not only provides shortcuts but also enables auto-insertion of license header on creation
of new file.

You can call these commands via *Command Palette* (`Ctrl+Shift+P` on Windows/Linux, `⌘⇧P` on OS X):

* "licenser: Create LICENSE file"
  * create LICENSE file in your repository.
* "licenser: Insert license header"
  * insert license header into the currently opened source code file.
* "licenser: Arbitrary license header"
  * insert arbitrary license header into the currently opened source code file.

Programming languages supported by this extension are (alphabetical order):

* bat
* C
* Clojure
* C++
* C#
* CSS
* D
* Dockerfile
* Erlang
* Elixir
* F#
* Go
* Groovy
* HTML
* ini
* Java
* JavaScript
* JSX (JavaScript, TypeScript support)
* Lua
* Makefile
* Markdown
* Objective-C
* Perl
* PHP
* Plain text
* PowerShell
* Python
* Ruby
* Rust
* TypeScript
* SCSS (Sass)
* ShellScript
* Swift
* XML

The following programing languages are supported in the manual configurations of this extension (see `contributes.languages` in `package.json`):

* Crystal
* Elixir
* Erlang
* Haskell
* Julia
* LISP (CommonLisp, Scheme)
* Nim (and Nimble)
* OCaml
* Pascal

## Configurations

### licenser.license

```
"licenser.license": "AL2"
```

This setting defines the license used by the project.

Currently, supported licenses are:

* "AGPLv3": GNU Affero General Public License version 3
* "AL2": Apache License version 2
* "BSD2": BSD 2-clause License
* "BSD3": BSD 3-clause License (New BSD License)
* "BSL1": Boost Software License - Version 1.0
* "GPLv2": GNU General Public License version 2
* "GPLv3": GNU General Public License version 3
* "LGPLv3": GNU Lesser General Public License version 3
* "MIT": MIT License
* "MPLv2": Mozilla Public License version 2
* "CC-BY-3": Creative Commons Attribution 3.0
* "CC-BY-SA-3": Creative Commons Attribution-ShareAlike 3.0
* "CC-BY-NC-3": Creative Commons Attribution-NonCommercial 3.0
* "CC-BY-ND-3": Creative Commons Attribution-NoDerivs 3.0
* "CC-BY-NC-SA-3": Creative Commons Attribution-NonCommercial-ShareAlike 3.0
* "CC-BY-NC-ND-3": Creative Commons Attribution-NonCommercial-NoDerivs 3.0
* "CC-BY-4": Creative Commons Attribution 4.0
* "CC-BY-SA-4": Creative Commons Attribution-ShareAlike 4.0
* "CC-BY-NC-4": Creative Commons Attribution-NonCommercial 4.0
* "CC-BY-ND-4": Creative Commons Attribution-NoDerivs 4.0
* "CC-BY-NC-SA-4": Creative Commons Attribution-NonCommercial-ShareAlike 4.0
* "CC-BY-NC-ND-4": Creative Commons Attribution-NonCommercial-NoDerivs 4.0
* "CC0-1": CC0 1.0
* "WTFPL": Do What The Fuck You Want To Public License
* "zlib": zlib License
* "Custom": User-defined (see `licenser.custom*` settings below)

### licenser.author

```
"licenser.author": "Yoshi Yamaguchi"
```

This setting defines the author name that would be inserted into the
license header template.

### licenser.projectName

```
"licenser.projectName": "Awesome project"
```

**This setting should be in Workspace settings.** This setting defines the project name you are working on.
This setting is only used in the template for GPLv2 and GPLv3. Default value would be
your workspace root directory name. Be aware that this setting should be in Workspace setting,
not in User setting, since User setting affects all workspaces which are not relevant to this project name.

### licenser.useSingleLineStyle

```
"licenser.useSingleLineStyle": true
```

This setting defines your preference of comment style. If this setting is set as `true`,
licenser uses single line comment style for license header in case that the language has
single line comment style. If it is set as `true` but the language doesn't have single line comment style,
multi line comment will be applied.

### licenser.customTermsAndConditions

```
"licenser.customTermsAndConditions": "Copyright @YEAR@ @AUTHOR@\n\nThese are my terms and conditions..."
```

This setting defines the text used to create the `LICENSE` file when the "Custom" license type is selected.

The following placeholders can be used:

* `@AUTHOR@`: Replaced with `licenser.author`
* `@FILE@`: Replaced with the current file name (only useful for custom header).
* `@PROJECT@`: Replaced with `licenser.projectName`
* `@YEAR@`: Replaced with the current year

**Note:** Newlines are not allowed in settings strings, so you must use `\n` instead.
Other characters, such as double-quotes, may need to be escaped as well.
Consider using a regex replace to convert an existing multi-line file to a single line.

### licenser.customHeader

```
"licenser.customHeader": "@FILENAME@ - @PROJECT@\n\nCopyright @YEAR@ @AUTHOR@\n\nThis is my license..."
```

This setting defines the text used to create the license header file when the "Custom" license type is selected.

Placeholders and escaping requirements are the same as `licenser.customTermsAndConditions`.

### licenser.disableAutoHeaderInsertion

```
"licenser.disableAutoHeaderInsertion": false
```

This setting defines the behavior of header auto-insertion.
If this setting is set as `true`, licenser will disable auto-insertion of license header on creation of new file.

## Call to action

### Report issues

Finally the author bought Windows 10 machine, and he can test the app by himself!
For bug reporting, please create a ticket on [GitHub repository](https://github.com/ymotongpoo/vsc-licenser/issues).

### Pull requests

This repository is mainly developed under 'develop' branch, so please make pull requests there, not to 'master' branch.

## Changelogs

See all changes in [CHANGELOG](https://github.com/ymotongpoo/vsc-licenser/blob/master/CHANGELOG.md).

## Contributors

Thank you for contributions to "licenser".

* @aodag
* @Cologler
* @jimmidyson
* @simonmika
* @marchrock
* @dtl
* @jrobeson
* @dlech
* @Lexicality
* @detwin
* @teo-tsirpanis
* @olefasting
* @beta

## Reference

* [All CC 3.0 Legal Codes](https://creativecommons.org/2011/04/15/plaintext-versions-of-creative-commons-licenses-and-cc0/)
* [All CC 4.0 Legal Codes](https://creativecommons.org/2014/01/07/plaintext-versions-of-creative-commons-4-0-licenses/)
