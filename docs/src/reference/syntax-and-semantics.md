# Syntax & semantics

This page is the reference for the notation of GoMeta — the **[metaLines](#metaLine)** written into a
file's comments — and for what the GoMeta Engine evaluates from them. It is written for the release **0.4.4** (alpha) from the package's own reference document and from GoMeta's design. The two example files committed with the package, and the [talk proposal for JuliaCon 2026](https://pretalx.com/juliacon-2026/talk/XYMFMZ/) by Jerae Sieburgh, which they illustrate, are, in general, the law of the notation: where this page and a committed example could ever disagree, the example and what GoMeta evaluates for it count. The page's terms are defined in the [Glossary](#Glossary) below or where they first appear.

## 0. What GoMeta does

A source file carries ordinary content plus [metaLines](#metaLine). [BLS](#BLS,-Component,-Block,-Line,-Segment,-File),
GoMeta's parser, reads the file and records what it finds in the **BLS Component tree**: the
File, its Blocks, their Lines, and the Segments within a Line — each of them a [Component](#BLS,-Component,-Block,-Line,-Segment,-File), and
every Block, Line and Segment carrying a [flavor](#flavor): Meta, Text or Code. The [GoMeta Engine](#the-GoMeta-Engine,-Extension) then evaluates the metadata over
that BLS Component tree: for each Component, which value of which [Alterant](#Alterant) applies. GoMeta
evaluates the metadata — more precisely, the GoMeta Engine evaluates it — but does not act on
those evaluations: that is the [Extensions](#the-GoMeta-Engine,-Extension)' role; they receive the evaluations through GoMeta's
interface, [`altValues_evals`](../reference/public-api.md#1.-One-call:-the-entry).

Throughout this page the Alterant **Visib**, with its values `show`, `hide` and `discard`, is
the example, because what the GoMeta Engine evaluates for it can be checked by eye in a rendered copy of the file.
Visib is one Alterant among others; the principles this page states — how a value is written — hold for every Alterant, while which values an Alterant has, how far a value reaches, whether a closer [statement](#statement,-metaSegment) overrules, and whether more than one of them may apply to one piece at a time, are each Alterant's own.

## Glossary

### comment marker

The **comment marker** is the character, or pair of characters, that opens a comment in the file's format: `#` in Julia, `//` in the C family (e.g. C, Rust, etc.),
`%` in LaTeX. The [GoMeta markers](#GoMeta-marker) are built on it: `#~` opens a metaLine; `##` opens a comment and `#]` the
close. In another format the same forms use that format's comment marker — `//~`, `//#` and `//]` in the C family, `%~`, `%%` and `%]` in LaTeX — named when GoMeta is called.

### GoMeta marker

A **GoMeta marker** is the [comment marker](#comment-marker) of the file's format followed by a tilde: `#~` in Julia, `//~` in the C family (e.g. C, Rust, etc.), `%~` in LaTeX — with its depth where one is written (`#~2`, `//~2`) and the `!` of the inert form (`#~!`). The GoMeta markers symbolize GoMeta: the tilde is part of its logo. GoMeta's comment and its close — `##` and `#]` in Julia, `//#` and `//]` in the C family, `%%` and `%]` in LaTeX — are built on the comment marker in the same way.

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
Labels, Heading and Id; the examples exercise Visib and Labels (§13), and rung 6 of [the ladder](../examples/step-by-step.md) shows the Heading.

### statement, metaSegment

A **statement** is one instruction on a metaLine: the value of an Alterant,
with optional arguments in `()` and an optional condition in `{}` that says when the value
applies (e.g. `hide{ isCode }`, `:label1`, `discard{ :label2 , isCode}`, etc.). A metaLine may carry
several statements. At the file level and in the user level a statement may instead be one of the Labels Alterant's [vocabulary statements](#vocabulary,-vocabulary-statement), which applies no value to any Component and takes no condition (§5). A **metaSegment** is a Segment of metadata within a content line: the marker `#~` after the line's content and the statements after it, if any; its statements apply to that line.

### altValue, evals

An **altValue** is one evaluated value of an Alterant for one Component. The **evals** are the
altValues the GoMeta Engine evaluated for a run, delivered as `altValues_evals` — one row per
evaluated value, each at its Component.

### diagnostic

A **diagnostic** is one record in the delivery's list of diagnostics: a code, a severity — error, warning or
info — a message and a context. A run that completes may carry warning and info diagnostics beside its
result — a label that did not apply, a change of the vocabulary file (§5); an error diagnostic marks a failed
run ([Public API](public-api.md#8.-What-a-program-sees-when-something-is-wrong)).

### label

A **label** is a tag the Labels Alterant applies to the Components in a statement's reach. The
colon is the action and the labels are its arguments: `:(label1, label2)` applies two; for one
label `:label1` is short for `:(label1)`. A label can be given a condition: `:label1{ isText }`
applies it only where the condition holds. A label can also be [withheld, or applied explicitly](#withhold,-explicit-apply). The names a run may apply are the Labels Alterant's [vocabulary](#vocabulary,-vocabulary-statement) (§5).

### withhold, explicit apply

A **withhold** keeps a label out of the set a Component carries: `:-label1` withholds one name,
`:(-, label1, label2)` several, at the statement's own metaBlock and everything under it until a later
metaBlock of the same or a shallower depth replaces the slot. An **explicit apply**, `:+label1` or
`:(+, label1)`, applies a label whether or not a withhold stands above it. A plain `:label1` met by a
withhold applies nothing and is reported by a warning [diagnostic](#diagnostic) (§5).

### vocabulary, vocabulary statement

The **vocabulary** is the set of names the Labels Alterant applies as labels: the names of the user
level's **vocabulary file** — a copy of the file shipped with GoMeta, made at the first need — which
the **vocabulary statements** edit, for every later run as well: `:++label6` adds a name to the
vocabulary, `:--label1` removes one from it (§5).

### condition

The **condition** is the optional `{}` after a value or a label: the condition under which it gets applied. Its
atoms are labels (`:label4`) and the BLS key words; they are joined with `,` (or), `&&` (and),
`!` (not) and grouped with `()`.

### the BLS key words

The **BLS key words** are facts about a Component that BLS records when it reads the file, and that a condition may ask (e.g.
`isCode`, `isText`, `isMeta`, `containsMeta`, etc.). They are entries of the Component's settribute.

### settribute

A **settribute** is a data store, usually for smallish entries, that can be set to a range of particular values; it is used for settings and attributes alike — hence the name. Every Component carries one; it is built as a [NamedElement](#NamedElement), described below. The BLS key words
are the entries BLS sets in it when it reads the file.

### NamedElement

A Component's settribute is built as an instance of a **NamedElement**: a fixed-size data store whose entries are read and set by name. BLS declares the type with a Julia macro of its own, `@namedElement`. Given a type name, the Julia type of the entries and the list of the entries' names, the macro writes the type: a struct around one fixed-size array, a table that maps each name to its position in that array, the constructors, and the functions that read and set an entry by name — `getElement(store, :isCode)` returns one array element. A NamedElement of `Bool` entries is thus a vector of named flags (a bit vector of one `Bool` per entry, not Julia's packed `BitVector`); one of `Int` entries is a vector of named integers.

Every Component carries two such stores: its named integers (`CmpntNamedInt`, nine entries at this release, e.g. its number — the `#N` the views print after Block, Line or Segment — and its parent's, its input line number, the number of its children, where its main string starts and stops, etc.) and its settribute (`ComponentSettribute`, 42 `Bool` entries at this release, e.g. the BLS key words `isMeta`, `isCode`, `isText` and `containsMeta`, a flag per depth such as `depth1`, the attachment facts, `comment`, `isEmpty`, `hasMetaStr`, etc.). The Component-tree view on the [Development tools](development-tools.md) page prints both for every Block, Line and Segment: the `Int64` row is the named-integer store, the `Bool` row names the settribute entries that are set.

The [public surface](public-api.md#5.-The-BLS-Component-tree-and-its-door) offers the read `getElement(c, key)` on a Component `c` and the two types `ComponentSettribute` and `CmpntNamedInt`; the macro and the rest of what it writes are BLS's internals.

### depth, the meta hierarchy

A metaBlock sits at a **depth** (e.g. `#~` is depth 1, `#~2` depth 2, etc.) — written as a digit, or
as the number of tildes (`#~~~` is depth 3). The depths form the **meta hierarchy**, like the
levels of headings: a deeper metaBlock nests under the shallower one open above it and inherits
from it. `#~0` is the file level; above it lies the **user level**, which a program may feed through the
configuration ([Public API](public-api.md#2.-The-configuration)).

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
  arguments and `{}` [condition](#condition), and [labels](#label) — applied, or withheld and applied
  explicitly with a sign at the head of the statement (§5). They are read from left to right.
- A **heading** is a quoted text first on a metaLine — `#~ "Chapter one"` — a value of the Heading Alterant,
  applied to the metaBlock that states it and to no other Block; the view records it as `head_<depth>`, `head_1`
  for this metaLine (rung 6 of [the ladder](../examples/step-by-step.md)).
- At the file level (`#~0`) and in the [user level](#depth,-the-meta-hierarchy) a statement may also be one of the
  Labels Alterant's [vocabulary statements](#vocabulary,-vocabulary-statement): `:++label6` or `:(++, label-3, label🏔️, label_💡)` adds names to the
  Labels Alterant's vocabulary, `:--label1` or `:(--, label1, label2)` removes names from it — in the user level's
  vocabulary file, so for every later run as well (§5). Such a statement is read once and applies to no Component.
- Everything after a `##` on the same line is a **comment** for the reader; GoMeta does not
  read it as metadata.

Besides the standard metaLine on its own line, three further forms exist: the **close** `#]`
(§4), the **inline [metaSegment](#statement,-metaSegment)** — a `#~` at the end of a content line, with a statement after it or none (§9) —
and the **inert marker** `#~!` (`#~2!` at depth 2), whose content is not processed (§9).

**A marker needs its space.** A [GoMeta marker](#GoMeta-marker) — `#~` with its depth or `!` where one is written — and GoMeta's comment `##` and its close `#]` are recognised only when white
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

::: details Measured: four inputs with markers inside strings — what GoMeta evaluated for each, as the development tools print it; the third ends in the refusal

In the development tool's printouts a "cell" is a BLS Component that carries evaluated values —
the tool's word; this site says Component. Its "(no evals — defaults apply)" marks a Component with no evaluated values of its own; it falls under the value of a Component that contains it, else under the Alterant's declared default. Each view ends with the run's line — its status and its diagnostics, here `── the run: status PROCESS_OK · no diagnostics`.

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">strings_julia_A.jl</span><span class="gm-dt-gutter">  —  4 evals rows on 4 cells  (of 4 Blocks · 11 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# Probe A: a multi-line string whose …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# Probe A: a multi-line string whose …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "#~ hide{ isCode }"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "#~ hide{ isCode }"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L3–L10  </span> "x = 1⏎⏎s = """⏎first line of the stri…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L3      </span> "x = 1"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L4      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L5      </span> "s = """"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L6      </span> "first line of the string"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #8   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L7      </span> "second line of the string #~ discard"
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #3 "#~ discard"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,8)]  origin=[(direct,1) (direct,4) (direct,8) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #9   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L8      </span> "third line of the string #~ hide"
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #5 "#~ hide"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,9)]  origin=[(direct,1) (direct,4) (direct,9) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L9      </span> "fourth line of the string"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "y = 2"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "y = 2"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">strings_julia_B.jl</span><span class="gm-dt-gutter">  —  2 evals rows on 2 cells  (of 4 Blocks · 11 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# Probe B: a multi-line string with a…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# Probe B: a multi-line string with a…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "#~ hide{ isCode }"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "#~ hide{ isCode }"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L3–L10  </span> "x = 1⏎⏎t = """⏎alpha⏎#~ hide⏎beta⏎gam…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L3      </span> "x = 1"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L4      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L5      </span> "t = """"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L6      </span> "alpha"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L7      </span> "#~ hide"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L8      </span> "beta"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L9      </span> "gamma"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "y = 2"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "y = 2"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

```
goMeta threw (no delivery):
GoMeta absorb: unknown alterant action "right" — not one of the registered sorted_alt_actions = [:(:), :cell, :discard, :file, :head, :hide, :ids, :parent, :show] (v0's closed action set; see docs/public-api.md §3.4)
```

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">strings_latex.tex</span><span class="gm-dt-gutter">  —  2 evals rows on 2 cells  (of 4 Blocks · 14 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "% A probe for the Syntax &amp; semantics …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "% A probe for the Syntax &amp; semantics …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #3  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L2–L7   </span> "\documentclass{article}⏎\begin{docume…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L2      </span> "\documentclass{article}"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L3      </span> "\begin{document}"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L4      </span> "Ordinary text before the environment."<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L5      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L6      </span> "\begin{verbatim}"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L7      </span> "line one of the verbatim block"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> "%~ hide"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> "%~ hide"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L9–L14  </span> "line two of the verbatim block⏎line t…"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L9      </span> "line two of the verbatim block"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10     </span> "line three of the verbatim block"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "\end{verbatim}"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L13     </span> "Ordinary text after the environment."<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "\end{document}"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
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
form the meta hierarchy, like the levels of headings in a document: a deeper metaBlock nests under the shallower one open above it and [inherits](#attachment,-inheritance) from it (e.g. a [metaBlock](#metaBlock) at depth 2
under the depth-1 metaBlock, a metaBlock at depth 3
under the depth-2 one, etc.). Two metaBlocks at the same depth are **siblings**: one does
not inherit from the other. In the digit form the package reads depths from 1 to 8; `#~9` is
refused with a message.

## 3. metaBlocks

Contiguous metaLines form one metaBlock. A `##` comment line between them belongs to the
metaBlock and does not break it. An empty line after a metaLine starts a new Block: only Code
and Text Blocks may contain interior empty lines. The depth of a metaBlock is the depth of its first
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
that apply to it from that metaBlock and from the depth-1 metaBlock it nests under — unless a
statement withholds one: `:-label1` keeps `label1` out of the set from there down (below).

GoMeta ships the Labels Alterant's vocabulary as a data file of 46 names: the five names the committed
examples use — `label1` to `label5` — and `doc`; 33 pictograph names, each the word label glued to a
pictograph (e.g. `label🍒`, `label💡`, `label🔥`, etc.; a bare pictograph is no shipped name), and seven
everyday names — `warning`, `note`, `info`, `definition`, `todo`, `public` and `private`. A run reads the
user level's copy of that file (`~/.gometa/labels-vocabulary.txt`, made from the shipped file at the
first need; another file through the environment variable `GOMETA_LABELS_VOCABULARY`), and that copy is
the base of the run's [vocabulary](#vocabulary,-vocabulary-statement); a file extends and prunes it, for
good, with the Labels Alterant's **vocabulary statements**:

- `:++label6` adds the name `label6` to the Labels Alterant's vocabulary; `:(++, label-3, label🏔️, label_💡)`
  adds several at once — the names not yet in it (`label🏔️` ships, so that statement adds two);
- `:--label1` removes the name `label1` from it — a shipped name as well as one added before; `:(--, label1, label2)`
  removes several at once. Since the statement edits the user level's vocabulary file, `label1` stays removed for every
  later run on that machine, a later `:label1` reported as unknown, until it is added again or the file reverted — delete
  it, or copy the shipped file over it.

**Where a vocabulary statement may stand.** In a metaBlock opened by `#~0`, the file level (§2; a
metaBlock's depth is its first metaLine's, §3), and in the user level a program feeds through the
configuration ([Public API](public-api.md#2.-The-configuration)). Anywhere else — a metaBlock of
depth 1 or deeper, an inline metaSegment — it is refused with a message naming the two places.

**What it does.** A vocabulary statement is applied to no Component: it is read once, applies no
label, leaves no evaluated value, and does not count towards the eight statements a depth level
holds (§13). It holds from its own metaBlock onward — for that metaBlock and for every Block after
it; a later metaBlock at `#~0` adds to it and does not undo it. Inside its own metaBlock the order
does not matter: a label may be applied on the line before the statement that admits it, and a
name removed there is reported, not applied, wherever a statement of that metaBlock applies it. The run's vocabulary is the names
of the user level's vocabulary file plus the names added minus the names removed, and for one name
the later statement wins: a removed name added again is back; adding a name already there, or
removing one that is not, changes nothing. The vocabulary statements of the user level are read
before the file's, so for the same name a statement of the file wins over the user level's. A
vocabulary statement that changes the vocabulary edits the user level's vocabulary file — for every
later run on that machine — and a run that completes delivers one info [diagnostic](#diagnostic) per
change, naming the statement, the file and the way back; a file that cannot be written is reported
by a warning diagnostic and the change holds for that run alone.

**What is reported, and what is refused.** Applying a name outside the run's vocabulary — a name
never added, removed, or misspelt — applies nothing, under the plain form, the withhold and the
explicit apply alike; the run completes and delivers one warning [diagnostic](#diagnostic) per name at
each Component concerned, naming the statement and the remedy — declare the name with `:++…` at `#~0`
or in the user level, or correct the spelling; a list applies its other names. Asking in a condition
for a name that is unknown, or not applied, answers false. A malformed vocabulary statement is refused
when it is read, with a message: a condition on it (`:++label6{ isCode }` — a vocabulary statement
takes none); a name beginning with `+` or `-`; a name beginning with `#` (the vocabulary file reads
such a line as a comment); a name with white space or an invisible character inside; a statement
naming no label (`:++`, `:(++)`); a list with an empty member, a stray comma (`:(++, label6, )`); the
one-name form given several names (`:(++label6, label7)` — the list form names several). A refused
run delivers nothing, but a change an earlier vocabulary statement of the same run already made to the
vocabulary file stays. A quoted name (`:(++, "label6")`) is not a vocabulary statement and is refused
like any quoted text in a slot that takes none.

The vocabulary lives in one file of the user level — another file through the environment variable
`GOMETA_LABELS_VOCABULARY` — which the vocabulary statements edit; loading several vocabulary files
from several sources belongs to a later release.

**The withhold and the explicit apply.** A sign at the head of a label statement withholds a label or
applies it explicitly. `:-label1` or `:(-, label1, label2)` keeps the named labels out of the set at the
statement's own metaBlock and everything under it, until a later metaBlock of the same or a shallower
depth replaces the slot — the Engine's own reach, as for any statement (§4); `:+label1` or `:(+, label1)`
applies a label whether or not a withhold stands above it. Within one metaBlock the written order
decides: `:label1 :-label1` ends without `label1`, `:-label1 :+label1` ends with it. A plain `:label1`
at a Component where `label1` is withheld applies nothing, and the run completes: it delivers one
warning diagnostic per name at each Component concerned, naming the ways out — drop the withhold, or
write `:+label1` where one statement must apply the label regardless. A withhold leaves the vocabulary
untouched: it holds for the run, where `:--label1` removes the name for good. A withhold or an
explicit apply fed through the user level is applied first at every Component attached to metadata,
so a file's plain `:label1` under a fed `:-label1` applies nothing and is reported. The sign stands at
the head of a statement, never inside a list: `:(label1, -label2)`, `:+-label1`, the one-name form given
several names (`:(-label1, label2)`), a sign with no name (`:-`) and a stray comma in a signed list
(`:(-, )`) are refused with a message naming the forms.

**A worked example.** The file below declares a name, applies it, withholds it, applies it explicitly
and removes it again; its comments say what each line does. `label🍒` ships with GoMeta and is applied under a condition;
`label🌲` does not ship and is declared for the file. The full delivery view under it shows every value at its Component and
ends with the run's line and its four [diagnostic](#diagnostic) rows: the info rows of the declaration and the removal, and the
warning rows of the plain `:label🌲` under the withhold, one at each of the two Components it reached. The run used a fresh vocabulary file at
`/tmp/example/.gometa/labels-vocabulary.txt`; on your machine the file is `~/.gometa/labels-vocabulary.txt`, and after the run
your vocabulary is as it was. The file is this site's at release 0.4.4; it is to join the package's committed examples.

```gometa
#~0 :++label🌲 ## This meta `Line` at level 0 DECLARES the label label🌲.
## label🌲 is NOT part of the shipped vocabulary: `:++` adds it to your
##      vocabulary file - reported by an info row at the end of the run.

#~ :label🌲 :label🍒{ isMeta } ## label🍒 IS part of the shipped vocabulary.
## Here, label🍒 gets applied ONLY to metadata - due to: `{ isMeta }`.
a = 1 ## This `Line` of code is ATTACHED to the meta `Block` above.
## It receives label🌲 - but NOT label🍒, since it is code, not metadata.

#~2 :-label🌲 ## `:-` WITHHOLDS label🌲 from this meta `Block` and all below it.
b = 2 ## This `Line` of code receives NO label: label🌲 is withheld
##      and label🍒 only applies to metadata.

#~3 :label🌲 ## A plain `:label🌲` under the withhold does NOT apply.
## It is reported by a warning row at the end of the run - the run proceeds.
c = 3 ## This `Line` of code receives NO label either.

#~3 :+label🌲 ## `:+` applies label🌲 EXPLICITLY, despite the withhold above.
d = 4 ## This `Line` of code receives label🌲 again.

#~0 :--label🌲 ## `:--` REMOVES label🌲 from your vocabulary file again,
##      reported by an info row: the file is as it was before this run.
```

::: details The full delivery view of the worked example — every Block and Line with its evaluated values, as the development tools print it, ending with the run's line and its diagnostics

In the development tool's printouts a "cell" is a BLS Component that carries evaluated values — the tool's word; this site says Component. Its "(no evals — defaults apply)" marks a Component with no evaluated values of its own; it falls under the value of a Component that contains it, else under the Alterant's declared default. The view ends with the run's line — its status and its diagnostics, here `── the run: status PROCESS_OK · 4 diagnostic rows` and the rows listed under it.

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">file_for_Example_Labels.jl</span><span class="gm-dt-gutter">  —  8 evals rows on 6 cells  (of 10 Blocks · 22 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1–L3   </span> "#~0 :++label🌲 ## This meta `Line` at…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1      </span> "#~0 :++label🌲 ## This meta `Line` at…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "## label🌲 is NOT part of the shipped…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L3      </span> "##      vocabulary file - reported by…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L4–L6   </span> "#~ :label🌲 :label🍒{ isMeta } ## lab…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🌲</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L4      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L5      </span> "#~ :label🌲 :label🍒{ isMeta } ## lab…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L6      </span> "## Here, label🍒 gets applied ONLY to…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L7–L8   </span> "a = 1 ## This `Line` of code is ATTAC…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🌲</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L7      </span> "a = 1 ## This `Line` of code is ATTAC…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L8      </span> "## It receives label🌲 - but NOT labe…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9–L10  </span> "#~2 :-label🌲 ## `:-` WITHHOLDS label…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L10     </span> "#~2 :-label🌲 ## `:-` WITHHOLDS label…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11–L12 </span> "b = 2 ## This `Line` of code receives…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "b = 2 ## This `Line` of code receives…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12     </span> "##      and label🍒 only applies to m…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L13–L15 </span> "#~3 :label🌲 ## A plain `:label🌲` un…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L13     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L14     </span> "#~3 :label🌲 ## A plain `:label🌲` un…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #16  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L15     </span> "## It is reported by a warning row at…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L16     </span> "c = 3 ## This `Line` of code receives…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L16     </span> "c = 3 ## This `Line` of code receives…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L17–L18 </span> "#~3 :+label🌲 ## `:+` applies label🌲…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🌲</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L17     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18     </span> "#~3 :+label🌲 ## `:+` applies label🌲…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L19     </span> "d = 4 ## This `Line` of code receives…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🌲</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L19     </span> "d = 4 ## This `Line` of code receives…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block">Block #11 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L20–L22 </span> "#~0 :--label🌲 ## `:--` REMOVES label…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L20     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L21     </span> "#~0 :--label🌲 ## `:--` REMOVES label…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L22     </span> "##      reported by an info row: the …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · 4 diagnostic rows
</span>diagnostic: LABELS_VOCABULARY_FILE_CHANGED (info) — label label🌲 — 1 occurrence(s)
   GoMeta absorb: `:++label🌲` added label🌲 to the vocabulary file /tmp/example/.gometa/labels-vocabulary.txt — it holds for this run and every later one; `:--label🌲` removes it again; see docs/public-api.md §2
   stated by: L1–L3
   file: "/tmp/example/.gometa/labels-vocabulary.txt"
   change: :added
   level: 1
   statement: ":++label🌲"
diagnostic: LABEL_NOT_APPLIED_WITHHELD (warning) — label label🌲 — 2 occurrence(s)
   GoMeta apply: the plain `:label🌲` did not apply label🌲 here — withheld; if this run means to withhold it, nothing to do; drop `:-label🌲` (in the user level's profile or in the file) to apply it everywhere; write `:+label🌲` where one statement must apply it regardless — a written `:+label🌲` then holds against a withhold stated above it or in the user level's profile; see docs/public-api.md §3.4
   stated by: L13–L15
   at: L13–L15, L16
   the Labels statements applied there so far: L4–L6, L4–L6, L9–L10, L13–L15 (at: L13–L15)
   the Labels statements applied there so far: L4–L6, L9–L10, L13–L15 (at: L16)
diagnostic: LABELS_VOCABULARY_FILE_CHANGED (info) — label label🌲 — 1 occurrence(s)
   GoMeta absorb: `:--label🌲` removed label🌲 from the vocabulary file /tmp/example/.gometa/labels-vocabulary.txt — it is unknown for this run and every later one; `:++label🌲` adds it again (the shipped file keeps the original list); see docs/public-api.md §2
   stated by: L20–L22
   file: "/tmp/example/.gometa/labels-vocabulary.txt"
   change: :removed
   level: 1
   statement: ":--label🌲"
4 diagnostic row(s) in 3 group(s)
</pre>
```

:::

## 6. Conditions

The optional `{}` after a value or a label states the condition under which it gets applied.
As the [talk proposal for JuliaCon 2026](https://pretalx.com/juliacon-2026/talk/XYMFMZ/) explains the first example, the optional `{}` following `hide` on line 1 allows the user to specify conditions under which `hide` may get applied: a Block inheriting from it is hidden if it has been attributed `:label4` or is a code Block, provided there is no opposing statement closer to that Block overruling it.

| written | meaning | from the examples |
|---|---|---|
| `,` | or | `discard{ :label2 , isCode}` — discard if `:label2` or code |
| `&&` | and | `:label1{ isText && containsMeta }` |
| `!` | not | `show{ !:label5}` — show only where `:label5` has not been applied |
| `()` | grouping | `:label1{ (isText && containsMeta), isMeta }` |

The atoms of a condition are labels and the [BLS key words](#the-BLS-key-words) — in the examples `isCode`, `isText`, `isMeta` and
`containsMeta`. Write `()` wherever the reading of a mixed condition could be in doubt, as the
first example does. A label atom answers false where the label is withheld — after the withhold, in
written order — as it does for a name that is unknown or not applied; no diagnostic reports a query,
so a `hide{ :label1 }` may stop firing silently (§5).

**A condition is Julia.** GoMeta rewrites the condition's own parts — a label test such as
`:label4`, a BLS key word such as `isCode` — into Julia, Julia's parser reads the result once,
and Julia evaluates it when the Engine applies the statement. A condition can therefore contain
a Julia expression over those atoms that evaluates to true or false, and it can run code: processing a file you did not write
runs its conditions as Julia code. Use GoMeta on input you trust, as you would any Julia file
you `include`. A vocabulary statement in such a file also edits your vocabulary file for good; each
change of a completed run is reported by an info diagnostic (§5).

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

**The closest applicable statement wins.** Where two Visib statements reach a Component, the closer applicable one overrules: a `show` at depth 2 overrules a `hide` inherited from depth 1;
a metaSegment at the end of a line overrules both for that line. In the first example file the
line 30 (*This `Line`, however, will NOT get hidden.*) ends in `#~ show` and stays shown inside a hidden
Block.

**Left to right on one metaLine.** The statements of a metaLine are read in order, and a
condition sees only what has been applied before it. In the first example file the metaLine
`#~3 :label4 discard{:label3} :label3` does not discard the Block attached to it: `:label3` has not been
applied yet when `discard{:label3}` is issued; only after that does the Block receive
`:label3`. The condition stands, though, and applies to content that comes to carry the label
later: in the second example file, the line that ends in a bare `#~` inherits `:label4` because of that `#~`
and is discarded by the `discard{:label4}` issued before that label on line 34. A
[vocabulary statement](#vocabulary,-vocabulary-statement) is recorded when its metaBlock is read, so within
that metaBlock its place does not matter (§5). The same left-to-right order governs the [withhold](#withhold,-explicit-apply):
`:label1 :-label1` ends without `label1`, `:-label1 :+label1` ends with it; a condition written before a
withhold still sees the label (§5).

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
labels as its arguments, in the two equivalent forms `:label1 :label2` and `:(label1, label2)`; a sign at the head of the statement withholds a label or applies it explicitly — `:-label1`, `:(-, label1, label2)`, `:+label1`, `:(+, label1)`, at any depth, the sign never inside a list (§5); at the file level and in the user level it also takes a vocabulary statement — a sign glued to one name, `:++label6` or `:--label1`, or the sign as the first argument of a list, `:(++, label-3, label🏔️, label_💡)` or `:(--, label1, label2)` (§5). GoMeta trims every bare argument's two edges of white space and of six invisible separators before the Alterant sees it — a quoted text is untouched; the class is the public `GoMeta.is_argument_space` ([Public API](public-api.md#6.-Extensions-and-the-registry)).
Visib's values take no arguments; `hide()` is read as `hide`. The Id Alterant's values `cell`, `parent` and `file` take one integer argument each (`cell(7)`), and its value `ids` takes the three at once: `ids(c, p, f)` sets `cell`, `parent` and `file` to `c`, `p` and `f`, exactly as `cell(c) parent(p) file(f)` would; the Id Alterant is a placeholder at this release and its syntax may change — do not build durable content on it.

## 11. The examples

Two example files, `file_for_Example_Proposal_JuliaCon.jl` and `file_for_Example_Extended.jl`, serve, in general, as the law of the notation; five further inputs are examples the package's tests use. All seven stand under `examples/InFileFolder/`, each with its
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

The [JuliaCon 2026 talk proposal](https://pretalx.com/juliacon-2026/talk/XYMFMZ/) explains the opening of the first file: "The first three lines in the code below form a Block of metadata at level 1. The optional {} following hide on line 1 allows the user to specify conditions under which hide may get applied. In this case, a Block, say aBlock, inheriting from it will be hidden, if it has been attributed :label4 or is a code Block provided there is no opposing statement closer to aBlock overruling it. Analogously, :label1 gets assigned to anything which inherits from this first meta Block, if it is text and containsMeta or is itself meta, provided there is no other statement closer by, overruling this." The committed file's comment lines differ from the
proposal's listing in wording only; the metaLines are the same.

::: details The full delivery view of the first example — every Block and Line with its evaluated values, as the development tools print it

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">file_for_Example_Proposal_JuliaCon.jl</span><span class="gm-dt-gutter">  —  28 evals rows on 10 cells  (of 8 Blocks · 35 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #2  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1–L3   </span> "#~ hide{ :label4 , isCode } ## This i…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,2)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1      </span> "#~ hide{ :label4 , isCode } ## This i…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "## The above `Line` of meta initiated…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L3      </span> "#~ :label1{ (isText &amp;&amp; containsMeta),…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #3  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L4–L7   </span> "# This `Line` of text starts a new `B…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L4      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> "# This `Line` of text starts a new `B…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L6      </span> "# This `Block` is NOT attached to met…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #8   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L7      </span> "# However, this `Line` will get disca…"
<span class="gm-dt-gutter">│     </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #7 "#~ discard"</span>
<span class="gm-dt-gutter">│         handle ns=:default  grain=Line  path=[(direct,1) (direct,3) (direct,8)]  origin=[(direct,1) (direct,3) (direct,8) (direct,7)]
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8–L9   </span> "#~2 :label5 show{ !:label5} ## This i…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> "#~2 :label5 show{ !:label5} ## This i…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10–L20 </span> "using Plots ## This `Line` starts a n…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10     </span> "using Plots ## This `Line` starts a n…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "## This code `Block` is ATTACHED to m…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12     </span> "## Therefore, this code `Block` recei…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L13     </span> "## `show` from line 9 above does NOT …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "##      as this can only happen"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #16  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L15     </span> "##      if label5 has NOT been applie…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L16     </span> "## This code `Block` inherits `hide` …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L17     </span> "##      since this is a code `Block` …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L18     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L19     </span> "println("!!! NOTE !!! Only Code and T…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L20     </span> "println("\t Whereas an empty line aft…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L21–L22 </span> "#~3 :label4 discard{:label3} :label3"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label4</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L21     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L22     </span> "#~3 :label4 discard{:label3} :label3"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L23–L30 </span> "# This `Block` of text receives label…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label4</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L23     </span> "# This `Block` of text receives label…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #25  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L24     </span> "#       plus label5 from further abov…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L25     </span> "#       plus label1 since it `isText`…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L26     </span> "# It is NOT "discarded" since label3 …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #28  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L27     </span> "#       when `discard{:label3}` is is…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #29  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L28     </span> "# Only after that it receives label3."<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #30  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L29     </span> "# Instead, it gets hidden due to labe…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #31  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L30     </span> "# This `Line`, however, will NOT get …"
<span class="gm-dt-gutter">│     </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #13 "#~ show"</span>
<span class="gm-dt-gutter">│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
</span><span class="gm-dt-gutter">│     </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #13 "#~ show"</span>
<span class="gm-dt-gutter">│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
</span><span class="gm-dt-gutter">│     </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label4</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #13 "#~ show"</span>
<span class="gm-dt-gutter">│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
</span><span class="gm-dt-gutter">│     </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #13 "#~ show"</span>
<span class="gm-dt-gutter">│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
</span><span class="gm-dt-gutter">│     </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #13 "#~ show"</span>
<span class="gm-dt-gutter">│         handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,31)]  origin=[(direct,1) (direct,7) (direct,31) (direct,13)]
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L31–L32 </span> "#~2 :label5"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #32  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L31     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #33  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L32     </span> "#~2 :label5"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L33–L35 </span> "md"""⏎This is a `Block` of markdown t…"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #34  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L33     </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #35  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L34     </span> "This is a `Block` of markdown text. #…"
<span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #15 "#~ hide"</span>
<span class="gm-dt-gutter">   │      handle ns=:default  grain=Line  path=[(direct,1) (direct,9) (direct,35)]  origin=[(direct,1) (direct,9) (direct,35) (direct,15)]
</span><span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #15 "#~ hide"</span>
<span class="gm-dt-gutter">   │      handle ns=:default  grain=Line  path=[(direct,1) (direct,9) (direct,35)]  origin=[(direct,1) (direct,9) (direct,35) (direct,15)]
</span><span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #15 "#~ hide"</span>
<span class="gm-dt-gutter">   │      handle ns=:default  grain=Line  path=[(direct,1) (direct,9) (direct,35)]  origin=[(direct,1) (direct,9) (direct,35) (direct,15)]
</span><span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #36  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L35     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

:::

::: details The full delivery view of the second example

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">file_for_Example_Extended.jl</span><span class="gm-dt-gutter">  —  24 evals rows on 9 cells  (of 9 Blocks · 63 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1–L5   </span> "## Test File⏎## NOTE: I've addes some…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "## Test File"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L2      </span> "## NOTE: I've addes some markers to t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L3      </span> "##      They have nothing to do with …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L4      </span> "##      They are simply meant to assi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> "##      comparing the input file to t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L6–L10  </span> "#~ discard{ :label2 , isCode} ## This…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L6      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7      </span> "#~ discard{ :label2 , isCode} ## This…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> "#~ :label1{ isText &amp;&amp; containsMeta }"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> "## The following meta `Line` within t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L10     </span> "#~! discard{ isMeta } ## This `Line` …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #4  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L11–L16 </span> "# With this `Line` of text starts a n…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L11     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L12     </span> "# With this `Line` of text starts a n…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L13     </span> "# This `Block` is NOT attached to met…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #15  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L14     </span> "# This `Line` should still be "hidden…"
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #9 "#~ hide"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,15)]  origin=[(direct,1) (direct,4) (direct,15) (direct,9)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #16  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L15     </span> "# ... and this `Line` should still be…"
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #11 "#~ discard"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,4) (direct,16)]  origin=[(direct,1) (direct,4) (direct,16) (direct,11)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L16     </span> "# NOTE: Input line 15 will be missing…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L17–L19 </span> "#~2 :label3 :label5 show{ !:label5} #…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L17     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18     </span> "#~2 :label3 :label5 show{ !:label5} #…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L19     </span> "#~ hide{:label1} ## This comment ends…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L20–L32 </span> "using Plots ## This `Segment` is a co…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L20     </span> "using Plots ## This `Segment` is a co…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L21     </span> "## This `Block` of code starts with `…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22     </span> "## This `Block` is ATTACHED to metada…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L23     </span> "## Therefore, this code `Block` recei…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #25  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L24     </span> "## `show` [input line 18] does NOT ge…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L25     </span> "##      as this can only happen if la…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L26     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #28  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L27     </span> "## Instead, this code `Block` inherit…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #29  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "##      since it is code i.e.: `isCod…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #30  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L29     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #31  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L30     </span> "println("!!! NOTE !!! Only Code and T…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #32  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L31     </span> "println("\t Whereas an empty line aft…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #33  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L32     </span> "## @: Input line 32. It marks the end…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L33–L34 </span> "#~3 discard{:label4} :label4 ## This …"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label4</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #34  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L33     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #35  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L34     </span> "#~3 discard{:label4} :label4 ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L35–L49 </span> "# Here starts a new `Block` of text #…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label4</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #36  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L35     </span> "# Here starts a new `Block` of text #…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #37  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L36     </span> "#       which receives label4 from li…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #38  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L37     </span> "#       and label3 and label5 from li…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #39  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L38     </span> "#       and receives label1 from line…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #40  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L39     </span> "#       since it is a `Block` of text…"
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #28 "#~"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
</span><span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label3</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #28 "#~"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
</span><span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label4</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #28 "#~"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
</span><span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label5</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #28 "#~"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
</span><span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #28 "#~"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,8) (direct,40)]  origin=[(direct,1) (direct,8) (direct,40) (direct,28)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #41  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L40     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #42  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L41     </span> "# This `Block` does NOT get "discarde…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #43  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L42     </span> "#       NOT been applied yet when `di…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #44  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L43     </span> "# Instead this `Block` gets "hidden" …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #45  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L44     </span> "#       text and contains meta, there…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #46  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L45     </span> "#       and consequently inheriting t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #47  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L46     </span> "## NOTE: Line 39, however, will get "…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #48  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L47     </span> "##      since this `Line` inherits la…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #49  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L48     </span> "##      and consequently `discard{:la…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #50  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L49     </span> "## @: Input line 49. It is at the end…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L50–L51 </span> "#~2 :label2 ## This is a comment with…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label2</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #51  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L50     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #52  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L51     </span> "#~2 :label2 ## This is a comment with…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L52–L63 </span> "md"""⏎This is a `Block` of markdown t…"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label2</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
</span><span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
</span><span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #53  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L52     </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #54  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L53     </span> "This is a `Block` of markdown text."<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #55  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L54     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #56  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L55     </span> "It is ATTACHED to the one-`Line` meta…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #57  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L56     </span> "It therefore inherits label2."<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #58  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L57     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #59  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L58     </span> "This meta `Block`, however, neither i…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #60  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L59     </span> "starting with "#~3" nor that further …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #61  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L60     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #62  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L61     </span> "It DOES inherit from the first meta `…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #63  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L62     </span> "Which is why it gets "discarded" - du…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #64  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L63     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
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
Line and ends with the run's status and its diagnostics — where a label that did not apply is reported:

```
julia --startup-file=no --project=tests devtools/devtools.jl evals-tree <file>
```

## 13. What the examples do not exercise

- The Id Alterant's effects. Its values exist in the package (`cell`, `parent`, `file`, `ids`); no example
  exercises them, and the Id Alterant is a placeholder. The Heading Alterant's value is seen in use at rung 6 of
  [the ladder](../examples/step-by-step.md) (`head_1` in its view); the basic renderer writes the metaLine as it is.
- `containsText`: BLS records it, but no example asks for it in a condition.
- The reading of a mixed condition without `()`: Julia's own rules decide it; write the parentheses.
- A tilde count with a differing digit, such as `#~~3`.
- A `##` comment and an inline `#~` on the same content line.
- More than one Visib value on one metaLine, such as `discard{ isCode } show`: the first applicable value wins.
- The limits of this release: the vocabulary of a run is the user level's vocabulary file plus what the
  run's own vocabulary statements add and remove, and the statements edit that file for good (§5); one depth level of the
  meta hierarchy holds at most eight statements — a vocabulary statement takes none of them — and a ninth
  is refused with a message; the digit form of the depth reads 1 to 8 (§2).
