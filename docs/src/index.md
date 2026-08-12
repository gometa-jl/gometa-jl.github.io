```@raw html
---
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
  <section class="gm-hero">
    <div class="gm-hero-text">
      <h1 class="gm-sr">GoMeta</h1>
      <img class="gm-wordmark gm-only-dark" src="/wordmark-dark.png" alt="">
      <img class="gm-wordmark gm-only-light" src="/wordmark-light.png" alt="">
      <p class="gm-hero-title">Your files, ready to be found again.</p>
      <p class="gm-hero-tagline">One <code>#~</code> comment line in a Julia file makes it retrievable, interlinkable,
        re-renderable, and shareable on your terms &mdash; read by tools, never run by them.</p>
      <div class="gm-metaline" role="img" aria-label="Example metaLine"><span class="gm-metaline-inner"><span class="h">#</span><span class="t">~</span><span class="r"> :label1{ isText &amp;&amp; containsMeta }</span></span></div>
      <div class="gm-chips">
        <span class="gm-chip gm-chip-mint">v0.3.0</span>
        <span class="gm-chip gm-chip-cyan">FSL-1.1-MIT &middot; Fair Source</span>
      </div>
      <div class="gm-hero-actions">
        <a class="gm-btn gm-btn-brand" href="/tutorials/getting-started">Write your first metaLine</a>
        <a class="gm-btn gm-btn-alt" href="/concepts/metalines">What is a metaLine?</a>
      </div>
    </div>
    <div class="gm-hero-image">
      <img class="gm-only-dark" src="/mark-dark.png" alt="GoMeta mark — two notebooks spelling /#/~">
      <img class="gm-only-light" src="/mark-light.png" alt="GoMeta mark — two notebooks spelling /#/~">
    </div>
  </section>
  <section class="gm-features">
    <div class="gm-features-inner">
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> find</div>
        <h2>Find it again</h2>
        <p>Label a passage where it lives. Years later, one query answers: which pieces of which files carry this label.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> link</div>
        <h2>A web, not a hierarchy</h2>
        <p>A folder gives each file one place. Labels weave a web &mdash; the same label names related pieces across files, and one query walks them all.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> render</div>
        <h2>One source, many outputs</h2>
        <p>One marked Julia file becomes four Jupyter notebook editions, an executed twin, and two Documenter manual pages &mdash; every view derived from its <code>#~</code> marks, the source never forked.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> share</div>
        <h2>Share on your terms</h2>
        <p>Mark what is private: the rendered share-view removes what you discarded and hides what you hid &mdash; publish the rest.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> evaluate</div>
        <h2>Evaluates, never executes</h2>
        <p>Conditions run in GoMeta&rsquo;s own closed, bounded interpreter &mdash; in a default-configured run, no condition text ever reaches Julia&rsquo;s <code>eval</code>.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> speak</div>
        <h2>Three content flavors</h2>
        <p>New in 0.3.0: <code>:julia</code> (default), <code>:c</code> for the <code>//</code> line-comment family, <code>:latex</code> for <code>%</code> &mdash; selected explicitly, never inferred. And labels now speak pictograph: <code>:💡</code>, <code>:📝</code>, <code>:🔥</code>.</p>
      </div>
    </div>
  </section>
  <section class="gm-status">
    <p><strong>Status: alpha.</strong> GoMeta.jl <code>0.3.0</code> implements the v0 subset of the
    GoMeta language &mdash; a working, tested engine with a byte-exact example oracle: the seven
    committed example pairs render byte-identically, pinned by the shipped 1140-test suite.
    Alpha states the maturity honestly &mdash; the surface may still move before <code>1.0</code>.
    GoMeta <strong>evaluates</strong> metadata; it never executes the file it processes.</p>
    <p class="gm-license-note">GoMeta is <strong>Fair Source</strong> &mdash; licensed under the
    Functional Source License, Version 1.1, MIT Future License (<strong>FSL-1.1-MIT</strong>;
    source-available, not OSI-approved open source): free for everyone&rsquo;s own use &mdash;
    at work, at university, in the public sector. Not licensed: offering GoMeta to others in a
    commercial product or service that competes with it or with the Licensor&rsquo;s own
    GoMeta-based offerings. On the second anniversary of a version&rsquo;s
    release, that version becomes available under the MIT license &mdash; irrevocably. See the
    <a href="https://github.com/gometa-jl/GoMeta.jl">repository</a> for the license and details.</p>
    <p class="gm-merci-cta"><a href="/merci">Merci🌷</a></p>
  </section>
</div>
```
