# The ladder — step by step

Every rung below is one file GoMeta can read, shown whole with its line numbers, followed by what the GoMeta Engine evaluated for it — the development tools' own printouts, captured from the package, never typed — and, where visibility is the point, the rendered copy the basic renderer writes. Read it after [Getting started](../tutorials/getting-started.md)'s first metaLine, or start here: rung 1 assumes Julia and nothing of GoMeta. The first four rungs grow ONE file: the lines a rung adds carry a bold number, a tint and a bar at the left edge; a line a rung only touched carries a dotted number, a lighter tint and a yellow bar; the unchanged lines fold away behind a line that opens on a click, and a long box scrolls inside itself until its bar shows the whole file. From rung 5 on each rung is a file of its own. The comments inside each file carry its point; the paragraph before it says what the file leaves unsaid.

## Rung 1 — what BLS sees

Before GoMeta can absorb and evaluate the metadata, [BLS](../reference/syntax-and-semantics.md#BLS,-Component,-Block,-Line,-Segment,-File) reads the file and records what it finds as Components: Blocks, Lines and Segments, each of one of three [flavors](../reference/syntax-and-semantics.md#flavor) — Text, Meta or Code — and each flavor can contain comments. In the words of the [JuliaCon 2026 proposal](https://pretalx.com/juliacon-2026/talk/XYMFMZ/), "Any line starting with #~ is considered to be a metaline"; here the statement after the marker is `hide`, a value of the [Alterant](../reference/syntax-and-semantics.md#Alterant) Visib — what `hide` does to a copy of the file is rung 2's, rung 1 shows only where it lands. "By positioning such a block just above a block of code or text [no vertical spacing in between] the former gets attached to the latter" — the proposal again; an empty line after a metaLine starts a new Block. The file's own 'metaComponent' and 'metaStatement' are its early names for a Component of flavor Meta and for a statement; its 'sub-section' is nesting under: `#~2` opens a metaLine one level deeper than `#~`, and a deeper metaLine stays under the shallower one above it however many lines lie between — the empty line detaches content from metadata, it does not take `#~2` out from under line 8; the levels are [rung 5](#Rung-5-—-the-meta-hierarchy:-the-depths)'s. Where no statement reaches a Component, nothing applies, and the value is `show`. The file's own comments say the rest; it is grown from the first Intro-Tour file of GoMeta's early demos: three comment lines re-cut and a markdown Block added.

```gometa ln scroll=16
# This first line is 'Text'. ## This is a 'comment' of 'Text'.
# Line 1 above consists of two BLS 'Segment' Components.
# Both of flavor: 'Text'. The '##' starts a 'comment'.
# BLS [Block, Line, Segment] Components can currently be of
# 3 different flavors: 'Code', 'Meta' and 'Text'.
# Each of which can be turned into a flavored comment by '##'.

#~ hide ## This is a first 'metaLine' (incl. this comment).
## The 'Line' above consists of two BLS 'Segment's.

a = 1 ## This is a first 'Line' of 'Code'.
b = 2 ## These two lines of 'Code' form a 'Block' of 'Code'.
## The empty line 10 starts this 'Block' and DETACHES it from the metaLine:
## it is NOT attached to any 'metaComponent'
## and therefore unaffected by metadata.

#~2 ## This second 'metaLine' is kind of a sub-section
## of the first 'metaLine' above and therefore it
## inherits its 'metaStatement's. More later.
c = 3 ## This 'Line' of 'Code' IS attached
## to the 'metaBlock' of "#~2" (no empty line between),
## which in turn inherits from the first 'metaBlock'.

md"""
This is a 'Block' of markdown text - 'Text' too, without a '#'.
The empty line above starts it, so it is NOT attached to metadata.
"""
```

::: details The full delivery view of rung 1 — every Block and Line with its evaluated values, as the development tools print it

How to read the view: each Component's line names one Block or Line with its flavor and the input lines it spans — `L7–L9` are the file's line numbers, `#3` is the number BLS gave the Component. A `●` row under a Block or Line is one evaluated value, `visib => :hide`; in the tool's words a Component that carries such a row is a "cell" — this site says Component. The `(+)` after a value is the row's polarity, a flag reserved for later use and `true` in every row at this release: it tells nothing yet. The grey `handle` line is the Component's address — skip it on a first reading. "(no evals — defaults apply)" marks a Component with no evaluated values of its own: it falls under the value of a Component that contains it, else under the Alterant's declared default. The view ends with the run's line — its status and its diagnostics.

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-01_what-bls-sees.jl</span><span class="gm-dt-gutter">  —  3 evals rows on 3 cells  (of 6 Blocks · 27 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1–L6   </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L2      </span> "# Line 1 above consists of two BLS 'S…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L3      </span> "# Both of flavor: 'Text'. The '##' st…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L4      </span> "# BLS [Block, Line, Segment] Componen…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> "# 3 different flavors: 'Code', 'Meta'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L6      </span> "# Each of which can be turned into a …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7–L9   </span> "#~ hide ## This is a first 'metaLine'…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> "#~ hide ## This is a first 'metaLine'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> "## The 'Line' above consists of two B…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10–L15 </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L11     </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12     </span> "b = 2 ## These two lines of 'Code' fo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L13     </span> "## The empty line 10 starts this 'Blo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "## it is NOT attached to any 'metaCom…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #16  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L15     </span> "## and therefore unaffected by metada…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L16–L19 </span> "#~2 ## This second 'metaLine' is kind…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L16     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L17     </span> "#~2 ## This second 'metaLine' is kind…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18     </span> "## of the first 'metaLine' above and …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L19     </span> "## inherits its 'metaStatement's. Mor…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L20–L22 </span> "c = 3 ## This 'Line' of 'Code' IS att…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L20     </span> "c = 3 ## This 'Line' of 'Code' IS att…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L21     </span> "## to the 'metaBlock' of "#~2" (no em…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22     </span> "## which in turn inherits from the fi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block">Block #7  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L23–L27 </span> "md"""⏎This is a 'Block' of markdown t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L23     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #25  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L24     </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L25     </span> "This is a 'Block' of markdown text - …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L26     </span> "The empty line above starts it, so it…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #28  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L27     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

:::

::: details The Component-tree view of rung 1 — every Block, Line and Segment with the facts BLS recorded about it (the `Bool` row) and its numbers (the `Int64` row)

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-01_what-bls-sees.jl</span><span class="gm-dt-gutter">  —  6 Blocks · 27 Lines · 12 Segments
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #2    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1–L6   </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=1 idxString=0 inputLineNum=1 numChildren=6 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1      </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=2 idxString=0 inputLineNum=1 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>containsText isText
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1      </span> "# This first line is 'Text'. "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=1 stopMainStr=29 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #3  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1      </span> "## This is a 'comment' of 'Text'."
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=30 stopMainStr=62 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L2      </span> "# Line 1 above consists of two BLS 'Segment…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=2 idxString=2 inputLineNum=2 numChildren=0 startMainStr=1 stopMainStr=56 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L3      </span> "# Both of flavor: 'Text'. The '##' starts a…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=2 idxString=3 inputLineNum=3 numChildren=0 startMainStr=1 stopMainStr=54 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L4      </span> "# BLS [Block, Line, Segment] Components can…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=2 idxString=4 inputLineNum=4 numChildren=0 startMainStr=1 stopMainStr=59 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L5      </span> "# 3 different flavors: 'Code', 'Meta' and '…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=2 idxString=5 inputLineNum=5 numChildren=0 startMainStr=1 stopMainStr=49 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L6      </span> "# Each of which can be turned into a flavor…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=2 idxString=6 inputLineNum=6 numChildren=0 startMainStr=1 stopMainStr=62 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L7–L9   </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=1 idxString=0 inputLineNum=7 numChildren=3 startMainStr=7 stopMainStr=9 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L7      </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=3 idxString=0 inputLineNum=7 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8      </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=3 idxString=0 inputLineNum=8 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 containsMeta isMeta
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #4  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8      </span> "#~ hide "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=9 idxString=8 inputLineNum=8 numChildren=0 startMainStr=1 stopMainStr=8 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8      </span> "## This is a first 'metaLine' (incl. this c…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=9 idxString=8 inputLineNum=8 numChildren=0 startMainStr=9 stopMainStr=59 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #10    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L9      </span> "## The 'Line' above consists of two BLS 'Se…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=3 idxString=9 inputLineNum=9 numChildren=0 startMainStr=1 stopMainStr=51 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L10–L15 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=1 idxString=0 inputLineNum=10 numChildren=6 startMainStr=10 stopMainStr=15 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L10     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=11 idParent=4 idxString=0 inputLineNum=10 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L11     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=12 idParent=4 idxString=0 inputLineNum=11 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode isCode
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L11     </span> "a = 1 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=12 idxString=11 inputLineNum=11 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #7  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L11     </span> "## This is a first 'Line' of 'Code'."
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=12 idxString=11 inputLineNum=11 numChildren=0 startMainStr=7 stopMainStr=42 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L12     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=13 idParent=4 idxString=0 inputLineNum=12 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode isCode
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L12     </span> "b = 2 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=13 idxString=12 inputLineNum=12 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #9  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L12     </span> "## These two lines of 'Code' form a 'Block'…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=13 idxString=12 inputLineNum=12 numChildren=0 startMainStr=7 stopMainStr=60 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L13     </span> "## The empty line 10 starts this 'Block' an…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=14 idParent=4 idxString=13 inputLineNum=13 numChildren=0 startMainStr=1 stopMainStr=75 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span> "## it is NOT attached to any 'metaComponent…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=15 idParent=4 idxString=14 inputLineNum=14 numChildren=0 startMainStr=1 stopMainStr=44 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #16    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L15     </span> "## and therefore unaffected by metadata."
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=16 idParent=4 idxString=15 inputLineNum=15 numChildren=0 startMainStr=1 stopMainStr=40 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L16–L19 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=1 idxString=0 inputLineNum=16 numChildren=4 startMainStr=16 stopMainStr=19 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth2 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #17    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L16     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=17 idParent=5 idxString=0 inputLineNum=16 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #18    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L17     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=18 idParent=5 idxString=0 inputLineNum=17 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>depth2 containsMeta isMeta
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #10 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L17     </span> "#~2 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=18 idxString=17 inputLineNum=17 numChildren=0 startMainStr=1 stopMainStr=4 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>depth2 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #11 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L17     </span> "## This second 'metaLine' is kind of a sub-…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=11 idParent=18 idxString=17 inputLineNum=17 numChildren=0 startMainStr=5 stopMainStr=54 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L18     </span> "## of the first 'metaLine' above and theref…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=19 idParent=5 idxString=18 inputLineNum=18 numChildren=0 startMainStr=1 stopMainStr=49 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #20    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L19     </span> "## inherits its 'metaStatement's. More late…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=20 idParent=5 idxString=19 inputLineNum=19 numChildren=0 startMainStr=1 stopMainStr=45 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L20–L22 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=1 idxString=0 inputLineNum=20 numChildren=3 startMainStr=20 stopMainStr=22 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L20     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=21 idParent=6 idxString=0 inputLineNum=20 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #12 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L20     </span> "c = 3 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=12 idParent=21 idxString=20 inputLineNum=20 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #13 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L20     </span> "## This 'Line' of 'Code' IS attached"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=13 idParent=21 idxString=20 inputLineNum=20 numChildren=0 startMainStr=7 stopMainStr=42 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #22    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L21     </span> "## to the 'metaBlock' of "#~2" (no empty li…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=22 idParent=6 idxString=21 inputLineNum=21 numChildren=0 startMainStr=1 stopMainStr=55 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #23    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L22     </span> "## which in turn inherits from the first 'm…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=23 idParent=6 idxString=22 inputLineNum=22 numChildren=0 startMainStr=1 stopMainStr=53 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L23–L27 </span>
<span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=1 idxString=0 inputLineNum=23 numChildren=5 startMainStr=23 stopMainStr=27 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">Bool   </span>containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L23     </span> ""
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=24 idParent=7 idxString=0 inputLineNum=23 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #25    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L24     </span> "md""""
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=25 idParent=7 idxString=24 inputLineNum=24 numChildren=0 startMainStr=1 stopMainStr=5 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L25     </span> "This is a 'Block' of markdown text - 'Text'…"
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=26 idParent=7 idxString=25 inputLineNum=25 numChildren=0 startMainStr=1 stopMainStr=63 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L26     </span> "The empty line above starts it, so it is NO…"
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=27 idParent=7 idxString=26 inputLineNum=26 numChildren=0 startMainStr=1 stopMainStr=66 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #28    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L27     </span> """""
<span class="gm-dt-gutter">         </span><span class="gm-dt-gutter">Int64  </span>idComponent=28 idParent=7 idxString=27 inputLineNum=27 numChildren=0 startMainStr=1 stopMainStr=3 idExtension=0 idExtended=0
<span class="gm-dt-gutter">         </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
</pre>
```

:::

In the full delivery view, `visib => :hide` stands on three Blocks — the first metaBlock, the `#~2` metaBlock and the `c = 3` Block — and on nothing else: the `a = 1`/`b = 2` Block and the markdown Block read "(no evals — defaults apply)". A metaBlock carries the value it states. The Block `a = 1`/`b = 2` spans the lines 10 to 15: in the printouts an empty line counts as the first Line of the Block it starts. In the Component-tree view, line 1 is two Segments (the second a comment of flavor Text), the metaLine two Segments, and every Code or Text Block written directly below a metaBlock carries `attachedToMeta`; the metaBlocks of depth 1 and deeper carry the flag too.

## Rung 2 — the three values of Visib, and the first rendered copy

Rung 1 grown by ten lines. Visib's values are `show`, `hide` and `discard`, and for any one piece of the file only one of them applies at a time. The rendered copy below the printouts is written by the [basic renderer](../reference/development-tools.md), a development tool and a proxy to check by eye what GoMeta has evaluated — what matters is what GoMeta evaluates, not what its proxy shows. A hidden Line is written behind `## `, a hidden empty line stays an empty line, a discarded Line is left out, a shown Line is written as it is. The `#~ discard` on line 26 and the `#~ show` on line 30 stand beside the first `#~` on line 8, not under it as `#~2` does, so they inherit nothing from it — the levels are [rung 5](#Rung-5-—-the-meta-hierarchy:-the-depths)'s.

```gometa ln new=10-11,26-32,36 chg=15,35 fold=2 scroll=12
# This first line is 'Text'. ## This is a 'comment' of 'Text'.
# Line 1 above consists of two BLS 'Segment' Components.
# Both of flavor: 'Text'. The '##' starts a 'comment'.
# BLS [Block, Line, Segment] Components can currently be of
# 3 different flavors: 'Code', 'Meta' and 'Text'.
# Each of which can be turned into a flavored comment by '##'.

#~ hide ## This is a first 'metaLine' (incl. this comment).
## The 'Line' above consists of two BLS 'Segment's.
## 'hide' is one of Visib's three values: hidden lines STAY
## in the rendered copy, commented out.

a = 1 ## This is a first 'Line' of 'Code'.
b = 2 ## These two lines of 'Code' form a 'Block' of 'Code'.
## The empty line 12 starts this 'Block' and DETACHES it from the metaLine:
## it is NOT attached to any 'metaComponent'
## and therefore unaffected by metadata.

#~2 ## This second 'metaLine' is kind of a sub-section
## of the first 'metaLine' above and therefore it
## inherits its 'metaStatement's. More later.
c = 3 ## This 'Line' of 'Code' IS attached
## to the 'metaBlock' of "#~2" (no empty line between),
## which in turn inherits from the first 'metaBlock'.

#~ discard ## 'discard', Visib's second value: the attached 'Line' below
## LEAVES the rendered copy - not even as a comment; this 'metaBlock' too.
d = 4 ## This 'Line' of 'Code' gets DISCARDED.

#~ show ## 'show', Visib's third value, is the DEFAULT; stated here:
# This 'Line' of 'Text' is attached and stays as it is.

md"""
This is a 'Block' of markdown text - 'Text' too, without a '#'.
The empty line above starts it, so it is NOT attached to metadata:
nothing applies, and where nothing applies the value is 'show'.
"""
```

::: details The full delivery view of rung 2 — every Block and Line with its evaluated values, as the development tools print it

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-02_visib-values.jl</span><span class="gm-dt-gutter">  —  7 evals rows on 7 cells  (of 10 Blocks · 37 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1–L6   </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L2      </span> "# Line 1 above consists of two BLS 'S…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L3      </span> "# Both of flavor: 'Text'. The '##' st…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L4      </span> "# BLS [Block, Line, Segment] Componen…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> "# 3 different flavors: 'Code', 'Meta'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L6      </span> "# Each of which can be turned into a …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7–L11  </span> "#~ hide ## This is a first 'metaLine'…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> "#~ hide ## This is a first 'metaLine'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> "## The 'Line' above consists of two B…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L10     </span> "## 'hide' is one of Visib's three val…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L11     </span> "## in the rendered copy, commented ou…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12–L17 </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L13     </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "b = 2 ## These two lines of 'Code' fo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #16  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L15     </span> "## The empty line 12 starts this 'Blo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L16     </span> "## it is NOT attached to any 'metaCom…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L17     </span> "## and therefore unaffected by metada…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18–L21 </span> "#~2 ## This second 'metaLine' is kind…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L19     </span> "#~2 ## This second 'metaLine' is kind…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L20     </span> "## of the first 'metaLine' above and …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L21     </span> "## inherits its 'metaStatement's. Mor…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22–L24 </span> "c = 3 ## This 'Line' of 'Code' IS att…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22     </span> "c = 3 ## This 'Line' of 'Code' IS att…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L23     </span> "## to the 'metaBlock' of "#~2" (no em…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #25  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L24     </span> "## which in turn inherits from the fi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25–L27 </span> "#~ discard ## 'discard', Visib's seco…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L26     </span> "#~ discard ## 'discard', Visib's seco…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #28  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L27     </span> "## LEAVES the rendered copy - not eve…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "d = 4 ## This 'Line' of 'Code' gets D…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #29  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "d = 4 ## This 'Line' of 'Code' gets D…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L29–L30 </span> "#~ show ## 'show', Visib's third valu…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #30  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L29     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #31  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L30     </span> "#~ show ## 'show', Visib's third valu…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L31     </span> "# This 'Line' of 'Text' is attached a…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #32  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L31     </span> "# This 'Line' of 'Text' is attached a…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block">Block #11 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L32–L37 </span> "md"""⏎This is a 'Block' of markdown t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #33  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L32     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #34  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L33     </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #35  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L34     </span> "This is a 'Block' of markdown text - …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #36  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L35     </span> "The empty line above starts it, so it…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #37  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L36     </span> "nothing applies, and where nothing ap…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #38  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L37     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

:::

::: details The rendered copy of rung 2 — what the basic renderer writes from the run

```
# This first line is 'Text'. ## This is a 'comment' of 'Text'.
# Line 1 above consists of two BLS 'Segment' Components.
# Both of flavor: 'Text'. The '##' starts a 'comment'.
# BLS [Block, Line, Segment] Components can currently be of
# 3 different flavors: 'Code', 'Meta' and 'Text'.
# Each of which can be turned into a flavored comment by '##'.

## #~ hide ## This is a first 'metaLine' (incl. this comment).
## The 'Line' above consists of two BLS 'Segment's.
## 'hide' is one of Visib's three values: hidden lines STAY
## in the rendered copy, commented out.

a = 1 ## This is a first 'Line' of 'Code'.
b = 2 ## These two lines of 'Code' form a 'Block' of 'Code'.
## The empty line 12 starts this 'Block' and DETACHES it from the metaLine:
## it is NOT attached to any 'metaComponent'
## and therefore unaffected by metadata.

## #~2 ## This second 'metaLine' is kind of a sub-section
## of the first 'metaLine' above and therefore it
## inherits its 'metaStatement's. More later.
## c = 3 ## This 'Line' of 'Code' IS attached
## to the 'metaBlock' of "#~2" (no empty line between),
## which in turn inherits from the first 'metaBlock'.

#~ show ## 'show', Visib's third value, is the DEFAULT; stated here:
# This 'Line' of 'Text' is attached and stays as it is.

md"""
This is a 'Block' of markdown text - 'Text' too, without a '#'.
The empty line above starts it, so it is NOT attached to metadata:
nothing applies, and where nothing applies the value is 'show'.
"""
```

:::

The view: seven rows on seven Blocks — `hide` on three, `discard` on two, `show` on two; the stated `show` on the `#~ show` metaBlock and its attached Text Block against "(no evals — defaults apply)" on the markdown Block, which has the same value by default. The rendered copy: three lines behind `## ` (the first metaLine, the `#~2` metaLine, `c = 3`); four lines gone (the `#~ discard` metaBlock with its comment, and `d = 4`); the show lines and the markdown Block as they are. The renderer's `## ` is its hide marker, the input's `##` comments keep theirs, and a line that already begins with `##` is not marked twice: the hidden `##` comment lines look untouched.

## Rung 3 — the metaSegment

Rung 2 grown by five lines. Besides the metaLine on its own line, a `#~` may stand after a line's content, as the Line's last Segment: that is a [metaSegment](../reference/syntax-and-semantics.md#statement,-metaSegment), and its statement applies to that one Line only — not to the Block the Line belongs to; at this release it reaches the Line as a whole. The seven-line example on the [front page](../index.md) already ended in one, `b = 2 #~ discard{ :label1 }`. The depths of the meta hierarchy, the file level `#~0` among them, come with [rung 5](#Rung-5-—-the-meta-hierarchy:-the-depths).

```gometa ln new=33-37 fold=1 scroll=12
# This first line is 'Text'. ## This is a 'comment' of 'Text'.
# Line 1 above consists of two BLS 'Segment' Components.
# Both of flavor: 'Text'. The '##' starts a 'comment'.
# BLS [Block, Line, Segment] Components can currently be of
# 3 different flavors: 'Code', 'Meta' and 'Text'.
# Each of which can be turned into a flavored comment by '##'.

#~ hide ## This is a first 'metaLine' (incl. this comment).
## The 'Line' above consists of two BLS 'Segment's.
## 'hide' is one of Visib's three values: hidden lines STAY
## in the rendered copy, commented out.

a = 1 ## This is a first 'Line' of 'Code'.
b = 2 ## These two lines of 'Code' form a 'Block' of 'Code'.
## The empty line 12 starts this 'Block' and DETACHES it from the metaLine:
## it is NOT attached to any 'metaComponent'
## and therefore unaffected by metadata.

#~2 ## This second 'metaLine' is kind of a sub-section
## of the first 'metaLine' above and therefore it
## inherits its 'metaStatement's. More later.
c = 3 ## This 'Line' of 'Code' IS attached
## to the 'metaBlock' of "#~2" (no empty line between),
## which in turn inherits from the first 'metaBlock'.

#~ discard ## 'discard', Visib's second value: the attached 'Line' below
## LEAVES the rendered copy - not even as a comment; this 'metaBlock' too.
d = 4 ## This 'Line' of 'Code' gets DISCARDED.

#~ show ## 'show', Visib's third value, is the DEFAULT; stated here:
# This 'Line' of 'Text' is attached and stays as it is.

e = 5 #~ hide
## The 'Line' above ENDS in a 'metaSegment': a '#~' after its content.
## It applies to that one 'Line' only - so 'e = 5' gets hidden.
f = 6 ## This 'Line' of 'Code', in the same 'Block', is NOT hidden.

md"""
This is a 'Block' of markdown text - 'Text' too, without a '#'.
The empty line above starts it, so it is NOT attached to metadata:
nothing applies, and where nothing applies the value is 'show'.
"""
```

::: details The full delivery view of rung 3 — every Block and Line with its evaluated values, as the development tools print it

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-03_metasegment.jl</span><span class="gm-dt-gutter">  —  8 evals rows on 8 cells  (of 11 Blocks · 42 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1–L6   </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L2      </span> "# Line 1 above consists of two BLS 'S…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L3      </span> "# Both of flavor: 'Text'. The '##' st…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L4      </span> "# BLS [Block, Line, Segment] Componen…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> "# 3 different flavors: 'Code', 'Meta'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L6      </span> "# Each of which can be turned into a …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7–L11  </span> "#~ hide ## This is a first 'metaLine'…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> "#~ hide ## This is a first 'metaLine'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> "## The 'Line' above consists of two B…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L10     </span> "## 'hide' is one of Visib's three val…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L11     </span> "## in the rendered copy, commented ou…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12–L17 </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L13     </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "b = 2 ## These two lines of 'Code' fo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #16  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L15     </span> "## The empty line 12 starts this 'Blo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L16     </span> "## it is NOT attached to any 'metaCom…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L17     </span> "## and therefore unaffected by metada…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18–L21 </span> "#~2 ## This second 'metaLine' is kind…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L19     </span> "#~2 ## This second 'metaLine' is kind…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L20     </span> "## of the first 'metaLine' above and …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L21     </span> "## inherits its 'metaStatement's. Mor…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22–L24 </span> "c = 3 ## This 'Line' of 'Code' IS att…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22     </span> "c = 3 ## This 'Line' of 'Code' IS att…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L23     </span> "## to the 'metaBlock' of "#~2" (no em…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #25  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L24     </span> "## which in turn inherits from the fi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25–L27 </span> "#~ discard ## 'discard', Visib's seco…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L26     </span> "#~ discard ## 'discard', Visib's seco…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #28  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L27     </span> "## LEAVES the rendered copy - not eve…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "d = 4 ## This 'Line' of 'Code' gets D…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #29  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "d = 4 ## This 'Line' of 'Code' gets D…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L29–L30 </span> "#~ show ## 'show', Visib's third valu…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #30  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L29     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #31  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L30     </span> "#~ show ## 'show', Visib's third valu…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L31     </span> "# This 'Line' of 'Text' is attached a…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #32  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L31     </span> "# This 'Line' of 'Text' is attached a…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #11 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L32–L36 </span> "e = 5 #~ hide⏎## The 'Line' above END…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #33  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L32     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #34  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L33     </span> "e = 5 #~ hide"
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #21 "#~ hide"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,11) (direct,34)]  origin=[(direct,1) (direct,11) (direct,34) (direct,21)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #35  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L34     </span> "## The 'Line' above ENDS in a 'metaSe…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #36  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L35     </span> "## It applies to that one 'Line' only…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #37  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L36     </span> "f = 6 ## This 'Line' of 'Code', in th…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block">Block #12 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L37–L42 </span> "md"""⏎This is a 'Block' of markdown t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #38  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L37     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #39  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L38     </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #40  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L39     </span> "This is a 'Block' of markdown text - …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #41  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L40     </span> "The empty line above starts it, so it…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #42  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L41     </span> "nothing applies, and where nothing ap…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #43  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L42     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

:::

::: details The rendered copy of rung 3 — what the basic renderer writes from the run

```
# This first line is 'Text'. ## This is a 'comment' of 'Text'.
# Line 1 above consists of two BLS 'Segment' Components.
# Both of flavor: 'Text'. The '##' starts a 'comment'.
# BLS [Block, Line, Segment] Components can currently be of
# 3 different flavors: 'Code', 'Meta' and 'Text'.
# Each of which can be turned into a flavored comment by '##'.

## #~ hide ## This is a first 'metaLine' (incl. this comment).
## The 'Line' above consists of two BLS 'Segment's.
## 'hide' is one of Visib's three values: hidden lines STAY
## in the rendered copy, commented out.

a = 1 ## This is a first 'Line' of 'Code'.
b = 2 ## These two lines of 'Code' form a 'Block' of 'Code'.
## The empty line 12 starts this 'Block' and DETACHES it from the metaLine:
## it is NOT attached to any 'metaComponent'
## and therefore unaffected by metadata.

## #~2 ## This second 'metaLine' is kind of a sub-section
## of the first 'metaLine' above and therefore it
## inherits its 'metaStatement's. More later.
## c = 3 ## This 'Line' of 'Code' IS attached
## to the 'metaBlock' of "#~2" (no empty line between),
## which in turn inherits from the first 'metaBlock'.

#~ show ## 'show', Visib's third value, is the DEFAULT; stated here:
# This 'Line' of 'Text' is attached and stays as it is.

## e = 5 ## #~ hide
## The 'Line' above ENDS in a 'metaSegment': a '#~' after its content.
## It applies to that one 'Line' only - so 'e = 5' gets hidden.
f = 6 ## This 'Line' of 'Code', in the same 'Block', is NOT hidden.

md"""
This is a 'Block' of markdown text - 'Text' too, without a '#'.
The empty line above starts it, so it is NOT attached to metadata:
nothing applies, and where nothing applies the value is 'show'.
"""
```

:::

The view shows the ladder's first row on a Line rather than on a Block — `grain=Line` in the printout — on the Line `e = 5`, with its origin named: the Segment `#~ hide`; the Block, the two `##` Lines and `f = 6` read "(no evals — defaults apply)". In the rendered copy the renderer wrote `## ` twice on that line, before the hidden Line and before its metaSegment — not rung 2's case: here the hidden Line and the metaSegment it ends in each get a mark — and `f = 6` stands as it is.

## Rung 4 — a condition decides per Component

Rung 3 grown by six lines. "The optional {} following hide on line 1 allows the user to specify conditions under which hide may get applied" — the [JuliaCon 2026 proposal](https://pretalx.com/juliacon-2026/talk/XYMFMZ/) on the first example file, whose line 1 carries the condition; here it stands on line 38. The [condition](../reference/syntax-and-semantics.md#condition) is Julia, and `isCode` is one of the [BLS key words](../reference/syntax-and-semantics.md#the-BLS-key-words) — facts about a Component that BLS records when it reads the file and that a condition may ask. The Engine evaluates the condition for each Component the statement reaches: here the Text Line is attached but is not Code, so nothing applies to it; the Code Line is attached and is Code, so it is hidden. A Block is a run of lines of one flavor, so the Text Line 41 and the Code Line 42 are two Blocks; a Block directly below an attached Block, with no empty line between, is attached as well — the Component-tree view shows both with `attachedToMeta`.

```gometa ln new=38-43 fold=1 scroll=12
# This first line is 'Text'. ## This is a 'comment' of 'Text'.
# Line 1 above consists of two BLS 'Segment' Components.
# Both of flavor: 'Text'. The '##' starts a 'comment'.
# BLS [Block, Line, Segment] Components can currently be of
# 3 different flavors: 'Code', 'Meta' and 'Text'.
# Each of which can be turned into a flavored comment by '##'.

#~ hide ## This is a first 'metaLine' (incl. this comment).
## The 'Line' above consists of two BLS 'Segment's.
## 'hide' is one of Visib's three values: hidden lines STAY
## in the rendered copy, commented out.

a = 1 ## This is a first 'Line' of 'Code'.
b = 2 ## These two lines of 'Code' form a 'Block' of 'Code'.
## The empty line 12 starts this 'Block' and DETACHES it from the metaLine:
## it is NOT attached to any 'metaComponent'
## and therefore unaffected by metadata.

#~2 ## This second 'metaLine' is kind of a sub-section
## of the first 'metaLine' above and therefore it
## inherits its 'metaStatement's. More later.
c = 3 ## This 'Line' of 'Code' IS attached
## to the 'metaBlock' of "#~2" (no empty line between),
## which in turn inherits from the first 'metaBlock'.

#~ discard ## 'discard', Visib's second value: the attached 'Line' below
## LEAVES the rendered copy - not even as a comment; this 'metaBlock' too.
d = 4 ## This 'Line' of 'Code' gets DISCARDED.

#~ show ## 'show', Visib's third value, is the DEFAULT; stated here:
# This 'Line' of 'Text' is attached and stays as it is.

e = 5 #~ hide
## The 'Line' above ENDS in a 'metaSegment': a '#~' after its content.
## It applies to that one 'Line' only - so 'e = 5' gets hidden.
f = 6 ## This 'Line' of 'Code', in the same 'Block', is NOT hidden.

#~ hide{ isCode } ## A CONDITION: 'hide' applies only where it holds.
## 'isCode', a BLS key word, asks each attached Component: are you 'Code'?
## This 'metaBlock' itself is 'Meta', not 'Code': it stays as it is.
# This 'Line' of 'Text' is attached, but 'isCode' fails: it stays.
g = 7 ## This 'Line' of 'Code' follows directly: 'isCode' holds - hidden.

md"""
This is a 'Block' of markdown text - 'Text' too, without a '#'.
The empty line above starts it, so it is NOT attached to metadata:
nothing applies, and where nothing applies the value is 'show'.
"""
```

::: details The full delivery view of rung 4 — every Block and Line with its evaluated values, as the development tools print it

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-04_condition.jl</span><span class="gm-dt-gutter">  —  9 evals rows on 9 cells  (of 14 Blocks · 48 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1–L6   </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L1      </span> "# This first line is 'Text'. ## This …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L2      </span> "# Line 1 above consists of two BLS 'S…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L3      </span> "# Both of flavor: 'Text'. The '##' st…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L4      </span> "# BLS [Block, Line, Segment] Componen…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> "# 3 different flavors: 'Code', 'Meta'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L6      </span> "# Each of which can be turned into a …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7–L11  </span> "#~ hide ## This is a first 'metaLine'…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L7      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> "#~ hide ## This is a first 'metaLine'…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> "## The 'Line' above consists of two B…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L10     </span> "## 'hide' is one of Visib's three val…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L11     </span> "## in the rendered copy, commented ou…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12–L17 </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L12     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L13     </span> "a = 1 ## This is a first 'Line' of 'C…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "b = 2 ## These two lines of 'Code' fo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #16  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L15     </span> "## The empty line 12 starts this 'Blo…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L16     </span> "## it is NOT attached to any 'metaCom…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L17     </span> "## and therefore unaffected by metada…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18–L21 </span> "#~2 ## This second 'metaLine' is kind…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L19     </span> "#~2 ## This second 'metaLine' is kind…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L20     </span> "## of the first 'metaLine' above and …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L21     </span> "## inherits its 'metaStatement's. Mor…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22–L24 </span> "c = 3 ## This 'Line' of 'Code' IS att…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L22     </span> "c = 3 ## This 'Line' of 'Code' IS att…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L23     </span> "## to the 'metaBlock' of "#~2" (no em…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #25  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L24     </span> "## which in turn inherits from the fi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25–L27 </span> "#~ discard ## 'discard', Visib's seco…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L26     </span> "#~ discard ## 'discard', Visib's seco…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #28  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L27     </span> "## LEAVES the rendered copy - not eve…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "d = 4 ## This 'Line' of 'Code' gets D…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #29  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "d = 4 ## This 'Line' of 'Code' gets D…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L29–L30 </span> "#~ show ## 'show', Visib's third valu…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #30  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L29     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #31  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L30     </span> "#~ show ## 'show', Visib's third valu…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L31     </span> "# This 'Line' of 'Text' is attached a…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #32  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L31     </span> "# This 'Line' of 'Text' is attached a…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #11 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L32–L36 </span> "e = 5 #~ hide⏎## The 'Line' above END…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #33  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L32     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line gm-dt-bold">Line #34  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L33     </span> "e = 5 #~ hide"
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span><span class="gm-dt-gutter">   ← Segment #21 "#~ hide"</span>
<span class="gm-dt-gutter">│  │      handle ns=:default  grain=Line  path=[(direct,1) (direct,11) (direct,34)]  origin=[(direct,1) (direct,11) (direct,34) (direct,21)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #35  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L34     </span> "## The 'Line' above ENDS in a 'metaSe…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #36  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L35     </span> "## It applies to that one 'Line' only…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #37  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L36     </span> "f = 6 ## This 'Line' of 'Code', in th…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #12 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L37–L40 </span> "#~ hide{ isCode } ## A CONDITION: 'hi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #38  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L37     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #39  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L38     </span> "#~ hide{ isCode } ## A CONDITION: 'hi…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #40  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L39     </span> "## 'isCode', a BLS key word, asks eac…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #41  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L40     </span> "## This 'metaBlock' itself is 'Meta',…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #13 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L41     </span> "# This 'Line' of 'Text' is attached, …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #42  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L41     </span> "# This 'Line' of 'Text' is attached, …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #14 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L42     </span> "g = 7 ## This 'Line' of 'Code' follow…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,14)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #43  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L42     </span> "g = 7 ## This 'Line' of 'Code' follow…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block">Block #15 </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L43–L48 </span> "md"""⏎This is a 'Block' of markdown t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #44  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L43     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #45  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L44     </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #46  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L45     </span> "This is a 'Block' of markdown text - …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #47  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L46     </span> "The empty line above starts it, so it…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #48  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L47     </span> "nothing applies, and where nothing ap…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #49  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L48     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

:::

::: details The Component-tree view of rung 4 — every Block, Line and Segment with the facts BLS recorded about it (the `Bool` row) and its numbers (the `Int64` row)

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-04_condition.jl</span><span class="gm-dt-gutter">  —  14 Blocks · 48 Lines · 26 Segments
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #2    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1–L6   </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=1 idxString=0 inputLineNum=1 numChildren=6 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1      </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=2 idxString=0 inputLineNum=1 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>containsText isText
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #2  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1      </span> "# This first line is 'Text'. "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=1 stopMainStr=29 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #3  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L1      </span> "## This is a 'comment' of 'Text'."
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=30 stopMainStr=62 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L2      </span> "# Line 1 above consists of two BLS 'Segment…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=2 idxString=2 inputLineNum=2 numChildren=0 startMainStr=1 stopMainStr=56 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L3      </span> "# Both of flavor: 'Text'. The '##' starts a…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=2 idxString=3 inputLineNum=3 numChildren=0 startMainStr=1 stopMainStr=54 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #5     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L4      </span> "# BLS [Block, Line, Segment] Components can…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=2 idxString=4 inputLineNum=4 numChildren=0 startMainStr=1 stopMainStr=59 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L5      </span> "# 3 different flavors: 'Code', 'Meta' and '…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=2 idxString=5 inputLineNum=5 numChildren=0 startMainStr=1 stopMainStr=49 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L6      </span> "# Each of which can be turned into a flavor…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=2 idxString=6 inputLineNum=6 numChildren=0 startMainStr=1 stopMainStr=62 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L7–L11  </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=1 idxString=0 inputLineNum=7 numChildren=5 startMainStr=7 stopMainStr=11 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L7      </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=3 idxString=0 inputLineNum=7 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8      </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=3 idxString=0 inputLineNum=8 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 containsMeta isMeta
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #4  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8      </span> "#~ hide "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=9 idxString=8 inputLineNum=8 numChildren=0 startMainStr=1 stopMainStr=8 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8      </span> "## This is a first 'metaLine' (incl. this c…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=9 idxString=8 inputLineNum=8 numChildren=0 startMainStr=9 stopMainStr=59 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L9      </span> "## The 'Line' above consists of two BLS 'Se…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=3 idxString=9 inputLineNum=9 numChildren=0 startMainStr=1 stopMainStr=51 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L10     </span> "## 'hide' is one of Visib's three values: h…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=11 idParent=3 idxString=10 inputLineNum=10 numChildren=0 startMainStr=1 stopMainStr=59 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #12    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L11     </span> "## in the rendered copy, commented out."
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=12 idParent=3 idxString=11 inputLineNum=11 numChildren=0 startMainStr=1 stopMainStr=39 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L12–L17 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=1 idxString=0 inputLineNum=12 numChildren=6 startMainStr=12 stopMainStr=17 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L12     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=13 idParent=4 idxString=0 inputLineNum=12 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L13     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=14 idParent=4 idxString=0 inputLineNum=13 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode isCode
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L13     </span> "a = 1 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=14 idxString=13 inputLineNum=13 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #7  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L13     </span> "## This is a first 'Line' of 'Code'."
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=14 idxString=13 inputLineNum=13 numChildren=0 startMainStr=7 stopMainStr=42 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=15 idParent=4 idxString=0 inputLineNum=14 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode isCode
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span> "b = 2 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=15 idxString=14 inputLineNum=14 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #9  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span> "## These two lines of 'Code' form a 'Block'…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=15 idxString=14 inputLineNum=14 numChildren=0 startMainStr=7 stopMainStr=60 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #16    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L15     </span> "## The empty line 12 starts this 'Block' an…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=16 idParent=4 idxString=15 inputLineNum=15 numChildren=0 startMainStr=1 stopMainStr=75 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #17    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L16     </span> "## it is NOT attached to any 'metaComponent…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=17 idParent=4 idxString=16 inputLineNum=16 numChildren=0 startMainStr=1 stopMainStr=44 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #18    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L17     </span> "## and therefore unaffected by metadata."
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=18 idParent=4 idxString=17 inputLineNum=17 numChildren=0 startMainStr=1 stopMainStr=40 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L18–L21 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=1 idxString=0 inputLineNum=18 numChildren=4 startMainStr=18 stopMainStr=21 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth2 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #19    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L18     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=19 idParent=5 idxString=0 inputLineNum=18 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #20    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L19     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=20 idParent=5 idxString=0 inputLineNum=19 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>depth2 containsMeta isMeta
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #10 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L19     </span> "#~2 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=20 idxString=19 inputLineNum=19 numChildren=0 startMainStr=1 stopMainStr=4 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>depth2 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #11 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L19     </span> "## This second 'metaLine' is kind of a sub-…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=11 idParent=20 idxString=19 inputLineNum=19 numChildren=0 startMainStr=5 stopMainStr=54 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L20     </span> "## of the first 'metaLine' above and theref…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=21 idParent=5 idxString=20 inputLineNum=20 numChildren=0 startMainStr=1 stopMainStr=49 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #22    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L21     </span> "## inherits its 'metaStatement's. More late…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=22 idParent=5 idxString=21 inputLineNum=21 numChildren=0 startMainStr=1 stopMainStr=45 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L22–L24 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=1 idxString=0 inputLineNum=22 numChildren=3 startMainStr=22 stopMainStr=24 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #23    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L22     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=23 idParent=6 idxString=0 inputLineNum=22 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #12 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L22     </span> "c = 3 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=12 idParent=23 idxString=22 inputLineNum=22 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #13 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L22     </span> "## This 'Line' of 'Code' IS attached"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=13 idParent=23 idxString=22 inputLineNum=22 numChildren=0 startMainStr=7 stopMainStr=42 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L23     </span> "## to the 'metaBlock' of "#~2" (no empty li…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=24 idParent=6 idxString=23 inputLineNum=23 numChildren=0 startMainStr=1 stopMainStr=55 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #25    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L24     </span> "## which in turn inherits from the first 'm…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=25 idParent=6 idxString=24 inputLineNum=24 numChildren=0 startMainStr=1 stopMainStr=53 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L25–L27 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=1 idxString=0 inputLineNum=25 numChildren=3 startMainStr=25 stopMainStr=27 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L25     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=26 idParent=7 idxString=0 inputLineNum=25 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #27    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L26     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=27 idParent=7 idxString=0 inputLineNum=26 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 containsMeta isMeta
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #14 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L26     </span> "#~ discard "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=14 idParent=27 idxString=26 inputLineNum=26 numChildren=0 startMainStr=1 stopMainStr=11 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #15 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L26     </span> "## 'discard', Visib's second value: the att…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=15 idParent=27 idxString=26 inputLineNum=26 numChildren=0 startMainStr=12 stopMainStr=72 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #28    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L27     </span> "## LEAVES the rendered copy - not even as a…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=28 idParent=7 idxString=27 inputLineNum=27 numChildren=0 startMainStr=1 stopMainStr=74 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L28     </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=1 idxString=0 inputLineNum=28 numChildren=1 startMainStr=28 stopMainStr=28 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #29    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L28     </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=29 idParent=8 idxString=0 inputLineNum=28 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #16 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L28     </span> "d = 4 "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=16 idParent=29 idxString=28 inputLineNum=28 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #17 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L28     </span> "## This 'Line' of 'Code' gets DISCARDED."
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=17 idParent=29 idxString=28 inputLineNum=28 numChildren=0 startMainStr=7 stopMainStr=46 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L29–L30 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=1 idxString=0 inputLineNum=29 numChildren=2 startMainStr=29 stopMainStr=30 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #30    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L29     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=30 idParent=9 idxString=0 inputLineNum=29 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #31    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L30     </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=31 idParent=9 idxString=0 inputLineNum=30 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>depth1 containsMeta isMeta
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #18 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L30     </span> "#~ show "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=18 idParent=31 idxString=30 inputLineNum=30 numChildren=0 startMainStr=1 stopMainStr=8 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #19 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L30     </span> "## 'show', Visib's third value, is the DEFA…"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=19 idParent=31 idxString=30 inputLineNum=30 numChildren=0 startMainStr=9 stopMainStr=68 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L31     </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=1 idxString=0 inputLineNum=31 numChildren=1 startMainStr=31 stopMainStr=31 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsText isText
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #32    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L31     </span> "# This 'Line' of 'Text' is attached and sta…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=32 idParent=10 idxString=31 inputLineNum=31 numChildren=0 startMainStr=1 stopMainStr=55 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsText isText
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #11   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L32–L36 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=11 idParent=1 idxString=0 inputLineNum=32 numChildren=5 startMainStr=32 stopMainStr=36 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode containsMeta isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #33    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L32     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=33 idParent=11 idxString=0 inputLineNum=32 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #34    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L33     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=34 idParent=11 idxString=0 inputLineNum=33 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>containsCode containsMeta isCode
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #20 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L33     </span> "e = 5 "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=20 idParent=34 idxString=33 inputLineNum=33 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #21 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L33     </span> "#~ hide"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=21 idParent=34 idxString=33 inputLineNum=33 numChildren=0 startMainStr=7 stopMainStr=13 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #35    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L34     </span> "## The 'Line' above ENDS in a 'metaSegment'…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=35 idParent=11 idxString=34 inputLineNum=34 numChildren=0 startMainStr=1 stopMainStr=70 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #36    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L35     </span> "## It applies to that one 'Line' only - so …"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=36 idParent=11 idxString=35 inputLineNum=35 numChildren=0 startMainStr=1 stopMainStr=63 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #37    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L36     </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=37 idParent=11 idxString=0 inputLineNum=36 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>containsCode isCode
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #22 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L36     </span> "f = 6 "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=22 idParent=37 idxString=36 inputLineNum=36 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #23 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L36     </span> "## This 'Line' of 'Code', in the same 'Bloc…"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=23 idParent=37 idxString=36 inputLineNum=36 numChildren=0 startMainStr=7 stopMainStr=67 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #12   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L37–L40 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=12 idParent=1 idxString=0 inputLineNum=37 numChildren=4 startMainStr=37 stopMainStr=40 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #38    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L37     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=38 idParent=12 idxString=0 inputLineNum=37 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #39    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L38     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=39 idParent=12 idxString=0 inputLineNum=38 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 containsMeta isMeta
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #24 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L38     </span> "#~ hide{ isCode } "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=24 idParent=39 idxString=38 inputLineNum=38 numChildren=0 startMainStr=1 stopMainStr=18 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #25 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L38     </span> "## A CONDITION: 'hide' applies only where i…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=25 idParent=39 idxString=38 inputLineNum=38 numChildren=0 startMainStr=19 stopMainStr=69 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #40    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L39     </span> "## 'isCode', a BLS key word, asks each atta…"
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=40 idParent=12 idxString=39 inputLineNum=39 numChildren=0 startMainStr=1 stopMainStr=74 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #41    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L40     </span> "## This 'metaBlock' itself is 'Meta', not '…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=41 idParent=12 idxString=40 inputLineNum=40 numChildren=0 startMainStr=1 stopMainStr=68 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #13   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L41     </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=13 idParent=1 idxString=0 inputLineNum=41 numChildren=1 startMainStr=41 stopMainStr=41 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsText isText
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #42    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L41     </span> "# This 'Line' of 'Text' is attached, but 'i…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=42 idParent=13 idxString=41 inputLineNum=41 numChildren=0 startMainStr=1 stopMainStr=66 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsText isText
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #14   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L42     </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=14 idParent=1 idxString=0 inputLineNum=42 numChildren=1 startMainStr=42 stopMainStr=42 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #43    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L42     </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=43 idParent=14 idxString=0 inputLineNum=42 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #26 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L42     </span> "g = 7 "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=26 idParent=43 idxString=42 inputLineNum=42 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #27 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L42     </span> "## This 'Line' of 'Code' follows directly: …"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=27 idParent=43 idxString=42 inputLineNum=42 numChildren=0 startMainStr=7 stopMainStr=73 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #15   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L43–L48 </span>
<span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=15 idParent=1 idxString=0 inputLineNum=43 numChildren=6 startMainStr=43 stopMainStr=48 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">Bool   </span>containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #44    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L43     </span> ""
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=44 idParent=15 idxString=0 inputLineNum=43 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #45    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L44     </span> "md""""
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=45 idParent=15 idxString=44 inputLineNum=44 numChildren=0 startMainStr=1 stopMainStr=5 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #46    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L45     </span> "This is a 'Block' of markdown text - 'Text'…"
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=46 idParent=15 idxString=45 inputLineNum=45 numChildren=0 startMainStr=1 stopMainStr=63 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #47    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L46     </span> "The empty line above starts it, so it is NO…"
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=47 idParent=15 idxString=46 inputLineNum=46 numChildren=0 startMainStr=1 stopMainStr=66 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #48    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L47     </span> "nothing applies, and where nothing applies …"
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=48 idParent=15 idxString=47 inputLineNum=47 numChildren=0 startMainStr=1 stopMainStr=63 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #49    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L48     </span> """""
<span class="gm-dt-gutter">         </span><span class="gm-dt-gutter">Int64  </span>idComponent=49 idParent=15 idxString=48 inputLineNum=48 numChildren=0 startMainStr=1 stopMainStr=3 idExtension=0 idExtended=0
<span class="gm-dt-gutter">         </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile containsText isText
</pre>
```

:::

::: details The rendered copy of rung 4 — what the basic renderer writes from the run

```
# This first line is 'Text'. ## This is a 'comment' of 'Text'.
# Line 1 above consists of two BLS 'Segment' Components.
# Both of flavor: 'Text'. The '##' starts a 'comment'.
# BLS [Block, Line, Segment] Components can currently be of
# 3 different flavors: 'Code', 'Meta' and 'Text'.
# Each of which can be turned into a flavored comment by '##'.

## #~ hide ## This is a first 'metaLine' (incl. this comment).
## The 'Line' above consists of two BLS 'Segment's.
## 'hide' is one of Visib's three values: hidden lines STAY
## in the rendered copy, commented out.

a = 1 ## This is a first 'Line' of 'Code'.
b = 2 ## These two lines of 'Code' form a 'Block' of 'Code'.
## The empty line 12 starts this 'Block' and DETACHES it from the metaLine:
## it is NOT attached to any 'metaComponent'
## and therefore unaffected by metadata.

## #~2 ## This second 'metaLine' is kind of a sub-section
## of the first 'metaLine' above and therefore it
## inherits its 'metaStatement's. More later.
## c = 3 ## This 'Line' of 'Code' IS attached
## to the 'metaBlock' of "#~2" (no empty line between),
## which in turn inherits from the first 'metaBlock'.

#~ show ## 'show', Visib's third value, is the DEFAULT; stated here:
# This 'Line' of 'Text' is attached and stays as it is.

## e = 5 ## #~ hide
## The 'Line' above ENDS in a 'metaSegment': a '#~' after its content.
## It applies to that one 'Line' only - so 'e = 5' gets hidden.
f = 6 ## This 'Line' of 'Code', in the same 'Block', is NOT hidden.

#~ hide{ isCode } ## A CONDITION: 'hide' applies only where it holds.
## 'isCode', a BLS key word, asks each attached Component: are you 'Code'?
## This 'metaBlock' itself is 'Meta', not 'Code': it stays as it is.
# This 'Line' of 'Text' is attached, but 'isCode' fails: it stays.
## g = 7 ## This 'Line' of 'Code' follows directly: 'isCode' holds - hidden.

md"""
This is a 'Block' of markdown text - 'Text' too, without a '#'.
The empty line above starts it, so it is NOT attached to metadata:
nothing applies, and where nothing applies the value is 'show'.
"""
```

:::

The view, for the three Components the new metaBlock reaches: `hide` on the `g = 7` Block only; the Text Block bare although attached; the conditioned metaBlock itself bare, because `isCode` is false for a Meta Component — a metaBlock carries the value it states where its condition holds for it. Nine rows in all, one more than rung 3. The rendered copy: the conditioned metaLine and the Text Line as they are, `g = 7` behind `## `. The BLS key words are the `Bool` entries the Component-tree view prints for every Component: `isText` on the Text Block, `isCode` on the Code Block, `isMeta` on the metaBlock.

## Rung 5 — the meta hierarchy: the depths

A station, a new short file. "For the purpose of inheritance, a hierarchy of blocks of metadata can be defined by appending additional ~s to the head of a metablock's first metaline or, alternatively, adding there a digit representing the desired depth within the metahierarchy" — the [JuliaCon 2026 proposal](https://pretalx.com/juliacon-2026/talk/XYMFMZ/): `#~` is depth 1, `#~2` or `#~~` depth 2, `#~3` or `#~~~` depth 3, and `#~0` is the file level, the shallowest [depth](../reference/syntax-and-semantics.md#depth,-the-meta-hierarchy), above depth 1. A Component carries the statements of the metaBlock it is attached to and of every shallower metaBlock that one nests under; where two Visib statements reach it, the closer applicable one wins — labels, by contrast, accumulate. A metaBlock at the same or a shallower depth ends the reach of the open metaBlocks at its depth and below: a second `#~` is a sibling of the first and inherits from the file level alone, not from its sibling and not from the depth-3 metaBlock between them. The view prints the value that wins; a statement that reaches a Component and is overruled leaves no row. The second Intro-Tour file, [rung 6](#Rung-6-—-a-label-applied-and-read;-the-Heading-values-beside-it), opens with a condition at the file level: `#~0 hide{ :label🍒 && isText }`. Every content Block in this file is attached to a metaBlock.

```gometa ln
#~0 hide ## Depth 0, the FILE level: every 'metaBlock' below inherits it.

#~ show ## Depth 1 ('#~') nests under depth 0; its 'show' OVERRULES 'hide'.
a = 1 ## This 'Line' of 'Code' is attached to depth 1: shown.

#~2 ## Depth 2 nests under the open depth 1 and inherits its 'show'.
# This 'Line' of 'Text' is attached to depth 2: shown, by depth 1's 'show'.

#~3 discard ## Depth 3 ('#~3'): its own 'discard' is closest - it wins.
b = 2 ## Attached to depth 3: DISCARDED - the 'metaBlock' above with it.

#~ ## A second depth-1 'metaBlock' is a SIBLING of the first:
## it inherits from depth 0 only - not from its sibling, not from depth 3.
c = 3 ## This 'Line' of 'Code' is attached to the sibling: hidden.
```

::: details The full delivery view of rung 5 — every Block and Line with its evaluated values, as the development tools print it

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-05_hierarchy.jl</span><span class="gm-dt-gutter">  —  9 evals rows on 9 cells  (of 9 Blocks · 14 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #2  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1      </span> "#~0 hide ## Depth 0, the FILE level: …"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,2)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1      </span> "#~0 hide ## Depth 0, the FILE level: …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2–L3   </span> "#~ show ## Depth 1 ('#~') nests under…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L3      </span> "#~ show ## Depth 1 ('#~') nests under…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L4      </span> "a = 1 ## This 'Line' of 'Code' is att…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L4      </span> "a = 1 ## This 'Line' of 'Code' is att…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L5–L6   </span> "#~2 ## Depth 2 nests under the open d…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L5      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L6      </span> "#~2 ## Depth 2 nests under the open d…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L7      </span> "# This 'Line' of 'Text' is attached t…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-good gm-dt-bold">:show   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,6)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L7      </span> "# This 'Line' of 'Text' is attached t…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8–L9   </span> "#~3 discard ## Depth 3 ('#~3'): its o…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L8      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L9      </span> "#~3 discard ## Depth 3 ('#~3'): its o…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10     </span> "b = 2 ## Attached to depth 3: DISCARD…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-bad gm-dt-bold">:discard</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L10     </span> "b = 2 ## Attached to depth 3: DISCARD…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L11–L13 </span> "#~ ## A second depth-1 'metaBlock' is…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,9)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L11     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L12     </span> "#~ ## A second depth-1 'metaBlock' is…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L13     </span> "## it inherits from depth 0 only - no…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "c = 3 ## This 'Line' of 'Code' is att…"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,10)]
</span><span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L14     </span> "c = 3 ## This 'Line' of 'Code' is att…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

:::

::: details The Component-tree view of rung 5 — every Block, Line and Segment with the facts BLS recorded about it (the `Bool` row) and its numbers (the `Int64` row)

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-05_hierarchy.jl</span><span class="gm-dt-gutter">  —  9 Blocks · 14 Lines · 16 Segments
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #2    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L1      </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=1 idxString=0 inputLineNum=1 numChildren=1 startMainStr=1 stopMainStr=1 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth0 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #2     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L1      </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=2 idxString=0 inputLineNum=1 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>depth0 containsMeta isMeta
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #2  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L1      </span> "#~0 hide "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=2 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=1 stopMainStr=9 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>depth0 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L1      </span> "## Depth 0, the FILE level: every 'metaBloc…"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=10 stopMainStr=73 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L2–L3   </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=1 idxString=0 inputLineNum=2 numChildren=2 startMainStr=2 stopMainStr=3 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #3     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L2      </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=3 idParent=3 idxString=0 inputLineNum=2 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #4     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L3      </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=3 idxString=0 inputLineNum=3 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>depth1 containsMeta isMeta
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #4  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L3      </span> "#~ show "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=4 idxString=3 inputLineNum=3 numChildren=0 startMainStr=1 stopMainStr=8 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L3      </span> "## Depth 1 ('#~') nests under depth 0; its …"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=4 idxString=3 inputLineNum=3 numChildren=0 startMainStr=9 stopMainStr=75 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L4      </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=4 idParent=1 idxString=0 inputLineNum=4 numChildren=1 startMainStr=4 stopMainStr=4 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #5     </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L4      </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=4 idxString=0 inputLineNum=4 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #6  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L4      </span> "a = 1 "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=5 idxString=4 inputLineNum=4 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #7  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L4      </span> "## This 'Line' of 'Code' is attached to dep…"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=5 idxString=4 inputLineNum=4 numChildren=0 startMainStr=7 stopMainStr=61 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L5–L6   </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=5 idParent=1 idxString=0 inputLineNum=5 numChildren=2 startMainStr=5 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth2 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L5      </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=5 idxString=0 inputLineNum=5 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #7     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L6      </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=5 idxString=0 inputLineNum=6 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>depth2 containsMeta isMeta
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #8  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L6      </span> "#~2 "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=7 idxString=6 inputLineNum=6 numChildren=0 startMainStr=1 stopMainStr=4 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>depth2 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #9  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L6      </span> "## Depth 2 nests under the open depth 1 and…"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=7 idxString=6 inputLineNum=6 numChildren=0 startMainStr=5 stopMainStr=68 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #6    </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L7      </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=6 idParent=1 idxString=0 inputLineNum=7 numChildren=1 startMainStr=7 stopMainStr=7 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsText isText
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #8     </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter">  L7      </span> "# This 'Line' of 'Text' is attached to dept…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=6 idxString=7 inputLineNum=7 numChildren=0 startMainStr=1 stopMainStr=75 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsText isText
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8–L9   </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=7 idParent=1 idxString=0 inputLineNum=8 numChildren=2 startMainStr=8 stopMainStr=9 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth3 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9     </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L8      </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=7 idxString=0 inputLineNum=8 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #10    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L9      </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=7 idxString=0 inputLineNum=9 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>depth3 containsMeta isMeta
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #10 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L9      </span> "#~3 discard "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=10 idxString=9 inputLineNum=9 numChildren=0 startMainStr=1 stopMainStr=12 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>depth3 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #11 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L9      </span> "## Depth 3 ('#~3'): its own 'discard' is cl…"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=11 idParent=10 idxString=9 inputLineNum=9 numChildren=0 startMainStr=13 stopMainStr=71 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L10     </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=8 idParent=1 idxString=0 inputLineNum=10 numChildren=1 startMainStr=10 stopMainStr=10 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #11    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L10     </span>
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=11 idParent=8 idxString=0 inputLineNum=10 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">│     ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #12 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L10     </span> "b = 2 "
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=12 idParent=11 idxString=10 inputLineNum=10 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│     │     </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsCode isCode
<span class="gm-dt-gutter">│     └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #13 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L10     </span> "## Attached to depth 3: DISCARDED - the 'me…"
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Int64  </span>idComponent=13 idParent=11 idxString=10 inputLineNum=10 numChildren=0 startMainStr=7 stopMainStr=72 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│           </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #9    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L11–L13 </span>
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=9 idParent=1 idxString=0 inputLineNum=11 numChildren=3 startMainStr=11 stopMainStr=13 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 attachedToMeta containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L11     </span> ""
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=12 idParent=9 idxString=0 inputLineNum=11 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │     </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile isEmpty containsMeta isMeta
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L12     </span>
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=13 idParent=9 idxString=0 inputLineNum=12 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │  </span><span class="gm-dt-gutter">Bool   </span>depth1 containsMeta isMeta
<span class="gm-dt-gutter">│  │  ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #14 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L12     </span> "#~ "
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=14 idParent=13 idxString=12 inputLineNum=12 numChildren=0 startMainStr=1 stopMainStr=3 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │  │     </span><span class="gm-dt-gutter">Bool   </span>depth1 includeInOutFile containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  │  └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #15 </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L12     </span> "## A second depth-1 'metaBlock' is a SIBLIN…"
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Int64  </span>idComponent=15 idParent=13 idxString=12 inputLineNum=12 numChildren=0 startMainStr=4 stopMainStr=61 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│  │        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #14    </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter">  L13     </span> "## it inherits from depth 0 only - not from…"
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Int64  </span>idComponent=14 idParent=9 idxString=13 inputLineNum=13 numChildren=0 startMainStr=1 stopMainStr=74 idExtension=0 idExtended=0
<span class="gm-dt-gutter">│        </span><span class="gm-dt-gutter">Bool   </span>ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr
<span class="gm-dt-empty"></span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #10   </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span>
<span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=10 idParent=1 idxString=0 inputLineNum=14 numChildren=1 startMainStr=14 stopMainStr=14 idExtension=0 idExtended=0
<span class="gm-dt-gutter">   │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #15    </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span>
<span class="gm-dt-gutter">      │  </span><span class="gm-dt-gutter">Int64  </span>idComponent=15 idParent=10 idxString=0 inputLineNum=14 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0
<span class="gm-dt-gutter">      │  </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta containsCode isCode
<span class="gm-dt-gutter">      ├─ </span><span class="gm-dt-tree gm-dt-segment">Segment #16 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span> "c = 3 "
<span class="gm-dt-gutter">      │     </span><span class="gm-dt-gutter">Int64  </span>idComponent=16 idParent=15 idxString=14 inputLineNum=14 numChildren=0 startMainStr=1 stopMainStr=6 idExtension=0 idExtended=0
<span class="gm-dt-gutter">      │     </span><span class="gm-dt-gutter">Bool   </span>attachedToMeta includeInOutFile containsCode isCode
<span class="gm-dt-gutter">      └─ </span><span class="gm-dt-tree gm-dt-segment">Segment #17 </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter">  L14     </span> "## This 'Line' of 'Code' is attached to the…"
<span class="gm-dt-gutter">            </span><span class="gm-dt-gutter">Int64  </span>idComponent=17 idParent=15 idxString=14 inputLineNum=14 numChildren=0 startMainStr=7 stopMainStr=66 idExtension=0 idExtended=0
<span class="gm-dt-gutter">            </span><span class="gm-dt-gutter">Bool   </span>includeInOutFile comment containsCode isCode
</pre>
```

:::

::: details The rendered copy of rung 5 — what the basic renderer writes from the run

```
## #~0 hide ## Depth 0, the FILE level: every 'metaBlock' below inherits it.

#~ show ## Depth 1 ('#~') nests under depth 0; its 'show' OVERRULES 'hide'.
a = 1 ## This 'Line' of 'Code' is attached to depth 1: shown.

#~2 ## Depth 2 nests under the open depth 1 and inherits its 'show'.
# This 'Line' of 'Text' is attached to depth 2: shown, by depth 1's 'show'.

## #~ ## A second depth-1 'metaBlock' is a SIBLING of the first:
## it inherits from depth 0 only - not from its sibling, not from depth 3.
## c = 3 ## This 'Line' of 'Code' is attached to the sibling: hidden.
```

:::

In the full delivery view nine Blocks carry nine rows: the file level `hide`; depth 1 and `a = 1` `show`; the bare `#~2` metaBlock and its attached Text Block carry a `show` row of their own — an inherited stated value; where only the default applies the view prints no row, it prints "(no evals — defaults apply)"; depth 3 and `b = 2` `discard`; the bare sibling and `c = 3` `hide`, which only the file level can have given them. The Component-tree view prints `depth0` to `depth3` on the five metaBlocks — `depth1` twice, on the first `#~` and on its sibling. In the rendered copy the file-level metaLine itself stands behind `## `, hidden by its own `hide`, the depth-3 Block is gone with its metaLine, and the sibling and `c = 3` stand behind `## `.

## Rung 6 — a label applied and read; the Heading values beside it

A station: the second of the two Intro-Tour files of GoMeta's early demos, its label a pictograph. A [label](../reference/syntax-and-semantics.md#label) is applied with the colon: `:label🍒` applies the name `label🍒` — a name GoMeta ships with, so the run reports nothing — to the metaBlock that states it and to the Block attached to it, and the view records it as `label_label🍒 => true` at each Component it applies to; "applies here" in the file's comments means that row. The second `#~` metaBlock is a sibling of the first ([rung 5](#Rung-5-—-the-meta-hierarchy:-the-depths)) and carries no label: its Block in the view has a heading row and no label row — the sibling rule again, now by a label's absence; labels accumulate, so a missing row is direct evidence. The file-level condition `hide{ :label🍒 && isText }` is evaluated for every Component it reaches when the Engine applies the statement, so it reads a label applied on a later line, and both halves must hold: it takes the first markdown Block alone. The same construction opens the Documenter example of the [JuliaCon 2026 talk](https://gometa.dev/talk/), `#~0 hide{ :🍻 }` over a later `#~2 :🍻` (the talk's label a bare pictograph, from before the shipped vocabulary).

A quoted text first on a metaLine is a value of the Heading Alterant; the view records it as `head_1` — the 1 its depth. A heading is applied to the metaBlock that states it and to no other Block, where the label reaches the attached Block as well — how far a value reaches is each Alterant's own. Every content Block in this file is attached.

```gometa ln scroll=16
#~0 hide{ :label🍒 && isText }
## The '#~0' above starts a metaLine on file level.

#~ "1. What is an 'Alterant'?" :label🍒
md"""
The 'metaLine' to which this markdown text is attached
contains two Alterant values:

- "1. What is an 'Alterant'?" - A value of the 'Heading' Alterant.
- :label🍒 - A value of the 'Labels' Alterant.

'Alterant's are to 'GoMeta' roughly what 'Type's are to 'Julia':
- They define what data type their instances can hold.
- They have constructors (kind of).
- One difference: They DO contain their own methods.
"""

#~ "2. When and How does an Alterant get applied?"
md"""
This 'Block' of 'Text' is also attached to a metaComponent.
However, 'hide' does NOT apply to it, since the condition
{ :label🍒 && isText } from line 1 above does
NOT evaluate to 'true' here because 'label🍒' does NOT apply here.
"""

#~ "3. Why is this Code line NOT hidden?" :label🍒
x = 1 ## This 'Line' of 'Code' carries ':label🍒' too, BUT it is
## 'Code', not 'Text' - so { :label🍒 && isText } fails here
## and the 'hide' from line 1 spares it. Both halves must hold.
```

::: details The full delivery view of rung 6 — every Block and Line with its evaluated values, as the development tools print it

```@raw html
<pre class="gm-dt" tabindex="0" v-pre><span class="gm-dt-bold">File  </span><span class="gm-dt-bold">rung-06_labels.jl</span><span class="gm-dt-gutter">  —  8 evals rows on 5 cells  (of 7 Blocks · 29 Lines)
</span><span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #2  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1–L2   </span> "#~0 hide{ :label🍒 &amp;&amp; isText }⏎## The…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #2   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L1      </span> "#~0 hide{ :label🍒 &amp;&amp; isText }"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #3   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L2      </span> "## The '#~0' above starts a metaLine …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #3  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L3–L4   </span> "#~ "1. What is an 'Alterant'?" :label…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">head_1      </span> =&gt; <span class="gm-dt-neutral gm-dt-bold">"1. What is an 'Alterant'?"</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,3)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #4   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L3      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #5   </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L4      </span> "#~ "1. What is an 'Alterant'?" :label…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #4  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5–L16  </span> "md"""⏎The 'metaLine' to which this ma…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">visib       </span> =&gt; <span class="gm-dt-neutral gm-dt-warn gm-dt-bold">:hide   </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,4)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #6   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L5      </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #7   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L6      </span> "The 'metaLine' to which this markdown…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #8   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L7      </span> "contains two Alterant values:"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #9   </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L8      </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #10  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L9      </span> "- "1. What is an 'Alterant'?" - A val…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #11  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L10     </span> "- :label🍒 - A value of the 'Labels' …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #12  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L11     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #13  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L12     </span> "'Alterant's are to 'GoMeta' roughly w…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #14  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L13     </span> "- They define what data type their in…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #15  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L14     </span> "- They have constructors (kind of)."<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #16  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L15     </span> "- One difference: They DO contain the…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #17  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L16     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #5  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L17–L18 </span> "#~ "2. When and How does an Alterant …"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">head_1      </span> =&gt; <span class="gm-dt-neutral gm-dt-bold">"2. When and How does an Alterant get applied?"</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,5)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #18  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L17     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #19  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L18     </span> "#~ "2. When and How does an Alterant …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block">Block #6  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L19–L24 </span> "md"""⏎This 'Block' of 'Text' is also …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #20  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L19     </span> "md""""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #21  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L20     </span> "This 'Block' of 'Text' is also attach…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #22  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L21     </span> "However, 'hide' does NOT apply to it,…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #23  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L22     </span> "{ :label🍒 &amp;&amp; isText } from line 1 ab…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #24  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L23     </span> "NOT evaluate to 'true' here because '…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #25  </span><span class="gm-dt-text">Text </span><span class="gm-dt-gutter"> L24     </span> """""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">├─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #7  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25–L26 </span> "#~ "3. Why is this Code line NOT hidd…"
<span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">head_1      </span> =&gt; <span class="gm-dt-neutral gm-dt-bold">"3. Why is this Code line NOT hidden?"</span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">│      handle ns=:default  grain=Block  path=[(direct,1) (direct,7)]
</span><span class="gm-dt-gutter">│  ├─ </span><span class="gm-dt-tree gm-dt-line">Line #26  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L25     </span> ""<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">│  └─ </span><span class="gm-dt-tree gm-dt-line">Line #27  </span><span class="gm-dt-marker">Meta </span><span class="gm-dt-gutter"> L26     </span> "#~ "3. Why is this Code line NOT hidd…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">└─ </span><span class="gm-dt-tree gm-dt-block gm-dt-bold">Block #8  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L27–L29 </span> "x = 1 ## This 'Line' of 'Code' carrie…"
<span class="gm-dt-gutter">   </span><span class="gm-dt-gutter">● </span><span class="gm-dt-payload gm-dt-bold">label_label🍒</span> =&gt; <span class="gm-dt-neutral gm-dt-bold">true    </span><span class="gm-dt-gutter">  (+)</span>
<span class="gm-dt-gutter">       handle ns=:default  grain=Block  path=[(direct,1) (direct,8)]
</span><span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #28  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L27     </span> "x = 1 ## This 'Line' of 'Code' carrie…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   ├─ </span><span class="gm-dt-tree gm-dt-line">Line #29  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L28     </span> "## 'Code', not 'Text' - so { :label🍒…"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">   └─ </span><span class="gm-dt-tree gm-dt-line">Line #30  </span><span class="gm-dt-code">Code </span><span class="gm-dt-gutter"> L29     </span> "## and the 'hide' from line 1 spares …"<span class="gm-dt-gutter gm-dt-italic">   (no evals — defaults apply)</span>
<span class="gm-dt-gutter">── the run: status PROCESS_OK · no diagnostics
</span></pre>
```

:::

::: details The rendered copy of rung 6 — what the basic renderer writes from the run

```
#~0 hide{ :label🍒 && isText }
## The '#~0' above starts a metaLine on file level.

#~ "1. What is an 'Alterant'?" :label🍒
## md"""
## The 'metaLine' to which this markdown text is attached
## contains two Alterant values:

## - "1. What is an 'Alterant'?" - A value of the 'Heading' Alterant.
## - :label🍒 - A value of the 'Labels' Alterant.

## 'Alterant's are to 'GoMeta' roughly what 'Type's are to 'Julia':
## - They define what data type their instances can hold.
## - They have constructors (kind of).
## - One difference: They DO contain their own methods.
## """

#~ "2. When and How does an Alterant get applied?"
md"""
This 'Block' of 'Text' is also attached to a metaComponent.
However, 'hide' does NOT apply to it, since the condition
{ :label🍒 && isText } from line 1 above does
NOT evaluate to 'true' here because 'label🍒' does NOT apply here.
"""

#~ "3. Why is this Code line NOT hidden?" :label🍒
x = 1 ## This 'Line' of 'Code' carries ':label🍒' too, BUT it is
## 'Code', not 'Text' - so { :label🍒 && isText } fails here
## and the 'hide' from line 1 spares it. Both halves must hold.
```

:::

Eight rows on five cells: two Alterants on each of the two `#~` metaBlocks that state the label (`head_1` and `label_label🍒` on the first and the third), `hide` on the first markdown Block alone, "(no evals — defaults apply)" on the attached second markdown Block and on the file-level metaBlock — a metaBlock carries the value it states where its condition holds for it, and this one is Meta, not Text. The Code Block carries the label but is not Text; the two metaBlocks that state the label carry it but are Meta. In the rendered copy the first markdown Block stands behind `## ` with its two empty lines left empty, the file-level metaLine stands as it is — where rung 5's stood behind `## ` — and everything else as it is. The run's line reads "no diagnostics": `label🍒` is a name GoMeta ships with.

From here: [The committed files](index.md) — the package's example pairs, two of them the law of the notation; [Syntax & semantics](../reference/syntax-and-semantics.md) for every rule the rungs used; [Getting started](../tutorials/getting-started.md) for the run itself.
