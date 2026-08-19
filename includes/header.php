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
            <input 
                id="inputJogo" 
                type="search" 
                name="q" 
                placeholder="Buscar jogos..." 
                autocomplete="off"
            >
            <button type="submit" class="search-button" aria-label="Buscar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
            </button>
            </form>

            <div class="opcoes">
                <select name="regiao" class="seletor-regiao">
                    <option value="br">Brasil (R$)</option>
                    <option value="us">EUA ($)</option>
                    <option value="eu">Europa (€)</option>
                </select>

                
                <button class="botao-tema" onclick="alternarTema()">Tema</button>
            </div>
        </div>
</header> 

<script>
        (function() {
            const temaSalvo = localStorage.getItem('temaPreferido');
            if (temaSalvo === 'claro') {
                document.body.classList.add('tema-claro');
            }
        })();
</script>

