import { handleInput, handleKeydown, handleSubmit } from './busca.js';
import { initPromocoes } from './promocoes.js';
import { alternarTema, sincronizarTema } from './tema.js';


const form = document.getElementById('formBusca');
const inputJogo = document.getElementById('inputJogo');

// função de busca

form.addEventListener('submit', handleSubmit);
inputJogo.addEventListener('input', handleInput);
inputJogo.addEventListener('keydown', handleKeydown);

// quando a página iniciar:

document.addEventListener('DOMContentLoaded', function() {
    
    initPromocoes();
    
    
    sincronizarTema();
});


window.alternarTema = alternarTema;

import { buscarPromocoes } from './promocoes.js';
window.buscarPromocoes = buscarPromocoes;
