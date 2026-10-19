```@raw html
---
u_version: "0.1"
---
```

# Syntax & semantics

This page is the reference for the notation of GoMeta — the **[metaLines](#metaLine)** written into a
file's comments — and for what the GoMeta Engine evaluates from them. It is written for the
release **0.4.0** (alpha) from the package's own reference document and from the design as its
author states it. The two example files committed with the package, and the author's proposal
they illustrate, are, in general, the law of the notation: where this page and a committed example could
ever disagree, the example and what GoMeta evaluates for it count. The page's terms are defined in the [Glossary](#Glossary) below or where they first appear.

## 0. What GoMeta does

A source file carries ordinary content plus [metaLines](#metaLine). [BLS](#BLS,-Component,-Block,-Line,-Segment,-File),
GoMeta's parser, reads the file and records what it finds in the **BLS Component tree**: the
File, its Blocks, their Lines, and the Segments within a Line — each of them a [Component](#BLS,-Component,-Block,-Line,-Segment,-File), and
every Block, Line and Segment carrying a [flavor](#flavor): Meta, Text or Code. The [GoMeta Engine](#the-GoMeta-Engine,-Extension) then evaluates the metadata over
that BLS Component tree: for each Component, which value of which [Alterant](#Alterant) applies. GoMeta
evaluates the metadata — more precisely, the GoMeta Engine evaluates it — but does not act on
those evaluations: that is the [Extensions](#the-GoMeta-Engine,-Extension)' role; they receive the evaluations through GoMeta's
interface, [`altValues_evals`](../reference/public-api.md).

Throughout this page the Alterant **Visib**, with its values `show`, `hide` and `discard`, is
the example, because what the GoMeta Engine evaluates for it can be checked by eye in a rendered copy of the file.
Visib is one Alterant among others; the principles this page states — how a value is written,
where it reaches, how a closer [statement](#statement,-metaSegment) overrules — hold for every Alterant, while which values an Alterant has, and whether more than one of them may apply to one piece at a time, are each Alterant's own.

## Glossary

### comment marker

The **comment marker** is the character, or pair of characters, that opens a comment in the file's format: `#` in Julia, `//` in the C family (e.g. C, Rust, etc.),
`%` in LaTeX. GoMeta's markers are built on it: `#~` opens a metaLine, `##` a comment, `#]` the
close. In another format the same forms use that format's comment marker (`//~`, `%~`), named when GoMeta is called.

### BLS, Component, Block, Line, Segment, File

**BLS** is GoMeta's parser, named for the three kinds of pieces it finds: **B**lock, **L**ine,
**S**egment. It records what it finds in the BLS Component tree. Its pieces are
**Components**: the **File**; its **Blocks** — a Block is a run of lines of one flavor; their
**Lines**; and the **Segments** within a Line, for instance the content before an inline `#~`
and the statement after it. The term is "the BLS Component tree", never a bare "tree".

### flavor

Every Block, Line and Segment carries a **flavor**: **Meta**, **Text** or **Code**. The word was chosen to avoid
"type". A comment is not a flavor: content of any flavor can take the form of a comment — a
`##` line inside a metaBlock is a comment of flavor Meta.

### metaLine

A **metaLine** is a BLS Line Component of flavor Meta. You write one by opening a line with the
marker `#~` — the comment marker followed by a tilde — and the rest of the line carries the
metadata: its statements, and, after a `##`, an ordinary comment if you want one.

### metaBlock

A **metaBlock** is a BLS Block Component of flavor Meta. One or more contiguous metaLines form one metaBlock.

### Alterant

An **Alterant** is, for Julia users, most similar to a Type: it defines which values its instances
can take. It is not exactly analogous to a Type: an Alterant usually brings functionality of its own, which may be invoked during the GoMeta Engine's process, for instance when a value is set. Visib's values are `show`, `hide` and `discard`; the Labels Alterant's values are labels. A
value is written bare, without the Alterant's name — `hide` — so that a metaLine stays brief. The Alterants shipped with this release are Visib,
Labels, Heading and Id; the examples exercise the first two (§13).

### statement, metaSegment

A **statement** is one instruction on a metaLine: the value of an Alterant,
with optional arguments in `()` and an optional condition in `{}` that says when the value
applies — `hide{ isCode }`, `:label1`, `discard{ :label2 , isCode}`. A metaLine may carry
several statements. A **metaSegment** is a Segment of metadata within a content line: the marker `#~` after the line's content and the statements after it, if any; its statements apply to that line.

### altValue, evals

An **altValue** is one evaluated value of an Alterant for one Component. The **evals** are the
altValues the GoMeta Engine evaluated for a run, delivered as `altValues_evals` — one row per
evaluated value, each at its Component.

### label

A **label** is a tag the Labels Alterant applies to the Components in a statement's reach. The
colon is the action and the labels are its arguments: `:(label1, label2)` applies two; for one
label `:label1` is short for `:(label1)`. A label can be given a condition: `:label1{ isText }`
applies it only where the condition holds.

### condition

The **condition** is the optional `{}` after a value or a label: the condition under which it gets applied. Its
atoms are labels (`:label4`) and the BLS key words; they are joined with `,` (or), `&&` (and),
`!` (not) and grouped with `()`.

### the BLS key words

The **BLS key words** are facts about a Component that BLS records when it reads the file, and that a condition may ask (e.g.
`isCode`, `isText`, `isMeta`, `containsMeta`, etc.). They are entries of the Component's settribute.

### settribute

In the words of GoMeta's author: "A '**settribute**' data store / container (usually for smallish
entries) which can be set to a range of particular values. It is used for SETTINGS and
ATTRIBUTES alike. Hence the term 'settribute'." Every Component carries one. The BLS key words
are the entries BLS sets in it when it reads the file.

### depth, the meta hierarchy

A metaBlock sits at a **depth**: `#~` is depth 1, `#~2` depth 2, and so on — written as a digit, or
as the number of tildes (`#~~~` is depth 3). The depths form the **meta hierarchy**, like the
levels of headings: a deeper metaBlock nests under the shallower one open above it and inherits
from it. `#~0` is the file level.

### attachment, inheritance

A Block of content written directly below a metaBlock, with no empty line between them, is
**attached** to it and **inherits** its statements — much as a docstring belongs to the
Julia definition that follows it. An empty line detaches.

### the GoMeta Engine, Extension

The **GoMeta Engine** is the part of GoMeta that evaluates the metadata. An **Extension** is a
separate program that receives the evaluations and acts on them — a renderer, for instance.
The whole, from the file to the Extensions, is explained on [How does GoMeta work?](../concepts/how-does-gometa-work.md).

## 1. The metaLine

A metaLine has the shape

```gometa
#~[depth]  statements   ## an ordinary comment, if you want one
```

- The **marker** `#~` opens it: the [comment marker](#comment-marker) of the file's format followed by a tilde.
  Without a [depth](#depth,-the-meta-hierarchy) the metaLine is at depth 1.
- The **statements** carry the metadata: values of Alterants, each with its optional `()`
  arguments and `{}` [condition](#condition), and [labels](#label). They are read from left to right.
- Everything after a `##` on the same line is a **comment** for the reader; GoMeta does not
  read it as metadata.

Besides the standard metaLine on its own line, three further forms exist: the **close** `#]`
(§4), the **inline [metaSegment](#statement,-metaSegment)** — a `#~` at the end of a content line, with a statement after it or none (§9) —
and the **inert marker** `#~!` (`#~2!` at depth 2), whose content is not processed (§9).

**A marker needs its space.** A GoMeta marker — `#~` with its depth or `!` where one is written, `##`, `#]` — is recognised only when white
space, or the start or the end of the line, stands before and after it. The white space is any
horizontal white space of Unicode (e.g. the space, the tab, the no-break space, etc.); a
line break counts as a boundary. This is deliberate: `someCharacters##someMoreCharacters` and
`someCharacters#~someMoreCharacters` are valid things to write in a file precisely because
markers demand their spaces, so such a glued shape is plain content, not metadata and not a
comment. The package makes two exceptions: a line that begins with one of the reserved forms
`#-`, `#+`, `#[` or `#>` is reserved for future GoMeta syntax and is not plain content; and the
misspelt inert marker with the exclamation mark before the depth (`#~!2` for `#~2!`) is refused
with a message.

**Writing about GoMeta in a file.** To mention a statement as prose — in a comment, in a
string — glue something to the front of its `#`: `"#~ hide"`, `'#~ hide'`, or any other
character without a space between it and the marker. A front-glued marker is never recognised.

**Markers inside strings.** At this release GoMeta reads a file line by line and does not read the host
language's strings as strings, with one exception. Inside a multi-line Julia string a marker
after the line's content, preceded by white space, is live — an inline metaSegment: a trailing `#~ discard` removes that line
of the string from the rendered copy, a trailing `#~ hide` hides it. The exception: a line that
begins with `#~` inside a multi-line string is held by the string's quotes and is not a
metaLine. In a single-line string a marker followed by further words makes GoMeta read those
words as statements, and the whole file is refused with a message naming the first word it does
not know — `"left part #~ hide right part"` fails on `right`. In LaTeX a `verbatim` environment
is no shelter: a `%~ hide` inside it is a live metaLine and hides the lines that follow it, the
`\end{verbatim}` line included. To write a marker inside a string, glue a character to its front
as above.

::: details The four probes behind these sentences — what GoMeta evaluated for each input, as the development tools print it; the third ends in the refusal

In the development tool's printouts a "cell" is a BLS Component that carries evaluated values —
the tool's word; this site says Component. Its "(no evals — defaults apply)" marks a Component with no evaluated values of its own; it falls under the value of a Component that contains it, else under the Alterant's declared default.

```
File  strings_julia_A.jl  —  4 evals rows on 4 cells  (of 4 Blocks · 11 Lines)
├─ Block #2  Text  L1       "# Probe A: a multi-line string whose …"   (no evals — defaults apply)
│  └─ Line #2   Text  L1       "# Probe A: a multi-line string whose …"   (no evals — defaults apply)
├─ Block #3  Meta  L2       "#~ hide{ isCode }"   (no evals — defaults apply)
│  └─ Line #3   Meta  L2       "#~ hide{ isCode }"   (no evals — defaults apply)
├─ Block #4  Code  L3–L10   "x = 1⏎⏎s = """⏎first line of the stri…"
│  ● visib        => :hide     (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
│  ├─ Line #4   Code  L3       "x = 1"   (no evals — defaults apply)
│  ├─ Line #5   Code  L4       ""   (no evals — defaults apply)
│  ├─ Line #6   Code  L5       "s = """"   (no evals — defaults apply)
│  ├─ Line #7   Code  L6       "first line of the string"   (no evals — defaults apply)
│  ├─ Line #8   Code  L7       "second line of the string #~ discard"
│  │  ● visib        => :discard  (+)   ← Segment #3 "#~ discard"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,8)]  origin=[(direct,1) (direct,4) (direct,8) (direct,3)]
│  ├─ Line #9   Code  L8       "third line of the string #~ hide"
│  │  ● visib        => :hide     (+)   ← Segment #5 "#~ hide"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,9)]  origin=[(direct,1) (direct,4) (direct,9) (direct,5)]
│  ├─ Line #10  Code  L9       "fourth line of the string"   (no evals — defaults apply)
│  └─ Line #11  Code  L10      """""   (no evals — defaults apply)
└─ Block #5  Code  L11      "y = 2"
   ● visib        => :hide     (+)
       handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
   └─ Line #12  Code  L11      "y = 2"   (no evals — defaults apply)
```

```
File  strings_julia_B.jl  —  2 evals rows on 2 cells  (of 4 Blocks · 11 Lines)
├─ Block #2  Text  L1       "# Probe B: a multi-line string with a…"   (no evals — defaults apply)
│  └─ Line #2   Text  L1       "# Probe B: a multi-line string with a…"   (no evals — defaults apply)
├─ Block #3  Meta  L2       "#~ hide{ isCode }"   (no evals — defaults apply)
│  └─ Line #3   Meta  L2       "#~ hide{ isCode }"   (no evals — defaults apply)
├─ Block #4  Code  L3–L10   "x = 1⏎⏎t = """⏎alpha⏎#~ hide⏎beta⏎gam…"
│  ● visib        => :hide     (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
│  ├─ Line #4   Code  L3       "x = 1"   (no evals — defaults apply)
│  ├─ Line #5   Code  L4       ""   (no evals — defaults apply)
│  ├─ Line #6   Code  L5       "t = """"   (no evals — defaults apply)
│  ├─ Line #7   Code  L6       "alpha"   (no evals — defaults apply)
│  ├─ Line #8   Code  L7       "#~ hide"   (no evals — defaults apply)
│  ├─ Line #9   Code  L8       "beta"   (no evals — defaults apply)
│  ├─ Line #10  Code  L9       "gamma"   (no evals — defaults apply)
│  └─ Line #11  Code  L10      """""   (no evals — defaults apply)
└─ Block #5  Code  L11      "y = 2"
   ● visib        => :hide     (+)
       handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
   └─ Line #12  Code  L11      "y = 2"   (no evals — defaults apply)
```

```
goMeta threw (no delivery):
GoMeta absorb: unknown alterant action "right" — not one of the registered sorted_alt_actions = [:(:), :cell, :discard, :file, :head, :hide, :parent, :show] (v0's closed action set; see docs/public-api.md §3.4)
```

```
File  strings_latex.tex  —  2 evals rows on 2 cells  (of 4 Blocks · 14 Lines)
├─ Block #2  Text  L1       "% A probe for the Syntax & semantics …"   (no evals — defaults apply)
│  └─ Line #2   Text  L1       "% A probe for the Syntax & semantics …"   (no evals — defaults apply)
├─ Block #3  Code  L2–L7    "\documentclass{article}⏎\begin{docume…"   (no evals — defaults apply)
│  ├─ Line #3   Code  L2       "\documentclass{article}"   (no evals — defaults apply)
│  ├─ Line #4   Code  L3       "\begin{document}"   (no evals — defaults apply)
│  ├─ Line #5   Code  L4       "Ordinary text before the environment."   (no evals — defaults apply)
│  ├─ Line #6   Code  L5       ""   (no evals — defaults apply)
│  ├─ Line #7   Code  L6       "\begin{verbatim}"   (no evals — defaults apply)
│  └─ Line #8   Code  L7       "line one of the verbatim block"   (no evals — defaults apply)
├─ Block #4  Meta  L8       "%~ hide"
│  ● visib        => :hide     (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
│  └─ Line #9   Meta  L8       "%~ hide"   (no evals — defaults apply)
└─ Block #5  Code  L9–L14   "line two of the verbatim block⏎line t…"
   ● visib        => :hide     (+)
       handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
   ├─ Line #10  Code  L9       "line two of the verbatim block"   (no evals — defaults apply)
   ├─ Line #11  Code  L10      "line three of the verbatim block"   (no evals — defaults apply)
   ├─ Line #12  Code  L11      "\end{verbatim}"   (no evals — defaults apply)
   ├─ Line #13  Code  L12      ""   (no evals — defaults apply)
   ├─ Line #14  Code  L13      "Ordinary text after the environment."   (no evals — defaults apply)
   └─ Line #15  Code  L14      "\end{document}"   (no evals — defaults apply)
```

:::

## 2. Depth and the meta hierarchy

Depth is written as a digit after the marker, or as the number of tildes.

| written | depth |
|---|---|
| `#~` | 1 |
| `#~2` | 2 |
| `#~3` | 3 |
| `#~~~` | 3 |

`#~0` addresses the **file level**, the shallowest depth, above depth 1. The depths
form the meta hierarchy, like the levels of headings in a document: a [metaBlock](#metaBlock) at depth 2
nests under the depth-1 metaBlock open above it and [inherits](#attachment,-inheritance) from it, a metaBlock at depth 3
under the depth-2 one, and so on. Two metaBlocks at the same depth are **siblings**: one does
not inherit from the other. In the digit form the package reads depths from 1 to 8; `#~9` is
refused with a message.

## 3. metaBlocks

Contiguous metaLines form one metaBlock. A `##` comment line between them belongs to the
metaBlock and does not break it. An empty line after a metaLine starts a new Block: only Code
and Text Blocks may contain empty lines. The depth of a metaBlock is the depth of its first
metaLine.

```julia
#~ discard{ :label2 , isCode} ## This is a comment within a meta `Block`.
#~ :label1{ isText && containsMeta }
## The following meta `Line` within this `Block` will be ignored due to the `!`.
#~! discard{ isMeta } ## This `Line` of meta ends this `Block` of meta.
```

These four lines of the second example file stand in one metaBlock at depth 1 — each a Line
of flavor Meta, a metaLine by the definition: two live ones, a `##` comment line, and one inert metaLine. The empty line after them ends it.

## 4. Where a metaBlock reaches: attachment, nesting, the close

**Attachment.** A Block of content — code or text — written directly below a metaBlock, with
no empty line between them, is [attached](#attachment,-inheritance) to it and inherits its statements. An empty line
between them detaches it: the Block is then not attached to metadata and inherits nothing from
it. In the second example file, the text Block at lines 12–16 follows an empty line and is not
attached; the code Block at line 20 follows the metaBlock at lines 18–19 directly and is.

**Nesting.** A metaBlock at a deeper depth than the one open above it nests under it and
inherits its statements. A metaBlock at the same or a shallower depth ends the reach of the
open metaBlocks at its depth and below for the content that follows: in the first example
file, the depth-2 metaBlock at line 32 inherits only from the depth-1 metaBlock at the top, not
from the depth-3 metaBlock before it.

**The close `#]`.** A line `#]` is the explicit end of the innermost open metaBlock; the
content that follows it is not attached to that metaBlock. Closing ends the attachment, not the
reach of the closed metaBlock's statements: a later, deeper metaBlock still nests under it — the
package's behaviour at this release, shown by the example `feature_explicit_close.jl` (§11). The
metaBlocks at shallower depths stay open.

## 5. Labels

Labels are tags. A metaLine applies them with the colon: `:label1` applies one, `:(label1,
label2)` two, and `:label1{ isText && containsMeta }` applies `:label1` only to text that
contains metadata. Labels accumulate: a Block attached to a depth-2 metaBlock carries the labels
that apply to it from that metaBlock and from the depth-1 metaBlock it nests under.

At this release the Labels Alterant knows a fixed list of 38 names: `label1` to `label5` and
33 pictographs such as `🍒`, `💡` and `🔥`. Applying a name outside the list is refused with
a message that names the accepted set; asking in a condition for a name that is unknown, or
not applied, answers false. The list lives with the Labels Alterant; which names it holds, and how a name is added, are under the author's review.

## 6. Conditions

The optional `{}` after a value or a label states the condition under which it gets applied.
As the author explains the first example: *the optional `{}` following `hide` on line 1
allows the user to specify conditions under which `hide` may get applied — a Block inheriting
from it will be hidden if it has been attributed `:label4` or is a code Block, provided there
is no opposing statement closer to that Block overruling it.*

| written | meaning | from the examples |
|---|---|---|
| `,` | or | `discard{ :label2 , isCode}` — discard if `:label2` or code |
| `&&` | and | `:label1{ isText && containsMeta }` |
| `!` | not | `show{ !:label5}` — show only where `:label5` has not been applied |
| `()` | grouping | `:label1{ (isText && containsMeta), isMeta }` |

The atoms of a condition are labels and the [BLS key words](#the-BLS-key-words) — in the examples `isCode`, `isText`, `isMeta` and
`containsMeta`. Write `()` wherever the reading of a mixed condition could be in doubt, as the
first example does.

**A condition is Julia.** GoMeta rewrites the condition's own parts — a label test such as
`:label4`, a BLS key word such as `isCode` — into Julia, Julia's parser reads the result once,
and Julia evaluates it when the Engine applies the statement. A condition can therefore contain
a Julia expression over those atoms that evaluates to true or false, and it can run code: processing a file you did not write
runs its conditions as Julia code. Use GoMeta on input you trust, as you would any Julia file
you `include`.

The three names `hide`, `show` and `discard` cannot be asked in a condition: `hide{ show }` is refused.

## 7. Visib

Visib is the Alterant of visibility. Its values are `show`, `hide` and `discard`, and for any
one Component only one of them applies at a time; where nothing applies, the value is `show`.
`discard` removes what it concerns from the output; `hide` keeps it but out of sight — what
"out of sight" is depends on the format and on the Extension: the package's own development
tool comments a hidden line out with `## ` (strictly speaking it is no Extension, though it behaves like one); an Extension may hide the same Block as one
multi-line comment — and an Extension may even render what would be discarded in bold red instead of discarding it, to show what the evaluation would remove. A hidden piece of
metadata is still metadata: it is evaluated as usual, and only its visibility changes;
discarded metadata is gone from the output.

A metaLine is itself a Component and is itself subject to Visib: a hidden metaBlock's Lines are
hidden with it; a discarded one's are discarded. In the second example file the one-line
metaBlock at line 51 carries `:label2` and is discarded with its markdown, by the
`discard{ :label2 , isCode}` of line 7 it inherits from.

## 8. How a value reaches a Component

**Inheritance.** A Component carries the statements of the metaBlock it is attached to and of
every shallower metaBlock that one nests under. In the first example file the code Block at
line 10 inherits `hide{ :label4 , isCode }` from line 1 and `:label5` and `show{ !:label5}`
from line 9.

**Indirectly, as parts.** A value evaluated for a Block holds for that Block; its Lines and
Segments are hidden, or discarded, or labelled, because they are parts of that Block, not
because each of them inherited the value on its own. This is the principle for every Alterant:
a Block's Id, say, reaches its Lines indirectly too.

**The closest statement wins.** Where two statements of the same Alterant reach a Component,
the one closer to it overrules: a `show` at depth 2 overrules a `hide` inherited from depth 1;
a metaSegment at the end of a line overrules both for that line. In the first example file the
line 30 (*This `Line`, however, will NOT get hidden.*) ends in `#~ show` and stays shown inside a hidden
Block.

**Left to right on one metaLine.** The statements of a metaLine are read in order, and a
condition sees only what has been applied before it. In the first example file the metaLine
`#~3 :label4 discard{:label3} :label3` does not discard the Block attached to it: `:label3` has not been
applied yet when `discard{:label3}` is issued; only after that does the Block receive
`:label3`. The condition stands, though, and applies to content that comes to carry the label
later: in the second example file, the line that ends in a bare `#~` inherits `:label4` because of that `#~`
and is discarded by the `discard{:label4}` issued before that label on line 34.

**Siblings.** Two metaBlocks at the same depth are siblings; the later one does not inherit
from the earlier one.

## 9. The inert marker, the close, the inline metaSegment

**The inert marker `#~N!`.** An exclamation mark after the depth — `#~!` at depth 1, `#~2!` at
depth 2 — tells GoMeta to ignore the metadata that follows it on that line; the line stays a
metaLine for the structure, so `#~2!` behaves in the structure exactly as `#~2` would. In
the second example file, line 10 `#~! discard{ isMeta }` applies no discard, purely because of
the `!`. The exclamation mark belongs after the depth: `#~!2` is a mistake and is refused with
a message naming the correct spelling.

**The close `#]`** — §4.

**The inline metaSegment.** A `#~` at the end of a content line, followed by a statement,
applies that statement to the line: `#~ hide` hides the line, `#~ discard` removes it, `#~ show`
keeps it visible inside a hidden Block. A bare trailing `#~` makes the line itself
inherit metadata, which can make a standing condition fire on it (§8). A
statement at the end of a line reaches the line as a whole at this release; a finer grain —
a metaSegment applying to the Segments before it within the line — is part of the design and
not yet implemented.

## 10. Arguments

Parentheses pass arguments to a value: `someAlterantsValue(arg1, arg2)`. The Labels Alterant's colon takes
labels as its arguments, in the two equivalent forms `:label1 :label2` and `:(label1, label2)`.
Visib's values take no arguments; `hide()` is read as `hide`. The Id Alterant's values `cell`,
`parent` and `file` take one integer argument (`cell(7)`); the Id Alterant is a placeholder at
this release and its syntax may change — do not build durable content on it.

## 11. The examples

Two example files are the author's and are the law of the notation; five further inputs are
examples the package's tests use. All seven stand under `examples/InFileFolder/`, each with its
rendered copy under `examples/OutFileFolder/`, and the shipped test suite pins every rendered
copy byte for byte.

| input | what it exercises |
|---|---|
| `file_for_Example_Proposal_JuliaCon.jl` | the proposal's example: depths 1–3; `hide{ :label4 , isCode }`; a conditional label with `()` grouping; `show{ !:label5}`; an inline `#~ show` inside a hidden Block; an inline `#~ hide` in markdown; the order of statements on one metaLine |
| `file_for_Example_Extended.jl` | depths 1–3; `,`, `&&` and `!` in conditions; the inert `#~!`; inline `#~ hide`, `#~ discard` and a bare `#~`; a Block detached by an empty line; a sibling metaBlock; a standing condition firing later |
| `feature_explicit_close.jl` | the close `#]` |
| `feature_order_of_application.jl` | a condition issued before its label |
| `feature_contiguous_metablock.jl` | contiguous metaLines of two depths as one metaBlock |
| `feature_contiguous_metablock_blankline.jl` | the same two metaLines with an empty line between them |
| `feature_triple_tilde.jl` | `#~~~` as depth 3 under a depth-2 metaBlock |

The author's proposal introduces the first file so: "All this is readily exemplified by a
self-explanatory toy example. It is contained in the GoMeta folder together with instructions
and additional tools revealing some insights into the package's inner workings." — and explains
its opening: "The first three lines in the code below form a Block of metadata at level 1. The
optional {} following hide on line 1 allows the user to specify conditions under which hide may
get applied. In this case, a Block, say aBlock, inheriting from it will be hidden, if it has
been attributed :label4 or is a code Block provided there is no opposing statement closer to
aBlock overruling it. Analogously, :label1 gets assigned to anything which inherits from this
first meta Block, if it is text and containsMeta or is itself meta, provided there is no other
statement closer by, overruling this." The committed file's comment lines differ from the
proposal's listing in wording only; the metaLines are the same.

::: details The full delivery view of the first example — every Block and Line with its evaluated values, as the development tools print it

```
status: PROCESS_OK
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

::: details The full delivery view of the second example

```
status: PROCESS_OK
File  file_for_Example_Extended.jl  —  24 evals rows on 9 cells  (of 9 Blocks · 63 Lines)
├─ Block #2  Text  L1–L5    "## Test File⏎## NOTE: I've addes some…"   (no evals — defaults apply)
│  ├─ Line #2   Text  L1       "## Test File"   (no evals — defaults apply)
│  ├─ Line #3   Text  L2       "## NOTE: I've addes some markers to t…"   (no evals — defaults apply)
│  ├─ Line #4   Text  L3       "##      They have nothing to do with …"   (no evals — defaults apply)
│  ├─ Line #5   Text  L4       "##      They are simply meant to assi…"   (no evals — defaults apply)
│  └─ Line #6   Text  L5       "##      comparing the input file to t…"   (no evals — defaults apply)
├─ Block #3  Meta  L6–L10   "#~ discard{ :label2 , isCode} ## This…"   (no evals — defaults apply)
│  ├─ Line #7   Meta  L6       ""   (no evals — defaults apply)
│  ├─ Line #8   Meta  L7       "#~ discard{ :label2 , isCode} ## This…"   (no evals — defaults apply)
│  ├─ Line #9   Meta  L8       "#~ :label1{ isText && containsMeta }"   (no evals — defaults apply)
│  ├─ Line #10  Meta  L9       "## The following meta `Line` within t…"   (no evals — defaults apply)
│  └─ Line #11  Meta  L10      "#~! discard{ isMeta } ## This `Line` …"   (no evals — defaults apply)
├─ Block #4  Text  L11–L16  "# With this `Line` of text starts a n…"   (no evals — defaults apply)
│  ├─ Line #12  Text  L11      ""   (no evals — defaults apply)
│  ├─ Line #13  Text  L12      "# With this `Line` of text starts a n…"   (no evals — defaults apply)
│  ├─ Line #14  Text  L13      "# This `Block` is NOT attached to met…"   (no evals — defaults apply)
│  ├─ Line #15  Text  L14      "# This `Line` should still be "hidden…"
│  │  ● visib        => :hide     (+)   ← Segment #9 "#~ hide"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,15)]  origin=[(direct,1) (direct,4) (direct,15) (direct,9)]
│  ├─ Line #16  Text  L15      "# ... and this `Line` should still be…"
│  │  ● visib        => :discard  (+)   ← Segment #11 "#~ discard"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,16)]  origin=[(direct,1) (direct,4) (direct,16) (direct,11)]
│  └─ Line #17  Text  L16      "# NOTE: Input line 15 will be missing…"   (no evals — defaults apply)
├─ Block #5  Meta  L17–L19  "#~2 :label3 :label5 show{ !:label5} #…"
│  ● label_label3 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
│  ├─ Line #18  Meta  L17      ""   (no evals — defaults apply)
│  ├─ Line #19  Meta  L18      "#~2 :label3 :label5 show{ !:label5} #…"   (no evals — defaults apply)
│  └─ Line #20  Meta  L19      "#~ hide{:label1} ## This comment ends…"   (no evals — defaults apply)
├─ Block #6  Code  L20–L32  "using Plots ## This `Segment` is a co…"
│  ● label_label3 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ● visib        => :discard  (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
│  ├─ Line #21  Code  L20      "using Plots ## This `Segment` is a co…"   (no evals — defaults apply)
│  ├─ Line #22  Code  L21      "## This `Block` of code starts with `…"   (no evals — defaults apply)
│  ├─ Line #23  Code  L22      "## This `Block` is ATTACHED to metada…"   (no evals — defaults apply)
│  ├─ Line #24  Code  L23      "## Therefore, this code `Block` recei…"   (no evals — defaults apply)
│  ├─ Line #25  Code  L24      "## `show` [input line 18] does NOT ge…"   (no evals — defaults apply)
│  ├─ Line #26  Code  L25      "##      as this can only happen if la…"   (no evals — defaults apply)
│  ├─ Line #27  Code  L26      ""   (no evals — defaults apply)
│  ├─ Line #28  Code  L27      "## Instead, this code `Block` inherit…"   (no evals — defaults apply)
│  ├─ Line #29  Code  L28      "##      since it is code i.e.: `isCod…"   (no evals — defaults apply)
│  ├─ Line #30  Code  L29      ""   (no evals — defaults apply)
│  ├─ Line #31  Code  L30      "println("!!! NOTE !!! Only Code and T…"   (no evals — defaults apply)
│  ├─ Line #32  Code  L31      "println("\t Whereas an empty line aft…"   (no evals — defaults apply)
│  └─ Line #33  Code  L32      "## @: Input line 32. It marks the end…"   (no evals — defaults apply)
├─ Block #7  Meta  L33–L34  "#~3 discard{:label4} :label4 ## This …"
│  ● label_label3 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ● label_label4 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
│  ├─ Line #34  Meta  L33      ""   (no evals — defaults apply)
│  └─ Line #35  Meta  L34      "#~3 discard{:label4} :label4 ## This …"   (no evals — defaults apply)
├─ Block #8  Text  L35–L49  "# Here starts a new `Block` of text #…"
│  ● label_label1 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
│  ● label_label3 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
│  ● label_label4 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
│  ● label_label5 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
│  ● visib        => :hide     (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
│  ├─ Line #36  Text  L35      "# Here starts a new `Block` of text #…"   (no evals — defaults apply)
│  ├─ Line #37  Text  L36      "#       which receives label4 from li…"   (no evals — defaults apply)
│  ├─ Line #38  Text  L37      "#       and label3 and label5 from li…"   (no evals — defaults apply)
│  ├─ Line #39  Text  L38      "#       and receives label1 from line…"   (no evals — defaults apply)
│  ├─ Line #40  Text  L39      "#       since it is a `Block` of text…"
│  │  ● label_label1 => true      (+)   ← Segment #28 "#~"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
│  │  ● label_label3 => true      (+)   ← Segment #28 "#~"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
│  │  ● label_label4 => true      (+)   ← Segment #28 "#~"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
│  │  ● label_label5 => true      (+)   ← Segment #28 "#~"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
│  │  ● visib        => :discard  (+)   ← Segment #28 "#~"
│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
│  ├─ Line #41  Text  L40      ""   (no evals — defaults apply)
│  ├─ Line #42  Text  L41      "# This `Block` does NOT get "discarde…"   (no evals — defaults apply)
│  ├─ Line #43  Text  L42      "#       NOT been applied yet when `di…"   (no evals — defaults apply)
│  ├─ Line #44  Text  L43      "# Instead this `Block` gets "hidden" …"   (no evals — defaults apply)
│  ├─ Line #45  Text  L44      "#       text and contains meta, there…"   (no evals — defaults apply)
│  ├─ Line #46  Text  L45      "#       and consequently inheriting t…"   (no evals — defaults apply)
│  ├─ Line #47  Text  L46      "## NOTE: Line 39, however, will get "…"   (no evals — defaults apply)
│  ├─ Line #48  Text  L47      "##      since this `Line` inherits la…"   (no evals — defaults apply)
│  ├─ Line #49  Text  L48      "##      and consequently `discard{:la…"   (no evals — defaults apply)
│  └─ Line #50  Text  L49      "## @: Input line 49. It is at the end…"   (no evals — defaults apply)
├─ Block #9  Meta  L50–L51  "#~2 :label2 ## This is a comment with…"
│  ● label_label2 => true      (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
│  ● visib        => :discard  (+)
│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
│  ├─ Line #51  Meta  L50      ""   (no evals — defaults apply)
│  └─ Line #52  Meta  L51      "#~2 :label2 ## This is a comment with…"   (no evals — defaults apply)
└─ Block #10 Text  L52–L63  "md"""⏎This is a `Block` of markdown t…"
   ● label_label2 => true      (+)
       handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
   ● visib        => :discard  (+)
       handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
   ├─ Line #53  Text  L52      "md""""   (no evals — defaults apply)
   ├─ Line #54  Text  L53      "This is a `Block` of markdown text."   (no evals — defaults apply)
   ├─ Line #55  Text  L54      ""   (no evals — defaults apply)
   ├─ Line #56  Text  L55      "It is ATTACHED to the one-`Line` meta…"   (no evals — defaults apply)
   ├─ Line #57  Text  L56      "It therefore inherits label2."   (no evals — defaults apply)
   ├─ Line #58  Text  L57      ""   (no evals — defaults apply)
   ├─ Line #59  Text  L58      "This meta `Block`, however, neither i…"   (no evals — defaults apply)
   ├─ Line #60  Text  L59      "starting with "#~3" nor that further …"   (no evals — defaults apply)
   ├─ Line #61  Text  L60      ""   (no evals — defaults apply)
   ├─ Line #62  Text  L61      "It DOES inherit from the first meta `…"   (no evals — defaults apply)
   ├─ Line #63  Text  L62      "Which is why it gets "discarded" - du…"   (no evals — defaults apply)
   └─ Line #64  Text  L63      """""   (no evals — defaults apply)
```

:::

## 12. Verify it

From the repository root, after `Pkg.instantiate()`:

```
julia --startup-file=no --project=. devtools/run_examples.jl
```

It processes every input under `examples/InFileFolder/`, writes each rendered copy to a scratch
folder (printed; `--out <dir>` keeps them where you say) and compares every rendered copy byte
for byte with the committed one under `examples/OutFileFolder/`. To test a reading of this
page, copy or edit an input, rerun, and read the resulting copy — and read the delivery view
the development tools print for it, which shows what the Engine evaluated for each Block and
Line:

```
julia --startup-file=no --project=tests devtools/devtools.jl evals-tree <file>
```

## 13. What the examples do not exercise

- The Heading and Id Alterants' effects. Their values exist in the package (`head`; `cell`,
  `parent`, `file`); the examples do not exercise them, and the Id Alterant is a placeholder.
- `containsText`: BLS records it, but no example asks for it in a condition.
- The reading of a mixed condition without `()`: Julia's own rules decide it; write the parentheses.
- A tilde count with a differing digit, such as `#~~3`.
- A `##` comment and an inline `#~` on the same content line.
- More than one Visib value on one metaLine, such as `discard{ isCode } show` — the author's
  rule, given before this release: the first applicable value wins.
- The limits of this release: the label list is closed (§5); one depth level of the meta
  hierarchy holds at most eight statements, a ninth is refused with a message; the digit form of
  the depth reads 1 to 8 (§2).
