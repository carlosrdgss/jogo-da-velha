# Evidência — recusa do push direto na `main`

> Preencha depois de configurar a proteção da `main` (passo 6 da Aula 1).

**Como foi feito:**

```bash
git switch main
git pull
echo "teste" >> teste-push-direto.txt
git add teste-push-direto.txt
git commit -m "chore: tentativa de push direto"
git push origin main
```

**Saída do terminal (cole aqui):**

```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
To https://github.com/carlosrdgss/jogo-da-velha.git
 ! [remote rejected] main -> main (protected branch hook declined)
error: failed to push some refs to 'https://github.com/carlosrdgss/jogo-da-velha.git'
```

*(Exemplo do formato esperado — substitua pela saída real e/ou adicione um print em `docs/evidencias/`.)*

Depois desfaça o commit local: `git reset --hard origin/main`.
