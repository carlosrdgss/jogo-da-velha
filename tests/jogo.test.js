import { describe, it, expect } from 'vitest';
import { novoEstado, jogar, calcularVencedor, mensagemStatus } from '../src/jogo.js';

const sequencia = (...posicoes) => posicoes.reduce((e, p) => jogar(e, p), novoEstado());

describe('jogo', () => {
  it('começa vazio com X', () => {
    const e = novoEstado();
    expect(e.tabuleiro.every((c) => c === null)).toBe(true);
    expect(e.jogador).toBe('X');
  });

  it('alterna jogadores', () => {
    const e = sequencia(0);
    expect(e.tabuleiro[0]).toBe('X');
    expect(e.jogador).toBe('O');
  });

  it('ignora casa ocupada e posição inválida', () => {
    const e = sequencia(0);
    expect(jogar(e, 0)).toBe(e);
    expect(jogar(e, 9)).toBe(e);
    expect(jogar(e, -1)).toBe(e);
    expect(jogar(e, 1.5)).toBe(e);
  });

  it('não muta o estado anterior', () => {
    const e = novoEstado();
    jogar(e, 4);
    expect(e.tabuleiro[4]).toBeNull();
  });

  it('X vence na linha de cima', () => {
    const e = sequencia(0, 3, 1, 4, 2);
    expect(e.vencedor).toBe('X');
    expect(e.linha).toEqual([0, 1, 2]);
  });

  it('O vence na diagonal', () => {
    const e = sequencia(1, 0, 3, 4, 5, 8);
    expect(e.vencedor).toBe('O');
  });

  it('bloqueia jogadas depois do fim', () => {
    const fim = sequencia(0, 3, 1, 4, 2);
    expect(jogar(fim, 8)).toBe(fim);
  });

  it('detecta empate', () => {
    const e = sequencia(0, 1, 2, 4, 3, 5, 7, 6, 8);
    expect(e.vencedor).toBeNull();
    expect(e.empate).toBe(true);
  });

  it('calcularVencedor devolve null sem vencedor', () => {
    expect(calcularVencedor(Array(9).fill(null))).toBeNull();
  });

  it('mensagens de status', () => {
    expect(mensagemStatus(novoEstado())).toBe('Vez do jogador X');
    expect(mensagemStatus(sequencia(0, 3, 1, 4, 2))).toBe('Jogador X venceu!');
    expect(mensagemStatus(sequencia(0, 1, 2, 4, 3, 5, 7, 6, 8))).toMatch(/Empate/);
  });
});
