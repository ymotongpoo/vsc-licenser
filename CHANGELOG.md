# Changelog

## 1.9.0
* add support for yaml

## 1.8.0
* add purescript, terraform, vue, svelite (#122, #123)
* add BUSL-1.1 support (#124)

## 1.7.0
* fix to ignore hidden (dot-started) files (#110)
* fix to add postcss (#103)
* fix vulnerabilities

## 1.6.0
* fix onStartupFinished activate event to initialize extension on startup (#99)
* add SPDX license (#96)
* fix nonexitent multiline notation for shellscript (#99)
* add support for environment variables (#99)
* change for multiple file mode to respect shebang (#91)
## 1.5.0
* fix config for BSL1 (#74)
* change alias for Pascal (#75)
* support ADVPL (#76)
* fix new lines in custom header (#79)
* add 0BSD support (#81)
* fix double-quote in AGPL v3 (#82)

## 1.4.0
* add Unlicense support (#61)
* supoprt LaTeX and Dart (#63)
* support inserting license header to multiple file (#65)
* support GN and Starlark (#67)

## 1.3
### 1.3.1

* fix README

### 1.3.0

* dynamic license chooser (#55)
* fix command name (#56)

## 1.2
(skipped)

## 1.1
### 1.1.1
* add Handlebars, D and Pascal support (#31, #33, #35)
* add Boost Software License support (#34)

### 1.1.2
* add Julia, Crystal, Nim and Nimble support (#38)
* add config to diable auto-insertion (#42)
* add WTFPL support (#43)
* fix the bug where the placeholder is replaced only once. (#44)

## 1.0

### 1.0.1
* add Lua support (#30)

### 1.0.0
* more support on custom license header thanks to @dlech. (#23, #29)

## 0.5
### 0.5.4
* bug fix #25.

### 0.5.3
* support arbitrary license header insertion. (#22)

### 0.5.2
* bug fix #19.

### 0.5.1
* add Erlang, PowerShell support.

### 0.5.0
* add CC3.0, CC4.0 support.

## 0.4
### 0.4.2
* bug fix #14.

### 0.4.1
* add Haskell, Clojure, JSX, CommonLisp, Scheme support. (fix #10.)
* fix bugs around `useSingleLineStyle` option.
* fix OCaml support.

### 0.4.0
* add optionn for comment style preference (`licenser.useSingleLineStyle`)

## 0.3 (more language and license support)
### 0.3.2
* bug fix #11

### 0.3.1 (breaking change)
* add AGPLv3, MPLv2, BSD2 support. (there's breaking change on 'BSD' setting.)
* fix issue on LGPL handling.

### 0.3.0
* add Swift, Objective-C, SCSS(Sass), Dockerfile, Groovy, Makefile, ini, bat support.
* change comment notation handling from {[key:string]:string} to dedicated class.

## 0.2 (add feature to insert license header)
### 0.2.5
* add Rust support.

### 0.2.4
* merge fix to the template of MIT and GPLv3.

### 0.2.3
* add description for `projectName` setting.

### 0.2.2
* bug fix #4

### 0.2.1
* nit change.

### 0.2.0
* add feature to insert license header on file creation.

## 0.1 (first test release)
### 0.1.21
* add feature to skip first line if it is shebang.
* fix path issue on windows.

### 0.1.13-20
* skipped due to vsce command failure.

### 0.1.12
* add XML support.

### 0.1.11
* fix `license` value in `package.json`.

### 0.1.10
* fix bug of default username on Windows.

### 0.1.9
* fix bug on using MIT license.
* change default author name to use OS username.
* add one empty line margin after license header.
* change license header not to add unnecessary spaces.

### 0.1.8
* nit. skipped.

### 0.1.7
* fix the link to CHANGELOG.

### 0.1.6
* add `keywords` in `pacakge.json`.

### 0.1.5
* support for GPLv2, LGPLv3, MIT
* add default options for licenser.license.
