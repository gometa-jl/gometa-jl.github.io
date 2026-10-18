import{_ as s,o as e,c as a,an as t}from"./chunks/framework.CYOK54rb.js";const u=JSON.parse('{"title":"Development tools","description":"","frontmatter":{"u_version":"0.1"},"headers":[],"relativePath":"reference/development-tools.md","filePath":"reference/development-tools.md"}'),i={name:"reference/development-tools.md"};function p(l,n,o,d,r,h){return e(),a("div",null,[...n[0]||(n[0]=[t(`<h1 id="Development-tools" tabindex="-1">Development tools <a class="header-anchor" href="#Development-tools" aria-label="Permalink to &quot;Development tools {#Development-tools}&quot;">​</a></h1><p><span class="gm-name">GoMeta</span>&#39;s output is a set of evaluated values at the <a href="/reference/syntax-and-semantics#BLS,-Component,-Block,-Line,-Segment,-File">Components</a> of a file, not a file: as its author puts it, <em>&quot;the output of <span class="gm-name">GoMeta</span> is not readily directly observable. For that reason, a couple of tools and colorful printouts can serve to track and illustrate the internal process of the package&quot;</em>. This page is the reference for those tools at release <strong>0.4.0</strong> (alpha): the print tools, which show what a run produced, and the basic renderer, which writes a rendered copy of the file. They are not part of a <span class="gm-name">GoMeta</span> run: the <a href="/reference/syntax-and-semantics#the-GoMeta-Engine,-Extension"><span class="gm-name">GoMeta</span> Engine</a> uses none of them, a run gives the same delivery without them, and they change nothing in it. They read the delivery through the same public surface an <a href="/reference/syntax-and-semantics#the-GoMeta-Engine,-Extension">Extension</a> uses — the <a href="./public-api">Public API</a>. Their purpose, in the author&#39;s words — said of the tool that prints the evaluated values: <em>&quot;So I can see what has been evaluated for which Component.&quot;</em> — and of the printout of how BLS parsed a file, so that anyone <em>&quot;can SEE / CHECK / VERIFY how it was parsed in terms of BLS&quot;</em>.</p><h2 id="1.-The-print-tools" tabindex="-1">1. The print tools <a class="header-anchor" href="#1.-The-print-tools" aria-label="Permalink to &quot;1. The print tools {#1.-The-print-tools}&quot;">​</a></h2><p>From a shell, at the repository&#39;s root and after <code>Pkg.instantiate()</code> in its <code>tests</code> project, one call prints one view of one file:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light-high-contrast github-dark-dimmed vp-code" tabindex="0"><code><span class="line"><span>julia --startup-file=no --project=tests devtools/devtools.jl &lt;verb&gt; &lt;file&gt;</span></span></code></pre></div><table tabindex="0"><thead><tr><th style="text-align:right;">verb</th><th style="text-align:right;">prints</th></tr></thead><tbody><tr><td style="text-align:right;"><code>evals-tree</code></td><td style="text-align:right;">the full delivery view: every Block and Line of the <a href="/reference/syntax-and-semantics#BLS,-Component,-Block,-Line,-Segment,-File">BLS Component tree</a>, each with the <a href="/reference/syntax-and-semantics#altValue,-evals">evaluated values</a> recorded at it and every value&#39;s handle decoded; a Line that ends in a metaSegment — a <code class="gm-ml"><span class="gm-sg">#~</span></code> with or without a <a href="/reference/syntax-and-semantics#statement,-metaSegment">statement</a> after it — carries its values with that Segment named; a Component without a value of its own is marked so</td></tr><tr><td style="text-align:right;"><code>bls-tree</code></td><td style="text-align:right;">the Component-tree view: every Component with its <a href="/reference/syntax-and-semantics#settribute">settribute</a> and its named integers</td></tr><tr><td style="text-align:right;"><code>tree</code></td><td style="text-align:right;">the BLS Component tree printed one row per input line: each Component&#39;s <a href="/reference/syntax-and-semantics#flavor">flavor</a> and content, Blocks, Lines and Segments nested</td></tr><tr><td style="text-align:right;"><code>segments</code></td><td style="text-align:right;">the same rows with the input&#39;s line numbers in front</td></tr><tr><td style="text-align:right;"><code>evals</code></td><td style="text-align:right;">the evaluated values alone, one row per value</td></tr><tr><td style="text-align:right;"><code>trace</code></td><td style="text-align:right;">the evaluated values with each row&#39;s decoded <a href="./public-api">Component&#39;s handle</a></td></tr><tr><td style="text-align:right;"><code>render</code></td><td style="text-align:right;">the rendered copy of the file — the basic renderer&#39;s output (section 2)</td></tr><tr><td style="text-align:right;"><code>comparison</code></td><td style="text-align:right;">one line per Component and, for every Block, Line and Segment, one line per Alterant with its evaluated value and its source, sorted — a text form by which the deliveries of two versions or variants of <span class="gm-name">GoMeta</span> for one input are compared by their values</td></tr></tbody></table><p>The delivery views and the Component-tree view from Julia:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light-high-contrast github-dark-dimmed vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">using</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;"> GoMeta</span></span>
<span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">include</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">joinpath</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">pkgdir</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(GoMeta), </span><span style="--shiki-light:#032563;--shiki-dark:#96D0FF;">&quot;devtools&quot;</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">, </span><span style="--shiki-light:#032563;--shiki-dark:#96D0FF;">&quot;devtools.jl&quot;</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">))</span></span>
<span class="line"><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">delivery </span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">=</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;"> GoMeta</span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">.</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">goMeta</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">read</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#032563;--shiki-dark:#96D0FF;">&quot;some.jl&quot;</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">print_altValues_evals</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(delivery)                                            </span><span style="--shiki-light:#4B535D;--shiki-dark:#768390;"># the compact delivery view</span></span>
<span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">print_altValues_evals</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(delivery; include_empty </span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">=</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;"> true</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">, show_handles </span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">=</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;"> true</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">)   </span><span style="--shiki-light:#4B535D;--shiki-dark:#768390;"># the full delivery view</span></span>
<span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">print_BLS_Component_Tree</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(delivery)                                         </span><span style="--shiki-light:#4B535D;--shiki-dark:#768390;"># the Component-tree view</span></span>
<span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">write_altValues_evals_to_file</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#032563;--shiki-dark:#96D0FF;">&quot;evals.html&quot;</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">, delivery; include_empty </span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">=</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;"> true</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">)  </span><span style="--shiki-light:#4B535D;--shiki-dark:#768390;"># the same views as files (.html or .txt)</span></span>
<span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">write_BLS_Component_Tree_to_file</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#032563;--shiki-dark:#96D0FF;">&quot;tree.html&quot;</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">, delivery)</span></span></code></pre></div><p>The compact delivery view leaves out the Components that carry no value of their own and the handles. The full delivery view is the one to read first — it says what the Engine evaluated for which Component. The <a href="./../tutorials/getting-started">Getting started</a> page and the <a href="/reference/syntax-and-semantics#11.-The-examples">Syntax &amp; semantics</a> page embed it for the two example files; the two other views of the first example file follow here.</p><details class="details custom-block"><summary>The BLS Component tree of the first example file, printed one row per input line (the <code>tree</code> verb)</summary><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light-high-contrast github-dark-dimmed vp-code" tabindex="0"><code><span class="line"><span>{:B-Meta:L-Meta [{:S-Meta [#~ hide{ :label4 , isCode } ]}{:S-Meta [## This is a comment within a \`Block\` of meta.]}]}</span></span>
<span class="line"><span>{       :L-Meta [## The above \`Line\` of meta initiated this \`Block\` of meta.]}</span></span>
<span class="line"><span>{       :L-Meta [{:S-Meta [#~ :label1{ (isText &amp;&amp; containsMeta), isMeta } ]}{:S-Meta [## This meta \`Block\` ends here.]}]}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{:B-Text:L-Text [# This \`Line\` of text starts a new \`Block\` of text.]}</span></span>
<span class="line"><span>{       :L-Text [# This \`Block\` is NOT attached to metadata - it does NOT INHERIT metadata.]}</span></span>
<span class="line"><span>{       :L-Text [{:S-Text [# However, this \`Line\` will get discarded due to: ]}{:S-Meta [#~ discard]}]}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{:B-Meta:L-Meta [{:S-Meta [#~2 :label5 show{ !:label5} ]}{:S-Meta [## This is line 9. It is a one-line meta \`Block\`.]}]}</span></span>
<span class="line"><span>{:B-Code:L-Code [{:S-Code [using Plots ]}{:S-Code [## This \`Line\` starts a new \`Block\` of code.]}]}</span></span>
<span class="line"><span>{       :L-Code [## This code \`Block\` is ATTACHED to metadata - it inherits metadata from above.]}</span></span>
<span class="line"><span>{       :L-Code [## Therefore, this code \`Block\` receives label5.]}</span></span>
<span class="line"><span>{       :L-Code [## \`show\` from line 9 above does NOT get applied to this \`Block\`]}</span></span>
<span class="line"><span>{       :L-Code [##      as this can only happen]}</span></span>
<span class="line"><span>{       :L-Code [##      if label5 has NOT been applied. Note \`{!:label5}\` following \`show\`.]}</span></span>
<span class="line"><span>{       :L-Code [## This code \`Block\` inherits \`hide\` from line 1 above]}</span></span>
<span class="line"><span>{       :L-Code [##      since this is a code \`Block\` and due to: \`{isCode}\` following \`hide\`.]}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{       :L-Code [println(&quot;!!! NOTE !!! Only Code and Text \`Block\`s may contain empty lines.&quot;)]}</span></span>
<span class="line"><span>{       :L-Code [println(&quot;\\t Whereas an empty line after a meta \`Line\` starts a new \`Block\`.&quot;)]}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{:B-Meta:L-Meta [#~3 :label4 discard{:label3} :label3]}</span></span>
<span class="line"><span>{:B-Text:L-Text [# This \`Block\` of text receives label4]}</span></span>
<span class="line"><span>{       :L-Text [#       plus label5 from further above]}</span></span>
<span class="line"><span>{       :L-Text [#       plus label1 since it \`isText\` AND \`containsMeta\` [last statement].]}</span></span>
<span class="line"><span>{       :L-Text [# It is NOT &quot;discarded&quot; since label3 has not been applied yet]}</span></span>
<span class="line"><span>{       :L-Text [#       when \`discard{:label3}\` is issued.]}</span></span>
<span class="line"><span>{       :L-Text [# Only after that it receives label3.]}</span></span>
<span class="line"><span>{       :L-Text [# Instead, it gets hidden due to label4 and \`hide{:label4}\` on line 1.]}</span></span>
<span class="line"><span>{       :L-Text [{:S-Text [# This \`Line\`, however, will NOT get hidden. ]}{:S-Meta [#~ show]}]}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{:B-Meta:L-Meta [#~2 :label5]}</span></span>
<span class="line"><span>{:B-Text:L-Text [md&quot;&quot;&quot;]}</span></span>
<span class="line"><span>{       :L-Text [{:S-Text [This is a \`Block\` of markdown text. ]}{:S-Meta [#~ hide]}]}</span></span>
<span class="line"><span>{       :L-Text [&quot;&quot;&quot;]}</span></span></code></pre></div></details><details class="details custom-block"><summary>The Component-tree view of the first example file — every Component with its settribute and its named integers (the <code>bls-tree</code> verb)</summary><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light-high-contrast github-dark-dimmed vp-code" tabindex="0"><code><span class="line"><span>status: PROCESS_OK</span></span>
<span class="line"><span>File  file_for_Example_Proposal_JuliaCon.jl  —  8 Blocks · 35 Lines · 14 Segments</span></span>
<span class="line"><span>├─ Block #2    Meta   L1–L3   </span></span>
<span class="line"><span>│  │  Int64  idComponent=2 idParent=1 idxString=0 inputLineNum=1 numChildren=3 startMainStr=1 stopMainStr=3 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  Bool   depth1 attachedToMeta containsMeta isMeta</span></span>
<span class="line"><span>│  ├─ Line #2     Meta   L1      </span></span>
<span class="line"><span>│  │  │  Int64  idComponent=2 idParent=2 idxString=0 inputLineNum=1 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  │  Bool   depth1 containsMeta isMeta</span></span>
<span class="line"><span>│  │  ├─ Segment #2  Meta   L1       &quot;#~ hide{ :label4 , isCode } &quot;</span></span>
<span class="line"><span>│  │  │     Int64  idComponent=2 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=1 stopMainStr=28 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  │     Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span>│  │  └─ Segment #3  Meta   L1       &quot;## This is a comment within a \`Block\` of me…&quot;</span></span>
<span class="line"><span>│  │        Int64  idComponent=3 idParent=2 idxString=1 inputLineNum=1 numChildren=0 startMainStr=29 stopMainStr=74 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │        Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span>│  ├─ Line #3     Meta   L2       &quot;## The above \`Line\` of meta initiated this …&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=3 idParent=2 idxString=2 inputLineNum=2 numChildren=0 startMainStr=1 stopMainStr=59 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span>│  └─ Line #4     Meta   L3      </span></span>
<span class="line"><span>│     │  Int64  idComponent=4 idParent=2 idxString=0 inputLineNum=3 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │  Bool   depth1 containsMeta isMeta</span></span>
<span class="line"><span>│     ├─ Segment #4  Meta   L3       &quot;#~ :label1{ (isText &amp;&amp; containsMeta), isMet…&quot;</span></span>
<span class="line"><span>│     │     Int64  idComponent=4 idParent=4 idxString=3 inputLineNum=3 numChildren=0 startMainStr=1 stopMainStr=47 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │     Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span>│     └─ Segment #5  Meta   L3       &quot;## This meta \`Block\` ends here.&quot;</span></span>
<span class="line"><span>│           Int64  idComponent=5 idParent=4 idxString=3 inputLineNum=3 numChildren=0 startMainStr=48 stopMainStr=78 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│           Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>├─ Block #3    Text   L4–L7   </span></span>
<span class="line"><span>│  │  Int64  idComponent=3 idParent=1 idxString=0 inputLineNum=4 numChildren=4 startMainStr=4 stopMainStr=7 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  Bool   containsMeta containsText isText</span></span>
<span class="line"><span>│  ├─ Line #5     Text   L4       &quot;&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=5 idParent=3 idxString=0 inputLineNum=4 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile isEmpty containsText isText</span></span>
<span class="line"><span>│  ├─ Line #6     Text   L5       &quot;# This \`Line\` of text starts a new \`Block\` …&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=6 idParent=3 idxString=5 inputLineNum=5 numChildren=0 startMainStr=1 stopMainStr=51 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  ├─ Line #7     Text   L6       &quot;# This \`Block\` is NOT attached to metadata …&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=7 idParent=3 idxString=6 inputLineNum=6 numChildren=0 startMainStr=1 stopMainStr=74 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  └─ Line #8     Text   L7      </span></span>
<span class="line"><span>│     │  Int64  idComponent=8 idParent=3 idxString=0 inputLineNum=7 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │  Bool   containsMeta containsText isText</span></span>
<span class="line"><span>│     ├─ Segment #6  Text   L7       &quot;# However, this \`Line\` will get discarded d…&quot;</span></span>
<span class="line"><span>│     │     Int64  idComponent=6 idParent=8 idxString=7 inputLineNum=7 numChildren=0 startMainStr=1 stopMainStr=50 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│     └─ Segment #7  Meta   L7       &quot;#~ discard&quot;</span></span>
<span class="line"><span>│           Int64  idComponent=7 idParent=8 idxString=7 inputLineNum=7 numChildren=0 startMainStr=51 stopMainStr=60 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│           Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>├─ Block #4    Meta   L8–L9   </span></span>
<span class="line"><span>│  │  Int64  idComponent=4 idParent=1 idxString=0 inputLineNum=8 numChildren=2 startMainStr=8 stopMainStr=9 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  Bool   depth2 attachedToMeta containsMeta isMeta</span></span>
<span class="line"><span>│  ├─ Line #9     Meta   L8       &quot;&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=9 idParent=4 idxString=0 inputLineNum=8 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile isEmpty containsMeta isMeta</span></span>
<span class="line"><span>│  └─ Line #10    Meta   L9      </span></span>
<span class="line"><span>│     │  Int64  idComponent=10 idParent=4 idxString=0 inputLineNum=9 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │  Bool   depth2 containsMeta isMeta</span></span>
<span class="line"><span>│     ├─ Segment #8  Meta   L9       &quot;#~2 :label5 show{ !:label5} &quot;</span></span>
<span class="line"><span>│     │     Int64  idComponent=8 idParent=10 idxString=9 inputLineNum=9 numChildren=0 startMainStr=1 stopMainStr=28 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │     Bool   depth2 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span>│     └─ Segment #9  Meta   L9       &quot;## This is line 9. It is a one-line meta \`B…&quot;</span></span>
<span class="line"><span>│           Int64  idComponent=9 idParent=10 idxString=9 inputLineNum=9 numChildren=0 startMainStr=29 stopMainStr=77 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│           Bool   ignoreThisMeta includeInOutFile comment containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>├─ Block #5    Code   L10–L20 </span></span>
<span class="line"><span>│  │  Int64  idComponent=5 idParent=1 idxString=0 inputLineNum=10 numChildren=11 startMainStr=10 stopMainStr=20 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  Bool   attachedToMeta containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #11    Code   L10     </span></span>
<span class="line"><span>│  │  │  Int64  idComponent=11 idParent=5 idxString=0 inputLineNum=10 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  │  Bool   attachedToMeta containsCode isCode</span></span>
<span class="line"><span>│  │  ├─ Segment #10 Code   L10      &quot;using Plots &quot;</span></span>
<span class="line"><span>│  │  │     Int64  idComponent=10 idParent=11 idxString=10 inputLineNum=10 numChildren=0 startMainStr=1 stopMainStr=12 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  │     Bool   attachedToMeta includeInOutFile containsCode isCode</span></span>
<span class="line"><span>│  │  └─ Segment #11 Code   L10      &quot;## This \`Line\` starts a new \`Block\` of code…&quot;</span></span>
<span class="line"><span>│  │        Int64  idComponent=11 idParent=11 idxString=10 inputLineNum=10 numChildren=0 startMainStr=13 stopMainStr=56 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │        Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #12    Code   L11      &quot;## This code \`Block\` is ATTACHED to metadat…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=12 idParent=5 idxString=11 inputLineNum=11 numChildren=0 startMainStr=1 stopMainStr=79 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #13    Code   L12      &quot;## Therefore, this code \`Block\` receives la…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=13 idParent=5 idxString=12 inputLineNum=12 numChildren=0 startMainStr=1 stopMainStr=48 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #14    Code   L13      &quot;## \`show\` from line 9 above does NOT get ap…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=14 idParent=5 idxString=13 inputLineNum=13 numChildren=0 startMainStr=1 stopMainStr=64 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #15    Code   L14      &quot;##      as this can only happen&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=15 idParent=5 idxString=14 inputLineNum=14 numChildren=0 startMainStr=1 stopMainStr=31 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #16    Code   L15      &quot;##      if label5 has NOT been applied. Not…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=16 idParent=5 idxString=15 inputLineNum=15 numChildren=0 startMainStr=1 stopMainStr=75 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #17    Code   L16      &quot;## This code \`Block\` inherits \`hide\` from l…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=17 idParent=5 idxString=16 inputLineNum=16 numChildren=0 startMainStr=1 stopMainStr=54 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #18    Code   L17      &quot;##      since this is a code \`Block\` and du…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=18 idParent=5 idxString=17 inputLineNum=17 numChildren=0 startMainStr=1 stopMainStr=77 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile comment containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #19    Code   L18      &quot;&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=19 idParent=5 idxString=0 inputLineNum=18 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile isEmpty containsCode isCode</span></span>
<span class="line"><span>│  ├─ Line #20    Code   L19      &quot;println(&quot;!!! NOTE !!! Only Code and Text \`B…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=20 idParent=5 idxString=19 inputLineNum=19 numChildren=0 startMainStr=1 stopMainStr=76 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsCode isCode</span></span>
<span class="line"><span>│  └─ Line #21    Code   L20      &quot;println(&quot;\\t Whereas an empty line after a m…&quot;</span></span>
<span class="line"><span>│        Int64  idComponent=21 idParent=5 idxString=20 inputLineNum=20 numChildren=0 startMainStr=1 stopMainStr=77 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│        Bool   includeInOutFile containsCode isCode</span></span>
<span class="line"><span></span></span>
<span class="line"><span>├─ Block #6    Meta   L21–L22 </span></span>
<span class="line"><span>│  │  Int64  idComponent=6 idParent=1 idxString=0 inputLineNum=21 numChildren=2 startMainStr=21 stopMainStr=22 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  Bool   depth3 attachedToMeta containsMeta isMeta</span></span>
<span class="line"><span>│  ├─ Line #22    Meta   L21      &quot;&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=22 idParent=6 idxString=0 inputLineNum=21 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile isEmpty containsMeta isMeta</span></span>
<span class="line"><span>│  └─ Line #23    Meta   L22      &quot;#~3 :label4 discard{:label3} :label3&quot;</span></span>
<span class="line"><span>│        Int64  idComponent=23 idParent=6 idxString=22 inputLineNum=22 numChildren=0 startMainStr=1 stopMainStr=36 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│        Bool   depth3 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>├─ Block #7    Text   L23–L30 </span></span>
<span class="line"><span>│  │  Int64  idComponent=7 idParent=1 idxString=0 inputLineNum=23 numChildren=8 startMainStr=23 stopMainStr=30 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  Bool   attachedToMeta containsMeta containsText isText</span></span>
<span class="line"><span>│  ├─ Line #24    Text   L23      &quot;# This \`Block\` of text receives label4&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=24 idParent=7 idxString=23 inputLineNum=23 numChildren=0 startMainStr=1 stopMainStr=38 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   attachedToMeta includeInOutFile containsText isText</span></span>
<span class="line"><span>│  ├─ Line #25    Text   L24      &quot;#       plus label5 from further above&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=25 idParent=7 idxString=24 inputLineNum=24 numChildren=0 startMainStr=1 stopMainStr=38 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  ├─ Line #26    Text   L25      &quot;#       plus label1 since it \`isText\` AND \`…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=26 idParent=7 idxString=25 inputLineNum=25 numChildren=0 startMainStr=1 stopMainStr=74 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  ├─ Line #27    Text   L26      &quot;# It is NOT &quot;discarded&quot; since label3 has no…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=27 idParent=7 idxString=26 inputLineNum=26 numChildren=0 startMainStr=1 stopMainStr=61 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  ├─ Line #28    Text   L27      &quot;#       when \`discard{:label3}\` is issued.&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=28 idParent=7 idxString=27 inputLineNum=27 numChildren=0 startMainStr=1 stopMainStr=42 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  ├─ Line #29    Text   L28      &quot;# Only after that it receives label3.&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=29 idParent=7 idxString=28 inputLineNum=28 numChildren=0 startMainStr=1 stopMainStr=37 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  ├─ Line #30    Text   L29      &quot;# Instead, it gets hidden due to label4 and…&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=30 idParent=7 idxString=29 inputLineNum=29 numChildren=0 startMainStr=1 stopMainStr=70 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│  └─ Line #31    Text   L30     </span></span>
<span class="line"><span>│     │  Int64  idComponent=31 idParent=7 idxString=0 inputLineNum=30 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │  Bool   containsMeta containsText isText</span></span>
<span class="line"><span>│     ├─ Segment #12 Text   L30      &quot;# This \`Line\`, however, will NOT get hidden…&quot;</span></span>
<span class="line"><span>│     │     Int64  idComponent=12 idParent=31 idxString=30 inputLineNum=30 numChildren=0 startMainStr=1 stopMainStr=45 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│     │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>│     └─ Segment #13 Meta   L30      &quot;#~ show&quot;</span></span>
<span class="line"><span>│           Int64  idComponent=13 idParent=31 idxString=30 inputLineNum=30 numChildren=0 startMainStr=46 stopMainStr=52 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│           Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>├─ Block #8    Meta   L31–L32 </span></span>
<span class="line"><span>│  │  Int64  idComponent=8 idParent=1 idxString=0 inputLineNum=31 numChildren=2 startMainStr=31 stopMainStr=32 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │  Bool   depth2 attachedToMeta containsMeta isMeta</span></span>
<span class="line"><span>│  ├─ Line #32    Meta   L31      &quot;&quot;</span></span>
<span class="line"><span>│  │     Int64  idComponent=32 idParent=8 idxString=0 inputLineNum=31 numChildren=0 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│  │     Bool   includeInOutFile isEmpty containsMeta isMeta</span></span>
<span class="line"><span>│  └─ Line #33    Meta   L32      &quot;#~2 :label5&quot;</span></span>
<span class="line"><span>│        Int64  idComponent=33 idParent=8 idxString=32 inputLineNum=32 numChildren=0 startMainStr=1 stopMainStr=11 idExtension=0 idExtended=0</span></span>
<span class="line"><span>│        Bool   depth2 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span></span></span>
<span class="line"><span>└─ Block #9    Text   L33–L35 </span></span>
<span class="line"><span>   │  Int64  idComponent=9 idParent=1 idxString=0 inputLineNum=33 numChildren=3 startMainStr=33 stopMainStr=35 idExtension=0 idExtended=0</span></span>
<span class="line"><span>   │  Bool   attachedToMeta containsMeta containsText isText</span></span>
<span class="line"><span>   ├─ Line #34    Text   L33      &quot;md&quot;&quot;&quot;&quot;</span></span>
<span class="line"><span>   │     Int64  idComponent=34 idParent=9 idxString=33 inputLineNum=33 numChildren=0 startMainStr=1 stopMainStr=5 idExtension=0 idExtended=0</span></span>
<span class="line"><span>   │     Bool   attachedToMeta includeInOutFile containsText isText</span></span>
<span class="line"><span>   ├─ Line #35    Text   L34     </span></span>
<span class="line"><span>   │  │  Int64  idComponent=35 idParent=9 idxString=0 inputLineNum=34 numChildren=2 startMainStr=0 stopMainStr=0 idExtension=0 idExtended=0</span></span>
<span class="line"><span>   │  │  Bool   containsMeta containsText isText</span></span>
<span class="line"><span>   │  ├─ Segment #14 Text   L34      &quot;This is a \`Block\` of markdown text. &quot;</span></span>
<span class="line"><span>   │  │     Int64  idComponent=14 idParent=35 idxString=34 inputLineNum=34 numChildren=0 startMainStr=1 stopMainStr=36 idExtension=0 idExtended=0</span></span>
<span class="line"><span>   │  │     Bool   includeInOutFile containsText isText</span></span>
<span class="line"><span>   │  └─ Segment #15 Meta   L34      &quot;#~ hide&quot;</span></span>
<span class="line"><span>   │        Int64  idComponent=15 idParent=35 idxString=34 inputLineNum=34 numChildren=0 startMainStr=37 stopMainStr=43 idExtension=0 idExtended=0</span></span>
<span class="line"><span>   │        Bool   depth1 includeInOutFile containsMeta isMeta hasMetaStr</span></span>
<span class="line"><span>   └─ Line #36    Text   L35      &quot;&quot;&quot;&quot;&quot;</span></span>
<span class="line"><span>         Int64  idComponent=36 idParent=9 idxString=35 inputLineNum=35 numChildren=0 startMainStr=1 stopMainStr=3 idExtension=0 idExtended=0</span></span>
<span class="line"><span>         Bool   includeInOutFile containsText isText</span></span></code></pre></div></details><p>The tools carry their own check, a battery under <code>devtools/probes/</code> that fails loudly when the surface they read has changed.</p><h2 id="2.-The-basic-renderer:-a-proxy-to-check-by-eye" tabindex="-1">2. The basic renderer: a proxy to check by eye <a class="header-anchor" href="#2.-The-basic-renderer:-a-proxy-to-check-by-eye" aria-label="Permalink to &quot;2. The basic renderer: a proxy to check by eye {#2.-The-basic-renderer:-a-proxy-to-check-by-eye}&quot;">​</a></h2><p>The basic renderer writes a rendered copy of the file in which each piece appears as its evaluated Visib value says — shown, hidden or discarded. In the author&#39;s words it <em>&quot;was simply a PROXY FOR ME TO CHECK WHAT <span class="gm-name">GoMeta</span> had evaluated to. The REAL IMPORTANT PART IS WHAT <span class="gm-name">GoMeta</span> EVALUATES TO - NOT WHAT ITS PROXY EVALUATES TO.&quot;</em> Strictly speaking it is no Extension: it lives under the package&#39;s development tools, and it is there because it serves a vital purpose for the package&#39;s development. It behaves like one, though: it reads the delivery through the public surface — the BLS Component tree through BLS&#39;s own functions, every Visib value through the Engine&#39;s answer function, <a href="./public-api"><code>evaluatedAltValue</code></a> — and it evaluates nothing itself. It is loaded explicitly, at the top level:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light-high-contrast github-dark-dimmed vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">include</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">joinpath</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">pkgdir</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(GoMeta), </span><span style="--shiki-light:#032563;--shiki-dark:#96D0FF;">&quot;devtools&quot;</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">, </span><span style="--shiki-light:#032563;--shiki-dark:#96D0FF;">&quot;load_basic_renderer.jl&quot;</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">))   </span><span style="--shiki-light:#4B535D;--shiki-dark:#768390;"># at the top level</span></span>
<span class="line"><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">out </span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">=</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;"> Main</span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">.</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">BasicRenderer</span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">.</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">outputs</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(delivery)   </span><span style="--shiki-light:#4B535D;--shiki-dark:#768390;"># (blsStructure_bytes, render_bytes)</span></span>
<span class="line"><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">print</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">String</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(</span><span style="--shiki-light:#023B95;--shiki-dark:#6CB6FF;">copy</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">(out</span><span style="--shiki-light:#A0111F;--shiki-dark:#F47067;">.</span><span style="--shiki-light:#0E1116;--shiki-dark:#ADBAC7;">render_bytes)))        </span><span style="--shiki-light:#4B535D;--shiki-dark:#768390;"># the rendered copy</span></span></code></pre></div><p>It returns a pair: the tree print of section 1 (the <code>tree</code> verb) and the rendered copy. The tree print is the BLS Component tree as the parser built it and holds no evaluated values; the tools print it and the test suite pins it. No Extension takes this pair; an Extension works from the delivery. The package&#39;s test suite pins the pair byte for byte — the rendered copy against the committed reference files under the examples, the tree print against its committed copy; in the author&#39;s words the renderer <em>&quot;MUST PRODUCE CONSISTENT OUTPUTS&quot;</em>.</p><h2 id="3.-What-the-rendered-copy-shows" tabindex="-1">3. What the rendered copy shows <a class="header-anchor" href="#3.-What-the-rendered-copy-shows" aria-label="Permalink to &quot;3. What the rendered copy shows {#3.-What-the-rendered-copy-shows}&quot;">​</a></h2><p>Measured on the two example files, whose rendered copies the package commits under <code>examples/OutFileFolder/</code> and the test suite pins (the second&#39;s is embedded in section 6):</p><ul><li><p>A discarded Component leaves no bytes of its own.</p></li><li><p>A hidden Line is written behind the file format&#39;s hide marker — <code>##</code> in Julia — and so is every non-empty line of a hidden Block that has no Visib value of its own — a line with its own value is written as that value says: the first example file&#39;s line 30, which ends in its own <code class="gm-ml"><span class="gm-sg">#~</span> show</code>, is written as it is; a hidden empty line stays an empty line (the second example file&#39;s line 40).</p></li><li><p>A line that already begins with the marker is written as it is, never marked twice.</p></li><li><p>A hidden metaLine keeps its own marker: <em>hide</em> is visibility, so the metadata stays metadata in the rendered copy; a discarded metaLine is gone (the second example file&#39;s line 51).</p></li><li><p>An inline <a href="/reference/syntax-and-semantics#statement,-metaSegment">metaSegment</a> is kept as it is on a shown line and, on a hidden one, written behind its own <code>##</code> as the line is.</p></li></ul><p>The two <code>##</code> are two things: in the input <code>##</code> opens a comment for the reader; in the rendered copy the input&#39;s comments keep their <code>##</code>, and the tool writes <code>##</code> before what it hides — its hide marker.</p><h2 id="4.-What-the-test-suite-pins" tabindex="-1">4. What the test suite pins <a class="header-anchor" href="#4.-What-the-test-suite-pins" aria-label="Permalink to &quot;4. What the test suite pins {#4.-What-the-test-suite-pins}&quot;">​</a></h2><p>Over the committed examples the shipped tests assert that the same input and configuration give a byte-identical tree print and rendered copy in every run; that a discarded Component leaves no bytes and every non-empty line evaluated hidden carries the marker; that the tree print holds no evaluated values; and that the evaluated values are the same in every run.</p><h2 id="5.-Line-endings" tabindex="-1">5. Line endings <a class="header-anchor" href="#5.-Line-endings" aria-label="Permalink to &quot;5. Line endings {#5.-Line-endings}&quot;">​</a></h2><p>A file with CRLF line endings (a carriage return before each line feed) is read as if its endings were LF (a line feed alone), and the rendered copy comes out with LF endings; the bytes within a line are kept as they are (see the <a href="./public-api">Public API</a> page).</p><h2 id="6.-A-worked-example" tabindex="-1">6. A worked example <a class="header-anchor" href="#6.-A-worked-example" aria-label="Permalink to &quot;6. A worked example {#6.-A-worked-example}&quot;">​</a></h2><p>In the second example file (<code>examples/InFileFolder/file_for_Example_Extended.jl</code>), line 14 is a text line that ends in <code class="gm-ml"><span class="gm-sg">#~</span> hide</code> and line 15 a line that ends in <code class="gm-ml"><span class="gm-sg">#~</span> discard</code>. In the rendered copy line 14 appears behind the hide marker, its trailing metaSegment marked with it, and line 15 is absent — as the file itself says, on its line 16: <em>&quot;Input line 15 will be missing from the output file!&quot;</em></p><details class="details custom-block"><summary>The rendered copy of the second example file, as the basic renderer writes it</summary><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light-high-contrast github-dark-dimmed vp-code" tabindex="0"><code><span class="line"><span>## Test File</span></span>
<span class="line"><span>## NOTE: I&#39;ve addes some markers to this file such as: &quot;## @: Input line 2&quot;</span></span>
<span class="line"><span>##      They have nothing to do with \`GoMeta\` [yet].</span></span>
<span class="line"><span>##      They are simply meant to assist orientation when</span></span>
<span class="line"><span>##      comparing the input file to the output file.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#~ discard{ :label2 , isCode} ## This is a comment within a meta \`Block\`.</span></span>
<span class="line"><span>#~ :label1{ isText &amp;&amp; containsMeta }</span></span>
<span class="line"><span>## The following meta \`Line\` within this \`Block\` will be ignored due to the \`!\`.</span></span>
<span class="line"><span>#~! discard{ isMeta } ## This \`Line\` of meta ends this \`Block\` of meta.</span></span>
<span class="line"><span></span></span>
<span class="line"><span># With this \`Line\` of text starts a new \`Block\` of text. ## @: Input line 12.</span></span>
<span class="line"><span># This \`Block\` is NOT attached to metadata - it does NOT inherit metadata.</span></span>
<span class="line"><span>## # This \`Line\` should still be &quot;hidden&quot; / commented out. ## #~ hide</span></span>
<span class="line"><span># NOTE: Input line 15 will be missing from the output file! ## @: Input line 16.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#~2 :label3 :label5 show{ !:label5} ## @: Input line 18.</span></span>
<span class="line"><span>#~ hide{:label1} ## This comment ends this meta \`Block\` at level 2 [\`#~2\`].</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#~3 discard{:label4} :label4 ## This comment ends this meta \`Block\` at level 3.</span></span>
<span class="line"><span>## # Here starts a new \`Block\` of text ## @: Input line 35.</span></span>
<span class="line"><span>## #       which receives label4 from line 34</span></span>
<span class="line"><span>## #       and label3 and label5 from line 18</span></span>
<span class="line"><span>## #       and receives label1 from line 8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## # This \`Block\` does NOT get &quot;discarded&quot; since label4 has</span></span>
<span class="line"><span>## #       NOT been applied yet when \`discard{:label4}\` [line 34] is issued.</span></span>
<span class="line"><span>## # Instead this \`Block\` gets &quot;hidden&quot; due to circumstance that it is</span></span>
<span class="line"><span>## #       text and contains meta, therefore receiving label1</span></span>
<span class="line"><span>## #       and consequently inheriting the \`hide\` from line 19.</span></span>
<span class="line"><span>## NOTE: Line 39, however, will get &quot;discarded&quot;</span></span>
<span class="line"><span>##      since this \`Line\` inherits label4 due to the &quot;#~&quot; at its end</span></span>
<span class="line"><span>##      and consequently \`discard{:label4}\` [line 34] gets applied here.</span></span>
<span class="line"><span>## @: Input line 49. It is at the end of this \`Block\` of text.</span></span></code></pre></div></details>`,27)])])}const m=s(i,[["render",p]]);export{u as __pageData,m as default};
