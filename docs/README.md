# DocOS / doc-os Documentation

## Introduction

Welcome to the documentation for DocOS, a project born from my journey to learn JavaScript programming and operating system (OS) concepts. As a former Discworld MUD player, I aspired to create something reminiscent of that experience. Along the way, I discovered a captivating game called Kingsway, which greatly inspired me and gave me the motivation to embark on (and hopefully complete) this project. In addition to these two games, I found similar projects within the realm of GitHub.

## Technology Stack Overview

Initially, I began with a basic stack of HTML, CSS, and JavaScript (JS), avoiding any complex build tools. However, as the project grew rapidly, managing modules became increasingly challenging.

Subsequently, I experimented with AMD (requirejs). I was drawn to AMD and requirejs due to their user-friendliness; running the JS program was as simple as double-clicking the index.html file. However, I encountered difficulties when I wanted to explore new coding styles in other module definitions, such as ESM (ECMAScript Modules). The confusion arose because requirejs is older than ESM and has fewer users. Transitioning between the AMD mindset and the ESM mindset proved challenging, despite both being JavaScript module systems.

I then transitioned to using Rollup. While it was indeed more convenient, I found myself rapidly switching between projects, testing ideas, and trying different stacks for various personal and work-related projects. This resulted in a temporary abandonment of the DocOS project. Upon returning to it, I faced confusion once again, as the code felt outdated. This could be attributed to my excessive use of trendy tools in my day job.

As of August 2023, I have adopted esbuild. Although Vite is stable and widely used, I found it unnecessary to make the switch at this time. My goal was to transition from Rollup to something slightly more modern. I required tools that were quick to set up and easily integrable into existing projects, even those using outdated technology stacks that I no longer prefer. For these reasons, I opted for esbuild. By initializing an npm package, installing the necessary components, and creating a simple build script, I was able to focus on refactoring my existing code.

I acknowledge that my tendency to change the technology stack might lead to further changes in the near future. However, I am prepared to confront this challenge, as I believe in the value of gaining experience with various tools.

...