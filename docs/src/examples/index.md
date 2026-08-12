# Examples

Every example here starts from one ordinary **Julia** file carrying `#~` metaLines in its
comments. The smallest examples pair each input with the one rendered share-view it derives;
the richest derive several outputs from a single source — each with its own view of what is
shown, what stays hidden, and what runs. Two kinds of control are on display: **control of
rendering** — which content each derived view carries — and **control of execution** — which
code a notebook or a docs build actually runs.

The smallest examples are the repository's committed corpus: **seven input/output pairs**
under `examples/` that render **byte-identically**, pinned by the shipped 1140-test suite
at this release. Verify every pair yourself from a repository checkout:

```
julia --startup-file=no --project=. -e 'using Pkg; Pkg.instantiate()'   # once
julia --startup-file=no --project=. run_examples.jl
```

## The notebooks pipeline

One source, many outputs. `notebooks_from_source.jl`, at the repository root, derives a
whole notebook family from ONE marked Julia source file — purely from its `#~` marks. From
`notebooks/src/montecarlo.jl` — an ordinary, runnable Julia file (`include` it) — it emits
**four notebook editions**; a standard `jupyter nbconvert --execute` run then produces the
**executed twin**:

- **full** — every surviving cell, with legend-driven tags (`parameters`,
  `skip-execution`, `solution`, `deep-dive`);
- **student** — the worksheet: the solution cell is absent, a scaffold cell stands in,
  and instruction cells are locked;
- **report** — the reading view: every code input folded;
- **slides** — a slide type per cell, scraped from the source's depth marks;
  `jupyter nbconvert --to slides` turns it into a reveal.js deck;
- **executed** — the one edition with real outputs, from a standard
  `jupyter nbconvert --execute` run.

Each line's fate comes from the engine's own evaluated verdicts — the `:visib` rows of
`GoMeta.altValues_evals` — never re-derived from the render. A verdict-hidden line is
never visible in a rendered view, and never lost: it travels with the notebook in source
form (an HTML comment in markdown cells, `gometa` cell metadata in code cells), so the
derivation is a format transformation, not a projection. A **discarded** line travels
nowhere. Hidden lines do not execute in notebooks.

A second source ships the same way: `notebooks/src/quickstart.jl` runs as a script from
the checkout root *and* as its derived notebook — the onboarding artifact demonstrates
the pipeline it teaches.

Every generated artifact regenerates **byte-identically** (the executed twin, which
carries real kernel outputs, is validated separately, outside that byte gate):

```
julia --startup-file=no --project=. notebooks_from_source.jl --check
```

## Documenter pages as views

The same marks in the same source also derive a pair of Documenter manual pages —
`docs/montecarlo-full.md` and `docs/montecarlo-reader.md`. The pages are **views**:
verdict-hidden lines are simply not on them (the one exception is Documenter's own
executed blocks — `# hide`-marked `@example` lines and `@setup` bodies — which the docs
build runs and display-hides while they remain present in the raw page markdown), and
metaLines do not ride them. The `#~` marks additionally decide which `jldoctest` blocks
each page carries — **the docs build runs exactly the tests the marks kept**. Rendering
control and execution control come from the same metadata.

## Jupyter notebook example

::: info Coming at launch

A full worked Jupyter example lands here at launch — it is being finalized now. In the
meantime, the complete notebook family ships in the repository under `notebooks/`, with a
README that explains every artifact and how to regenerate it.

:::

## Documenter.jl example

::: info Coming at launch

A full worked Documenter.jl example lands here at launch — it is being finalized now. In
the meantime, the derived manual-page pair ships in the repository under `docs/`, generated
from `notebooks/src/montecarlo.jl` by the shipped generator at the repository root.

:::

New to the syntax? Start with [What is GoMeta?](../concepts/what-is-gometa.md) and
[metaLines](../concepts/metalines.md), or install via
[Getting started](../tutorials/getting-started.md).
