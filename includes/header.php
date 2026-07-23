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

            <button class="botao-tema">Tema</button>
        </div>
    </div>
</header>