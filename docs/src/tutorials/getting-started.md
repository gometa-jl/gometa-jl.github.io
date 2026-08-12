# Getting started

## Install

```julia
using Pkg
Pkg.add(url = "https://github.com/gometa-jl/GoMeta.jl")   # GitHub-only at this release
```

Requires Julia **1.12** (or newer 1.x). The core has exactly two dependencies
(StaticArrays + InlineStrings, exact-pinned) — install into a **fresh environment**
(`Pkg.activate` a new directory, or `] activate --temp`) so the exact pins cannot conflict
with versions already resolved in an existing environment.

::: tip Run the examples from a checkout

`Pkg.add` gives you the package; to also run the committed examples and the corpus driver,
**clone the repository** — the quickstart and the driver read `examples/` by paths relative
to the repository root.

:::

## Your first metaLine

Take an ordinary Julia file and add one comment line:

```julia
#~ hide{ isCode }   ## hide everything in scope that is code
x = 1
```

That `#~` line is a **metaLine**. GoMeta absorbs it, evaluates which content it applies to
(here: the attached code below it), and the renderer applies the **Visib** verdict — the
code block is hidden in the rendered output, while your file itself is untouched and still
runs exactly as before.

From here:

- [What is GoMeta?](../concepts/what-is-gometa.md) — the mental model in five minutes.
- [metaLines](../concepts/metalines.md) — the syntax: labels, conditions, depth, attachment.
- The repository's `examples/` corpus — seven committed input/output pairs that render
  byte-identically under the test suite, plus the quickstart in the
  [README](https://github.com/gometa-jl/GoMeta.jl).

## Questions

Write to [hello@gometa.dev](mailto:hello@gometa.dev) or open an issue in the
[repository](https://github.com/gometa-jl/GoMeta.jl).
