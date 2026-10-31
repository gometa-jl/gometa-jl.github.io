```@raw html
---
description: "GoMeta can be embedded in all kinds of other programming languages as well as in Word documents or be attached to files themselves."
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
        <!-- The hero's top row: the typed Courier Prime wordmark with the small "α status" tag at its bottom right (GoMeta's creator, 2026-10-20), beside the GoMeta mark (one image for dark mode, one for light). -->
        <div class="gm-hero-brand"><h1 class="gm-hero-word">GoMeta</h1><span class="gm-alpha">α status</span></div>
        <img class="gm-mark-top gm-only-dark" src="/mark-dark.svg" loading="lazy" alt="GoMeta mark — two notebooks spelling /#/~">
        <img class="gm-mark-top gm-only-light" src="/mark-light.svg" loading="lazy" alt="GoMeta mark — two notebooks spelling /#/~">
      </div>
      <div class="gm-metaline gm-metaline-full" role="img" aria-label="Example metaLine"><span class="gm-metaline-inner"><span class="h">#</span><span class="t">~</span><span class="r"> This is a metaLine: How to embed meaning into comments.</span></span></div>
      <!-- "What is GoMeta?" ensemble — slide 8 of the JuliaCon 2026 talk (geometry = coordinates relative to the 1088px content column). -->
      <div class="gm-s8" role="group" aria-label="What is GoMeta — key points">
        <div class="gm-s8-box gm-s8-key"><span><strong>THE</strong> key <em>distinguishing</em> feature</span></div>
        <div class="gm-s8-box gm-s8-mint"><span><span class="gm8-m">GoMeta</span> can be <span class="gm8-a">embedded</span> in all kinds of other <br><span class="gm8-a">programming languages</span> as well as <br>in <span class="gm8-a">Word documents</span> or be <br><span class="gm8-a">attached to files</span> themselves.</span></div>
        <div class="gm-s8-box gm-s8-gold"><span>This allows <span class="gm8-m">GoMeta</span> to <br><span class="gm8-a">connect</span> content of one <br><span class="gm8-a">programming language</span>, <br>one <span class="gm8-a">file format</span> <br>with that of another.</span></div>
        <div class="gm-s8-box gm-s8-mag"><span><span class="gm8-m">GoMeta</span> works <br><span class="gm8-a">in between</span> them, <br><span class="gm8-a">behind</span> them, <br><span class="gm8-a">within</span> them.</span></div>
        <div class="gm-s8-box gm-s8-viol"><span>That is the <strong>reason why</strong> it is called '<span class="gm8-go">Go</span><span class="gm8-meta">Meta</span>'.</span></div>
        <div class="gm-s8-box gm-s8-rose"><span>What other language can do that&nbsp;?</span></div><!-- nbsp: keeps the slide's pre-? space from orphaning the ? on narrow screens -->
      </div>
      <div class="gm-hero-actions gm-hero-actions-2">
        <!-- Two buttons, symmetric about the page's centre (2026-10-30): the web version of the
             official slides, and the official proposal page, which carries the talk's video recording.
             target=_self is LOAD-BEARING on /talk/: a public/ asset, not a VitePress page; without a target attribute the
             SPA router intercepts the click into its 404. -->
        <a class="gm-btn gm-btn-talk" href="/talk/" target="_self"><strong>JuliaCon2026 Slides 🔗</strong> <span>Web version of the official slides</span></a>
        <a class="gm-btn gm-btn-talk" href="https://pretalx.com/juliacon-2026/talk/XYMFMZ/" target="_blank" rel="noopener"><strong>JuliaCon2026 Talk 🔗</strong> <span>The proposal page with the video</span></a>
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
    <!-- Labels and panels are INTERLEAVED siblings: on desktop the grid re-assembles the two-column master-detail; on mobile the single column becomes an accordion (each panel opens directly under its label). -->
    <div class="gm-tabs-grid">
      <label class="gm-tabbox gm-tb-mint" for="gmt-core"><strong>What is <span class="gm-name">GoMeta</span>?</strong> The idea</label>
      <div class="gm-tabpanel gm-tp-core">
          <span class="gm-tp-title">What is <span class="gm-name">GoMeta</span>?</span>
          <p><span class="gm-name">GoMeta.jl</span> is an <em>interpretable-metadata</em> engine, written in Julia, designed to work between, behind and within your data: in any programming language and any file format.</p>
          <p>A file carries its ordinary content plus <code><span class="gm-sg">#~</span></code> metaLines &mdash; comment lines with machine-interpretable metadata (e.g. labels, visibility actions, conditions, etc.) sitting right beside the content they describe. Language-agnostic, since the metadata remains &ldquo;hidden&rdquo; within the comments &mdash; the host file stays an ordinary file, and the host language sees nothing but a comment.</p>
          <p><span class="gm-name">GoMeta</span> evaluates the metadata &mdash; more precisely, the <span class="gm-name">GoMeta</span> Engine evaluates it &mdash; but does not act on those evaluations: that is the Extensions&rsquo; role; they receive the evaluations through <span class="gm-name">GoMeta</span>&rsquo;s interface, <code>altValues_evals</code>.</p>
          <p><a href="/concepts/what-is-gometa">What is <span class="gm-name">GoMeta</span>? &rarr;</a></p>
        </div>
        <label class="gm-tabbox gm-tb-gold" for="gmt-syntax"><strong>Why use <span class="gm-name">GoMeta</span>?</strong> Four use cases, and beyond</label>
        <div class="gm-tabpanel gm-tp-syntax">
          <span class="gm-tp-title">Why use <span class="gm-name">GoMeta</span>?</span>
          <p>Four seemingly unrelated use cases illustrate what <span class="gm-name">GoMeta</span> <strong>can</strong> be used for &mdash; but they are <strong>not</strong> <span class="gm-name">GoMeta</span>: Extensions serve them.</p>
          <ul>
            <li><strong>Find it again</strong> &mdash; adding meaning to content can change the game; the shipped demo <code>find_by_label.jl</code> answers: which pieces of which files carry this label.</li>
            <li><strong>Webs of atomic data units</strong> &mdash; link fragments across files, put things into context. This one requires not only an Extension but also a database as a back end.</li>
            <li><strong>One source file, all kinds of output formats</strong> &mdash; shipped today: one notebook and its executed twin, and two manual pages, from one marked file.</li>
            <li><strong>Share on your terms</strong> &mdash; marking private passages would allow automated removal before sharing; <span class="gm-name">GoMeta</span>&rsquo;s own source has been processed this way.</li>
          </ul>
          <p>And, in the words of <span class="gm-name">GoMeta</span>&rsquo;s creator: &ldquo;This is not just for programmers any more.&rdquo;</p>
          <p><a href="/concepts/why-use-gometa">Why use <span class="gm-name">GoMeta</span>? &rarr;</a></p>
        </div>
        <label class="gm-tabbox gm-tb-cyan" for="gmt-blocks"><strong>How does <span class="gm-name">GoMeta</span> work?</strong> One run, from a file to the Extensions</label>
        <div class="gm-tabpanel gm-tp-blocks">
          <span class="gm-tp-title">How does <span class="gm-name">GoMeta</span> work?</span>
          <ul>
            <li><strong>BLS parses the file</strong> into the BLS Component tree &mdash; Block, Line, Segment, in three flavors: Meta, Text, Code. One record is crucial: is a Component attached to a metaComponent or not? That is crucial when deciding whether a metaStatement gets applied to it.</li>
            <li><strong>The heart:</strong> <span class="gm-name">GoMeta</span> absorbs the metadata &mdash; parses and interprets it &mdash; evaluates the altValues (Alterant values), and makes them available to whatever Extension the user calls for.</li>
            <li><strong>Alterants:</strong> as a Julia Type declares a kind of value, an Alterant declares a kind of metadata with its actions and rules. Visib, labels, id and heading ship built in.</li>
            <li><strong>Extensions act:</strong> one run delivers one object carrying both main products &mdash; the BLS Component tree and the evaluated values, <code>altValues_evals</code> &mdash; and the Extensions act on it.</li>
          </ul>
          <p><a href="/concepts/how-does-gometa-work">How does <span class="gm-name">GoMeta</span> work? &rarr;</a></p>
        </div>
        <label class="gm-tabbox gm-tb-viol" for="gmt-cases"><strong>Start here:</strong> the syntax, one run, the reference</label>
        <div class="gm-tabpanel gm-tp-cases">
          <span class="gm-tp-title">Start here</span>
          <p>Any line starting with <code><span class="gm-sg">#~</span></code> is a metaLine &mdash; it will be processed as metadata. Contiguous metaLines constitute a metaBlock; positioned just above a block of code or text, it gets attached &mdash; similar to how docstrings get associated with Julia structures following them.</p>
          <div class="language-gometa vp-adaptive-theme gm-syn"><pre class="shiki" tabindex="0"><code><span class="gm-sg">#~</span><span class="gm-mt"> hide </span><span class="gm-cm">## A first 'metaLine'.</span>
<span class="gm-tx"># This first line is 'Text'.</span>
<span class="gm-cm">## This is a 'comment' of 'Text'.</span>
<span class="gm-tx"></span>
<span class="gm-sg">#~2</span><span class="gm-mt"> :label1</span>
<span class="gm-cd">a = 1 </span><span class="gm-cm">## A 'Block' of 'Code'.</span>
<span class="gm-cd">b = 2 </span><span class="gm-sg">#~</span><span class="gm-mt"> discard{ :label1 }</span></code></pre></div>
          <p><a href="/tutorials/getting-started">Getting started &rarr;</a><br><a href="/examples/">Examples &rarr;</a><br><a href="/reference/syntax-and-semantics">The full reference &rarr;</a></p>
        </div>
        <a class="gm-tabbox gm-tb-merci" href="/merci"><strong>Merci🌷</strong></a>
    </div>
  </div>
  <section class="gm-features">
    <div class="gm-features-inner">
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> 1 &middot; parse</div>
        <h2>BLS reads the file</h2>
        <p>Before <span class="gm-name">GoMeta</span> can absorb &amp; evaluate the metadata, BLS reads the file, extracts features of interest and records them in a tree-like structure. Blocks, Lines and Segments are all Components at different levels in the hierarchy, in three Component flavors &mdash; Meta, Text, Code. And one record is crucial: is a Component attached to a metaComponent or not? That is crucial when deciding whether a metaStatement gets applied to it.</p>
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
        <p>It is essential to <span class="gm-name">GoMeta</span>. Any line starting with <code><span class="gm-sg">#~</span></code> is a metaLine &mdash; it will be processed as metadata. Contiguous metaLines constitute a metaBlock; positioned just above a block of code or text, the metaBlock gets attached &mdash; similar to how docstrings get associated with Julia structures following them. Three comment markers at this release: Julia&rsquo;s <code>#</code>, the C family&rsquo;s <code>//</code> (e.g. C, Rust, etc.), LaTeX&rsquo;s <code>%</code> &mdash; named when <span class="gm-name">GoMeta</span> is called, never inferred. The same principles are easily extended to other programming languages or project data in general.</p>
      </div>
    </div>
  </section>
  <section class="gm-status">
    <p><strong>Status: alpha.</strong> <span class="gm-name">GoMeta.jl</span> <code>0.4.4</code> implements the v0 subset of the
    <span class="gm-name">GoMeta</span> language &mdash; a working, tested engine: the seven
    committed example pairs render byte for byte, pinned by the shipped test suite.
    It&rsquo;s alpha &mdash; the surface may still move before <code>1.0</code>.
    <span class="gm-name">GoMeta</span> evaluates the metadata &mdash; more precisely, the <span class="gm-name">GoMeta</span> Engine evaluates it &mdash; but does not act on those evaluations: that is the Extensions&rsquo; role.</p>
    <p class="gm-license-note"><span class="gm-name">GoMeta</span> is <strong>Fair Source</strong> &mdash; licensed under the
    Functional Source License, Version 1.1, MIT Future License (<strong>FSL-1.1-MIT</strong>;
    source-available, not OSI-approved open source): free for everyone&rsquo;s own use &mdash;
    at work, at university, in the public sector. Not licensed: offering <span class="gm-name">GoMeta</span> to others in a
    commercial product or service that competes with it or with the Licensor&rsquo;s own
    <span class="gm-name">GoMeta</span>-based offerings that exist when the version is made available. On the second anniversary of a version&rsquo;s
    release, that version becomes available under the MIT license &mdash; irrevocably. See the
    <a href="https://github.com/gometa-jl/GoMeta.jl">repository</a> for the license and details.</p>
  </section>
</div>
```
