# Repository Instructions

## GitHub publishing

- When the user asks to update or push to GitHub, use the repository's configured Git remote and Git transport directly.
- Do not require a successful `gh auth status` check and do not ask the user for credentials before attempting the requested Git operation.
- Only report an authentication problem if the actual `git push` fails with an authentication or authorization error.
- On the `gh-pages` deployment branch, push directly when the user asks to publish unless they explicitly request a pull request or another branch workflow.
- Preserve unrelated working-tree changes. Stage only the files that belong to the requested update unless the user explicitly asks to include everything.
