# Development tools

GoMeta's output is a set of evaluated values at the [Components](syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File) of a file, not a file: as GoMeta's creator puts it, *"the output of GoMeta is not readily directly observable. For that reason, a couple of tools and colorful printouts can serve to track and illustrate the internal process of the package"*. This page is the reference for those tools
at release **0.4.1** (alpha): the print tools, which show what a run produced, and the basic
renderer, which writes a rendered copy of the file. They are not part of a GoMeta run: the
[GoMeta Engine](syntax-and-semantics.md#the-GoMeta-Engine,-Extension) uses none of them, a run
gives the same delivery without them, and they change nothing in it. They read the delivery
through the same public surface an [Extension](syntax-and-semantics.md#the-GoMeta-Engine,-Extension)
uses — the [Public API](public-api.md). Their purpose: the print of the evaluated values shows what has been evaluated for which Component, and the print of the BLS Component tree lets anyone see and check how BLS parsed the file.

## 1. The print tools

From a shell, at the repository's root and after `Pkg.instantiate()` in its `tests` project,
one call prints one view of one file:

```
julia --startup-file=no --project=tests devtools/devtools.jl <verb> <file>
```

| verb | prints |
|---|---|
| `evals-tree` | the full delivery view: every Block and Line of the [BLS Component tree](syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File), each with the [evaluated values](syntax-and-semantics.md#altValue,-evals) recorded at it and every value's handle decoded; a Line that ends in a metaSegment — a `#~` with or without a [statement](syntax-and-semantics.md#statement,-metaSegment) after it — carries its values with that Segment named; a Component without a value of its own is marked so |
| `bls-tree` | the Component-tree view: every Component with its [settribute](syntax-and-semantics.md#settribute) and its named integers |
| `tree` | the BLS Component tree printed one row per input line: each Component's [flavor](syntax-and-semantics.md#flavor) and content, Blocks, Lines and Segments nested |
| `segments` | the same rows with the input's line numbers in front |
| `evals` | the evaluated values alone, one row per value |
| `trace` | the evaluated values with each row's decoded [Component's handle](public-api.md) |
| `render` | the rendered copy of the file — the basic renderer's output (section 2) |
| `comparison` | one line per Component and, for every Block, Line and Segment, one line per Alterant with its evaluated value and its source, sorted — a text form by which the deliveries of two versions or variants of GoMeta for one input are compared by their values |

The delivery views and the Component-tree view from Julia:

```julia
using GoMeta
include(joinpath(pkgdir(GoMeta), "devtools", "devtools.jl"))
delivery = GoMeta.goMeta(read("some.jl"))

print_altValues_evals(delivery)                                            # the compact delivery view
print_altValues_evals(delivery; include_empty = true, show_handles = true)   # the full delivery view
print_BLS_Component_Tree(delivery)                                         # the Component-tree view
write_altValues_evals_to_file("evals.html", delivery; include_empty = true)  # the same views as files (.html or .txt)
write_BLS_Component_Tree_to_file("tree.html", delivery)
```

The compact delivery view leaves out the Components that carry no value of their own and the handles. The full delivery view is the one to read first — it says what the Engine evaluated for which
Component. The [Getting started](../tutorials/getting-started.md) page and the
[Syntax & semantics](syntax-and-semantics.md#11.-The-examples) page embed it for the two
example files; the two other views of the first example file follow here.

::: details The BLS Component tree of the first example file, printed one row per input line (the `tree` verb)

```
{:B-Meta:L-Meta [{:S-Meta [#~ hide{ :label4 , isCode } ]}{:S-Meta [## This is a comment within a `Block` of meta.]}]}
{       :L-Meta [## The above `Line` of meta initiated this `Block` of meta.]}
{       :L-Meta [{:S-Meta [#~ :label1{ (isText && containsMeta), isMeta } ]}{:S-Meta [## This meta `Block` ends here.]}]}

{:B-Text:L-Text [# This `Line` of text starts a new `Block` of text.]}
{       :L-Text [# This `Block` is NOT attached to metadata - it does NOT INHERIT metadata.]}
{       :L-Text [{:S-Text [# However, this `Line` will get discarded due to: ]}{:S-Meta [#~ discard]}]}

{:B-Meta:L-Meta [{:S-Meta [#~2 :label5 show{ !:label5} ]}{:S-Meta [## This is line 9. It is a one-line meta `Block`.]}]}
{:B-Code:L-Code [{:S-Code [using Plots ]}{:S-Code [## This `Line` starts a new `Block` of code.]}]}
{       :L-Code [## This code `Block` is ATTACHED to metadata - it inherits metadata from above.]}
{       :L-Code [## Therefore, this code `Block` receives label5.]}
{       :L-Code [## `show` from line 9 above does NOT get applied to this `Block`]}
{       :L-Code [##      as this can only happen]}
{       :L-Code [##      if label5 has NOT been applied. Note `{!:label5}` following `show`.]}
{       :L-Code [## This code `Block` inherits `hide` from line 1 above]}
{       :L-Code [##      since this is a code `Block` and due to: `{isCode}` following `hide`.]}

{       :L-Code [println("!!! NOTE !!! Only Code and Text `Block`s may contain empty lines.")]}
{       :L-Code [println("\t Whereas an empty line after a meta `Line` starts a new `Block`.")]}

{:B-Meta:L-Meta [#~3 :label4 discard{:label3} :label3]}
{:B-Text:L-Text [# This `Block` of text receives label4]}
{       :L-Text [#       plus label5 from further above]}
{       :L-Text [#       plus label1 since it `isText` AND `containsMeta` [last statement].]}
{       :L-Text [# It is NOT "discarded" since label3 has not been applied yet]}
{       :L-Text [#       when `discard{:label3}` is issued.]}
{       :L-Text [# Only after that it receives label3.]}
{       :L-Text [# Instead, it gets hidden due to label4 and `hide{:label4}` on line 1.]}
{       :L-Text [{:S-Text [# This `Line`, however, will NOT get hidden. ]}{:S-Meta [#~ show]}]}

{:B-Meta:L-Meta [#~2 :label5]}
{:B-Text:L-Text [md"""]}
{       :L-Text [{:S-Text [This is a `Block` of markdown text. ]}{:S-Meta [#~ hide]}]}
{       :L-Text ["""]}
```

:::

::: details The Component-tree view of the first example file — every Component with its settribute and its named integers (the `bls-tree` verb)

```
status: PROCESS_OK
File  file_for_Example_Proposal_JuliaCon.jl  —  8 Blocks · 35 Lines · 14 Segments
├─ Block #2    Meta   L1–L3   
│  │  Int64  idComponent=2 idParent=1 idxString=0 inputLineNum=1 numChildren=3 startMainStr=1 stopMainStr=3 idExtension=0 idExtended=0
│  │  Bool   depth1 attachedToMeta containsMeta isMeta
│  ├─ Line #2     Meta   L1      
│  │  │  Int64  idComponent=2 idParent=2 idxString=0 inputLineNum=1 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│  │  │  Bool   depth1 containsMeta isMeta
│  │  ├─ Segment #2  Meta   L1       "#~ hide{ :label4 , isCode } "
│  │  │     Int64  idComponent=2 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=1 stopMainStr=28 idExtension=0 idExtended=0
│  │  │     Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr
│  │  └─ Segment #3  Meta   L1       "## This is a comment within a `Block` of me…"
│  │        Int64  idComponent=3 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=29 stopMainStr=74 idExtension=0 idExtended=0
│  │        Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
│  ├─ Line #3     Meta   L2       "## The above `Line` of meta initiated this …"
│  │     Int64  idComponent=3 idParent=2 idxString=2 inputLineNum=2 numChildren=0 startMainStr=1 stopMainStr=59 idExtension=0 idExtended=0
│  │     Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
│  └─ Line #4     Meta   L3      
│     │  Int64  idComponent=4 idParent=2 idxString=0 inputLineNum=3 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│     │  Bool   depth1 containsMeta isMeta
│     ├─ Segment #4  Meta   L3       "#~ :label1{ (isText && containsMeta), isMet…"
│     │     Int64  idComponent=4 idParent=4 idxString=3 inputLineNum=3 numChildren=0 startMainStr=1 stopMainStr=47 idExtension=0 idExtended=0
│     │     Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr
│     └─ Segment #5  Meta   L3       "## This meta `Block` ends here."
│           Int64  idComponent=5 idParent=4 idxString=3 inputLineNum=3 numChildren=0 startMainStr=48 stopMainStr=78 idExtension=0 idExtended=0
│           Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr

├─ Block #3    Text   L4–L7   
│  │  Int64  idComponent=3 idParent=1 idxString=0 inputLineNum=4 numChildren=4 startMainStr=4 stopMainStr=7 idExtension=0 idExtended=0
│  │  Bool   containsMeta containsText isText
│  ├─ Line #5     Text   L4       ""
│  │     Int64  idComponent=5 idParent=3 idxString=0 inputLineNum=4 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile isEmpty containsText isText
│  ├─ Line #6     Text   L5       "# This `Line` of text starts a new `Block` …"
│  │     Int64  idComponent=6 idParent=3 idxString=5 inputLineNum=5 numChildren=0 startMainStr=1 stopMainStr=51 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  ├─ Line #7     Text   L6       "# This `Block` is NOT attached to metadata …"
│  │     Int64  idComponent=7 idParent=3 idxString=6 inputLineNum=6 numChildren=0 startMainStr=1 stopMainStr=74 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  └─ Line #8     Text   L7      
│     │  Int64  idComponent=8 idParent=3 idxString=0 inputLineNum=7 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│     │  Bool   containsMeta containsText isText
│     ├─ Segment #6  Text   L7       "# However, this `Line` will get discarded d…"
│     │     Int64  idComponent=6 idParent=8 idxString=7 inputLineNum=7 numChildren=0 startMainStr=1 stopMainStr=50 idExtension=0 idExtended=0
│     │     Bool   includeInOutFile containsText isText
│     └─ Segment #7  Meta   L7       "#~ discard"
│           Int64  idComponent=7 idParent=8 idxString=7 inputLineNum=7 numChildren=0 startMainStr=51 stopMainStr=60 idExtension=0 idExtended=0
│           Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr

├─ Block #4    Meta   L8–L9   
│  │  Int64  idComponent=4 idParent=1 idxString=0 inputLineNum=8 numChildren=2 startMainStr=8 stopMainStr=9 idExtension=0 idExtended=0
│  │  Bool   depth2 attachedToMeta containsMeta isMeta
│  ├─ Line #9     Meta   L8       ""
│  │     Int64  idComponent=9 idParent=4 idxString=0 inputLineNum=8 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile isEmpty containsMeta isMeta
│  └─ Line #10    Meta   L9      
│     │  Int64  idComponent=10 idParent=4 idxString=0 inputLineNum=9 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│     │  Bool   depth2 containsMeta isMeta
│     ├─ Segment #8  Meta   L9       "#~2 :label5 show{ !:label5} "
│     │     Int64  idComponent=8 idParent=10 idxString=9 inputLineNum=9 numChildren=0 startMainStr=1 stopMainStr=28 idExtension=0 idExtended=0
│     │     Bool   depth2 includeInOutFile containsMeta isMeta hasMetaStr
│     └─ Segment #9  Meta   L9       "## This is line 9. It is a one-line meta `B…"
│           Int64  idComponent=9 idParent=10 idxString=9 inputLineNum=9 numChildren=0 startMainStr=29 stopMainStr=77 idExtension=0 idExtended=0
│           Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr

├─ Block #5    Code   L10–L20 
│  │  Int64  idComponent=5 idParent=1 idxString=0 inputLineNum=10 numChildren=11 startMainStr=10 stopMainStr=20 idExtension=0 idExtended=0
│  │  Bool   attachedToMeta containsCode isCode
│  ├─ Line #11    Code   L10     
│  │  │  Int64  idComponent=11 idParent=5 idxString=0 inputLineNum=10 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│  │  │  Bool   attachedToMeta containsCode isCode
│  │  ├─ Segment #10 Code   L10      "using Plots "
│  │  │     Int64  idComponent=10 idParent=11 idxString=10 inputLineNum=10 numChildren=0 startMainStr=1 stopMainStr=12 idExtension=0 idExtended=0
│  │  │     Bool   attachedToMeta includeInOutFile containsCode isCode
│  │  └─ Segment #11 Code   L10      "## This `Line` starts a new `Block` of code…"
│  │        Int64  idComponent=11 idParent=11 idxString=10 inputLineNum=10 numChildren=0 startMainStr=13 stopMainStr=56 idExtension=0 idExtended=0
│  │        Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #12    Code   L11      "## This code `Block` is ATTACHED to metadat…"
│  │     Int64  idComponent=12 idParent=5 idxString=11 inputLineNum=11 numChildren=0 startMainStr=1 stopMainStr=79 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #13    Code   L12      "## Therefore, this code `Block` receives la…"
│  │     Int64  idComponent=13 idParent=5 idxString=12 inputLineNum=12 numChildren=0 startMainStr=1 stopMainStr=48 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #14    Code   L13      "## `show` from line 9 above does NOT get ap…"
│  │     Int64  idComponent=14 idParent=5 idxString=13 inputLineNum=13 numChildren=0 startMainStr=1 stopMainStr=64 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #15    Code   L14      "##      as this can only happen"
│  │     Int64  idComponent=15 idParent=5 idxString=14 inputLineNum=14 numChildren=0 startMainStr=1 stopMainStr=31 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #16    Code   L15      "##      if label5 has NOT been applied. Not…"
│  │     Int64  idComponent=16 idParent=5 idxString=15 inputLineNum=15 numChildren=0 startMainStr=1 stopMainStr=75 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #17    Code   L16      "## This code `Block` inherits `hide` from l…"
│  │     Int64  idComponent=17 idParent=5 idxString=16 inputLineNum=16 numChildren=0 startMainStr=1 stopMainStr=54 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #18    Code   L17      "##      since this is a code `Block` and du…"
│  │     Int64  idComponent=18 idParent=5 idxString=17 inputLineNum=17 numChildren=0 startMainStr=1 stopMainStr=77 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile comment containsCode isCode
│  ├─ Line #19    Code   L18      ""
│  │     Int64  idComponent=19 idParent=5 idxString=0 inputLineNum=18 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile isEmpty containsCode isCode
│  ├─ Line #20    Code   L19      "println("!!! NOTE !!! Only Code and Text `B…"
│  │     Int64  idComponent=20 idParent=5 idxString=19 inputLineNum=19 numChildren=0 startMainStr=1 stopMainStr=76 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsCode isCode
│  └─ Line #21    Code   L20      "println("\t Whereas an empty line after a m…"
│        Int64  idComponent=21 idParent=5 idxString=20 inputLineNum=20 numChildren=0 startMainStr=1 stopMainStr=77 idExtension=0 idExtended=0
│        Bool   includeInOutFile containsCode isCode

├─ Block #6    Meta   L21–L22 
│  │  Int64  idComponent=6 idParent=1 idxString=0 inputLineNum=21 numChildren=2 startMainStr=21 stopMainStr=22 idExtension=0 idExtended=0
│  │  Bool   depth3 attachedToMeta containsMeta isMeta
│  ├─ Line #22    Meta   L21      ""
│  │     Int64  idComponent=22 idParent=6 idxString=0 inputLineNum=21 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile isEmpty containsMeta isMeta
│  └─ Line #23    Meta   L22      "#~3 :label4 discard{:label3} :label3"
│        Int64  idComponent=23 idParent=6 idxString=22 inputLineNum=22 numChildren=0 startMainStr=1 stopMainStr=36 idExtension=0 idExtended=0
│        Bool   depth3 includeInOutFile containsMeta isMeta hasMetaStr

├─ Block #7    Text   L23–L30 
│  │  Int64  idComponent=7 idParent=1 idxString=0 inputLineNum=23 numChildren=8 startMainStr=23 stopMainStr=30 idExtension=0 idExtended=0
│  │  Bool   attachedToMeta containsMeta containsText isText
│  ├─ Line #24    Text   L23      "# This `Block` of text receives label4"
│  │     Int64  idComponent=24 idParent=7 idxString=23 inputLineNum=23 numChildren=0 startMainStr=1 stopMainStr=38 idExtension=0 idExtended=0
│  │     Bool   attachedToMeta includeInOutFile containsText isText
│  ├─ Line #25    Text   L24      "#       plus label5 from further above"
│  │     Int64  idComponent=25 idParent=7 idxString=24 inputLineNum=24 numChildren=0 startMainStr=1 stopMainStr=38 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  ├─ Line #26    Text   L25      "#       plus label1 since it `isText` AND `…"
│  │     Int64  idComponent=26 idParent=7 idxString=25 inputLineNum=25 numChildren=0 startMainStr=1 stopMainStr=74 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  ├─ Line #27    Text   L26      "# It is NOT "discarded" since label3 has no…"
│  │     Int64  idComponent=27 idParent=7 idxString=26 inputLineNum=26 numChildren=0 startMainStr=1 stopMainStr=61 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  ├─ Line #28    Text   L27      "#       when `discard{:label3}` is issued."
│  │     Int64  idComponent=28 idParent=7 idxString=27 inputLineNum=27 numChildren=0 startMainStr=1 stopMainStr=42 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  ├─ Line #29    Text   L28      "# Only after that it receives label3."
│  │     Int64  idComponent=29 idParent=7 idxString=28 inputLineNum=28 numChildren=0 startMainStr=1 stopMainStr=37 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  ├─ Line #30    Text   L29      "# Instead, it gets hidden due to label4 and…"
│  │     Int64  idComponent=30 idParent=7 idxString=29 inputLineNum=29 numChildren=0 startMainStr=1 stopMainStr=70 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile containsText isText
│  └─ Line #31    Text   L30     
│     │  Int64  idComponent=31 idParent=7 idxString=0 inputLineNum=30 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│     │  Bool   containsMeta containsText isText
│     ├─ Segment #12 Text   L30      "# This `Line`, however, will NOT get hidden…"
│     │     Int64  idComponent=12 idParent=31 idxString=30 inputLineNum=30 numChildren=0 startMainStr=1 stopMainStr=45 idExtension=0 idExtended=0
│     │     Bool   includeInOutFile containsText isText
│     └─ Segment #13 Meta   L30      "#~ show"
│           Int64  idComponent=13 idParent=31 idxString=30 inputLineNum=30 numChildren=0 startMainStr=46 stopMainStr=52 idExtension=0 idExtended=0
│           Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr

├─ Block #8    Meta   L31–L32 
│  │  Int64  idComponent=8 idParent=1 idxString=0 inputLineNum=31 numChildren=2 startMainStr=31 stopMainStr=32 idExtension=0 idExtended=0
│  │  Bool   depth2 attachedToMeta containsMeta isMeta
│  ├─ Line #32    Meta   L31      ""
│  │     Int64  idComponent=32 idParent=8 idxString=0 inputLineNum=31 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
│  │     Bool   includeInOutFile isEmpty containsMeta isMeta
│  └─ Line #33    Meta   L32      "#~2 :label5"
│        Int64  idComponent=33 idParent=8 idxString=32 inputLineNum=32 numChildren=0 startMainStr=1 stopMainStr=11 idExtension=0 idExtended=0
│        Bool   depth2 includeInOutFile containsMeta isMeta hasMetaStr

└─ Block #9    Text   L33–L35 
   │  Int64  idComponent=9 idParent=1 idxString=0 inputLineNum=33 numChildren=3 startMainStr=33 stopMainStr=35 idExtension=0 idExtended=0
   │  Bool   attachedToMeta containsMeta containsText isText
   ├─ Line #34    Text   L33      "md""""
   │     Int64  idComponent=34 idParent=9 idxString=33 inputLineNum=33 numChildren=0 startMainStr=1 stopMainStr=5 idExtension=0 idExtended=0
   │     Bool   attachedToMeta includeInOutFile containsText isText
   ├─ Line #35    Text   L34     
   │  │  Int64  idComponent=35 idParent=9 idxString=0 inputLineNum=34 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
   │  │  Bool   containsMeta containsText isText
   │  ├─ Segment #14 Text   L34      "This is a `Block` of markdown text. "
   │  │     Int64  idComponent=14 idParent=35 idxString=34 inputLineNum=34 numChildren=0 startMainStr=1 stopMainStr=36 idExtension=0 idExtended=0
   │  │     Bool   includeInOutFile containsText isText
   │  └─ Segment #15 Meta   L34      "#~ hide"
   │        Int64  idComponent=15 idParent=35 idxString=34 inputLineNum=34 numChildren=0 startMainStr=37 stopMainStr=43 idExtension=0 idExtended=0
   │        Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr
   └─ Line #36    Text   L35      """""
         Int64  idComponent=36 idParent=9 idxString=35 inputLineNum=35 numChildren=0 startMainStr=1 stopMainStr=3 idExtension=0 idExtended=0
         Bool   includeInOutFile containsText isText
```

:::

The tools carry their own check, a battery under `devtools/probes/` that fails loudly when the
surface they read has changed.

## 2. The basic renderer: a proxy to check by eye

The basic renderer writes a rendered copy of the file in which each piece appears as its
evaluated Visib value says — shown, hidden or discarded. For GoMeta's creator it is simply a proxy to check what GoMeta has evaluated: what matters is what GoMeta evaluates, not what its proxy shows. Strictly speaking it is no Extension: it lives under the package's development tools, and it is there because it serves a vital purpose for the package's development. It behaves like one, though: it reads the delivery through the public surface — the BLS Component
tree through BLS's own functions, every Visib value through the Engine's answer function,
[`evaluatedAltValue`](public-api.md) — and it evaluates nothing itself. It is loaded
explicitly, at the top level:

```julia
include(joinpath(pkgdir(GoMeta), "devtools", "load_basic_renderer.jl"))   # at the top level
out = Main.BasicRenderer.outputs(delivery)   # (blsStructure_bytes, render_bytes)
print(String(copy(out.render_bytes)))        # the rendered copy
```

It returns a pair: the tree print of section 1 (the `tree` verb) and the rendered copy. The tree print is the BLS Component tree as the parser built it and holds no evaluated values; the tools print it and the test suite pins it. No
Extension takes this pair; an Extension works from the delivery. The package's test suite pins the pair byte for byte — the rendered copy against the committed reference files under the examples, the tree print against its committed copy: the renderer must produce consistent outputs.

## 3. What the rendered copy shows

Measured on the two example files, whose rendered copies the package commits under `examples/OutFileFolder/` and the test suite pins (the second's is embedded in section 6):

- A discarded Component leaves no bytes of its own.
- A hidden Line is written behind the file format's hide marker — `## ` in Julia — and so is
  every non-empty line of a hidden Block that has no Visib value of its own — a line with its own value is written as that value says: the first example file's line 30, which ends in its own `#~ show`, is written as it is; a hidden empty line stays an empty line (the second example file's line 40).
- A line that already begins with the marker is written as it is, never marked twice.
- A hidden metaLine keeps its own marker: *hide* is visibility, so the metadata stays metadata
  in the rendered copy; a discarded metaLine is gone (the second example file's line 51).
- An inline [metaSegment](syntax-and-semantics.md#statement,-metaSegment) is kept as it is on a shown line and, on a hidden one, written behind its own `## ` as the line is.

The two `##` are two things: in the input `##` opens a comment for the reader; in the rendered
copy the input's comments keep their `##`, and the tool writes `## ` before what it hides — its hide marker.

## 4. What the test suite pins

Over the committed examples the shipped tests assert that the same input and configuration
give a byte-identical tree print and rendered copy in every run; that a discarded Component
leaves no bytes and every non-empty line evaluated hidden carries the marker; that the tree print holds
no evaluated values; and that the evaluated values are the same in every run.

## 5. Line endings

A file with CRLF line endings (a carriage return before each line feed) is read as if its endings were LF (a line feed alone), and the rendered copy comes
out with LF endings; the bytes within a line are kept as they are (see the
[Public API](public-api.md) page).

## 6. A worked example

In the second example file (`examples/InFileFolder/file_for_Example_Extended.jl`), line 14 is a text line that ends in `#~ hide` and line 15 a line
that ends in `#~ discard`. In the rendered copy line 14 appears behind the hide marker, its
trailing metaSegment marked with it, and line 15 is absent — as the file itself says, on its line 16:
*"Input line 15 will be missing from the output file!"*

::: details The rendered copy of the second example file, as the basic renderer writes it

```
## Test File
## NOTE: I've addes some markers to this file such as: "## @: Input line 2"
##      They have nothing to do with `GoMeta` [yet].
##      They are simply meant to assist orientation when
##      comparing the input file to the output file.

#~ discard{ :label2 , isCode} ## This is a comment within a meta `Block`.
#~ :label1{ isText && containsMeta }
## The following meta `Line` within this `Block` will be ignored due to the `!`.
#~! discard{ isMeta } ## This `Line` of meta ends this `Block` of meta.

# With this `Line` of text starts a new `Block` of text. ## @: Input line 12.
# This `Block` is NOT attached to metadata - it does NOT inherit metadata.
## # This `Line` should still be "hidden" / commented out. ## #~ hide
# NOTE: Input line 15 will be missing from the output file! ## @: Input line 16.

#~2 :label3 :label5 show{ !:label5} ## @: Input line 18.
#~ hide{:label1} ## This comment ends this meta `Block` at level 2 [`#~2`].

#~3 discard{:label4} :label4 ## This comment ends this meta `Block` at level 3.
## # Here starts a new `Block` of text ## @: Input line 35.
## #       which receives label4 from line 34
## #       and label3 and label5 from line 18
## #       and receives label1 from line 8

## # This `Block` does NOT get "discarded" since label4 has
## #       NOT been applied yet when `discard{:label4}` [line 34] is issued.
## # Instead this `Block` gets "hidden" due to circumstance that it is
## #       text and contains meta, therefore receiving label1
## #       and consequently inheriting the `hide` from line 19.
## NOTE: Line 39, however, will get "discarded"
##      since this `Line` inherits label4 due to the "#~" at its end
##      and consequently `discard{:label4}` [line 34] gets applied here.
## @: Input line 49. It is at the end of this `Block` of text.
```

:::
