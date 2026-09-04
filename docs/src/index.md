```@raw html
---
u_version: "0.1"
layout: page
navbar: true
sidebar: false
aside: false
outline: false
lastUpdated: false
editLink: false
footer: true
---
```

```@raw html
<div class="gm-home">
  <section class="gm-hero gm-hero-v2">
    <div class="gm-hero-text">
      <div class="gm-hero-top">
        <!-- Hero v3 (owner's Figma sketch 2026-08-24, frame 46:2): typed Courier Prime
             wordmark replaces the wordmark PNGs; title/taglines/chips leave the hero. -->
        <h1 class="gm-hero-word">GoMeta</h1>
        <img class="gm-mark-top gm-only-dark" src="/mark-dark.svg" alt="GoMeta mark — two notebooks spelling /#/~">
        <img class="gm-mark-top gm-only-light" src="/mark-light.svg" alt="GoMeta mark — two notebooks spelling /#/~">
      </div>
      <div class="gm-metaline gm-metaline-full" role="img" aria-label="Example metaLine"><span class="gm-metaline-inner"><span class="h">#</span><span class="t">~</span><span class="r"> This is a metaLine: How to embed meaning into comments.</span></span></div>
      <!-- "What is GoMeta?" ensemble — deck slide 8, converted per the owner's Figma
           sketch (geometry = sketch coordinates relative to the 1088px content column). -->
      <div class="gm-s8" role="group" aria-label="What is GoMeta — key points">
        <div class="gm-s8-box gm-s8-key"><span><strong>THE</strong> key <em>distinguishing</em> feature</span></div>
        <div class="gm-s8-box gm-s8-mint"><span><span class="gm8-m">GoMeta</span> can be <span class="gm8-a">embedded</span> in all kinds of other <br><span class="gm8-a">programming languages</span> as well as <br>in <span class="gm8-a">Word documents</span> or be <br><span class="gm8-a">attached to files</span> themselves.</span></div>
        <div class="gm-s8-box gm-s8-gold"><span>This allows <span class="gm8-m">GoMeta</span> to <br><span class="gm8-a">connect</span> content of one <br><span class="gm8-a">programming language</span>, <br>one <span class="gm8-a">file format</span> <br>with that of another.</span></div>
        <div class="gm-s8-box gm-s8-mag"><span><span class="gm8-m">GoMeta</span> works <br><span class="gm8-a">in between</span> them, <br><span class="gm8-a">behind</span> them, <br><span class="gm8-a">within</span> them.</span></div>
        <div class="gm-s8-box gm-s8-viol"><span>That is the <strong>reason why</strong> it is called '<span class="gm8-go">Go</span><span class="gm8-meta">Meta</span>'.</span></div>
        <div class="gm-s8-box gm-s8-rose"><span>What other language can do that&nbsp;?</span></div><!-- nbsp: keeps the slide's pre-? space from orphaning the ? on narrow screens -->
      </div>
      <div class="gm-hero-actions">
        <!-- target=_self is LOAD-BEARING: /talk/ is a public/ asset, not a VitePress page;
             without a target attribute the SPA router intercepts the click into its 404. -->
        <a class="gm-btn gm-btn-talk" href="/talk/" target="_self"><strong>JuliaCon2026 Talk 🔗</strong> <span>Web version of the official slides</span></a>
      </div>
      <div class="gm-intro">
        <p class="gm-hero-tagline">The core idea of <span class="gm-name">GoMeta</span> is to embed formalized meaning within all kinds of
          comments and provide Extensions with its interpretations so they can act on them.</p>
        <p class="gm-hero-tagline">So on the one hand, <span class="gm-name">GoMeta</span> is a domain-specific language for metadata and on
          the other a framework with facilities which Extensions can build on.</p>
      </div>
    </div>
  </section>
  <div class="gm-tabs">
    <input type="radio" name="gmt" id="gmt-core">
    <input type="radio" name="gmt" id="gmt-syntax">
    <input type="radio" name="gmt" id="gmt-blocks">
    <input type="radio" name="gmt" id="gmt-cases">
    <!-- Labels and panels are INTERLEAVED siblings: on desktop the grid re-assembles
         the two-column master-detail; on mobile the single column becomes an accordion
         (each panel opens directly under its label — owner 2026-08-25 mobile fix). -->
    <div class="gm-tabs-grid">
      <label class="gm-tabbox gm-tb-mint" for="gmt-core"><strong>Core Concept:</strong> Why embed metadata into comments?</label>
      <div class="gm-tabpanel gm-tp-core">
          <span class="gm-tp-title">Core Concept: Why embed metadata into comments?</span>
          <p>Language-agnostic, since the metadata remains &ldquo;hidden&rdquo; within the comments &mdash; the host file stays an ordinary file, and the host language sees nothing but a comment.</p>
          <p>One source file, all kinds of output formats &mdash; and webs of atomic data units instead of hierarchies: a folder must place an item at a single position; labels weave a web.</p>
          <p><span class="gm-name">GoMeta</span> provides the means; Extensions serve the use cases.</p>
          <p>And the safety posture is part of the idea: <span class="gm-name">GoMeta</span> <strong>evaluates</strong> metadata &mdash; it never executes the file it processes.</p>
          <p><a href="/concepts/what-is-gometa">What is <span class="gm-name">GoMeta</span>? &rarr;</a></p>
        </div>
        <label class="gm-tabbox gm-tb-gold" for="gmt-syntax"><strong><span class="gm-name">GoMeta</span> Syntax:</strong> Examples</label>
        <div class="gm-tabpanel gm-tp-syntax">
          <span class="gm-tp-title"><span class="gm-name">GoMeta</span> Syntax: Examples</span>
          <p>Any line starting with <code>#~</code> is a metaLine &mdash; it will be processed as metadata. Contiguous metaLines constitute a metaBlock; positioned just above a block of code or text, it gets attached &mdash; similar to how docstrings get associated with Julia structures following them.</p>
          <div class="language-gometa vp-adaptive-theme gm-syn"><pre class="shiki" tabindex="0"><code><span class="gm-sg">#~</span><span class="gm-mt"> hide </span><span class="gm-cm">## A first 'metaLine'.</span>
<span class="gm-tx"># This first line is 'Text'.</span>
<span class="gm-cm">## This is a 'comment' of 'Text'.</span>
<span class="gm-sg">#~2</span><span class="gm-mt"> :label1</span>
<span class="gm-cd">a = 1 </span><span class="gm-cm">## A 'Block' of 'Code'.</span>
<span class="gm-cd">b = 2 </span><span class="gm-sg">#~</span><span class="gm-mt"> discard{ :label1 }</span></code></pre></div>
          <p><a href="/concepts/metalines">The metaLine syntax in full &rarr;</a></p>
        </div>
        <label class="gm-tabbox gm-tb-cyan" for="gmt-blocks"><strong><span class="gm-name">GoMeta</span> Building Blocks:</strong> How is it set up?</label>
        <div class="gm-tabpanel gm-tp-blocks">
          <span class="gm-tp-title"><span class="gm-name">GoMeta</span> Building Blocks: How is it set up?</span>
          <ul>
            <li><strong>BLS parses the file</strong> into a tree of Components &mdash; Block, Line, Segment, in three flavors: Meta, Text, Code. One record is crucial: is a Component attached to a metaComponent or not? That decides whether a metaStatement gets applied to it.</li>
            <li><strong>The heart:</strong> <span class="gm-name">GoMeta</span> absorbs the metadata &mdash; parses and interprets it &mdash; evaluates the altValues (Alterant values), and makes them available to whatever Extension the user calls for.</li>
            <li><strong>Alterants:</strong> as a Julia Type declares a kind of value, an Alterant declares a kind of metadata with its actions and rules. Visib, labels, id and heading ship built in.</li>
            <li><strong>Its own little parser:</strong> conditions run in <span class="gm-name">GoMeta</span>&rsquo;s own closed, bounded interpreter &mdash; in a default-configured run, no condition text ever reaches Julia&rsquo;s <code>eval</code>; more general parsing via Julia&rsquo;s parser is strictly opt-in.</li>
          </ul>
          <p><a href="/reference/syntax-and-semantics">The full reference &rarr;</a></p>
        </div>
        <label class="gm-tabbox gm-tb-viol" for="gmt-cases"><strong>Use Cases:</strong></label>
        <div class="gm-tabpanel gm-tp-cases">
          <span class="gm-tp-title">Use Cases:</span>
          <p>Four seemingly unrelated use cases illustrate what <span class="gm-name">GoMeta</span> <strong>can</strong> be used for &mdash; but they are <strong>not</strong> <span class="gm-name">GoMeta</span>: Extensions serve them.</p>
          <ul>
            <li><strong>Find it again</strong> &mdash; adding meaning to content can change the game; the shipped demo <code>find_by_label.jl</code> answers: which pieces of which files carry this label.</li>
            <li><strong>Webs of atomic data units</strong> &mdash; link fragments across files, put things into context. This one requires not only an Extension but also a database as a back end.</li>
            <li><strong>One source file, all kinds of output formats</strong> &mdash; shipped today: four notebook editions, an executed twin and two Documenter pages from one marked file.</li>
            <li><strong>Share on your terms</strong> &mdash; marking private passages would allow automated removal before sharing; <span class="gm-name">GoMeta</span>&rsquo;s own source has been processed this way.</li>
          </ul>
          <p><a href="/examples/">Examples &rarr;</a></p>
        </div>
        <a class="gm-tabbox gm-tb-merci" href="/merci"><strong>Merci🌷</strong></a>
    </div>
  </div>
  <section class="gm-features">
    <div class="gm-features-inner">
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> 1 &middot; parse</div>
        <h2>BLS reads the file</h2>
        <p>Before <span class="gm-name">GoMeta</span> can absorb &amp; evaluate the metadata, BLS reads the file, extracts features of interest and records them in a tree-like structure. Blocks, Lines and Segments are all Components at different levels in the hierarchy, in three Component flavors &mdash; Meta, Text, Code. And one record is crucial: is a Component attached to a metaComponent or not? That decides whether a metaStatement gets applied to it.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> 2 &middot; absorb</div>
        <h2>The heart: absorb &amp; evaluate</h2>
        <p>Once the BLS parsing has been conducted, we reach the heart of the <span class="gm-name">GoMeta</span> process: absorb the <span class="gm-name">GoMeta</span> data &mdash; i.e.: parse and interpret it &mdash; evaluate the altValues (Alterant values), and make them available to whatever Extension the user calls for.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> 3 &middot; extend</div>
        <h2>Extensions act</h2>
        <p><span class="gm-name">GoMeta</span> passes its evaluations on to Extensions, which act on them. Like languages, <span class="gm-name">GoMeta</span> by itself does not produce anything &mdash; it provides the means, the metadata-Blocks, to build something. Speedily retrieving a long-forgotten snippet, linking fragments across files, one source file for all kinds of output formats, automated removal of private passages before sharing: illustrations of what <span class="gm-name">GoMeta</span> can be used for &mdash; but they are <strong>not</strong> <span class="gm-name">GoMeta</span>. A web of atomic data units, for one, requires not only an Extension but also a database as a back end.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> 4 &middot; alterants</div>
        <h2>Registered kinds of metadata</h2>
        <p>As a Julia Type declares a kind of value, an Alterant declares a kind of metadata &mdash; with its actions and rules. Visib, labels, id and heading ship built in. What <span class="gm-name">GoMeta</span> evaluates per Component are their values: the altValues.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> 5 &middot; syntax</div>
        <h2>There is a <span class="gm-name">GoMeta</span> syntax</h2>
        <p>It is essential to <span class="gm-name">GoMeta</span>. Any line starting with <code>#~</code> is a metaLine &mdash; it will be processed as metadata. Contiguous metaLines constitute a metaBlock; positioned just above a block of code or text, the metaBlock gets attached &mdash; similar to how docstrings get associated with Julia structures following them. Three content flavors at 0.3.0: <code>:julia</code> for <code>#</code>, <code>:c</code> for <code>//</code>, <code>:latex</code> for <code>%</code> &mdash; selected explicitly, never inferred. The same principles are easily extended to other programming languages or project data in general.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> 6 &middot; secure</div>
        <h2>Its own little parser</h2>
        <p>For security reasons <span class="gm-name">GoMeta</span> provides its own little parser: condition text is parsed into a bounded AST and evaluated by <span class="gm-name">GoMeta</span>&rsquo;s own closed interpreter &mdash; in a default-configured run, no condition text ever reaches Julia&rsquo;s <code>eval</code>. More general parsing via Julia&rsquo;s parser is allowed through opt-in. <span class="gm-name">GoMeta</span> does not execute the instructions inscribed in the metadata.</p>
      </div>
    </div>
  </section>
  <section class="gm-status">
    <p><strong>Status: alpha.</strong> <span class="gm-name">GoMeta.jl</span> <code>0.3.2</code> implements the v0 subset of the
    <span class="gm-name">GoMeta</span> language &mdash; a working, tested engine with a byte-exact example oracle: the seven
    committed example pairs render byte-identically, pinned by the shipped 1140-test suite.
    It&rsquo;s alpha &mdash; the surface may still move before <code>1.0</code>.
    <span class="gm-name">GoMeta</span> <strong>evaluates</strong> metadata; it never executes the file it processes.</p>
    <p class="gm-license-note"><span class="gm-name">GoMeta</span> is <strong>Fair Source</strong> &mdash; licensed under the
    Functional Source License, Version 1.1, MIT Future License (<strong>FSL-1.1-MIT</strong>;
    source-available, not OSI-approved open source): free for everyone&rsquo;s own use &mdash;
    at work, at university, in the public sector. Not licensed: offering <span class="gm-name">GoMeta</span> to others in a
    commercial product or service that competes with it or with the Licensor&rsquo;s own
    <span class="gm-name">GoMeta</span>-based offerings. On the second anniversary of a version&rsquo;s
    release, that version becomes available under the MIT license &mdash; irrevocably. See the
    <a href="https://github.com/gometa-jl/GoMeta.jl">repository</a> for the license and details.</p>
  </section>
</div>
```
