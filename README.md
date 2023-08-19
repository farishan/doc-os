# DocOS / doc-os

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

- [ ] refactor to ES modules format, move to `modules`
  - [x] refactor `doc-os--require`, then
    - [x] remove `doc-os--require`
  - [ ] refactor `doc-os--rollup`, then
    - [ ] remove `doc-os--rollup`
- [ ] merge all modules into single main module with multiple formats (UMD, ES, amd, CommonJS), if needed
- [ ] finish all `@todo`
