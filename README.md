# DocOS / doc-os | [DEMO](https://farishan.github.io/doc-os/)

OS simulation for HTML Document. This is a toy with learning purpose, NOT for serious usage.

## rules

1. Keep each file under ~100 lines of code

## concepts
flow:

1. Import `OS` module
  1. `const os = OS.getInstance()`
  2. `os.boot()`
  ...

## development

- `npm run dev`
- run `example/index.html`

---

todo:

- [x] refactor to ES modules format, move to `modules`
  - [x] refactor `doc-os--require`, then
    - [x] remove `doc-os--require`
  - [x] refactor `doc-os--rollup`, then
    - [x] remove `doc-os--rollup`
- [x] merge all modules into single main module
- [ ] finish concept docs
- [ ] finish all `@todo`
- [ ] [nice to have] add tests
- [ ] [nice to have] create multiple formats (UMD, ES, amd, CommonJS), if needed