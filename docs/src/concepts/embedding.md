# Embedding in all kinds of formats

This page explains where GoMeta's metadata can be embedded — in the comments of all kinds of codes and formats, the reach GoMeta is meant for — and how: the form it takes in the formats this release reads.

GoMeta's metadata lives in comments, so the file stays an ordinary file of its format and the
host language never sees the metadata. Every format has its [comment marker](../reference/syntax-and-semantics.md#comment-marker) — `#` in Julia, `//` in the C family (e.g. C, Rust, etc.), `%` in LaTeX — and the [GoMeta marker](../reference/syntax-and-semantics.md#GoMeta-marker) is that marker followed by the tilde: `#~`, `//~`, `%~`. GoMeta's comment and its close are built the same way, so a file in any of these formats carries the same forms line for line:

| | Julia | the C family | LaTeX |
|---|---|---|---|
| the comment marker | `#` | `//` | `%` |
| the GoMeta marker — a [metaLine](../reference/syntax-and-semantics.md#metaLine) | `#~` | `//~` | `%~` |
| GoMeta's comment | `##` | `//#` | `%%` |
| the close | `#]` | `//]` | `%]` |

A metaLine's content — e.g. labels, visibility actions, conditions, etc. — is written the same way in every format; only the marker in front of it changes. At this release GoMeta reads these three comment markers; the marker is named when GoMeta is called (Julia is the default), never inferred from the file, and the committed examples are Julia files. GoMeta is meant for all kinds of comments: the [JuliaCon 2026 talk](https://gometa.dev/talk/) lists Julia and Python, C and Rust, and LaTeX as implemented, Word documents (the `.fodt` format to start with), and, not yet, spreadsheets and metadata attached to images, video and the like. That reach is the reason for the name — GoMeta works in between them, behind them, within them — stated on the [front page](../index.md).

The metadata lives next to the host's content, woven into the source, and the host is not aware of it. That is what makes GoMeta language- and format-agnostic: the metadata remains "hidden" within the comments, as the talk puts it, so the same metadata can be used everywhere, whatever the host. Files that are not text (e.g. photos, music, video, etc.) may carry metadata fields of their own: some image formats, for instance, accept small chunks of text. GoMeta is designed to be attached to such files later, through those fields — the talk's "attached to files themselves".

From here: [What is GoMeta?](what-is-gometa.md) — the idea whole; [Syntax & semantics](../reference/syntax-and-semantics.md) — the notation's reference; [Step by step](../examples/step-by-step.md) — the ladder of examples, Julia files at this release.
