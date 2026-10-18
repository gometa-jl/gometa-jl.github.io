```@raw html
---
u_version: "0.1"
---
```

# Why use GoMeta?

GoMeta's author explains GoMeta by asking and answering three questions. This page answers the
second. In his words: "Why would someone want to use GoMeta? Answers include the 4 Use Cases,
that GoMeta can be used within all kinds of comments across various languages and/or file
types etc." — and: "This is not just for programmers any more." The four use cases come first,
in the author's own words from his proposal; then why the metadata lives in comments; then the
reach beyond programmers — and to AI agents.

## 1. Four use cases

In the words of GoMeta's author — his proposal, once it has said that GoMeta absorbs the
metadata and that the result can then be passed to a separate program: "At this point the
question may arise: What would such a program or plug-in possibly use this for? What can
actually be gained from embedding formalized metadata within comments?" — "To address this
question, before continuing with the technicalities of GoMeta, lets consider four, seemingly
unrelated use cases which together ought to resonate with the vast majority of JuliaCon's
attendees:"

**Find it again.** "Over time a large number of Julia files can accumulate. Wouldn't it be
wonderful to speedily retrieve any desired, long forgotten poignant example, powerful code
snippet, insightful explanatory statement or laboriously tweaked plot related to some task at
hand? Adding meaning to content can change the game. On top of that, an instrument solving this
problem might prove even more invaluable when collaborating in a group sharing a repository of
documents and it is also not restricted to Julia files only."

**Link and swap.** "One might want to [inter]link a certain fragment of one file with another
fragment, possibly contained in some other file. E.g.: linking an intricate piece of code to an
enlightening explanation or a clarifying toy example. Occasionally it could also be handy to
swap entire sections of text / code of one file with alternate versions, depending on the
circumstances."

**One source, many outputs.** "Would you like to harness the power of Documenter, enjoying
simplified control while sticking to pure Julia files rather than having to deal with
additional markdown documents? More generally, a Julia file can serve as a source for all
kinds of outputs."

**Share on your terms.** "Being able to control how individual blocks of code / text are
being executed, respectively rendered, can be beneficial. E.g.: certain passages of a file
might be intended for personal usage only. Marking them as such would allow automated removal
before sharing. GoMeta's own source code, available on GitHub, has been processed this way.
Another example is the ability to restrict execution to code blocks pertaining to a particular
group only."

The use cases illustrate what GoMeta can be used for — but, in the author's words, "they are
NOT GoMeta": "the CORE of GoMeta is not meant to materialize these use cases but rather enable
Extensions (of which there will Core Extensions which ship by default with GoMeta and
additional Extension which can be added via modules etc) to do so." GoMeta evaluates the
metadata; an [Extension](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) acts
on the evaluations — a renderer, a program that writes a notebook or documentation, a program of
your own. What ships with this release for each of the four: a demo program under the package's
`extensions/` directory answers, for the package's committed examples and their five generic labels, which pieces of which files carry a given
[label](../reference/syntax-and-semantics.md#label); the author's web of atomic data units — the
second use case grown large — "requires not only an Extension but also a database as back end",
and that Extension does not ship yet; one marked source file in the package derives one notebook
and its executed twin, and two pages of the package's own manual; and the basic renderer, a
development tool, writes a copy of a file with its hidden parts commented out and its discarded
parts left out. Strictly speaking the basic renderer is no Extension, though it behaves like one: it lives under the package's development tools, and it is there because it serves a vital purpose for the package's development. The
[Examples](../examples/index.md) page shows the committed files; the
[Extensions](extensions.md) page says what an Extension is and receives.

## 2. Why in comments?

The author's answers, from his talk's slides and his proposal:

- **One source file, all kinds of output formats** — "and exert precise control over all
  format's wide ranging capabilities from within that Julia source file"; his list of output
  formats: "HTML - pdf - Jupyter notebook - Documenter markdown - Standard markdown - Clean Julia
  script - . . ." In his words: "Similar to Literate & Co., segments of code and text can live
  happily together, weaved into the same files. These serve as source files which can
  subsequently be converted into a variety of formats such as notebooks, standard markdown or
  even documenter markdown files. A suitable system for metadata allows exerting precise control
  over these format's wide ranging capabilities from within the Julia source file and provides
  the means to generalize Literate's core idea and more."
- **The same metadata everywhere** — "Julia - Python - C - Word / LaTeX - etc. etc." — "Language
  agnostic since metadata remains "hidden" within the comments." The host file stays an ordinary
  file of its format: the host language sees nothing but a comment, and the
  [metaLines](../reference/syntax-and-semantics.md#metaLine) travel with the content they
  describe.
- **Webs instead of hierarchies** — "Put things into context by weaving ... ... webs of atomic
  data units ... . . . analogous to our brain. ! Web ! Much more capable of representing reality
  than hierarchies are." A folder tree or a chapter outline places each item at one position;
  labels weave a web, and one piece of content carries as many labels as apply.
- **A wider tool** — "Code · Reports · Teaching material Note keeping · Group projects · etc.
  etc." — "Extends well beyond a programming tool". In the author's words: "The concept extends
  well beyond Julia and can be applied not only to other programming languages but to all sorts
  of text documents such as lectures notes or any number of scripts concerning a project,
  research or otherwise."

## 3. Not just for programmers — and for AI agents too

At this release GoMeta reads three [comment markers](../reference/syntax-and-semantics.md#comment-marker)
— Julia's `#`, the C family's `//` (e.g. C, Rust, etc.), LaTeX's `%` — and the author intends it for all kinds of
comments, documents and files; [What is GoMeta?](what-is-gometa.md) lists the carriers his talk
names and their state. In his words: "This is not just for programmers any more."

The author's aims, and a forecast of his talk, reach further. On the webs: "One of the MAIN AIMS of GoMeta is to enable
to interlink documents / files and more generally interlink content CONTAINED IN DIFFERENT
DOCUMENTS / FILES with each other e.g.: a paragraph contained in one document can refer to a
sub-section within another document etc." — "The AIM is to be able to CREATE WEBS OF ATOMIC DATA
UNITS." — "This would not only useful for humans but also for AI agents." And from his talk, on
the labeling itself: "In the near future, AI will automate much of the labeling in the
background. Crucially, if this black box is confined within a formalized framework of metadata,
intermediary steps can be systematically recorded, making the process not only better traceable
but allowing for subsequent adjustments, if necessary – potentially enabling the agent to improve
over time."

From here: [How does GoMeta work?](how-does-gometa-work.md) — one run, from a file to what the
Extensions receive; [Getting started](../tutorials/getting-started.md) — the install and one
complete run; [Examples](../examples/index.md) — the committed files.
