# What is GoMeta?

GoMeta.jl is an *interpretable-metadata* engine, written in Julia, designed to work between,
behind and within your data: in any programming language and any file format. As GoMeta's creator states it, the idea is to embed formalized metadata within all kinds of comments and to enable [Extensions](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) to act on GoMeta's output. His proposal for
JuliaCon 2026 puts it this way: "The core concept remains the same: Add interpretable meaning to
comments within a Julia file by means of brief, simple, expressive and extendable metadata. The
crux of the idea lies in its potential to serve a wider variety of different packages and even
facilitating interactions between them." — "However, in order to truly fulfill what had been
promised, in particular to allow for the desired expressiveness and extensibility, language-like
features had to be incorporated in the proposed schema." A file carries
its ordinary content plus `#~`
**[metaLines](../reference/syntax-and-semantics.md#metaLine)** — comment lines with
machine-interpretable metadata (e.g. labels, visibility actions, conditions, etc.) sitting right
beside the content they describe. GoMeta evaluates the metadata — more precisely, the
[GoMeta Engine](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) evaluates it
— but does not act on those evaluations: that is the
Extensions' role; they
receive the evaluations through GoMeta's interface, `altValues_evals`.

GoMeta's creator explains GoMeta by asking and answering three questions. This page answers the
first — what GoMeta is. [Why use GoMeta?](why-use-gometa.md) answers the second, and
[How does GoMeta work?](how-does-gometa-work.md) the third.

## The idea

1. **Embed** formalized meaning — metadata — into comments: brief, simple, expressive and
   extendable metadata, riding where every language already has room for a comment.
2. **Absorb and evaluate.** GoMeta absorbs that metadata — parses and interprets it — and
   evaluates which value of which
   [Alterant](../reference/syntax-and-semantics.md#Alterant) applies to each piece of the file.
   Two main products come out of one run: the BLS Component tree — the file as
   [BLS](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File),
   GoMeta's parser, recorded it — and the evaluated Alterant values, `altValues_evals`.
3. **Pass the evaluations on to the Extensions, which act on them.** An Extension — a
   renderer, an Extension that produces a notebook or documentation, a program of your own —
   reads the two products through GoMeta's public surface and executes the task it was designed
   for. Extensions are so called because they extend the core of GoMeta. The package ships a basic renderer as a development tool for looking at a run —
   strictly speaking no Extension, though it behaves like one: it lives under the package's development tools, and it is there because it serves a vital purpose for the package's development.

## A language and a framework

In the words of GoMeta's creator: "On the one hand, GoMeta is a domain specific language for metadata and on the other a framework with facilities on which Extensions can build." The
language is the notation of the metaLines (e.g. statements, labels, conditions, the meta hierarchy, etc.)
written in the comments of an ordinary file; the
[Syntax & semantics](../reference/syntax-and-semantics.md) page is its reference. The framework
is the one run that reads a file and delivers the two main products, and the public surface
through which the Extensions read them; [How does GoMeta work?](how-does-gometa-work.md) follows
that run, and the [Public API](../reference/public-api.md) page names what a program calls.

## In what files

GoMeta's metadata lives in comments, so the file stays an ordinary file of its format and the
host language never sees the metadata. At this release GoMeta reads three
[comment markers](../reference/syntax-and-semantics.md#comment-marker): Julia's `#`, the C family's `//` (e.g. C, Rust, etc.), and LaTeX's `%` — the marker is named when GoMeta is called (Julia is the
default), never inferred from the file. GoMeta is meant for all kinds of comments: the creator's JuliaCon 2026 talk lists Julia and Python, C and Rust, and LaTeX as implemented, Word documents (the `.fodt` format to start with), and, not yet, spreadsheets and metadata attached to images, video and the like. That reach is the reason for the name — GoMeta works in between them, behind them, within them — stated in the creator's words on the [front page](../index.md).

## Status

GoMeta was presented and released at JuliaCon 2026; in the creator's words, the package "finally implements a vastly matured offspring of a [my] half-baked idea proposed at JuliaCon2025."
GoMeta.jl `0.4.4` is **alpha**: a working, tested engine for the **v0 subset** of the GoMeta
language. The seven committed example pairs render byte for byte under the shipped test suite,
and input the grammar does not accept meets a stable refusal: GoMeta stops with a message that says what it could not accept, and nothing is delivered; a label GoMeta cannot apply — withheld, or not in the vocabulary — does not stop the run: it is reported by a warning diagnostic and the run completes. The surface may still move — by the creator's policy, until at least version 0.7 every change of the public surface is a clean cut (no leftover of an older version in a newer one), and the package's API document (`docs/public-api.md` in the repository) keeps the register of every such change. The language grows by design;
the v0 subset forecloses none of it.

GoMeta is **Fair Source** — licensed under the Functional Source License, Version 1.1, MIT
Future License (**FSL-1.1-MIT**; source-available, not OSI-approved open source): free for
everyone's own use — at work, at university, in the public sector — including internal use and
access, non-commercial education and research, and professional services provided to other
licensees. Not licensed: offering GoMeta to others in a commercial product or service that
competes with it or with the Licensor's own GoMeta-based offerings that exist when the version is made available (for that, contact
hello@gometa.dev). Each release automatically becomes **MIT-licensed** on its second
anniversary. See the [repository](https://github.com/gometa-jl/GoMeta.jl) for the LICENSE file
and details.

From here: [Why use GoMeta?](why-use-gometa.md) — what it is for;
[How does GoMeta work?](how-does-gometa-work.md) — one run, from a file to what the Extensions
receive; [Getting started](../tutorials/getting-started.md) — the install and one complete run.
