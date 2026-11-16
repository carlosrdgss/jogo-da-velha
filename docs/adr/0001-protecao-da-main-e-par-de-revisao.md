# 0001 — Proteção da main e par de revisão

- Status: aceito
- Data: 16/11/2026

## Contexto
O PGC exige que nenhuma alteração chegue à `main` sem revisão de outra pessoa. O GitHub
não permite aprovar o próprio Pull Request.

## Decisão
1. A `main` exige PR com 1 aprovação, histórico linear e vale para administradores também.
2. Um colega é adicionado como colaborador com permissão de escrita (par de revisão).
3. Somente squash merge, com o título do PR (Conventional Commits) como mensagem.
4. Environments `staging` e `production`; este com o Desenvolvedor Líder como revisor obrigatório.

## Consequências
- Todo código tem dois pares de olhos antes de entrar.
- O histórico da `main` fica linear e legível; a versão pode ser calculada dos títulos.
- Depende da disponibilidade do par de revisão (prazo combinado: 3 dias úteis).
