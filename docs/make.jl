using Documenter
using DocumenterVitepress

makedocs(;
    sitename = "GoMeta",
    authors = "GoMeta",
    format = DocumenterVitepress.MarkdownVitepress(;
        repo = "github.com/gometa-jl/gometa-jl.github.io",
        devbranch = "main",
        devurl = "dev",
        deploy_url = "https://gometa.dev",
    ),
    pages = [
        "Home" => "index.md",
        "Concepts" => [
            "What is GoMeta?" => "concepts/what-is-gometa.md",
            "metaLines" => "concepts/metalines.md",
        ],
        "Tutorials" => [
            "Getting started" => "tutorials/getting-started.md",
        ],
        "Examples" => "examples/index.md",
        "Reference" => [
            "Syntax & semantics" => "reference/syntax-and-semantics.md",
            "Public API" => "reference/public-api.md",
            "Canonical output" => "reference/canonical-output.md",
        ],
    ],
    warnonly = true,
)

# No deploydocs: since 2026-09-03 nothing is published by CI. The site root on gh-pages is pushed only by the
# owner through the GoMetaPublic publish gate (exactly the previewed local build). CI builds as a check only.
