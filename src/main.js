import { iniciar } from './ui.js';

// VITE_APP_VERSION é definida pelo pipeline de CD (Aula 3); localmente fica "dev".
document.querySelector('#versao').textContent = import.meta.env.VITE_APP_VERSION || 'dev';
iniciar(document);
