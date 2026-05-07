# Contributing to Digital Luxe

Thanks for helping improve **Digital Luxe** in the ToolSmart collection.

## Read these first

- [README.md](README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Agent Onboarding](docs/AGENT_ONBOARDING.md)
- [Copilot Instructions](.github/copilot-instructions.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)

---

## Development setup

```bash
git clone https://github.com/smartscott-LLC/digital-luxe.git
cd digital-luxe
npm start
```

App runs at `http://localhost:3002`.

- No build step
- No framework
- No test runner currently

---

## Contribution standards

1. Keep changes focused and minimal.
2. Preserve vanilla JS + local-first architecture.
3. Preserve Shadow DOM component isolation.
4. Follow existing naming/style patterns.
5. Update docs for behavior changes.

---

## Pull request checklist

- [ ] Problem is clearly described
- [ ] Solution is scoped and justified
- [ ] Core interactions manually verified (canvas + vault + export + smartbar)
- [ ] Documentation updated (`README` + `/docs` as needed)
- [ ] Conventional commit message used

---

## Commit format

Use Conventional Commits:

```txt
feat(scope): short description
fix(scope): short description
docs(scope): short description
refactor(scope): short description
chore(scope): short description
```

---

## Feature proposals

Open an issue describing:
- user problem
- proposed UX
- why it fits ToolSmart principles (local-first, no-code usability, reliability)
