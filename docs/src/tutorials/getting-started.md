# Getting started

GoMeta.jl adds interpretable `#~` metadata to ordinary Julia source files — this page takes
you from install to a first rendered share-view. Current release: **0.3.2** (alpha).

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
to the repository root (an installed copy also contains `examples/`, but buried in the
package store).

:::

## Your first metaLine

Take an ordinary Julia file and add one comment line:

```gometa
# An ordinary Julia file — with GoMeta metaLines in its comments:
#~ hide{ :label4 , isCode }   ## hide everything in scope that is code or carries :label4
x = 1                          # ...content...
```

That `#~` line is a **metaLine**. GoMeta absorbs it, evaluates which content it applies to,
and the render applies the **Visib** verdict — in-scope code comes back `## `-commented in
the rendered share-view, while your file stays an ordinary Julia file: GoMeta **evaluates**
metadata; **it never executes the file** it processes.

## Quickstart: process a committed example

Clone the repository first — the quickstart reads the committed `examples/` corpus relative
to the repository root. Then process one committed example end-to-end:

```julia
import GoMeta

bytes  = read("examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl")
result = GoMeta.goMeta(bytes)             # parse → absorb → evaluate → apply → emit
result.status == GoMeta.PROCESS_OK || error("processing failed")   # typed status check
out    = GoMeta.outputs(result)           # (blsStructure_bytes, render_bytes)
print(String(copy(out.render_bytes)))     # the rendered share-view of the file

evals = GoMeta.altValues_evals(result)    # the evaluated Alterant values, per piece of the file
                                          # (`evals` = evaluated metadata values — unrelated
                                          #  to Julia's `eval`)
evals[1]                                  # (cell_handle, attr, value, polarity), e.g. (…, :label_label1, true, true)
```

Two output halves come back: `render_bytes` is the rendered share-view of the file;
`blsStructure_bytes` is its structural twin — the parsed Block/Line/Segment tree serialized
deterministically. What the render does here: the line marked `#~ discard` is **removed**,
and the code line (which inherits `hide{ … isCode }` from the file's first metaLine) is
**commented out** with the `## ` hide marker. The full input/output pair is committed at
`examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl` →
`examples/OutFileFolder/file_for_Example_Proposal_JuliaCon.jl` — the same bytes the golden
suite pins.

The quickstart also ships in the repository as `notebooks/src/quickstart.jl` — one source,
two faces: it runs as a plain script from the checkout root, and `notebooks/quickstart.ipynb`
is derived from that same file's `#~` marks.

## Explore the checkout

Run **all seven** committed examples and verify each render byte-for-byte against the
committed references — the same pairs are pinned by the shipped 1140-test suite at this
release (green under a plain `Pkg.test()`):

```
julia --startup-file=no --project=. -e 'using Pkg; Pkg.instantiate()'   # once, resolves the package env
julia --startup-file=no --project=. run_examples.jl
```

A small query demo ships beside the driver — "find it again" over the same committed corpus:

```
julia --startup-file=no --project=. find_by_label.jl            # per-label overview
julia --startup-file=no --project=. find_by_label.jl label5     # which cells carry :label5, and
                                                                # each cell's evaluated visibility verdict
```

The checkout also carries the notebook family under `notebooks/`: one marked source file,
four notebook editions (full · student · report · slides), plus one executed twin. Every
GENERATED file regenerates byte-identically — while the executed twin carries real kernel
outputs and is validated separately, outside that byte gate:

```
julia --startup-file=no --project=. notebooks_from_source.jl --check
```

The committed corpus is trusted input; read the README's SECURITY section before running
GoMeta on files you did not write.

From here:

- [What is GoMeta?](../concepts/what-is-gometa.md) — the mental model in five minutes.
- [metaLines](../concepts/metalines.md) — the syntax: labels, conditions, depth, attachment.
- The repository's `examples/` corpus — seven committed input/output pairs that render
  byte-identically under the test suite, plus the quickstart in the
  [README](https://github.com/gometa-jl/GoMeta.jl).
- The repository's three references: `docs/SYNTAX-AND-SEMANTICS.md` (the language),
  `docs/public-api.md` (the API + the error-mode catalogue), `docs/CANONICAL-OUTPUT.md`
  (the two output halves and the six render rules).

## Questions

Write to [hello@gometa.dev](mailto:hello@gometa.dev) or open an issue in the
[repository](https://github.com/gometa-jl/GoMeta.jl).
