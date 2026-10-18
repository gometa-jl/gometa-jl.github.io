```@raw html
---
u_version: "0.1"
---
```

# Getting started

GoMeta.jl adds interpretable `#~` metadata to ordinary Julia source files. This page takes you
from the install through one complete run — the file goes in, [BLS](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File) (GoMeta's parser: Block, Line, Segment) parses it, the [GoMeta Engine](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension)
evaluates the metadata, and the basic renderer, a development tool, shows how an [Extension](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) acts on the result — and on to the checkout's committed
examples. Current release: **0.4.0** (alpha).

## Install

```julia
using Pkg
Pkg.add(url = "https://github.com/gometa-jl/GoMeta.jl")   # GitHub-only at this release
```

Requires Julia **1.12** (or newer 1.x). The core has exactly one registered dependency
(StaticArrays, exact-pinned) — install into a **fresh environment** (`Pkg.activate` a new
directory, or `] activate --temp`) so the exact pin cannot conflict with a version already
resolved in an existing environment.

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

In Julia, `#` is the [comment marker](../reference/syntax-and-semantics.md#comment-marker), and GoMeta's metadata lives in such comments. A line
that opens with the marker `#~` — the comment marker followed by a tilde — is a **[metaLine](../reference/syntax-and-semantics.md#metaLine)**:
the rest of the line carries the metadata, GoMeta's statement, and, after a `##`, an ordinary
comment if you want one. Here the statement `hide{ :label4 , isCode }` names a value of the
[Alterant](../reference/syntax-and-semantics.md) **Visib** — `hide` — and, in the braces, the condition under which that value may
apply: to content that carries the label `:label4` or is code. GoMeta evaluates the metadata —
more precisely, the GoMeta Engine evaluates it — but does not act on those evaluations: that
is the Extensions' role; they receive the evaluations through GoMeta's interface,
[`altValues_evals`](../reference/public-api.md). Your file stays an ordinary Julia file. In a file of another format the
marker is that format's comment marker followed by the tilde — `//~` in the C family (e.g. C, Rust, etc.), `%~` in
LaTeX, the three formats this release knows, named when GoMeta is called (Julia is the
default), never inferred from the file.

An **Alterant** is, for Julia users, most similar to a Type: it defines which values its
instances can take — Visib's are `show`, `hide` and `discard`, and for any one piece of the
file only one of them applies at a time — and the GoMeta Engine evaluates which value applies
to each piece. It is not exactly analogous to a Type: an Alterant usually brings functionality
of its own, which may be invoked during the GoMeta Engine's process, for instance when a value is set. Visib, the visibility
Alterant, is the example throughout this page; the principles it illustrates here hold for every Alterant, while which values an Alterant has, and whether more than one of them may apply to one piece at a time, are each Alterant's own.

The condition in the braces is Julia. GoMeta rewrites its own parts — a label test such as
`:label4`, a BLS key word such as `isCode`, which asks about the state of the piece — into
Julia, Julia's parser reads the result once, and Julia evaluates it when the Engine applies
the statement. Processing a file you did not write therefore runs its conditions as Julia
code: use GoMeta on input you trust, as you would any Julia file you `include`.

## One run, start to finish

Clone the repository first — the quickstart reads the committed `examples/` corpus relative
to the repository root. Then process one committed example,
`examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl`, an ordinary Julia file whose
comments carry metaLines. Its first ten lines:

```gometa
#~ hide{ :label4 , isCode } ## This is a comment within a `Block` of meta.
## The above `Line` of meta initiated this `Block` of meta.
#~ :label1{ (isText && containsMeta), isMeta } ## This meta `Block` ends here.

# This `Line` of text starts a new `Block` of text.
# This `Block` is NOT attached to metadata - it does NOT INHERIT metadata.
# However, this `Line` will get discarded due to: #~ discard

#~2 :label5 show{ !:label5} ## This is line 9. It is a one-line meta `Block`.
using Plots ## This `Line` starts a new `Block` of code.
```

### 1. The file goes in; BLS parses it; the GoMeta Engine evaluates

```julia
import GoMeta

bytes    = read("examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl")
delivery = GoMeta.goMeta(bytes)           # ONE run: BLS parses the file into the BLS Component tree;
                                          # the GoMeta Engine evaluates the metadata over it — ONE object
                                          # delivered, a GoMetaDelivery, carrying both main products
delivery.status == GoMeta.PROCESS_OK || error("processing failed")
```

One call does the whole run. BLS — the parser of GoMeta, named for the three kinds of pieces it
finds: **B**lock, **L**ine, **S**egment — reads the file and records what it finds in the
**BLS Component tree**: the File, its Blocks, their Lines, and the Segments within a Line — each of them a [Component](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File), the
pieces of the file this page speaks of.
Every Block, Line and Segment carries a [flavor](../reference/syntax-and-semantics.md#flavor): Meta, Text or Code — a metaLine is a Line of
flavor Meta.
The GoMeta Engine then evaluates the metadata over that BLS Component tree: for each Component, which value
of which Alterant applies. The run delivers one object with four parts, read by name:
`blsComponentTree`, `altValues_evals`, `status` and `diagnostics` — a run whose status is not
OK delivers a non-empty list of diagnostics.

### 2. The BLS Component tree — one main product

```julia
tree = delivery.blsComponentTree       # provided by BLS itself; travel it with BLS's own functions
for block in GoMeta.BLS.children(tree)                   # the File's Blocks, in source order …
    for line in GoMeta.BLS.children(tree, block)         # … a Block's Lines (a Line's Segments the same way)
        GoMeta.BLS.kind(line) === :Meta || continue      # the Component's flavor: :Meta / :Code / :Text
        println(String(GoMeta.BLS.content(tree, line)))  # the verbatim text of the piece, from the BLS Component tree
    end
end
```

This prints every Line of flavor Meta — every metaLine of the example, by the definition: the
`#~` lines and, with them, the comment line and the empty lines that stand inside the same
Blocks of flavor Meta — from the BLS Component tree and nothing else. The BLS Component tree is BLS's product: an Extension reads
it with BLS's own public functions, never through a function of the GoMeta Engine. `children`
walks down, `kind` names a Component's flavor, `content` gives its text.

### 3. The evaluated Alterant values — the other main product

```julia
evals = GoMeta.readAltValuesEvals(delivery.altValues_evals) # the evaluated Alterant values, per piece of the
                                                            # file, read through the Engine's reader (`evals` =
                                                            # evaluated metadata values — unrelated to Julia's `eval`)
evals[1]                                                    # one row: the Component's handle, the attribute, the value, the polarity
```

`altValues_evals` is the interface the GoMeta Engine delivers to the Extensions: the evaluated
Alterant values, each recorded at its Component. The reader returns it as rows,
one per evaluated value — a tuple of the [Component's handle](../reference/public-api.md) (bytes), the attribute, the value
and the [polarity](../reference/public-api.md) (always `true` at this release). Labels arrive as `:label_label1` …
`:label_label5` with the value `true`; the evaluated visibility as `:visib`. In this example
the first row belongs to line 7, whose trailing `#~ discard` gives that Line the Visib value
`discard`: `(…, :visib, :discard, true)`.

### 4. The Extensions act on the two products — a first look through a development tool

```julia
include(joinpath(pkgdir(GoMeta), "devtools", "load_basic_renderer.jl"))   # the basic renderer — a development tool;
                                                                          # include it at the top level, never inside a function
out = Main.BasicRenderer.outputs(delivery)   # the tool's (blsStructure_bytes, render_bytes) pair
print(String(copy(out.render_bytes)))        # the rendered copy of the file — the way to inspect a run by eye
```

GoMeta's own run ends with the delivery. Acting on it is the Extensions' role. For a first look
the package ships a development tool, the **basic renderer**. It behaves like an Extension: it
reads the two products through the same public surface every Extension uses — the delivered
tree through the functions BLS provides to travel it, every visibility value from the Engine's
answer function, [`evaluatedAltValue`](../reference/public-api.md) — and writes a rendered copy of the file in which each piece appears as its
evaluated Visib value says — shown as it is, hidden (its non-empty lines commented out with `## `), or discarded
(left out). Strictly speaking, though, it is no Extension: it lives under the package's
development tools, and it is there because it serves a vital purpose for the package's
development — it lets what the Engine evaluated be checked by eye, and the test suite pins its
render byte for byte against the committed references. It is not part of the Engine's output.

The rendered copy for lines 5–10 of the input (the whole rendered copy is committed in the repository
under `examples/OutFileFolder/`):

```julia
# This `Line` of text starts a new `Block` of text.
# This `Block` is NOT attached to metadata - it does NOT INHERIT metadata.

#~2 :label5 show{ !:label5} ## This is line 9. It is a one-line meta `Block`.
## using Plots ## This `Line` starts a new `Block` of code.
```

What happened, read from the delivered evaluations: line 7 carried its own `#~ discard` at its
end, so that Line's Visib value is `discard`, and the renderer left the line out. The Code
Block that starts at line 10 is [attached](../reference/syntax-and-semantics.md#attachment,-inheritance) to the metadata above it and [inherits](../reference/syntax-and-semantics.md#attachment,-inheritance) from the file's
first metaLine; `hide{ :label4 , isCode }` applies to it because it is code, so the Block's
Visib value is `hide`. Its Lines carry no value of their own: they are hidden as parts of a
hidden Block — the way every Alterant's value reaches a Block's children. The renderer
therefore commented the `using Plots` line out with `## `.

::: details The full delivery view of this run — every Block and Line with its evaluated values, as the development tools print it

In the development tool's printouts a "cell" is a BLS Component that carries evaluated values —
the tool's word; this site says Component. Its "(no evals — defaults apply)" marks a Component with no evaluated values of its own; it falls under the value of a Component that contains it, else under the Alterant's declared default.

```
File  file_for_Example_Proposal_JuliaCon.jl  —  28 evals rows on 10 cells  (of 8 Blocks · 35 Lines)
├─ Block #2  Meta  L1–L3    "#~ hide{ :label4 , isCode } ## This i…"
│  ● label_label1 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,2)]
│  ├─ Line #2   Meta  L1       "#~ hide{ :label4 , isCode } ## This i…"   (no evals — defaults apply)
│  ├─ Line #3   Meta  L2       "## The above `Line` of meta initiated…"   (no evals — defaults apply)
│  └─ Line #4   Meta  L3       "#~ :label1{ (isText && containsMeta),…"   (no evals — defaults apply)
├─ Block #3  Text  L4–L7    "# This `Line` of text starts a new `B…"   (no evals — defaults apply)
│  ├─ Line #5   Text  L4       ""   (no evals — defaults apply)
│  ├─ Line #6   Text  L5       "# This `Line` of text starts a new `B…"   (no evals — defaults apply)
│  ├─ Line #7   Text  L6       "# This `Block` is NOT attached to met…"   (no evals — defaults apply)
│  └─ Line #8   Text  L7       "# However, this `Line` will get disca…"
│     ● visib        => :discard  (+)   ← Segment #7 "#~ discard"
│         handle ns=:default  grain=Line  path=[(direct,1) (direct,3) (direct,8)]  origin=[(direct,1) (direct,3) (direct,8) (direct,7)]
├─ Block #4  Meta  L8–L9    "#~2 :label5 show{ !:label5} ## This i…"
│  ● label_label1 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
│  ├─ Line #9   Meta  L8       ""   (no evals — defaults apply)
│  └─ Line #10  Meta  L9       "#~2 :label5 show{ !:label5} ## This i…"   (no evals — defaults apply)
├─ Block #5  Code  L10–L20  "using Plots ## This `Line` starts a n…"
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
│  ● visib        => :hide     (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
│  ├─ Line #11  Code  L10      "using Plots ## This `Line` starts a n…"   (no evals — defaults apply)
│  ├─ Line #12  Code  L11      "## This code `Block` is ATTACHED to m…"   (no evals — defaults apply)
│  ├─ Line #13  Code  L12      "## Therefore, this code `Block` recei…"   (no evals — defaults apply)
│  ├─ Line #14  Code  L13      "## `show` from line 9 above does NOT …"   (no evals — defaults apply)
│  ├─ Line #15  Code  L14      "##      as this can only happen"   (no evals — defaults apply)
│  ├─ Line #16  Code  L15      "##      if label5 has NOT been applie…"   (no evals — defaults apply)
│  ├─ Line #17  Code  L16      "## This code `Block` inherits `hide` …"   (no evals — defaults apply)
│  ├─ Line #18  Code  L17      "##      since this is a code `Block` …"   (no evals — defaults apply)
│  ├─ Line #19  Code  L18      ""   (no evals — defaults apply)
│  ├─ Line #20  Code  L19      "println("!!! NOTE !!! Only Code and T…"   (no evals — defaults apply)
│  └─ Line #21  Code  L20      "println("\t Whereas an empty line aft…"   (no evals — defaults apply)
├─ Block #6  Meta  L21–L22  "#~3 :label4 discard{:label3} :label3"
│  ● label_label1 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ● label_label3 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ● label_label4 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ● visib        => :hide     (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ├─ Line #22  Meta  L21      ""   (no evals — defaults apply)
│  └─ Line #23  Meta  L22      "#~3 :label4 discard{:label3} :label3"   (no evals — defaults apply)
├─ Block #7  Text  L23–L30  "# This `Block` of text receives label…"
│  ● label_label1 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ● label_label3 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ● label_label4 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ● visib        => :hide     (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ├─ Line #24  Text  L23      "# This `Block` of text receives label…"   (no evals — defaults apply)
│  ├─ Line #25  Text  L24      "#       plus label5 from further abov…"   (no evals — defaults apply)
│  ├─ Line #26  Text  L25      "#       plus label1 since it `isText`…"   (no evals — defaults apply)
│  ├─ Line #27  Text  L26      "# It is NOT "discarded" since label3 …"   (no evals — defaults apply)
│  ├─ Line #28  Text  L27      "#       when `discard{:label3}` is is…"   (no evals — defaults apply)
│  ├─ Line #29  Text  L28      "# Only after that it receives label3."   (no evals — defaults apply)
│  ├─ Line #30  Text  L29      "# Instead, it gets hidden due to labe…"   (no evals — defaults apply)
│  └─ Line #31  Text  L30      "# This `Line`, however, will NOT get …"
│     ● label_label1 => true      (+)   ← Segment #13 "#~ show"
│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
│     ● label_label3 => true      (+)   ← Segment #13 "#~ show"
│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
│     ● label_label4 => true      (+)   ← Segment #13 "#~ show"
│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
│     ● label_label5 => true      (+)   ← Segment #13 "#~ show"
│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
│     ● visib        => :show     (+)   ← Segment #13 "#~ show"
│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
├─ Block #8  Meta  L31–L32  "#~2 :label5"
│  ● label_label1 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
│  ├─ Line #32  Meta  L31      ""   (no evals — defaults apply)
│  └─ Line #33  Meta  L32      "#~2 :label5"   (no evals — defaults apply)
└─ Block #9  Text  L33–L35  "md"""⏎This is a `Block` of markdown t…"
   ● label_label1 => true      (+)
       handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
   ● label_label5 => true      (+)
       handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
   ├─ Line #34  Text  L33      "md""""   (no evals — defaults apply)
   ├─ Line #35  Text  L34      "This is a `Block` of markdown text. #…"
   │  ● label_label1 => true      (+)   ← Segment #15 "#~ hide"
   │      handle ns=:default  grain=Line  path=[(direct,1) (direct,9) (direct,35)]  origin=[(direct,1) (direct,9) (direct,35) (direct,15)]
   │  ● label_label5 => true      (+)   ← Segment #15 "#~ hide"
   │      handle ns=:default  grain=Line  path=[(direct,1) (direct,9) (direct,35)]  origin=[(direct,1) (direct,9) (direct,35) (direct,15)]
   │  ● visib        => :hide     (+)   ← Segment #15 "#~ hide"
   │      handle ns=:default  grain=Line  path=[(direct,1) (direct,9) (direct,35)]  origin=[(direct,1) (direct,9) (direct,35) (direct,15)]
   └─ Line #36  Text  L35      """""   (no evals — defaults apply)
```

:::

## Explore the checkout

Run **all seven** committed examples and verify each render byte-for-byte against the
committed references — the same pairs are pinned by the shipped test suite (green under a
plain `Pkg.test()`):

```
julia --startup-file=no --project=. -e 'using Pkg; Pkg.instantiate()'   # once, resolves the package env
julia --startup-file=no --project=. devtools/run_examples.jl
```

A quickstart of the same run ships in the repository as `notebooks/src/quickstart.jl` — one
source, two faces: it runs as a plain script from the checkout root, and
`notebooks/quickstart.ipynb` is derived from that same file's `#~` metaLines.

The checkout also carries the notebook family under `notebooks/`: one marked source file, one
notebook (the full edition) plus one executed twin, and the same metaLines and [metaSegments](../reference/syntax-and-semantics.md#statement,-metaSegment) derive two manual pages.
Every GENERATED file regenerates byte-identically — while the executed twin carries real kernel
outputs and is validated separately, outside that byte gate:

```
julia --startup-file=no --project=. notebooks_from_source.jl --check
```

The committed corpus is trusted input; read the README's SECURITY section before running
GoMeta on files you did not write.

From here:

- [What is GoMeta?](../concepts/what-is-gometa.md) — the mental model in five minutes.
- [How does GoMeta work?](../concepts/how-does-gometa-work.md) — one run, from a file to what the Extensions receive.
- [Examples](../examples/index.md) — the committed corpus and the notebook family.
- The three references: [Syntax & semantics](../reference/syntax-and-semantics.md) (the
  language), [Public API](../reference/public-api.md) (the public names and the refusals),
  [Development tools](../reference/development-tools.md) (the print tools, which show what a run
  produced, and the basic renderer).

## Questions

Write to [hello@gometa.dev](mailto:hello@gometa.dev) or open an issue in the
[repository](https://github.com/gometa-jl/GoMeta.jl).
