// Regras do Jogo da Velha — lógica pura, sem DOM (fácil de testar).

export const LINHAS_VENCEDORAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
  [0, 4, 8], [2, 4, 6],            // diagonais
];

export function novoEstado() {
  return {
    tabuleiro: Array(9).fill(null),
    jogador: 'X',
    vencedor: null,
    linha: null,
    empate: false,
  };
}

export function calcularVencedor(tabuleiro) {
  for (const linha of LINHAS_VENCEDORAS) {
    const [a, b, c] = linha;
    if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
      return { vencedor: tabuleiro[a], linha };
    }
  }
  return null;
}

// Retorna um NOVO estado (imutável). Jogada inválida devolve o mesmo estado.
export function jogar(estado, posicao) {
  const valida = Number.isInteger(posicao) && posicao >= 0 && posicao <= 8;
  if (!valida || estado.vencedor || estado.empate || estado.tabuleiro[posicao]) {
    return estado;
  }

  const tabuleiro = [...estado.tabuleiro];
  tabuleiro[posicao] = estado.jogador;

  const resultado = calcularVencedor(tabuleiro);
  if (resultado) {
    return { ...estado, tabuleiro, vencedor: resultado.vencedor, linha: resultado.linha };
  }
  if (tabuleiro.every(Boolean)) {
    return { ...estado, tabuleiro, empate: true };
  }
  return { ...estado, tabuleiro, jogador: estado.jogador === 'X' ? 'O' : 'X' };
}

export function mensagemStatus(estado) {
  if (estado.vencedor) return `Jogador ${estado.vencedor} venceu!`;
  if (estado.empate) return 'Deu velha! Empate.';
  return `Vez do jogador ${estado.jogador}`;
}
