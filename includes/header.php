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

            <form id="formBusca" class="search-form">
            <input id="inputJogo" type="search" name="q" placeholder="Que jogo você procura?">
            </form>

            <div class="opcoes">
                <select name="regiao" class="seletor-regiao">
                    <option value="br">Brasil (R$)</option>
                    <option value="us">EUA ($)</option>
                    <option value="eu">Europa (€)</option>
                </select>

                <!-- Botão chamando a função -->
                <button class="botao-tema" onclick="alternarTema()">Tema</button>
            </div>
        </div>
</header> <!-- O header fecha aqui, antes do conteúdo da página -->

<script>
        (function() {
            const temaSalvo = localStorage.getItem('temaPreferido');
            if (temaSalvo === 'claro') {
                document.body.classList.add('tema-claro');
            }
        })();
</script>

