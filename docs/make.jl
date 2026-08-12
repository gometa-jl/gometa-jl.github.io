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
    ],
    warnonly = true,
)

DocumenterVitepress.deploydocs(;
    repo = "github.com/gometa-jl/gometa-jl.github.io",
    devbranch = "main",
    branch = "gh-pages",
    push_preview = false,
)
