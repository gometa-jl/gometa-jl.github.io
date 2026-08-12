# What is GoMeta?

GoMeta.jl is an *interpretable-metadata* engine for source files, written in Julia. A file
carries its ordinary content plus `#~` **metaLines** — comment lines with machine-interpretable
metadata (labels, visibility actions, conditions) sitting right beside the content they describe.

GoMeta **absorbs** the metaLines, **evaluates** which *alterants* apply to each piece of
content, and a renderer **applies** the result:

```
parse (BLS) → absorb (read metaLines) → evaluate (which alterants apply) → render (apply Visib)
```

::: tip GoMeta evaluates — it never executes

Conditions run in GoMeta's own closed interpreter, never through Julia's `eval`. A metaLine
can describe, label, and select; it cannot run anything. (One deliberate, explicitly opt-in
extension mode exists — see the SECURITY notes in the repository.)

:::

## Why metadata — and why in comments?

- **One source file, many output formats.** A file never has to be forked per audience: in
  this release, one marked Julia source file derives four notebook editions (full · student ·
  report · slides) plus one executed twin, a pair of Documenter manual pages generated as
  views of the same source — and, as for every file GoMeta processes, the share-view render
  of the file itself.
- **Webs instead of hierarchies.** A folder tree or a chapter outline forces each item into a
  single position — a stringent limitation. Labels weave webs of meaning instead: the same
  piece of content carries as many labels as apply, and one query brings it back (the shipped
  `find_by_label.jl` demo answers "which cells carry `:label5`?" over the committed corpus).
- **Language-agnostic, because comments.** The metadata hides inside ordinary comments, so
  the host language never sees it — and the same idea travels beyond Julia: `0.3.0` ships
  three content flavors, `:julia` (the `#` comment lead, the default), `:c` (the `//`
  line-comment family), and `:latex` (`%`) — selected explicitly, never inferred.

## The idea

1. **Embed** formalized meaning [metadata] into comments — brief, simple, expressive,
   extendable metadata riding where every language already has room.
2. **Absorb & evaluate** — GoMeta absorbs that metadata (parses and interprets it) and
   evaluates which alterants apply to each piece of content, producing the evaluated values:
   the **evals** (evaluated metadata — unrelated to Julia's `eval`).
3. **Pass the evaluations on** — the evals are the deliverable. **Extensions** — scripts,
   downstream tools, consumer packages — read them and act; GoMeta's own renderer, which
   applies **Visib** to produce the share-view, is simply the act built in.

## What it is for

Everything in GoMeta serves four concrete uses of your accumulated files:

1. **Find it again** — name and tag a file where it lives, and retrieve it by meaning later.
2. **Link and swap** — files reference each other by meaning, not by path.
3. **One source, many outputs** — render the same file into different views without forking it.
4. **Share on your terms** — strip what is private and publish the rest, by applying one
   simple function to GoMeta's output.

## The pieces

- Before GoMeta can absorb and evaluate anything, **BLS** parses the file into a tree of
  **Components**: **File → Block → Line → Segment**. Every Component carries one of three
  flavors — **Meta**, **Text**, or **Code**: a line is Meta if it starts with a delimited
  `#~` head (`#~` followed by whitespace, a depth marker, or end of line), Code if it is
  executable source, Text otherwise.
- **Every flavor can carry comments.** A `## ` opens a human comment whether the line is
  meta, text, or code — the comment rides its own Segment, and on a metaLine the meta-parser
  ignores it.
- A **metaBlock** — one or more contiguous metaLines — is the unit that carries metadata
  scope for the content attached below it.
- An **alterant** is a directive GoMeta applies to a Component. The **Visib** (visibility)
  alterant decides each Component's fate when rendered: **show**, **hide**, or **discard**.
- **State-refs** are built-in predicates (`isCode`, `isText`, `isMeta`, `containsMeta`)
  used inside `{ … }` conditions to decide whether an alterant applies.

Continue with [metaLines](metalines.md) for the syntax, or jump straight to
[Getting started](../tutorials/getting-started.md).

## Status

GoMeta.jl `0.3.0` is **alpha**: a working, tested engine for the **v0 subset** of the GoMeta
language. The committed example corpus — seven input/output pairs — renders **byte-identically**
under the shipped 1140-test suite, and malformed or extreme input on the witnessed metaLine
action surface receives a stable, documented refusal (the few remaining edges — including one
documented crash edge — are catalogued honestly in the repository's API reference). The
language grows by design; the v0 subset forecloses none of it.

GoMeta is **Fair Source** — licensed under the Functional Source License, Version 1.1,
MIT Future License (**FSL-1.1-MIT**): source-available, and free for everyone's own use — at
work, at university, in the public sector — including internal use and access, non-commercial
education and research, and professional services provided to other licensees. Not licensed:
offering GoMeta to others in a commercial product
or service that competes with it or with the Licensor's own GoMeta-based offerings (for
that, contact hello@gometa.dev). Each release
automatically becomes **MIT-licensed** on its second anniversary. See the
[repository](https://github.com/gometa-jl/GoMeta.jl) for the LICENSE file and details.
