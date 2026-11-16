// Placar da sessão: conta vitórias de X, de O e empates.

export function novoPlacar() {
  return { X: 0, O: 0, empate: 0 };
}

export function registrarResultado(placar, estado) {
  if (estado.vencedor) return { ...placar, [estado.vencedor]: placar[estado.vencedor] + 1 };
  if (estado.empate) return { ...placar, empate: placar.empate + 1 };
  return placar;
}
