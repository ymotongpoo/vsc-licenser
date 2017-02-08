# Changelog
## 0.5
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
