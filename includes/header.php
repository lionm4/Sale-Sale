
<header>
    <div class="cabeca">
        <div class="logo">
            <a href="index.php"><img src="../assets/images/logo.png" alt="Sale-Sale"></a>
        </div>

        <nav class="menu">
            <a href="index.php">Homepage</a>
            <a href="news.php">News</a>
            <a href="compare.php">Compare</a>
        </nav>

        <form action="/buscar" method="get" class="search-form">
            <input type="search" name="q" placeholder="Que jogo você procura?">
        </form>

         <div class="opcoes">
            <select name="regiao" class="seletor-regiao">
                <option value="br">Brasil (R$)</option>
                <option value="us">EUA ($)</option>
                <option value="eu">Europa (€)</option>
            </select>

            <button class="botao-tema" onclick="alternarTema()">Tema</button>
            <script>
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


            </script>

            <script src="js/script.js"></script>



        </div>
    </div>

</body>
</html>
</header>
