import { describe, it, expect, beforeEach } from 'vitest';
import { iniciar } from '../src/ui.js';
import { novoPlacar, registrarResultado } from '../src/placar.js';
import { novoEstado } from '../src/jogo.js';
import { readFileSync } from 'node:fs';

beforeEach(() => {
  const html = readFileSync('index.html', 'utf8');
  document.body.innerHTML = html.match(/<body>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/, '');
});

const clicar = (pos) => document.querySelector(`[data-pos="${pos}"]`).click();

describe('interface', () => {
  it('desenha 9 casas', () => {
    iniciar(document);
    expect(document.querySelectorAll('.celula')).toHaveLength(9);
  });

  it('joga, vence e atualiza o placar', () => {
    const jogo = iniciar(document);
    [0, 3, 1, 4, 2].forEach(clicar);
    expect(document.querySelector('#status').textContent).toBe('Jogador X venceu!');
    expect(document.querySelector('#placar-X').textContent).toBe('1');
    expect(jogo.obterPlacar().X).toBe(1);
    expect(document.querySelectorAll('.vitoria')).toHaveLength(3);
  });

  it('reinicia mantendo o placar', () => {
    iniciar(document);
    [0, 3, 1, 4, 2].forEach(clicar);
    document.querySelector('#reiniciar').click();
    expect(document.querySelector('#status').textContent).toBe('Vez do jogador X');
    expect(document.querySelector('#placar-X').textContent).toBe('1');
  });
});

describe('placar', () => {
  it('conta empate e ignora partida em andamento', () => {
    const p = novoPlacar();
    expect(registrarResultado(p, novoEstado())).toBe(p);
    expect(registrarResultado(p, { ...novoEstado(), empate: true }).empate).toBe(1);
  });
});
