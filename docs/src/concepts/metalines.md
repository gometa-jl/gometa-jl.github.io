# metaLines

A metaLine is an ordinary Julia comment with one extra character: it starts with `#~`
instead of `#`. That single sigil turns the line into metadata your tools can read — a
label, a condition, a visibility action — while Julia sees nothing but a comment.

`#~` is the `:julia` flavor's marker. GoMeta 0.3.0 ships three content flavors — `:julia`
the default, `:c` for the `//` line-comment family, `:latex` for `%` — selected explicitly
via `GoMetaConfig(flavor_tag = …)`, never inferred.

## Anatomy

A metaLine has up to three parts — an optional depth marker, the labels and actions, and an
optional human comment:

```gometa
#~[<depth>]  <labels and actions>   ## <human comment, ignored by the meta-parser>
```

- The leading `#~` (plus optional depth marker), **followed by whitespace or end of line**,
  identifies the line as meta. An undelimited shape like `#~someWord` is plain content, not
  meta — every GoMeta marker token requires whitespace or a line boundary on both sides of
  its head (the *token-delimiter law*).
- The middle carries **labels** (`:label1`, `:label2`, …) and **actions**
  (`show{…}` / `hide{…}` / `discard{…}`), processed left to right.
- Anything after a `## ` on the same line is a **human comment** — the meta-parser ignores it.
- If the depth marker is omitted, depth defaults to 1.

A real metaBlock from the committed corpus
(`examples/InFileFolder/file_for_Example_Extended.jl`):

```gometa
#~ discard{ :label2 , isCode} ## This is a comment within a meta `Block`.
#~ :label1{ isText && containsMeta }
## The following meta `Line` within this `Block` will be ignored due to the `!`.
#~! discard{ isMeta } ## This `Line` of meta ends this `Block` of meta.
```

**Contiguous metaLines form one metaBlock** — the unit that carries metadata scope. A `## `
comment line *between* metaLines does not break the block (line 3 above). A metaBlock ends
at a blank line, a content line, a `#]` close-marker, or a `#~!` — a blank line after a
metaLine always starts a new block; only Code and Text blocks may contain interior blank
lines.

## Labels

Labels are accumulative tags a metaLine applies to the content in its scope — the handles
that conditions and actions later select on.

- Two equivalent spellings: repeated one-word labels (`#~ :label1 :label2`) and the
  parenthesized list (`#~ :(label1, label2)`).
- The label vocabulary is a **closed whitelist**: `:label1` … `:label5` plus, since 0.3.0,
  a fixed **pictograph vocabulary** — byte-exact names like `:💡`, `:📝`, `:🔥`. A name
  from outside the whitelist refuses with a stable message naming the accepted set —
  whether you *apply* it or *query* it in a condition (where the condition is actually
  evaluated).
- A **conditional label** applies only where its condition holds:
  `:label1{ isText && containsMeta }` reaches only text that contains meta.

Two different uses of `{ … }` are worth keeping apart: a *label*-condition decides **where
to apply the label**; an *action*-condition decides **when to fire the action**.

## Conditions

The `{ … }` braces carry a condition deciding what an action applies to. Conditions combine
**labels** and **State-refs** — the built-in predicates `isCode`, `isText`, `isMeta`, and
`containsMeta` — with `,` (OR), `&&` (AND), `!` (NOT), and `()` grouping. All four, their
meta parts straight from the corpus:

```gometa
#~ discard{ :label2 , isCode}                    ## OR — discard what carries :label2 or is code
#~ :label1{ isText && containsMeta }             ## AND — a conditional label
#~2 :label3 :label5 show{ !:label5}              ## NOT — show only if :label5 is absent
#~ :label1{ (isText && containsMeta), isMeta }   ## () — grouping, an OR of two groups
```

Precedence of un-parenthesized mixed operators is engine-defined and not exercised by the
corpus — make intent unambiguous with explicit `()`.

Conditions are **evaluated, never executed** — they run in GoMeta's own closed interpreter,
never through Julia's `eval` in a default-configured run.

## The Visib actions

**Visib** — visibility — is the alterant that decides each component's fate in a render.
Its three actions are mutually exclusive, and the default is `show`:

- `show` → the line is kept **verbatim**;
- `hide` → the line is kept but **commented out**: every non-empty line gains a `## ` head
  (a line already starting with `## ` renders as-is; an empty line stays empty);
- `discard` → the line is **omitted entirely**.

The braces after an action carry a condition, not an argument — Visib actions take no
arguments, and a bare `hide` fires unconditionally. metaLines are themselves subject to
Visib: a hidden metaBlock renders as `## #~ …`. And because hide is a *visibility*
operation, hidden metadata is still alive in the rendered file — choose `discard` when
metadata must not survive a share.

## Depth and attachment

Every metaBlock sits at a **depth** (1, 2, 3, …), analogous to heading levels. The tilde
count sets it (`#~~~` opens depth 3), and a digit sets it too (`#~2` opens depth 2); with
neither, a metaBlock sits at depth 1. The authorable window at v0 is depths 1–8 — `#~9`
meets a stable refusal, not a crash (a multi-digit marker reads its first digit only:
`#~10` behaves as depth 1).

Depth governs **scope** between metaBlocks: a following metaBlock at depth *P* **nests
inside** an open metaBlock at depth *N* — and inherits it — when *P* > *N*; it
**closes/supersedes** it when *P* ≤ *N*. The close-marker `#]` closes the innermost open
metaBlock explicitly.

**Attachment** governs what content inherits: a content block is attached to the meta above
it exactly when there is **no blank line between them** — an attached block inherits the
open metaBlocks' alterants, and a blank line detaches it (it inherits nothing). `#]`
additionally detaches the single line immediately after it. Depth plus attachment govern a
metaBlock's scope — and the two axes are independent.

## Inheritance — a worked example

The toy example below is condensed from the corpus file
`examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl` — every metaLine's meta part
byte-true, narration comments trimmed or shortened. Its committed rendered counterpart
lives in `examples/OutFileFolder/`.

```gometa
#~ hide{ :label4 , isCode } ## This is a comment within a `Block` of meta.
#~ :label1{ (isText && containsMeta), isMeta } ## This meta `Block` ends here.

# This `Line` of text starts a new `Block` of text.
# This `Block` is NOT attached to metadata - it does NOT INHERIT metadata.
# However, this `Line` will get discarded due to: #~ discard

#~2 :label5 show{ !:label5} ## A one-line meta `Block`.
using Plots ## This `Line` starts a new `Block` of code.

println("!!! NOTE !!! Only Code and Text `Block`s may contain empty lines.")
println("\t Whereas an empty line after a meta `Line` starts a new `Block`.")

#~3 :label4 discard{:label3} :label3
# This `Block` of text receives label4
#       plus label5 from further above
#       plus label1 since it `isText` AND `containsMeta` [last statement].
# This `Line`, however, will NOT get hidden. #~ show

#~2 :label5
md"""
This is a `Block` of markdown text. #~ hide
"""
```

What the render does, and why:

- **The depth-1 metaBlock** (two contiguous metaLines) issues a conditional action —
  `hide{ :label4 , isCode }` — and a conditional label — `:label1{ … }`. Both now stand
  over everything that nests or attaches below.
- **The first text block is detached** — the blank line above it severs inheritance — so
  it renders verbatim… except its last line, whose trailing inline `#~ discard` removes
  exactly that line from the render.
- **The `#~2` metaBlock nests inside depth 1** (2 > 1) and inherits it. The attached code
  block — `using Plots` down through both `println` lines; Code blocks may contain
  interior blank lines — receives `:label5`. `show{ !:label5}` never fires (it needs
  `:label5` *absent*), and the inherited depth-1 `hide{ :label4 , isCode }` fires because
  the block is code: the whole block renders commented out.
- **Order matters, left to right.** On `#~3 :label4 discard{:label3} :label3`, the
  `discard{:label3}` is issued *before* `:label3` is applied, so it does not fire on the
  attached text block. The block does receive `:label4` — and the standing depth-1
  `hide{ :label4 , isCode }` catches it. Its last line ends in inline `#~ show`, which
  overrides the inherited hide: that one line stays visible.
- **metaLines are subject to Visib too** — the `#~3` metaBlock itself renders hidden, as
  `## #~3 …`.
- **The markdown line carrying inline `#~ hide`** renders commented out inside the string.
  GoMeta reads a file as lines — it never lexes the host language's string syntax.

## Three syntax forms

- the **standard metaLine** on its own line — `#~`, `#~N`, `#~~~`;
- the **close-marker** `#]`, closing the innermost open metaBlock (and detaching the
  single line right after it);
- the **inline `#~`** at the end of a content line, applying meta to *that line*:
  `#~ hide` / `#~ discard` hide or discard the line, `#~ show` overrides an inherited
  hide, and a bare trailing `#~` re-applies the meta context to the line.

Plus one modifier: the **inert `#~!`**, which makes a standard metaLine's content *not* be
processed — it also ends the metaBlock.

::: warning Writing about GoMeta in comments

Inside a single-hash `# ` content line, a whitespace-preceded `#~` token — any form — and
`#]` are parsed as **live inline syntax**, not prose; and a double-hash `## ` comment is
*not* automatically safe either: a whitespace-preceded `#~` inside one still fires the
inline scanner. To mention GoMeta tokens in commentary, **quote-glue** them: write `"#~ hide"`
with the quote hugging the marker. A front-glued marker is never a token — the
token-delimiter law again — so the glued mention is inert. The one discipline: no space
between the opening quote and the marker (`" #~ hide"` fires the inline scanner and
refuses loudly).

:::

## The full reference

This page is a taste. The authoritative, corpus-verified reference — every rule cited to a
runnable example and its committed byte-exact render — is
[`docs/SYNTAX-AND-SEMANTICS.md`](https://github.com/gometa-jl/GoMeta.jl) in the repository,
alongside the runnable `examples/` corpus.
