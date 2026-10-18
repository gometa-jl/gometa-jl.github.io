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
            "Why use GoMeta?" => "concepts/why-use-gometa.md",
            "How does GoMeta work?" => "concepts/how-does-gometa-work.md",
            "Extensions" => "concepts/extensions.md",
        ],
        "Tutorials" => [
            "Getting started" => "tutorials/getting-started.md",
        ],
        "Examples" => "examples/index.md",
        "Reference" => [
            "Syntax & semantics" => "reference/syntax-and-semantics.md",
            "Public API" => "reference/public-api.md",
            "Development tools" => "reference/development-tools.md",
        ],
    ],
    warnonly = true,
)

# No deploydocs: since 2026-09-03 nothing is published by CI. The site root on gh-pages is pushed only by the
# owner through the GoMetaPublic publish gate (exactly the previewed local build). CI builds as a check only.
