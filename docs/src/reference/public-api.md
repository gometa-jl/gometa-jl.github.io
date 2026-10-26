# Public API

This page is the reference for the surface a program relies on when it uses GoMeta, release
**0.4.4** (alpha): the four names `using GoMeta` brings into scope, the further names reached
qualified as `GoMeta.<name>`, and the door through which a program travels the
[BLS](syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File) Component tree. It is written from the package at that release and from the design as GoMeta's creator states it; the package's own test suite pins the set of names the package declares public, and this page lists exactly that set. The terms the page uses are defined where they first appear or in the Syntax & semantics page's
[Glossary](syntax-and-semantics.md#Glossary); the delivered object and the Component's handle
are defined here. Until at least version 0.7 every change of this surface is a clean cut: a renamed or removed name is gone, with no alias and no deprecation period — the policy of GoMeta's creator; the package's own API document keeps the register of every such change (see section 10 below).

## 1. One call: the entry

```julia
import GoMeta

bytes    = read("examples/InFileFolder/file_for_Example_Proposal_JuliaCon.jl")
delivery = GoMeta.goMeta(bytes)
delivery.status == GoMeta.PROCESS_OK || error("processing failed")
```

`goMeta(bytes; config = GoMetaConfig(), registry = DEFAULT_REGISTRY)` takes the file's bytes
(`read(path)`; from a `String`, `Vector{UInt8}(codeunits(s))`) and returns a
**`GoMetaDelivery`**, the delivered object of one run, with four parts read by name, in the
order of the pipeline:

- `blsComponentTree` — the [BLS](syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File)
  Component tree over which the metadata was evaluated, provided by BLS itself (section 5);
- `altValues_evals` — the evaluated [Alterant](syntax-and-semantics.md#Alterant) values, read
  through `readAltValuesEvals` (section 3);
- `status` — of type `GoMeta.ProcessStatus`: `PROCESS_OK` or `PROCESS_ERROR`;
- `diagnostics` — a vector of `GoMeta.Diagnostic` records, each with a `code` (a `Symbol`), a
  `severity` (`:error`, `:warning` or `:info`), a `message` and a `context`: a completed run may carry
  warning diagnostics — a label withheld or unknown where a statement applies it, a vocabulary file that
  cannot be written — and info diagnostics — a change of the vocabulary file (section 8). The status
  is `PROCESS_ERROR` exactly when a record of severity `:error` is among them: a failed run never comes with
  an empty list.

GoMeta evaluates the metadata — more precisely, the
[GoMeta Engine](syntax-and-semantics.md#the-GoMeta-Engine,-Extension) evaluates it — but does not
act on those evaluations: that is the
[Extensions](syntax-and-semantics.md#the-GoMeta-Engine,-Extension)' role; they receive the
evaluations through GoMeta's interface, `altValues_evals`.

The Engine reads no clock, and no environment but the one variable named below; the one file it reads, and writes, is the Labels
Alterant's vocabulary file of the user level (section 6; or the file the environment variable
`GOMETA_LABELS_VOCABULARY` names): for the same bytes, the same configuration, the same registry and
the same state of that file it delivers the same result — a program that must not depend on it points
that variable at a file of its own. Two things lie outside that guarantee because they are not the
Engine's: a [condition](syntax-and-semantics.md#condition) is Julia and does what its author wrote,
and the functions of a custom registry's Alterants (section 6) do what their author wrote. Processing
a file you did not write therefore runs its conditions as Julia code: use GoMeta on input you trust,
as you would any Julia file you `include`. A vocabulary statement in such a file also edits your
vocabulary file for good, each change of a completed run reported by an info diagnostic (section 8).

The BLS Component tree in the delivery is the one object the run built: every program that reads one
delivery shares it, and one that changes it changes it for every other.

`using GoMeta` brings in `goMeta`, `readAltValuesEvals`, `GoMetaConfig` and `GoMetaDelivery`;
every other public name is reached qualified. The qualified form — `import GoMeta` and
`GoMeta.goMeta(bytes)` — is the one the package's own tests use and the one to prefer when two
implementations of the language are loaded side by side.

## 2. The configuration

`GoMetaConfig(; flavor_tag = :julia, parse_range = nothing, user_mh_profile = nothing, namespace = :default)`
holds the run's options:

- `flavor_tag` names the file's [comment marker](syntax-and-semantics.md#comment-marker): `:julia`
  for `#`, `:c` for `//` (the C family: e.g. C, Rust, etc.), `:latex` for `%`. The marker is named when
  GoMeta is called, never inferred from the file. Any other tag makes `goMeta` throw before it
  reads a line, with a message that names the three tags and says that there is no fallback.
  The field carries the code's word *flavor*; on this site that word is reserved for the three
  [flavors](syntax-and-semantics.md#flavor) Meta, Text and Code — the field selects the comment
  marker.
- `parse_range`, a range of line numbers, limits the run to the file's first lines: the range's
  last number is the last line read, its first number is not used, a last number beyond the
  file's end is accepted, and a last number of zero or less reads the whole file. `nothing`,
  the default, reads the whole file.
- `namespace`, a `Symbol`, scopes every Component's handle of the run (section 3); a program
  that keeps the rows of several files apart gives each its own. A namespace longer than
  65535 bytes makes `GoMetaConfig(; …)` throw an `ArgumentError` when the configuration is constructed; the positional form carries no such guard.
- `user_mh_profile` is reserved and experimental: the body of a [metaLine](syntax-and-semantics.md#metaLine) fed into the run
  as its user level, the level above `#~0` in the meta hierarchy; an empty or whitespace-only string feeds nothing, like `nothing`, and a heading in the fed body is refused (section 8). Since 0.4.1 the fed body's labels are collected first, as the outermost level, and its other statements are evaluated after the Component's own metadata, with priority — an applicable fed value overrides the value the Component's own metadata decided; the Component's own metadata applies in written order with or without a feed. Since 0.4.2 the fed body may also carry the Labels Alterant's [vocabulary statements](syntax-and-semantics.md#vocabulary,-vocabulary-statement), `:++label6` / `:(++, label-3, label🏔️, label_💡)` and `:--label1` / `:(--, label1, label2)`: they are read when the body is fed, before any line of the file, so for the same name a vocabulary statement of the file wins over the fed one — the opposite direction from a fed value, which overrides the file's. Since 0.4.3 a fed vocabulary statement edits the user level's vocabulary file as a file's does (section 6), and a withhold or an explicit apply in the fed body (`:-label1`, `:+label1`; [Syntax & semantics §5](syntax-and-semantics.md#5.-Labels)) is applied first at every Component attached to metadata, so a file's plain `:label1` under a fed withhold applies nothing and is reported by a warning diagnostic (section 8). Leave it at `nothing`.

::: details Measured: an unknown `flavor_tag` — what `goMeta` throws

```
input: file_for_Example_Proposal_JuliaCon.jl · goMeta(bytes; config = GoMetaConfig(flavor_tag = :python))
GoMetaConfig constructed: GoMetaConfig(:python, nothing, nothing, :default)
goMeta threw: flavor_for: unknown flavor_tag :python — the closed inventory is (:julia, :c, :latex) and there is NO fallback
```

:::

## 3. The evaluated values

`readAltValuesEvals(delivery.altValues_evals)` returns the evaluated values as
[evals rows](syntax-and-semantics.md#altValue,-evals), one per evaluated value: a tuple of the
**Component's handle** — bytes that identify the
[Component](syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File) within the run's
namespace — followed by the attribute, the value and the polarity, a `Bool` reserved for later use and `true` in every row at this release. The rows are
sorted by handle, attribute and value, carry final values only, and are empty when the file
holds no metadata — no [metaLine](syntax-and-semantics.md#metaLine) and no [metaSegment](syntax-and-semantics.md#statement,-metaSegment) — and nothing is fed through the
configuration. In the code the handle is called `cell_handle`; this site says the Component's
handle.

The attributes at this release: `:label_<name> => true`, one row per
[label](syntax-and-semantics.md#label) that applies; `:visib => :show`, `:hide` or `:discard`;
`:head_<level> => "…"` for a heading (a same-level repeat on one handle `:head_<level>_<k>`); `:id_<name> => Int16` for the experimental Id Alterant,
one row per non-zero field. A program should skip an attribute family it does not know rather than fail on it: later releases may bring further Alterants and their families, and GoMeta's creator gives no guarantee that a later release delivers the evaluated values in the same form.

`GoMeta.serialize_evals(rows)` turns the rows into bytes: one row per line, four tab-separated
columns, a tab, newline, carriage return or backslash in an attribute name escaped.
`GoMeta.EvalRecord` is the type of one recorded row — beside the four columns it carries
`decided_by`, the handles of the [statements](syntax-and-semantics.md#statement,-metaSegment)
that produced the row, in the order they applied — and `GoMeta.EvalStore` the type of the part
`altValues_evals`. A Component's text is not in a row: read it through the door (section 5).
The [Getting started](../tutorials/getting-started.md) page shows the rows of one run.

## 4. The answers

Where the rows list what the Engine recorded, the answer function tells what applies to a
Component — decided by its own statement, by another Component's statement, or by the Alterant's default:

- `GoMeta.evaluatedAltValue(delivery, component, alterant; registry = DEFAULT_REGISTRY)` returns a `GoMeta.EvaluatedAltValue`
  with three fields. `value` is in the Alterant's own shape: Visib a `Symbol`, Labels a sorted
  vector of names — a label withheld at a Component is not among them, and a Line whose own metaSegment withholds its only labels has no row of its own and answers its Block's set — Heading a `String` (or `nothing`, its default), Id a named tuple. `source` is one of `:own` (the
  Component's own [statement](syntax-and-semantics.md#statement,-metaSegment) decided it),
  `:indirect` (another Component's statement decided it — e.g. for an
  [attached](syntax-and-semantics.md#attachment,-inheritance) Block and its Lines, the metaBlock from which that
  Block inherits the value; for a Segment, its Line; etc.), `:user` (the fed profile of section 2), `:file` (the file level; nothing feeds it at
  this release), `:default` (no statement decided it: the Alterant's declared default), `:none`
  (no statement and no default) and `:fallBack` (reserved, never delivered at this release).
  `via` is the deciding Component for `:indirect`, else `nothing`. The Alterants are named by
  their registered names: `:Visib`, `:labels`, `:heading`, `:id`. The declared defaults: Visib
  `:show`; Labels the empty set, Heading `nothing` and Id a named tuple of zeros — these three
  declared provisionally, they may change once used on real examples. The File has no value at
  this release and answers `nothing` with the source `:none`. An unknown Alterant name throws
  an `ArgumentError` naming the registered names.
- `GoMeta.scanAlterant(delivery, alterant; registry = DEFAULT_REGISTRY)` returns every Component for which the Engine
  recorded a value of that Alterant, each with its answer, in the BLS Component tree's order. A Component
  with no row of its own is not listed — its answer is `evaluatedAltValue`'s — and the File never
  is.
- `GoMeta.evaluatedAltValues(delivery, component; registry = DEFAULT_REGISTRY)` returns every registered Alterant's answer
  for one Component, in the registry's order.
- `GoMeta.childDiffers(delivery, component, alterant; registry = DEFAULT_REGISTRY)` is `true` when the Component's answer has
  a value different from its parent's. A Line that only falls under its Block's value never differs; a
  Line with its own statement differs when that statement's value is another; a Block whose
  value is not `nothing` differs from the File, which has no value at this release; the File
  itself never differs.

::: details Measured on the first example file: every Block's and Line's Visib answer with its source, the Labels answers, `childDiffers`, `scanAlterant`, `evaluatedAltValues`, and the refusal of an unknown name

The answers below are the public functions' returns, tabulated. The full delivery view of the
same file — every evals row at its Component — is embedded on the
[Syntax & semantics](syntax-and-semantics.md#11.-The-examples) page.

```
input: file_for_Example_Proposal_JuliaCon.jl · sha256 fb44c903fc614d795d210e46d04335e3dc1eb47bcf3eb8b7b5b45b1d88971214
status = PROCESS_OK · diagnostics = 0 · evals rows = 28
registered Alterant names (DEFAULT_REGISTRY.plugins' altName): [:labels, :Visib, :id, :heading]

== evaluatedAltValue(delivery, c, :Visib) · (:labels) · childDiffers(c, :Visib) — every Block and Line, in the tree's order ==
File       Visib => nothing source=none via=— · childDiffers=false
Block Meta  "#~ hide{ :label4 , isCode } ## This is a…"
      Visib => :show     source=default   via=— · labels => [:label1] (own) · childDiffers=true
   Line Meta  "#~ hide{ :label4 , isCode } ## This is a…"  Visib => :show     source=default   via=— · childDiffers=false
   Line Meta  "## The above `Line` of meta initiated th…"  Visib => :show     source=default   via=— · childDiffers=false
   Line Meta  "#~ :label1{ (isText && containsMeta), is…"  Visib => :show     source=default   via=— · childDiffers=false
Block Text  "⏎# This `Line` of text starts a new `Blo…"
      Visib => :show     source=default   via=— · labels => Symbol[] (default) · childDiffers=true
   Line Text  ""  Visib => :show     source=default   via=— · childDiffers=false
   Line Text  "# This `Line` of text starts a new `Bloc…"  Visib => :show     source=default   via=— · childDiffers=false
   Line Text  "# This `Block` is NOT attached to metada…"  Visib => :show     source=default   via=— · childDiffers=false
   Line Text  "# However, this `Line` will get discarde…"  Visib => :discard  source=own       via=— · childDiffers=true
Block Meta  "⏎#~2 :label5 show{ !:label5} ## This is …"
      Visib => :show     source=default   via=— · labels => [:label1, :label5] (indirect) · childDiffers=true
   Line Meta  ""  Visib => :show     source=default   via=— · childDiffers=false
   Line Meta  "#~2 :label5 show{ !:label5} ## This is l…"  Visib => :show     source=default   via=— · childDiffers=false
Block Code  "using Plots ## This `Line` starts a new …"
      Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · labels => [:label5] (indirect) · childDiffers=true
   Line Code  "using Plots ## This `Line` starts a new …"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "## This code `Block` is ATTACHED to meta…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "## Therefore, this code `Block` receives…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "## `show` from line 9 above does NOT get…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "##      as this can only happen"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "##      if label5 has NOT been applied. …"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "## This code `Block` inherits `hide` fro…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "##      since this is a code `Block` and…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  ""  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "println("!!! NOTE !!! Only Code and Text…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Code  "println("\t Whereas an empty line after …"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
Block Meta  "⏎#~3 :label4 discard{:label3} :label3"
      Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · labels => [:label1, :label3, :label4, :label5] (indirect) · childDiffers=true
   Line Meta  ""  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Meta  "#~3 :label4 discard{:label3} :label3"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
Block Text  "# This `Block` of text receives label4⏎#…"
      Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · labels => [:label1, :label3, :label4, :label5] (indirect) · childDiffers=true
   Line Text  "# This `Block` of text receives label4"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Text  "#       plus label5 from further above"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Text  "#       plus label1 since it `isText` AN…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Text  "# It is NOT "discarded" since label3 has…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Text  "#       when `discard{:label3}` is issue…"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Text  "# Only after that it receives label3."  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Text  "# Instead, it gets hidden due to label4 …"  Visib => :hide     source=indirect  via="#~ hide{ :label4 , isCode } ## This …" · childDiffers=false
   Line Text  "# This `Line`, however, will NOT get hid…"  Visib => :show     source=own       via=— · childDiffers=true
Block Meta  "⏎#~2 :label5"
      Visib => :show     source=default   via=— · labels => [:label1, :label5] (indirect) · childDiffers=true
   Line Meta  ""  Visib => :show     source=default   via=— · childDiffers=false
   Line Meta  "#~2 :label5"  Visib => :show     source=default   via=— · childDiffers=false
Block Text  "md"""⏎This is a `Block` of markdown text…"
      Visib => :show     source=default   via=— · labels => [:label1, :label5] (indirect) · childDiffers=true
   Line Text  "md""""  Visib => :show     source=default   via=— · childDiffers=false
   Line Text  "This is a `Block` of markdown text. #~ h…"  Visib => :hide     source=own       via=— · childDiffers=true
   Line Text  """""  Visib => :show     source=default   via=— · childDiffers=false

== scanAlterant(delivery, :Visib) — every Component with a recorded Visib value, in the tree's order ==
Text  "# However, this `Line` will get discarde…"  => :discard (own)
Code  "using Plots ## This `Line` starts a new …"  => :hide (indirect)
Meta  "⏎#~3 :label4 discard{:label3} :label3"  => :hide (indirect)
Text  "# This `Block` of text receives label4⏎#…"  => :hide (indirect)
Text  "# This `Line`, however, will NOT get hid…"  => :show (own)
Text  "This is a `Block` of markdown text. #~ h…"  => :hide (own)

== evaluatedAltValues(delivery, c) for the Code Block that follows the first metaBlock (every registered Alterant's answer) ==
Block Code "using Plots ## This `Line` starts a new …"
   labels   => [:label5] source=indirect
   Visib    => :hide source=indirect
   id       => (cell = 0, parent = 0, file = 0) source=default
   heading  => nothing source=default

== an unknown Alterant name ==
threw: ArgumentError: GoMeta evaluatedAltValue: no Alterant named `NoSuchAlterant` in the registry — the registered names: Visib, heading, id, labels
```

:::

## 5. The BLS Component tree and its door

`delivery.blsComponentTree` is BLS's own object, and BLS's own public functions travel it. They
are reached as `GoMeta.BLS.<name>`:

- `children(tree)` — the File's Blocks; `children(tree, c)` — a Component's children, in source
  order.
- `parent(tree, c)` — a Component's parent; `nothing` for the File.
- `kind(c)` — the Component's [flavor](syntax-and-semantics.md#flavor): `:Meta`, `:Text` or
  `:Code`; `nothing` for the File.
- `content(tree, c)` — the Component's own bytes; `content(tree)` — the document's lines joined
  by a newline, as BLS holds them, without a terminal newline.
- `root(tree)` — the File.
- `flavor(tree)` — the record of the run's comment marker (the function carries the code's word *flavor*, as the field `flavor_tag` of section 2 does — not a Component's flavor); the fields of that record the package commits to are `lead`,
  `hide_marker`, `hide_fold_prefix`, `flavor_tag` and `re_meta_leaded`.
- `endsWithNewline(tree)` — whether the document ended in a newline.
- `isHorizontalSpace(ch)` — whether a character is horizontal white space in the parser's sense.
- `getElement(c, key)` — reads, by key, one entry of a Component's
  [settribute](syntax-and-semantics.md#settribute) (a flag) or of its named integers (an `Int`).
- `File`, `Block`, `Line`, `Segment` — the Component types; `ComponentSettribute`,
  `CmpntNamedInt` — the types of a Component's two sets of named entries: its settribute and its named integers.

Everything else in `GoMeta.BLS` is internal.

## 6. Extensions and the registry

An Extension receives the evaluations through `altValues_evals`, asks its questions through
the functions of section 4, and travels the BLS Component tree through the door of section 5 — never through
anything internal. The Alterants a run knows come from its registry: `GoMeta.DEFAULT_REGISTRY`
holds the four shipped ones (Visib, Labels, Heading, Id), and a program adds Alterants of its own through
the registration lifecycle:

- `GoMeta.RegistryBuilder()` starts empty; `GoMeta.RegistryBuilder(DEFAULT_REGISTRY)` starts
  with the four shipped Alterants.
- `GoMeta.register!(builder, alterant, actions...)` declares one Alterant and its actions.
- `GoMeta.next_plugin_index(builder)` — the index the next registration takes; an action
  record names its Alterant by it.
- `GoMeta.validate(builder)` returns every defect as a `Diagnostic`, in a fixed order, and
  throws nothing.
- `GoMeta.publish(builder)` returns a sealed `GoMeta.AlterantRegistry`, the only kind `goMeta`
  accepts; it throws `GoMeta.RegistrationRefused`, which carries the diagnostics, on any error.

The records `register!` takes — the Alterant and its actions, built with keywords — and the two an Alterant's record carries:

- `GoMeta.Alterant(; altName, setMode, altConstructor, setAltInstance, getAltInstance = nothing, precedencesTuple = nothing, default = NoDefault(), capture = nothing, onRead = nothing)`
  — the Alterant: its name; how its values combine (`:accumulate` collects every applicable
  value, `:mutExclusive` stops at the first, `:mutExclusivePerField` is the Id compound's,
  `:localOnly` is applied only locally, where the statement stands); the type of its instances; its setter,
  whose methods are the actions' forms — a setter may return a vector of `Diagnostic` records, which the Engine
  delivers on the run's diagnostics with the place added to each record's context (the Component, the stating
  statement, the Alterant's statements applied there so far) and the severity copied: a warning or info record
  leaves the run `PROCESS_OK`, an error record makes it `PROCESS_ERROR` though the run completes with its whole
  delivery; a vector typed `Any` is ignored like any other return, and a severity outside the three is delivered
  without effect on the status; the Engine reads such a vector and never a label, and this agreement may change
  in a later version; its query getter, needed for an action a condition may
  ask (`nothing` otherwise); its precedence tuple, always `nothing` at this release; its default;
  its capture declaration; and, since 0.4.2, its read-time hook `onRead` — `nothing`, the default, for every
  shipped Alterant but Labels. The Engine calls the hook when it reads one of the Alterant's statements that
  carries arguments (a statement without arguments never reaches it), before the statement is queued, and reads
  its return in one grammar: `nothing` — the statement is queued as written; a vector of `Diagnostic` records
  alone — the records are delivered as a setter's are, with the read-time place (the stating statement, its level,
  its text), and the statement is queued; a pair of a state and such a vector — the statement is consumed and the
  records delivered; any other value — the statement is consumed at the read (nothing is queued, its condition is
  not kept, no row is recorded, the declared validation does not run for it) and the value becomes the Alterant's
  state for the run, handed back at the hook's next call and to the instance constructor as `altConstructor(run)`;
  where no state was minted, and for an Alterant without a hook, the constructor is called bare, `altConstructor()`,
  so a registration with a hook accepts both calls. An error the hook throws is Julia's own, out of `goMeta`. The
  Labels Alterant's hook records the [vocabulary statements](syntax-and-semantics.md#vocabulary,-vocabulary-statement)
  this way and returns, with its state, the info diagnostics of each change it makes to the vocabulary file.
- `GoMeta.ActionSpec(; name, plugin::Int8, accepts_string_slot = 0, validate = nothing)` — one action of an
  Alterant: its name; the index of its Alterant; which argument slot, if any, takes a quoted
  text; and a validation of that text.
- `GoMeta.CaptureDecl(attr_scheme; attr_stem = nothing)` — `attr_scheme` one of `:per_key`, `:single`, `:per_field`, `:per_entry` — how the Alterant's applied state
  becomes evals rows; without it an Alterant records no rows.
- `GoMeta.NoDefault()` and `GoMeta.Declared(value)` — the two forms of an Alterant's default;
  `GoMeta.DefaultSlot` is their common type.

The Labels Alterant's vocabulary is the user level's vocabulary file — `~/.gometa/labels-vocabulary.txt`, a copy of the 46-name file shipped with the package (`data/alterants-std/labels-vocabulary.txt`), made at the first need; another file through the environment variable `GOMETA_LABELS_VOCABULARY` — which the vocabulary statements of a file at `#~0` and of the fed user level edit (section 2; [Syntax & semantics §5](syntax-and-semantics.md#5.-Labels)); the shipped file is never written and is the way back; a missing shipped file refuses the run. The file's form: one name per line, a line beginning with `#` a comment, a blank line ignored, each line's two edges trimmed. The twenty-eighth public name, `GoMeta.is_argument_space(c)`, is that trim's class: true for a character GoMeta trims at the two edges of every bare argument before an Alterant sees it — the ordinary white space and the six invisible separators U+2028, U+2029, U+180E, U+200B, U+2060, U+FEFF — and false for every other character, the zero-width joiner and the variation selectors that shape pictographs among them; an Alterant that reads names from lines of its own trims them with `strip(GoMeta.is_argument_space, line)`, as the Labels Alterant does. The check that `goMeta` makes at its entry guards against
accidents by conforming code — an unpublished registry, a published one changed afterwards —
not against a loaded module that sets out to defeat it: load only Alterants you trust, as you
would any Julia file you `include`.

## 7. The development tool's pair

Among the package's development tools, the basic renderer lets what the Engine evaluated be checked by eye: it turns a
delivery into a print of the BLS Component tree and a rendered copy of the file. Strictly speaking it is no Extension: it lives under the package's development tools, and it is there because it serves a vital purpose for the package's development. It is loaded
explicitly and is not part of the Engine's surface:

```julia
include(joinpath(pkgdir(GoMeta), "devtools", "load_basic_renderer.jl"))   # at the top level
out = Main.BasicRenderer.outputs(delivery)   # (blsStructure_bytes, render_bytes)
```

No Extension takes this pair; an Extension works from the delivery. The test suite pins the
pair byte for byte — the rendered copy against the committed reference files, the tree print against its committed copy. The
[Getting started](../tutorials/getting-started.md) page shows the development tool in use; the
[Development tools](development-tools.md) page describes what it prints.

## 8. What a program sees when something is wrong

**Two statuses.** A run that completes delivers `PROCESS_OK`, its `diagnostics` empty or carrying warning and info records (below); a custom Alterant's error record (section 6) makes a completed run `PROCESS_ERROR` with its whole delivery. A run whose registry `goMeta` refuses delivers `PROCESS_ERROR` with one coded `Diagnostic`,
before any line is read: `REG_UNPUBLISHED` (an unsealed registry; the message names the path
builder → validate → publish) or `POST_SEAL_MUTATION` (a published registry changed afterwards;
the message names the first changed field). A file with no metadata at all is not an error:
`PROCESS_OK` — and, with nothing fed through the configuration, no rows.

**The registry's own refusals.** `register!` throws (and `next_plugin_index`, at capacity, the second code)
`RegistrationRefused` with `REG_PROTOCOL` (an action record that names another Alterant) or
`REG_SLOT_EXHAUSTED` (more than 127 Alterants or actions). `validate` returns a `REG_PROTOCOL`
row for each declared value outside the accepted domain;
`publish` throws `RegistrationRefused` carrying them. `REG_DERIVED_TABLES` names a registry
assembled directly from its parts, outside the lifecycle, whose parts do not agree with its
declarations — build through the lifecycle instead. At a run, the validation an action declares for its quoted text — when it answers
`false`, returns no `Bool` or throws — makes `goMeta` throw a stable message naming
`REG_VALIDATE_FALSE`, `RES_RETURN_TYPE` or `CB_VALIDATE_THROW`; a validation that throws its own message in GoMeta's form — an `ErrorException` whose text begins with `GoMeta` followed by a space — makes `goMeta` throw that message unchanged, and an `InterruptException` passes through unchanged too.

**Warnings and information.** A run that ends `PROCESS_OK` may carry `LABEL_NOT_APPLIED_WITHHELD` (a warning: a plain label statement met by a withhold), `LABEL_NOT_APPLIED_UNKNOWN` (a warning: a label outside the run's vocabulary, under any form), `LABELS_VOCABULARY_FILE_NOT_WRITTEN` (a warning: a vocabulary file that could not be written, the change holding for that run alone) and `LABELS_VOCABULARY_FILE_CHANGED` (information: a change of the vocabulary file, the way back named) — the two label codes one record per name at each Component concerned, the two file codes one record per change, the label and the place in its context, the message naming the remedy or the way back; `isempty(delivery.diagnostics)` is the one-line check that every label statement applied.

**What a file's author meets.** These make `goMeta` throw — with a stable message of GoMeta's, most naming the
offending token, or, where a bullet says so, with Julia's own error; nothing is delivered:

- an unknown action, "unknown alterant action", naming the registered actions (a label applied from outside the
  run's vocabulary is not refused: it is reported, above, and a label only asked for in a condition answers false);
  an empty label list (`#~ :` or `:()`), an empty label query (`{ :() }`) and a label list with an empty member, a
  stray comma (`:(label1, )`); a malformed withhold or explicit apply — `:(-label1, label2)`, `:-`, `:(-, )`,
  `:+-label1`, `:(label1, -label2)` — with a message naming the forms;
- a vocabulary statement (section 2; [Syntax & semantics §5](syntax-and-semantics.md#5.-Labels)) anywhere but a
  metaBlock opened by `#~0` or the fed user level, "is legal at `#~0` and in the user level's profile only", naming
  the place it stood in; a malformed one — with a condition, with a name beginning with `+`, `-` or `#`, with white
  space or an invisible character inside a name, naming no label, with an empty member in its list, or the one-name
  form given several names — each with a message naming the forms; a vocabulary file with white space or an
  invisible character inside a name (the line named), and a missing shipped vocabulary file; a refusal delivers
  nothing, but an edit an earlier vocabulary statement of the run made to the vocabulary file stays;
- a malformed metaLine: a character where the grammar allows none, "unexpected character"; an
  unterminated `(`, `{` or `"`; a quoted text in a slot that takes none, "string argument not
  accepted"; more than one inline marker on one line; the inert marker's `!` before the [depth](syntax-and-semantics.md#depth,-the-meta-hierarchy)
  (`#~!2` for `#~2!`), "bang-first meta marker", naming the right spelling; a reserved form
  (`#-`, `#+`, `#[`, `#>`) right after metadata — after a metaLine or metaBlock even with a blank line between;
- a condition that is empty or a bare literal (`{}`, `{ 1 }`), "carries no condition
  expression"; a word in a condition that is neither a [BLS key word](syntax-and-semantics.md#the-BLS-key-words) nor an action a condition
  may ask, "unknown condition key"; a condition Julia cannot parse, or one that fails when Julia
  evaluates it — Julia's own error; an argument an Alterant's setter cannot take — its own
  error, Julia's;
- a digit depth beyond 8 (`#~9`), "meta depth out of range"; a ninth statement in one depth level (the bound is 8 — a size GoMeta's creator chose to start with; if it proves too small it may easily be increased by hand — not the number of registered actions, 9 with the shipped registry; a vocabulary statement is not counted), "more than 8 actions in one meta-hierarchy slot"; more than one Visib value set for one Component, "more than one Visib value set for one component";
- an unknown `flavor_tag` (section 2);
- a heading in the body fed through `user_mh_profile` (section 2), "a heading (Heading Alterant) in the profile feed has no Component of the file levels to be local to".

GoMeta's own messages among these are stable within this release and the package's test suite asserts them.

## 9. Line endings

A file with CRLF line endings (a carriage return before each line feed) is read as if its endings were LF (a line feed alone): the content of each Line holds
no carriage return, and the rendered copy comes out with LF endings. The bytes within a line
are kept as they are.

::: details Measured: a file with CRLF endings through the Engine and the door

The transcript below is one run's, in three parts: the input's fingerprint and the run's status; the full delivery view of the run, as the development tools print it — in the development tool's printouts a "cell" is a BLS Component that carries evaluated values — the tool's word; this site says Component; its "(no evals — defaults apply)" marks a Component with no evaluated values of its own; it falls under the value of a Component that contains it, else under the Alterant's declared default; the view ends with the run's line, its status and its diagnostics — and the bytes: every Line's content through the door with its count of carriage returns, the rendered copy with its byte counts, and the count over the whole document.

```
input: crlf_input.jl · sha256 9b01c3a8fcfae089dad5bb33d52c7d4971f254986d40bbd35a61fcf4f326c5eb · bytes 186 · CR bytes in the input: 8
status = PROCESS_OK · diagnostics = 0
```

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">crlf_input.jl</span><span class="gm-dt-gutter">  —  5 evals rows on 4 cells  (of 6 Blocks · 8 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# A probe for the Public API page: a …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# A probe for the Public API page: a …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "#~ hide{ isCode } ## the first metaLi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "#~ hide{ isCode } ## the first metaLi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L3–L4   </span> "x = 1⏎y = 2"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L3      </span> "x = 1"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L4      </span> "y = 2"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #5  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5–L6   </span> "# a text line after an empty line"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L6      </span> "# a text line after an empty line"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7      </span> "#~ :label1"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7      </span> "#~ :label1"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L8      </span> "z = 3 #~ show"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #9   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L8      </span> "z = 3 #~ show"
<span class="gm-dt-gutter">      </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label1</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #5 "#~ show"</span>
<span class="gm-dt-gutter">          handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,9)]  origin=[(direct,1) (direct,7) (direct,9) (direct,5)]
</span><span class="gm-dt-gutter">      </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #5 "#~ show"</span>
<span class="gm-dt-gutter">          handle ns=:default  grain=Line  path=[(direct,1) (direct,7) (direct,9)]  origin=[(direct,1) (direct,7) (direct,9) (direct,5)]
</span><span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

```
== the content bytes of every Line through the door (BLS.content): does a Line keep its \r? ==
Text  "# A probe for the Public API page: a fil…"  CR bytes: 0 · length 65
Meta  "#~ hide{ isCode } ## the first metaLine"  CR bytes: 0 · length 39
Code  "x = 1"  CR bytes: 0 · length 5
Code  "y = 2"  CR bytes: 0 · length 5
Text  ""  CR bytes: 0 · length 0
Text  "# a text line after an empty line"  CR bytes: 0 · length 33
Meta  "#~ :label1"  CR bytes: 0 · length 10
Code  "z = 3 #~ show"  CR bytes: 0 · length 13

== the development tool's render: 184 bytes · CR bytes in the render: 0 · LF bytes: 8 ==
# A probe for the Public API page: a file with CRLF line endings.
#~ hide{ isCode } ## the first metaLine
## x = 1
## y = 2

# a text line after an empty line
#~ :label1
z = 3 #~ show
== end of the render ==
the whole document's text through the door, CR bytes: 0
```

:::

## 10. Not at this release; the policy

`using()` is a reserved name: do not define it or rely on it. The programs that check another
implementation of the language against the shared examples are internal and not part of the
surface. The version is in the package's `Project.toml`; the package's own API document
(`docs/public-api.md` in the repository) keeps the register of every renamed, removed or added
public name, and the policy of clean cuts holds until at least version 0.7.
