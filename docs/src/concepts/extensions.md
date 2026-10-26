# Extensions

GoMeta evaluates the metadata — more precisely, the
[GoMeta Engine](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension) evaluates it
— but does not act on those evaluations: that is the
[Extensions](../reference/syntax-and-semantics.md#the-GoMeta-Engine,-Extension)' role; they
receive the evaluations through GoMeta's interface, `altValues_evals`. Only then, and based on those evaluations, do the Extensions act. This page says what an Extension is, what it receives and through what, what it may do, what ships at this release, how a new Alterant is added, and what is planned for later. The names a program calls are the
[Public API](../reference/public-api.md) page's; the run an Extension consumes is followed on
[How does GoMeta work?](how-does-gometa-work.md).

## 1. What an Extension is

Extensions are so called because they extend the core of GoMeta. The GoMeta Core is what is included in the GoMeta module and is part of the GoMeta repository: GoMeta cannot run without [BLS](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File), and BLS is loaded into the GoMeta module, so BLS is part of the GoMeta Core; an Extension is not, since GoMeta can run without it and it is not loaded into the GoMeta module. In the words of GoMeta's creator, GoMeta is "a framework with facilities on which Extensions can build", and it provides for two kinds of Extensions: Core Extensions, which are to ship with GoMeta by default, and additional Extensions, which can be added (e.g. via modules, etc.).

An Extension is any program that receives what one run delivers and executes the task it was designed for — a renderer is one kind; a future Extension may update database entries or do anything else. The GoMeta Engine, BLS and the Extensions are separate components, and one principle for the Engine binds what an Extension may ask of it: the Engine includes no machinery that is useful only for one Extension, and even there only in certain situations — its top priority is the universal requirements, those that all, or at least most, Extensions require or find useful.

## 2. What an Extension receives, and through what

Extensions must go through GoMeta's public surface, which is kept to the necessary functionality; their main source of information is `altValues_evals` and the BLS Component tree, and functions are provided to travel and access the data within them.

One run delivers [one object](../reference/public-api.md#1.-One-call:-the-entry) with four parts: the BLS Component tree, provided by BLS itself; `altValues_evals`, the evaluated [Alterant](../reference/syntax-and-semantics.md#Alterant) values — the reference interface the GoMeta Engine delivers for all kinds of future Extensions; the status; the diagnostics. An Extension reads them through the public surface and nothing internal:

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
  [flavor](../reference/syntax-and-semantics.md#flavor), its text and the entries BLS recorded for it;
- the [diagnostics](../reference/public-api.md#8.-What-a-program-sees-when-something-is-wrong) — a completed run may carry warning and info records: a label not applied, a change of the vocabulary file; an Extension that acts on labels can read them or show them to its user.

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
pair — a print of the BLS Component tree and a rendered copy of the file: an Extension works from the delivery. And an Extension belongs to a GoMeta version: it must know how to interpret that version's `altValues_evals` — until at least version 0.7 every change of the public surface is a clean cut, and the [Public API](../reference/public-api.md) page states the policy; the package's own API document (`docs/public-api.md` in the repository) keeps the register of every such change.

## 3. What an Extension may do

What to do with the `altValues_evals` the GoMeta Engine produces is up to the Extensions. For example, a user may want to check which parts of a document would be discarded under Visib's `discard`; a render Extension may then be asked to highlight those parts — in bold, in red — instead of discarding them: a feature on the Extension's side, disconnected from the GoMeta Engine's code. Some Extensions may ignore certain evaluated values of an Alterant entirely, or interpret them differently from other Extensions: `hide` may mean hiding text in an intermediate file while discarding it from the final rendered output, or commenting it out in the way the output's file type requires (e.g. `##`, `///`, `<!-- -->`, etc.); and an Extension may use the evaluated values of several Alterants to produce its output while ignoring those of another Alterant entirely.

Extensions do not have to act all the same way on the same evaluation: what `hide` means may
differ slightly from one Extension to another, and how an Extension acts on one Alterant's
values may be adjusted by the user when calling it. An Extension need not know how an Alterant
combines its values — that is not its concern — and it relies on BLS for whether a
Block, Line or Segment is Code, Meta or Text. Where the Engine evaluated one value for a Block
and another for a Line inside it, how to deal with that is up to the Extension. Ideally an Extension uses the BLS Component tree and `altValues_evals` to complete its task, so that it re-does as little as possible of what BLS and the Engine have done; and the Engine owes it the evaluations in as efficient a manner as possible, the information unambiguous and informative.

For the render Extensions planned for GoMeta, the job is this: get the output of GoMeta; rewrite the content of the input file, or an equivalent of it, into a valid input file for the target environment, such that the evaluated values of Visib — show, hide, discard — are applied to the regions concerned. For the two render Extensions shown in the creator's JuliaCon 2026 talk, `hide` means, in the file such an Extension writes, that a Component evaluated `hide` stays present there, commented out or similar, and is not rendered.

## 4. What ships at this release

The repository carries two programs that read the delivery through the public surface. The notebook generator derives, from one marked source file, one notebook — the repository also keeps an executed twin of it — and two pages of the package's own manual, each line's Visib value taken from the Engine's answer for that line's Line Component. A demo program under `extensions/` answers which pieces of which files carry a given [label](../reference/syntax-and-semantics.md#label).
The [Examples](../examples/index.md) page shows their files.

Among the package's development tools is the **basic renderer**, which
writes a copy of a file with each piece shown, hidden or discarded as its evaluated Visib value
says. It behaves like an Extension. Strictly speaking, though, it is no Extension: it lives under the package's development tools, and it is there because it serves a vital purpose for the package's development. Its purpose is to let one check quickly, by eye, what the GoMeta Engine evaluated; like every renderer, it acts on GoMeta's evaluations and does not evaluate anything itself. The
[Development tools](../reference/development-tools.md) page explains it and the print tools.

## 5. A new Alterant

An Alterant is not an Extension: it is a kind of metadata — Visib, Labels, Heading and Id ship
with this release — and the Engine evaluates its values. In the creator's words, "it is relatively straight forward to add custom-made alterants and integrate them into the entire GoMeta setup"; his JuliaCon 2026 proposal adds: "Due to the modular design of GoMeta it is easily altered, extended and enables future contributors to integrate their own types of metadata." At this release a new Alterant is declared by a record of its parts (e.g. its name, how its values combine, the type of its
instances, its setter, its default, how its applied state becomes rows, etc.) and registered
before GoMeta is called; the forms and the registration lifecycle are the
[Public API](../reference/public-api.md#6.-Extensions-and-the-registry) page's.

## 6. What is planned for later

The one run that several Extensions may consume (section 2) assumes that the Extensions do not change the files GoMeta received as input. Later, Extensions that do change them are planned — for example, reactive Extensions which, while one works on a file in an editor, immediately hide its metadata, so that it does not clutter the visible surface and one can focus on the task at hand, and show it again when one wants to work on that metadata. To be used in such a reactive way, GoMeta must be maximally lightweight. At the JuliaCon 2026 talk, GoMeta's creator named what was still missing — a "GoMeta Extension", "Best with some sort of DB" — and what then needed improvement: the Id and the Labels Alterants. The webs of atomic data units — a use that needs not only an Extension but also a database as a back end — are on
[Why use GoMeta?](why-use-gometa.md).

From here: [How does GoMeta work?](how-does-gometa-work.md) — one run, from a file to what the
Extensions receive; [Public API](../reference/public-api.md) — the names; [Getting started](../tutorials/getting-started.md)
— the install and one complete run.
