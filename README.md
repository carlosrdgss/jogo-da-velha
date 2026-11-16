# Jogo da Velha

Jogo da Velha para dois jogadores (X e O) que roda no navegador, com placar da sessão.
Projeto da disciplina de **Gerência de Configuração de Software** (Católica SC), aplicando o
[Plano de GCS](docs/plano-gcs.md) com enfoque DevOps (CI/CD).
Baseado no repositório de referência [ongconecta](https://github.com/lzcamargo/ongconecta).

| Pasta | Conteúdo | Stack |
|---|---|---|
| `src/` | regras (`jogo.js`), placar, interface | JavaScript (ES modules) + Vite |
| `tests/` | testes unitários e de interface | Vitest + jsdom |
| `.github/` | CI, CODEOWNERS, templates de PR e Issues | GitHub Actions |
| `docs/` | plano de GCS, ADRs, evidências | Markdown |
| `scripts/` | configuração do repositório | Bash + GitHub CLI |

## Como rodar

Requisito: Node.js 22 (`node -v`) e Git.

```bash
git clone https://github.com/carlosrdgss/jogo-da-velha.git
cd jogo-da-velha
npm ci
npm run dev        # http://localhost:5173
```

## Como rodar os testes

```bash
npm test               # testes
npm run test:coverage  # testes + cobertura (mínimo 60%)
npm run lint           # análise estática
npm run build          # gera a pasta dist/
```

## Como contribuir

1. Crie a branch a partir da `main`: `git switch -c feature/<issue>-<descricao>`
2. Commits e **título do PR** em Conventional Commits (`feat(jogo): adiciona placar`).
3. Abra o Pull Request e preencha o template. A `main` **não aceita push direto**: exige
   1 aprovação do par de revisão e o merge é sempre *squash*.

## Governança (Aula 1)

- Plano de GCS: [docs/plano-gcs.md](docs/plano-gcs.md)
- Decisões: [docs/adr](docs/adr)
- Evidência da recusa do push direto: [docs/evidencias/recusa-push-main.md](docs/evidencias/recusa-push-main.md)
- Configuração do GitHub por script: `bash scripts/configurar-repositorio.sh <lider> <par>`
- Ambientes: `staging` (livre) e `production` (revisor obrigatório: @carlosrdgss)

## Comunicação da equipe

- Prazo de resposta a Pull Requests: até 3 dias úteis
