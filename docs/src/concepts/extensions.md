```@raw html
---
u_version: "0.1"
---
```

# Extensions

GoMeta evaluates the metadata — more precisely, the
[GoMeta Engine](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) evaluates it
— but does not act on those evaluations: that is the
[Extensions](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension)' role; they
receive the evaluations through GoMeta's interface, `altValues_evals`. In the words of GoMeta's
author: "GoMeta evaluates and ONLY THEN AND BASED ON THAT the Extensions ACT ON THAT." This page
says what an Extension is, what it receives and through what, what it may do, what ships at this
release, how a new Alterant is added, and what the author wants later. The names a program calls are the
[Public API](../reference/public-api.md) page's; the run an Extension consumes is followed on
[How does GoMeta work?](how-does-gometa-work.md).

## 1. What an Extension is

In the author's words: "Extensions are called 'Extensions' because they EXTEND THE CORE of
GoMeta." What the GoMeta Core is, he defines so: "I regard the GoMeta Core as that which is
included in the GoMeta module and written by us i.e.: is part of the GoMeta repo. For example,
GoMeta can NOT run without BLS. BLS is loaded into the GoMeta module. So BLS is part of the
GoMeta Core. An Extension is NOT part of the GoMeta Core since GoMeta can run without it and it
is not loaded into / not included in the GoMeta module." GoMeta is, in his words, "a framework
with facilities on which Extensions can build", and he foresees two kinds: "Core Extensions
which ship by default with GoMeta and additional Extension which can be added via modules etc".

An Extension is any program that receives what one run delivers and executes the task it was
designed for — a renderer is one kind; "a future Extension may be updating databese entries or
anything else". The GoMeta Engine, [BLS](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File)
and the Extensions are separate components, and the author's principle for the Engine — which he used to call the Core — binds
what an Extension may ask of it: "I do NOT want the GoMeta Core (engine) to include machinery
which is only usefull for one Extension and even there only in certain situations. It is an
absolut TOP PRIORITY that the GoMeta engine focuses on UNIVERSAL requirements (i.e.: issues
which are required and/or useful to the all or at least most of the Extensions)."

## 2. What an Extension receives, and through what

In the author's words: "Extensions MUST go through the public surface of GoMeta which MUST /
WILL BE RESTRICTED TO THE NECESSARY functionality. Their very main source of information derives
from 'altValues_evals' and the BLS tree structure. Moreover, there are some functions provided
to travel / access the required data within those data containers."

One run delivers [one object](../reference/public-api.md#1.-One-call:-the-entry) with four
parts: the BLS Component tree, provided by BLS itself; `altValues_evals`, the evaluated
[Alterant](../reference/syntax-and-semantics.md#Alterant) values — "THE reference / THE
interface delivered by the GoMeta Engine for all kinds of future Extensions"; the status; the
diagnostics. An Extension reads them through the public surface and nothing internal:

- the evaluated values as [rows](../reference/public-api.md#3.-The-evaluated-values), one per
  evaluated value at its Component — the reader `readAltValuesEvals`;
- the Engine's [answer](../reference/public-api.md#4.-The-answers) for one
  [Component](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File)
  and one Alterant — `evaluatedAltValue`, which says which value applies and where it came
  from (e.g. the Component's own [statement](../reference/syntax-and-semantics.md#statement,-metaSegment),
  another Component's statement it falls under, the Alterant's declared default, etc.); with it
  `scanAlterant` (every Component with a recorded value of one Alterant), `evaluatedAltValues`
  (every Alterant's answer for one Component) and `childDiffers` (whether a Component's answer differs from its parent's);
- the BLS Component tree through [BLS's door](../reference/public-api.md#5.-The-BLS-Component-tree-and-its-door)
  — BLS's own public functions, which travel it and read a Component's
  [flavor](../reference/syntax-and-semantics.md#flavor), its text and the entries BLS recorded for it.

```julia
import GoMeta

delivery = GoMeta.goMeta(read("examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl"))
tree     = delivery.blsComponentTree
for block in GoMeta.BLS.children(tree)                       # the File's Blocks, in source order
    answer = GoMeta.evaluatedAltValue(delivery, block, :Visib)   # the Engine's answer for this Block
    answer.value === :hide || continue
    println(String(GoMeta.BLS.content(tree, block)))          # the Block's text, through BLS's door
end
```

Several Extensions may consume one and the same run. No Extension takes the development tool's
pair — a print of the BLS Component tree and a rendered copy of the file: an Extension works from the delivery. And an Extension belongs to a GoMeta
version — in the author's words, "The Extension of a GoMeta version MUST KNOW HOW TO INTERPRETE
that GoMeta version's 'altValues_evals'": until at least version 0.7 every change of the public
surface is a clean cut, and the [Public API](../reference/public-api.md) page states the policy; the package's own API document keeps the register of every such change.

## 3. What an Extension may do

In the author's words: "It is up to the Extensions what to do with the 'altValues_evals'
produced by the GoMeta Engine. For EXAMPLE, a user may want to inspect / verify what parts of a
document would get discarded when using 'discard' from the Alterant 'Visib'. For that reason, a
render Extension may be ask to render those parts of the document in bold using the font color
red INSTEAD of discarding it i.e.: doing quite the opposite of discarding these parts it may
actually be asked to HIGHLIGHT those parts. That would be an Extensions-side feature
disconnected from the GoMeta Engine's code / implementation." — "Some Extensions may completely
ignore certain evaluated values of a particular Alterant or while interpreting others
differently to other Extensions e.g.: 'hide' may be "implemented" / applied differently in
different contexts (hide some text in an intermediate file while discarding it from the final
user-facing, rendered output versus maybe comment that text out depending on the output file
type - prepend `##`, `///` or `<!-- -->` etc). An Extension use the evaluated values of several
Alterants to produce its output while ignoring the evaluated values of the other Alterant
entirely."

Extensions do not have to act all the same way on the same evaluation: what `hide` means may
differ slightly from one Extension to another, and how an Extension acts on one Alterant's
values may be adjusted by the user when calling it. An Extension need not know how an Alterant
combines its values — that is not its concern — and it relies on BLS for whether a
Block, Line or Segment is Code, Meta or Text. Where the Engine evaluated one value for a Block
and another for a Line inside it, how to deal with that is up to the Extension. Ideally an
Extension uses the BLS Component tree and `altValues_evals` to complete its task, so that it
re-does as little as possible of what BLS and the Engine have done; and the Engine owes it the evaluations in as
efficient a manner as possible — "the information must be unambiguous, and informative".

For the render Extensions he wanted built, the author stated the job: get the output of GoMeta; rewrite the
content of the input file, or an equivalent of it, into a valid input file for the target
environment, such that the evaluated values of Visib — show, hide, discard — are applied to the
regions concerned. For the two render Extensions of his talk he ruled what `hide` means in the
file such an Extension writes: a Component evaluated `hide` stays present there, commented out
or similar, and is not rendered.

## 4. What ships at this release

The repository carries two programs that read the delivery through the public surface. The notebook generator derives, from one marked source file, one notebook — the repository also keeps an executed twin of it — and two pages of the package's own manual, each line's Visib value taken from the Engine's answer for that line's Line Component. A demo program under `extensions/` answers which pieces of which files carry a given [label](../reference/syntax-and-semantics.md#label).
The [Examples](../examples/index.md) page shows their files.

Among the package's development tools is the **basic renderer**, which
writes a copy of a file with each piece shown, hidden or discarded as its evaluated Visib value
says. In the author's words: "It is a dev-tool which behaves like an Extension so it is actually
BOTH when looking at the definition of an Extension. … the definition of an Extension does
apply to the "basic renderer" / "renderer dev-tool". It should be placed under the dev-tools
directory." Strictly speaking, though, it is no Extension: it lives under the package's development tools, and it is there because it serves a vital purpose for the package's development. Its purpose, in his words, was "to enable me to quickly, visually VERIFY what the GoMeta Engine had evaluated to"; it was his proxy for checking what GoMeta had evaluated — and "the renderer (even the development tool one) act BASED ON THE EVALUATIONS
OF GoMeta. They do NOT evaluate themselves." The
[Development tools](../reference/development-tools.md) page explains it and the print tools.

## 5. A new Alterant

An Alterant is not an Extension: it is a kind of metadata — Visib, Labels, Heading and Id ship
with this release — and the Engine evaluates its values. In the author's words, "it is
relatively straight forward to add custom-made alterants and integrate them into the entire
GoMeta setup"; his proposal, of the toy example it shows: "It is worth pointing out, that the vocabulary of
instructions used in the example above has been restricted to a bare minimum for the purpose of
illustrating the concept. Due to the modular design of GoMeta it is easily altered, extended and
enables future contributors to integrate their own types of metadata. Moreover, () are used for
argument passing." At this release a new Alterant is declared by a record of its parts (e.g. its name, how its values combine, the type of its
instances, its setter, its default, how its applied state becomes rows, etc.) and registered
before GoMeta is called; the forms and the registration lifecycle are the
[Public API](../reference/public-api.md#6.-Extensions-and-the-registry) page's.

## 6. What the author wants later

In his words — his "point 6" being the one run that several Extensions consume, stated in section 2 above: "My point 6 here assumes that the Extensions do NOT mutate the underlying input
files (i.e.: the files GoMeta received as input). LATER I DO WANT to have such Extensions which
DO MUTATE the input files. One example may be REACTIVE Extensions which immediately 'hide'
certain parts of the input file WHILE WORKING WITH IT for instance in VS Code e.g.: hide the
metadata while working on a file so all that GoMeta metadata is not cluttering the user's
visible surface and so the user can focus on the actual task at hand. This metadata can then be
re-appear (i.e.: 'show') when necessary - when the user wants to work on that metadata." And, in his words, "I want to use GoMeta later in a REACTIVE WAY i.e.: it MUST be MAXIMALLY LIGHTWEIGHT." At his talk he named what was still missing —
a "GoMeta Extension", "Best with some sort of DB" — and what then needed improvement: the Id and the Labels
Alterants. The webs of atomic data units — a use that needs not only an Extension but also a database as back end — are on
[Why use GoMeta?](why-use-gometa.md).

From here: [How does GoMeta work?](how-does-gometa-work.md) — one run, from a file to what the
Extensions receive; [Public API](../reference/public-api.md) — the names; [Getting started](../tutorials/getting-started.md)
— the install and one complete run.
