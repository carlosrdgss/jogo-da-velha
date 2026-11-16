# Plano de Gerenciamento de Configuração de Software (PGC) — Jogo da Velha

| | |
|---|---|
| **Projeto** | Jogo da Velha (HTML + JavaScript, roda no navegador) |
| **Repositório** | https://github.com/carlosrdgss/jogo-da-velha |
| **Desenvolvedor Líder** | Carlos (@carlosrdgss) |
| **Par de revisão** | @EduardoAlcalaa |
| **Disciplina** | Gerência de Configuração de Software — Católica SC |
| **Versão do plano** | 1.0 |

Este plano é um **item de configuração**: vive no repositório, é alterado só por Pull
Request revisado e tem seu histórico versionado (seção 4.1).

## 1. Objetivo e escopo

Definir como o código, os testes, os pipelines e a documentação do Jogo da Velha são
identificados, versionados, revisados, integrados e entregues. Cobre todo o conteúdo do
repositório. Enfoque DevOps: integração e entrega contínuas (CI/CD) via GitHub Actions.

## 2. Papéis e responsabilidades

| Papel | Quem | Responsabilidades |
|---|---|---|
| Desenvolvedor Líder | @carlosrdgss | Mantém o repositório e este plano; revisor obrigatório do ambiente `production`; decide releases |
| Par de revisão | @EduardoAlcalaa | Colaborador com permissão de escrita; revisa e aprova todo PR do Líder (e vice-versa no projeto dele) |
| Pipeline (GitHub Actions) | automático | Executa lint, testes, cobertura, SCA e build a cada PR |

Regra: ninguém aprova o próprio PR (o GitHub impede) — por isso existe o par de revisão.

## 3. Ambientes, ramificação e merge

### 3.1 Estrutura do repositório

```
jogo-da-velha/
├── src/            código: jogo.js (regras), placar.js, ui.js, main.js, estilo.css
├── tests/          testes automatizados (Vitest)
├── docs/           este plano, ADRs, evidências
├── scripts/        configuração do repositório
├── .github/        workflows (CI), CODEOWNERS, templates de PR e Issues
├── index.html  package.json  package-lock.json  vite.config.js  eslint.config.js
└── .gitignore  .gitattributes  .env.example  .nvmrc  README.md
```

### 3.2 Ambientes

| Ambiente | Finalidade | Regra de promoção |
|---|---|---|
| Local | desenvolvimento (`npm run dev`) | — |
| Revisão de PR | artefato `web-pr-<n>` gerado pelo CI | a cada push no PR |
| `staging` | validação antes de produção | automática após merge na `main` (Aula 3) |
| `production` | versão publicada | **aprovação obrigatória do Desenvolvedor Líder** (Environment com *Required reviewers*) |

### 3.3 Branching e merge (trunk-based simplificado)

- `main` é a única branch de longa duração e está **protegida**: push direto é recusado;
  só entra código por Pull Request.
- Branches de trabalho: `feature/<issue>-<descricao>`, `fix/<issue>-<descricao>`,
  `docs/<descricao>`; curtas, apagadas automaticamente após o merge.
- Regras da `main`: PR obrigatório · 1 aprovação · aprovações antigas descartadas a cada novo
  commit · histórico linear · sem exceções nem para administradores · sem force-push/exclusão.
- **Somente squash merge**: cada PR vira um commit, com o título do PR como mensagem.

## 4. Itens de configuração

### 4.1 Lista de itens (CIs)

| Item | Caminho | Observação |
|---|---|---|
| Código-fonte | `src/` | regras separadas da interface |
| Testes | `tests/` | cobertura mínima de 60% |
| Plano de GCS | `docs/plano-gcs.md` | este documento |
| Decisões de arquitetura | `docs/adr/` | um arquivo por decisão |
| Pipelines | `.github/workflows/` | pipeline também é configuração |
| Modelos de colaboração | `.github/` (PR, Issues, CODEOWNERS) | |
| Dependências travadas | `package.json` + `package-lock.json` | versões exatas |
| Configuração de build/lint | `vite.config.js`, `eslint.config.js`, `.nvmrc` | Node 22 |
| Variáveis de ambiente (nomes) | `.env.example` | **nunca** valores reais |
| Normas do repositório | `.gitignore`, `.gitattributes`, `README.md` | |

Segredos jamais entram no repositório; no pipeline usam-se **GitHub Secrets**.

### 4.2 Convenções de nomenclatura

- **Commits e títulos de PR:** Conventional Commits — `<tipo>(<escopo>): <descrição>`
  (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`).
  Validado pelo check `titulo-pr`.
- **Versões:** SemVer `MAJOR.MINOR.PATCH` (`feat` → MINOR, `fix` → PATCH, `!` ou
  `BREAKING CHANGE` → MAJOR). **Tags:** `vX.Y.Z`.
- **Branches:** ver 3.3. **Artefatos:** `web-pr-<n>`, `web-dist`.

## 5. Revisão e integração contínua

### 5.1 Pipeline de CI (`.github/workflows/ci.yml`)

Disparado em todo PR para a `main`: `npm ci` → lint → testes com cobertura (≥ 60%) →
`npm audit` (bloqueia vulnerabilidade crítica) → build → publicação do artefato do PR.
O job agregador `ci-ok` resume o resultado e é o check exigido na proteção da `main`.

### 5.2 Revisão por pares

Todo PR segue o template `.github/pull_request_template.md` (contexto, decisão, como
testar, checklist), é pequeno e trata de um único assunto. O `CODEOWNERS` solicita a
revisão automaticamente. Prazo de resposta do par: até 3 dias úteis.

### 5.3 Quality gates

| Gate | Critério |
|---|---|
| Título do PR | Conventional Commits |
| Lint | zero erros |
| Testes | todos passam; cobertura de linhas ≥ 60% |
| SCA | nenhuma vulnerabilidade crítica em dependências de produção |
| Build | compila sem erro |
| Revisão | 1 aprovação de outra pessoa |

## 6. Entrega contínua (Aula 3)

merge na `main` → CD calcula a versão SemVer e faz o build **uma única vez** → publica em
`staging` → aguarda aprovação do Líder no Environment `production` → publica em produção,
cria a tag `vX.Y.Z` e a Release. O mesmo artefato validado em staging vai para produção.
Rollback: reexecutar o deploy de uma versão anterior.

## 8. Controle de mudanças

Mudanças comuns passam pelo fluxo de PR (seção 5). Mudanças de **alto risco** (alteração do
pipeline, do plano, de dependências críticas, hotfix em produção) abrem uma Issue com o
modelo *Mudança de alto risco* e exigem decisão registrada do Líder e do par antes do merge.

## 9. Baselines e releases

Cada release gera a tag `vX.Y.Z` e uma Release no GitHub com notas automáticas. A tag é a
baseline: permite reconstruir e restaurar exatamente aquela versão.

## 13. Segurança

2FA obrigatório nas contas · nenhum segredo no código · `.env` no `.gitignore` · Dependabot
e `npm audit` para vulnerabilidades · proteção da `main` sem bypass · deploy em produção com
aprovação humana.

## 14. Histórico do plano

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | 16/11/2026 | Versão inicial |
