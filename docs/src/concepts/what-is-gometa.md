# What is GoMeta?

GoMeta is an *interpretable-metadata* engine for source files. A file carries its ordinary
content plus `#~` **metaLines** — comment lines with machine-interpretable metadata (labels,
visibility actions, conditions) sitting right beside the content they describe.

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

## What it is for

Everything in GoMeta serves four concrete uses of your accumulated files:

1. **Find it again** — name and tag a file where it lives, and retrieve it by meaning later.
2. **Link and swap** — files reference each other by meaning, not by path.
3. **One source, many outputs** — render the same file into different views without forking it.
4. **Share on your terms** — strip what is private and publish the rest, by applying one
   simple function to GoMeta's output.

## The pieces

- **BLS** parses a file into a tree of components: **File → Block → Line → Segment**.
  Every component is typed **Meta**, **Text**, or **Code** — a line is Meta if it starts
  with `#~`, Code if it is executable source, Text otherwise.
- A **metaBlock** — one or more contiguous metaLines — is the unit that carries metadata
  scope for the content attached below it.
- An **alterant** is a directive GoMeta applies to a component. The **Visib** (visibility)
  alterant decides each component's fate when rendered: **show**, **hide**, or **discard**.
- **State-refs** are built-in predicates (`isCode`, `isText`, `isMeta`, `containsMeta`)
  used inside `{ … }` conditions to decide whether an alterant applies.

Continue with [metaLines](metalines.md) for the syntax, or jump straight to
[Getting started](../tutorials/getting-started.md).

## Status

GoMeta.jl `0.2.0` is **alpha**: a working, tested engine for the **v0 subset** of the GoMeta
language. The committed example corpus renders **byte-identically** under the shipped
755-test suite, and extreme or malformed input receives a stable, documented refusal rather
than a crash. The language grows by design; the v0 subset forecloses none of it.

GoMeta is **source-available under a restrictive custom license** — private, personal, or
educational use only; commercial, institutional, and funded-research use require a separate
license. See the [repository](https://github.com/gometa-jl/GoMeta.jl) for the LICENSE file
and details.
