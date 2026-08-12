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
      <p class="gm-hero-tagline">One <code>#~</code> comment line makes a file retrievable, interlinkable,
        re-renderable, and shareable on your terms &mdash; read by tools, never run by them.</p>
      <div class="gm-metaline" role="img" aria-label="Example metaLine"><span class="gm-metaline-inner gm-typein"><span class="h">#</span><span class="t">~</span><span class="r"> :label1{ isText &amp;&amp; containsMeta }</span></span></div>
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
        <p>Name and tag a file where it lives. Years later, one query brings it back.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> link</div>
        <h2>Link and swap</h2>
        <p>Files reference each other by meaning, not by path &mdash; reorganize without breakage.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> render</div>
        <h2>One source, many outputs</h2>
        <p>Render the same file into a notebook, a docs page, or a share-ready copy &mdash; without forking it.</p>
      </div>
      <div class="gm-card">
        <div class="gm-eyebrow"><span class="h">#~</span> share</div>
        <h2>Share on your terms</h2>
        <p>Strip what is private and publish the rest &mdash; one simple function applied to GoMeta&rsquo;s output.</p>
      </div>
    </div>
  </section>
  <section class="gm-status">
    <p><strong>Status: alpha.</strong> GoMeta.jl <code>0.2.0</code> implements the v0 subset of the
    GoMeta language &mdash; a working, tested engine with a byte-exact example oracle and a
    755-test suite. GoMeta <strong>evaluates</strong> metadata; it never executes the file it processes.</p>
    <p class="gm-license-note">GoMeta is source-available under a restrictive custom license:
    private, personal, or educational use only &mdash; see the
    <a href="https://github.com/gometa-jl/GoMeta.jl">repository</a> for the license and details.</p>
  </section>
</div>
```
