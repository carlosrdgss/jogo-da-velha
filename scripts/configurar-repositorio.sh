#!/usr/bin/env bash
# Configura o repositório no GitHub conforme o PGC, via GitHub CLI (gh).
# Equivale aos passos 3 a 6 da Aula 1 (também possível pela interface web).
#
# Pré-requisitos: gh instalado e autenticado (gh auth login, HTTPS);
#                 executar dentro do clone; repositório PÚBLICO.
#
# Uso: bash scripts/configurar-repositorio.sh <usuario-lider> <usuario-par-revisao> [aprovacoes] [com-checks]
#   aprovacoes = 1 (padrão). Use 0 apenas se trabalhar sozinho.
#   com-checks = 1 -> exige também os checks ci-ok e titulo-pr (só depois de rodarem uma vez).

set -euo pipefail

LIDER="${1:?Informe o usuário GitHub do Desenvolvedor Líder (você)}"
PAR="${2:?Informe o usuário GitHub do par de revisão}"
APROVACOES="${3:-1}"
COM_CHECKS="${4:-0}"
REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)

passo() { echo "==> $1"; }
echo "Configurando $REPO (líder: $LIDER, par: $PAR, aprovações: $APROVACOES)"

passo "Convidando o par de revisão com permissão de escrita (push)"
gh api -X PUT "repos/$REPO/collaborators/$PAR" -f permission=push > /dev/null

passo "Merge somente por squash, título do PR como mensagem, apagar branch após merge"
gh api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=PR_BODY \
  -F delete_branch_on_merge=true > /dev/null

passo "Criando Environments staging e production (production com $LIDER como revisor obrigatório)"
LIDER_ID=$(gh api "users/$LIDER" --jq .id)
gh api -X PUT "repos/$REPO/environments/staging" --input - > /dev/null <<JSON
{ "deployment_branch_policy": { "protected_branches": true, "custom_branch_policies": false } }
JSON
gh api -X PUT "repos/$REPO/environments/production" --input - > /dev/null <<JSON
{
  "wait_timer": 0,
  "prevent_self_review": false,
  "reviewers": [ { "type": "User", "id": $LIDER_ID } ],
  "deployment_branch_policy": { "protected_branches": true, "custom_branch_policies": false }
}
JSON

passo "Protegendo a main (PR obrigatório, histórico linear, sem exceções para admins)"
if [ "$COM_CHECKS" = "1" ]; then
  CHECKS='{ "strict": true, "contexts": ["ci-ok", "titulo-pr"] }'
else
  CHECKS='null'
fi
gh api -X PUT "repos/$REPO/branches/main/protection" --input - > /dev/null <<JSON
{
  "required_status_checks": $CHECKS,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": $APROVACOES,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

echo "Pronto. Confira em: https://github.com/$REPO/settings"
echo "Agora teste: faça um commit direto na main e tente 'git push' — deve ser recusado."
