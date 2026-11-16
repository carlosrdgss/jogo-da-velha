import { novoEstado, jogar, mensagemStatus } from './jogo.js';
import { novoPlacar, registrarResultado } from './placar.js';

// Liga as regras (jogo.js) ao DOM. Recebe a raiz para poder ser testado com jsdom.
export function iniciar(raiz = document) {
  const tabuleiroEl = raiz.querySelector('#tabuleiro');
  const statusEl = raiz.querySelector('#status');
  const botaoReiniciar = raiz.querySelector('#reiniciar');

  let estado = novoEstado();
  let placar = novoPlacar();

  function desenhar() {
    tabuleiroEl.replaceChildren();
    estado.tabuleiro.forEach((valor, i) => {
      const celula = raiz.ownerDocument
        ? raiz.ownerDocument.createElement('button')
        : document.createElement('button');
      celula.type = 'button';
      celula.className = 'celula';
      celula.dataset.pos = String(i);
      celula.textContent = valor ?? '';
      celula.setAttribute('aria-label', `Casa ${i + 1}${valor ? `: ${valor}` : ''}`);
      if (valor) celula.classList.add(valor === 'X' ? 'x' : 'o');
      if (estado.linha?.includes(i)) celula.classList.add('vitoria');
      celula.disabled = Boolean(valor) || Boolean(estado.vencedor) || estado.empate;
      tabuleiroEl.appendChild(celula);
    });
    statusEl.textContent = mensagemStatus(estado);
    raiz.querySelector('#placar-X').textContent = placar.X;
    raiz.querySelector('#placar-O').textContent = placar.O;
    raiz.querySelector('#placar-empate').textContent = placar.empate;
  }

  tabuleiroEl.addEventListener('click', (evento) => {
    const alvo = evento.target.closest('[data-pos]');
    if (!alvo) return;
    const novo = jogar(estado, Number(alvo.dataset.pos));
    if (novo === estado) return;
    estado = novo;
    placar = registrarResultado(placar, estado);
    desenhar();
  });

  botaoReiniciar.addEventListener('click', () => {
    estado = novoEstado();
    desenhar();
  });

  desenhar();
  return { obterEstado: () => estado, obterPlacar: () => placar };
}
