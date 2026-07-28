function alternarTema() {
    // Acessa as variáveis globais do :root
    const root = document.documentElement;
    
    // Obtém a cor atual do fundo para saber qual tema está ativo
    const corAtual = getComputedStyle(root).getPropertyValue('--azul-medio').trim();

    // Se estiver no tema escuro (#26315c), muda para o claro
    if (corAtual === '#26315c') {
        root.style.setProperty('--azul-medio', '#ffffff');       /* Fundo branco */
        root.style.setProperty('--texto-escuro', '#1c1c1c');     /* Texto preto */
        root.style.setProperty('--cinza-claro', '#1a2440');      /* Cor do botão escura */
        root.style.setProperty('--azul-escuro', '#c7c9cf');      /* Barra superior clara */
    } else {
        // Se estiver no tema claro, volta para o escuro original
        root.style.setProperty('--azul-medio', '#26315c');
        root.style.setProperty('--texto-escuro', '#ffffff'); // Ajustado para dar contraste no escuro
        root.style.setProperty('--cinza-claro', '#c7c9cf');
        root.style.setProperty('--azul-escuro', '#1a2440');
    }
}
ordem