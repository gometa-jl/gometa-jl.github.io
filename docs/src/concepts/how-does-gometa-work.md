# How does GoMeta work?

GoMeta's creator explains GoMeta by asking and answering three questions — what GoMeta is, why someone would want to use it, and how it works. This page answers the third by following one
run from a file to what the [Extensions](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) receive. GoMeta.jl adds interpretable `#~` metadata to
ordinary files, inside their comments; in one run,
[BLS](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File), GoMeta's
parser, reads such a file and records what it finds in the BLS Component tree, the
[GoMeta Engine](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) evaluates the
metadata over that BLS Component tree, one object is delivered, and the
[Extensions](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) act on it. The
notation is the [Syntax & semantics](../reference/syntax-and-semantics.md) page's; the names a
program calls are the [Public API](../reference/public-api.md) page's; the tools for looking at
a run are the [Development tools](../reference/development-tools.md) page's; what an Extension is
and may do is the [Extensions](extensions.md) page's. The page's terms are defined in the
[Glossary](../reference/syntax-and-semantics.md#Glossary) and linked at their first use.

## 1. One run

GoMeta runs over a file by calling BLS, uses BLS's facilities and the BLS Component tree BLS
produced, and delivers the evaluated [Alterant](../reference/syntax-and-semantics.md#Alterant)
values. All of this can then be consumed by one or by several Extensions. The GoMeta pipeline has four steps, in this order: (i) the input file; (ii) BLS produces the BLS Component tree — a main product of the GoMeta process; (iii) the GoMeta Engine produces, based on the BLS Component tree, the evaluated Alterant values, called `altValues_evals` — also a main product; (iv) the Extensions use these main products to execute the task they were designed for, for example to produce an output file. Every worked example and quickstart is to use that same pipeline; the examples on this site do.

From Julia it is one call:

```julia
import GoMeta

bytes    = read("examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl")
delivery = GoMeta.goMeta(bytes)           # ONE run: BLS parses the file into the BLS Component tree;
                                          # the GoMeta Engine evaluates the metadata over it — ONE object
                                          # delivered, a GoMetaDelivery, carrying both main products
delivery.status == GoMeta.PROCESS_OK || error("processing failed")
```

The [Getting started](../tutorials/getting-started.md) page runs this call on a committed example
and reads each product.

## 2. BLS reads the file: the BLS Component tree

In the words of GoMeta's creator: "GoMeta handles the metadata. However, before it can begin its work, BLS reads the file[s], extracts features of interest and records them in a tree-like structure based on the content at hand. The basic building block of the aforementioned structure consists of the Component. Blocks, Lines and Segments are all Components at different levels in the hierarchy. The records include where a Component starts and ends, its flavor [to avoid the term Type] such as code, metadata or text, its place in the tree structure and much, much more."
Why this granularity, in the words of his JuliaCon 2026 proposal: "Moreover, metadata needs to be absorbed,
i.e.: parsed and interpreted, from somewhere before it can be applied somewhere. Thus far, both
tasks had been executed on a Block-level [a section of consecutive lines]. BLS now provides a
distinctly finer granularity by introducing Components such as Block, Line and Segment. This not
only necessitated a complete overhaul of GoMeta's implementation but also of the grammar being
used."

BLS — named for the three kinds of pieces it finds: **B**lock, **L**ine, **S**egment — records
what it finds in the **BLS Component tree**: the File, its Blocks, their Lines, and the Segments
within a Line — each of them a
[Component](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File).
Every Block, Line and Segment carries a [flavor](../reference/syntax-and-semantics.md#flavor):
Meta, Text or Code. A comment is not a flavor: content of any flavor can take the form of a
comment. The purpose of BLS is to deliver the BLS Component tree, and it provides the facilities
to access the individual Components within it and the data contained within them. Those
facilities are not a result of the run: the same functions travel the BLS Component tree of any
run.

Among what BLS records for every Component are the
[BLS key words](../reference/syntax-and-semantics.md#the-BLS-key-words) — facts about the
Component that a [condition](../reference/syntax-and-semantics.md#condition) may ask (e.g. `isMeta`, `isCode`, `containsMeta`, etc.), entries of the
Component's [settribute](../reference/syntax-and-semantics.md#settribute). BLS reads a Julia file
on its [comment marker](../reference/syntax-and-semantics.md#comment-marker) `#`, a file of the C family (e.g. C, Rust, etc.)
on `//`, a LaTeX file on `%` — the three formats this release knows, named when GoMeta is called
(Julia is the default), never inferred from the file. Which kind of parsing applies to which kind of input is BLS's responsibility, and this machinery will be expanded to further kinds of input. The [Development tools](../reference/development-tools.md) page shows the
BLS Component tree of the first example file as the tools print it.

## 3. The metadata: metaLines

Take an ordinary Julia file and add one comment line:

```gometa
# An ordinary Julia file — with GoMeta metaLines in its comments:
#~ hide{ :label4 , isCode }   ## hide everything in scope that is code or carries :label4
x = 1                          # ...content...
```

In Julia, `#` is the comment marker, and GoMeta's metadata lives in such comments. A line that
opens with the marker `#~` — the comment marker followed by a tilde — is a
**[metaLine](../reference/syntax-and-semantics.md#metaLine)**: a BLS Line Component of flavor
Meta. The rest of the line carries the metadata — its
[statements](../reference/syntax-and-semantics.md#statement,-metaSegment) — and, after a `##`,
an ordinary comment if you want one. One or more contiguous metaLines form a
[metaBlock](../reference/syntax-and-semantics.md#metaBlock). Your file stays an ordinary file of
its format.

A statement names a value of an Alterant — here `hide`, a value of **Visib** — and, in the
braces, the [condition](../reference/syntax-and-semantics.md#condition) under which that value may
apply: to content that carries the [label](../reference/syntax-and-semantics.md#label) `:label4` or
is code. A label — `:label4` — is a tag the Labels Alterant applies to the Components in a
statement's reach.

How the metadata reaches the content, in the words of the creator's proposal: "Any line starting with #~ is considered to be a metaline i.e.: it will be processed as metadata. Contiguous metalines constitute a coherent block of metadata separating it from others. By positioning such a block just above a block of code or text [no vertical spacing in between] the former gets attached to the latter – similar to how docstrings get associated with Julia structures following them. For the purpose of inheritance, a hierarchy of blocks of metadata can be defined by appending additional ~s to the head of a metablock's first metaline or, alternatively, adding there a digit representing the desired depth within the metahierarchy." His "block of metadata"
is the metaBlock; a Block of content written directly below it is
[attached](../reference/syntax-and-semantics.md#attachment,-inheritance) to it and inherits its
statements; his "metahierarchy" is the
[meta hierarchy](../reference/syntax-and-semantics.md#depth,-the-meta-hierarchy) of depths — `#~`
is depth 1, `#~2` depth 2, and so on — in which a deeper metaBlock nests under the shallower one
open above it and inherits from it. A `#~` after a line's content — a
[metaSegment](../reference/syntax-and-semantics.md#statement,-metaSegment) — applies its
statements to that line. The rules of the notation are the
[Syntax & semantics](../reference/syntax-and-semantics.md) page's.

## 4. The GoMeta Engine evaluates: the Alterants and the evaluated values

The GoMeta Engine absorbs the metadata — parses and interprets it — and evaluates it over the
BLS Component tree: for each Component, which value of which Alterant applies.

An **Alterant** is, for Julia users, most similar to a Type: it defines which values its
instances can take — Visib's are `show`, `hide` and `discard`, and for any one piece of the
file only one of them applies at a time — and the GoMeta Engine evaluates which value applies
to each piece. It is not exactly analogous to a Type: an Alterant usually brings functionality
of its own, which may be invoked during the GoMeta Engine's process, for instance when a value
is set. The Alterants shipped with this release are Visib, Labels, Heading and Id; the examples
exercise the first two. Visib is the example on this site's pages because what the Engine
evaluates for it can be checked by eye in a rendered copy of the file; it is one Alterant among
others, and the delivered evaluations are designed for all kinds of future Alterants.

Delivering such evaluations is the GoMeta Engine's core purpose: if the Engine determines that one value of an Alterant applies to a Block and another value of the same Alterant applies to a Line contained in that Block, that is the kind of information it delivers.

A value applies to the Components in its statement's reach — its own metaBlock, the content attached to that
metaBlock and what nests or is attached below — where its condition holds and no statement of
the same Alterant closer to the Component overrules it. A value evaluated for a Block applies to
that Block; the Lines and Segments it contains fall under it as parts of that Block, not
individually, and a Line's own differing value is recorded as its own. At this release Alterant values are applied to Components at the grain of the Block and the Line — not yet at the File level — and a next step will make the grain finer by including the Segment; the creator's JuliaCon 2026 proposal already alluded to "the possibility of a finer grained grammar. For instance, a Segment of metadata within a Line is applied to the Segments preceding it. This also applies within Blocks which are not attached." Today a metaSegment applies to its Line. Where no
statement reaches a Block, a Line or a Segment, the Alterant's declared default applies — for Visib, `show`; the File has no value at this release.

The condition in the braces is Julia. GoMeta rewrites its own parts — a label test such as
`:label4`, a BLS key word such as `isCode`, which asks about the state of the piece — into
Julia, Julia's parser reads the result once, and Julia evaluates it when the Engine applies
the statement. Processing a file you did not write therefore runs its conditions as Julia
code: use GoMeta on input you trust, as you would any Julia file you `include`. A vocabulary
statement in such a file also edits your vocabulary file for good, each change of a completed run
reported by an info diagnostic ([Syntax & semantics](../reference/syntax-and-semantics.md#5.-Labels)).

## 5. The delivery

One call does the whole run and returns one object, the delivery, with four parts read by name,
in the order of the pipeline:

- `blsComponentTree` — the BLS Component tree the run was evaluated over, provided by BLS itself;
- `altValues_evals` — the evaluated Alterant values;
- `status` — OK, or an error;
- `diagnostics` — a run whose status is not OK delivers a non-empty list of diagnostics; a completed
  run may carry warning and info diagnostics too — a label a withhold kept from applying, a label not
  in the vocabulary, a change of the vocabulary file ([Public API](../reference/public-api.md#8.-What-a-program-sees-when-something-is-wrong)).

`altValues_evals` is the reference interface the GoMeta Engine delivers for all kinds of future Extensions; many of them will also need the BLS Component tree, which is not delivered through the GoMeta Engine but provided by BLS itself.

The evaluated values are read through the Engine's reader,
[`readAltValuesEvals`](../reference/public-api.md#3.-The-evaluated-values), as rows, one per
evaluated value, each at its Component — a tuple of the
[Component's handle](../reference/public-api.md#3.-The-evaluated-values), the attribute, the
value and the polarity. The Engine records a value where necessary: a child Component's value
must be recorded explicitly where it differs from its parent's — else an Extension infers that the
child evaluated to its parent's value. The Engine's answer function,
[`evaluatedAltValue`](../reference/public-api.md#4.-The-answers), answers for one Component and
one Alterant which value applies and where it came from. The BLS Component tree is BLS's own
object: a program travels it with BLS's own public functions —
its [door](../reference/public-api.md#5.-The-BLS-Component-tree-and-its-door) — never through a
function of the GoMeta Engine. It is the GoMeta Engine's responsibility to deliver its
evaluations as efficiently as possible, so that the Extension consuming them can process them
efficiently.

## 6. The Extensions act

GoMeta evaluates the metadata — more precisely, the GoMeta Engine evaluates it — but does not
act on those evaluations: that is the Extensions' role; they receive the evaluations through
GoMeta's interface, `altValues_evals`. Only then, and based on those evaluations, do the Extensions act. Extensions are so called because they extend the core of GoMeta.

An Extension must go through GoMeta's public surface, never through anything internal. Its main
source of information is `altValues_evals` and the BLS Component tree, with the functions
provided to travel and access them. What it does with the evaluations is up to the Extension:
a render Extension may hide what Visib evaluated `hide` by commenting it out — the way of
commenting out depending on the output's format — while another may highlight the parts that
would be discarded instead of discarding them; an Extension may use the evaluated values of
several Alterants and ignore those of another entirely. Several Extensions may consume one and
the same run.

For a first look the package ships a development tool, the **basic renderer**. It
behaves like an Extension: it reads the delivery through the same public surface every Extension
uses and writes a rendered copy of the file in which each piece appears as its evaluated Visib
value says. Strictly speaking, though, it is no Extension: it lives under the package's
development tools, and it is there because it serves a vital purpose for the package's development — it lets what the Engine evaluated be checked by eye.

The run described on this page assumes that the Extensions do not change the input file. Later, Extensions that do are planned — one example being reactive Extensions which, while one works on a file in an editor, hide its metadata so that it does not clutter the visible surface, and show it again when one wants to work on that metadata. What an Extension is and may do, and what a new
Alterant needs, is the [Extensions](extensions.md) page's.

## 7. Looking at a run: the development tools

In the words of GoMeta's creator: "the output of GoMeta is not readily directly observable. For that reason, a couple of tools and colorful printouts can serve to track and illustrate the internal process of the package". The development tools print the BLS Component tree, the
evaluated values of a run, and the run's status and diagnostics; they read the delivery through the public surface and are not part
of a GoMeta run. The full delivery view of the first example file — every Block and Line with
its evaluated values, as the development tools print it — is below; its last line is the run's line
— its status and its diagnostics, here `── the run: status PROCESS_OK · no diagnostics`. In the development tool's printouts a "cell" is a BLS
Component that carries evaluated values — the tool's word; this site says Component. Its "(no evals — defaults apply)" marks a Component with no evaluated values of its own; it falls under the value of a Component that contains it, else under the Alterant's declared default. The
[Development tools](../reference/development-tools.md) page explains the tools and their views.

::: details The full delivery view of the first example file — every Block and Line with its evaluated values, as the development tools print it

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

From here: [What is GoMeta?](what-is-gometa.md) — the idea; [Why use GoMeta?](why-use-gometa.md)
— what it is for; [Getting started](../tutorials/getting-started.md) — the install and one
complete run.
