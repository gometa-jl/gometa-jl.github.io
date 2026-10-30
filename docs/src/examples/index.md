# Examples

Every example here starts from ordinary Julia files, each carrying `#~`
[metaLines](../reference/syntax-and-semantics.md#metaLine) in its comments. The smallest
examples pair each input file with the rendered copy the basic renderer — a development tool, strictly speaking no Extension —
writes from the [GoMeta Engine](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension)'s
run; the richest derive several outputs from one source file, each with its own choice of what is
shown, what stays hidden, and what runs. Two kinds of control are on display: control of
rendering — which content each derived output carries — and control of execution — which code a
notebook or a documentation build actually runs — both from the same metadata.

## 1. The committed corpus: seven pairs

The repository's `examples/` directory holds seven input files under `InFileFolder/` and, for
each, its committed rendered copy under `OutFileFolder/` — byte for byte what the basic renderer
writes from the Engine's run; the shipped test suite pins the same bytes. Two of the seven serve, in general, as the law of the notation: `file_for_Example_Proposal_JuliaCon.jl` and `file_for_Example_Extended.jl` — the [Syntax & semantics](../reference/syntax-and-semantics.md#11.-The-examples) page lists what each exercises and shows, for each, every Block and Line with what the Engine evaluated. Five feature files
each show one feature of the notation, named in the file's header: `feature_contiguous_metablock.jl`,
`feature_contiguous_metablock_blankline.jl`, `feature_explicit_close.jl`,
`feature_order_of_application.jl` and `feature_triple_tilde.jl`. Each input's `##` comments state
the expected behaviour and the reason why — the files are the specification.

Verify every pair yourself from a repository checkout:

```
julia --startup-file=no --project=. -e 'using Pkg; Pkg.instantiate()'   # once
julia --startup-file=no --project=. devtools/run_examples.jl
```

## 2. One source, its notebook

`notebooks_from_source.jl`, at the repository root, derives from ONE marked Julia source file
— purely from its metaLines and [metaSegments](../reference/syntax-and-semantics.md#statement,-metaSegment) — one notebook and two pages of the package's own manual. Each
line's fate — `show`, `hide` or `discard` — is taken from the Engine's answer for that line's Line
[Component](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File),
never re-derived from a rendered copy. From `notebooks/src/montecarlo.jl` — an ordinary,
runnable Julia file — it emits `notebooks/montecarlo.ipynb`, the full edition: every surviving
notebook cell, with tags the source's label legend drives — its header says which label means what. The repository also keeps
`montecarlo-executed.ipynb`, the one edition with real outputs, produced by executing that
notebook; it is validated separately, outside the byte check below. A second source ships the
same way, with its notebook alone and no manual pages: `notebooks/src/quickstart.jl` runs as a script from the checkout root and as its
derived notebook, `quickstart.ipynb`.

How hide and the metadata travel: a line the Engine evaluated `hide` is never visible when the
notebook is viewed, and never lost — it travels with the notebook in source form, as an HTML
comment in a markdown cell and as the cell's own metadata in a code cell — so the derivation is
a format transformation, not a view that leaves things out; the source's metaLines travel the same two ways. A
line the Engine evaluated `discard` travels nowhere. Hidden lines do not execute in the notebook.

Every generated file regenerates byte for byte:

```
julia --startup-file=no --project=. notebooks_from_source.jl --check
```

## 3. Two manual pages from the same source

The same metaLines and metaSegments in `notebooks/src/montecarlo.jl` also derive the two manual pages `docs/montecarlo-full.md`
and `docs/montecarlo-reader.md`, and decide which `jldoctest` blocks each page carries — the
documentation build runs exactly the tests the metaLines kept. The two pages differ. The FULL
page is a transformation artifact like the notebook: every non-discarded metaLine and every
hidden line outside the blocks the documentation build runs rides invisibly in it, absent from the built site. The READER
page is a view: nothing rides invisibly in it, and the sections it leaves out travel nowhere.

## 4. The demo: find it again

A demo program under `extensions/` processes the committed examples and answers which pieces of
which files carry a given [label](../reference/syntax-and-semantics.md#label), each with its
visibility as the Engine answers it:

```
julia --startup-file=no --project=. extensions/find_by_label.jl            # per-label overview
julia --startup-file=no --project=. extensions/find_by_label.jl label5     # one label, all hits
```

The worked examples on this page may still change.

From here: [Getting started](../tutorials/getting-started.md) — one complete run on the first
example file; [How does GoMeta work?](../concepts/how-does-gometa-work.md) — one run, from a file
to what the Extensions receive; [Extensions](../concepts/extensions.md) — what acts on what a run delivers.
