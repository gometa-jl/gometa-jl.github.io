# metaLines

A metaLine is an ordinary comment with one extra character: it starts with `#~` instead of
`#`. That single sigil turns the line into metadata your tools can read — a label, a
condition, a visibility action — while your language sees nothing but a comment.

## Anatomy

A metaLine has up to three parts — an optional depth marker, the labels and actions, and an
optional human comment:

```
#~[<depth>]  <labels and actions>   ## <human comment, ignored by the meta-parser>
```

- The leading `#~` (plus optional depth marker) identifies the line as meta.
- The middle carries **labels** (`:label1`, `:label2`, …) and **actions**
  (`show{…}` / `hide{…}` / `discard{…}`), processed left to right.
- Anything after a `## ` on the same line is a **human comment** — ignored by the parser.

A real example from the committed corpus:

```julia
#~ hide{ :label4 , isCode } ## This is a comment within a `Block` of meta.
x = collect(1:10)
#~2 :label5 show{ !:label5} ## It is a one-line meta `Block`.
result = sum(x)
#~ :label1{ (isText && containsMeta), isMeta } ## This meta `Block` ends here.
```

## Conditions

The `{ … }` braces carry a condition deciding what an action applies to. Conditions combine
**labels** and **State-refs** — the built-in predicates `isCode`, `isText`, `isMeta`, and
`containsMeta` — with `,` (OR), `&&`, `!`, and `()` grouping:

```julia
#~ hide{ isCode }                      ## hide everything in scope that is code
#~ show{ :label5 && !isMeta }          ## show what carries :label5 and is not meta
#~ discard{ (isText && containsMeta), isMeta }   ## OR of two groups
```

Conditions are **evaluated, never executed** — they run in GoMeta's closed interpreter.

## Depth and attachment

Every metaBlock sits at a **depth** (1, 2, 3, …), analogous to heading levels. Depth is set
by the number of tildes, and an explicit digit overrides the count — `#~2` opens depth 2.

A content block is **attached** to the meta above it exactly when there is **no blank line
between them** — an attached block inherits the open metaBlocks' alterants, and a blank line
detaches it. Depth plus attachment govern a metaBlock's **scope**.

## Three syntax forms

- the **standard metaLine** on its own line — `#~`, `#~N`;
- the **close-marker** `#]`, ending a metadata region;
- the **inline `#~`** at the end of a content line.

Plus one modifier: the **inert `#~!`**, which makes a standard metaLine's content *not* be
processed.

::: warning Writing about GoMeta in comments

Inside a single-hash `# ` content line, any `#~` token and `#]` are parsed as **live inline
syntax**, not prose. To mention GoMeta tokens in commentary, use double-hash `## ` comments —
those are never parsed as meta.

:::

## The full reference

This page is a taste. The authoritative, corpus-verified reference — every rule cited to a
runnable example and its committed byte-exact render — is
[`docs/SYNTAX-AND-SEMANTICS.md`](https://github.com/gometa-jl/GoMeta.jl) in the repository,
alongside the runnable `examples/` corpus.
