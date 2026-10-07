<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sale-Sale</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div id="resultado"></div>

    <main>
        <section class="hero-ofertas" aria-label="Oferta em destaque">
            <div class="hero-copy">
                <p class="hero-etiqueta">RADAR DE OFERTAS</p>
                <h1>Seu próximo jogo, por menos.</h1>
                <p>Preços e descontos atualizados para você encontrar uma boa oferta.</p>
                <a class="hero-cta" href="#lista-promocoes">Explorar ofertas</a>
            </div>
            <div class="oferta-destaque" id="oferta-destaque" aria-live="polite" aria-busy="true">
                <p class="loading">Buscando oferta em destaque...</p>
            </div>
        </section>

        <section class="promocoes" id="lista-promocoes" aria-labelledby="titulo-promocoes">
            <div class="promocoes-header">
                <div>
                    <p class="secao-etiqueta">ENCONTRE SEU PRÓXIMO JOGO</p>
                    <h2 id="titulo-promocoes">Ofertas em alta</h2>
                </div>
                <div class="promocoes-filtros" role="group" aria-label="Ordenar promoções">
                    <button type="button" class="filtro-ativo" aria-pressed="true">Mais avaliados</button>
                    <button type="button" class="filtro-inativo" aria-pressed="false">Lançamentos</button>
                    <button type="button" class="filtro-inativo" aria-pressed="false">Mais Descontos</button>
                </div>
            </div>
            <div class="promocoes-controles">
                <label for="filtro-loja">Loja
                    <select id="filtro-loja" name="loja">
                        <option value="todas">Todas as lojas</option>
                        <option value="1" selected>Steam</option>
                    </select>
                </label>
                <label for="filtro-preco">Preço máximo
                    <select id="filtro-preco" name="preco">
                        <option value="25">US$ 25</option>
                        <option value="50" selected>US$ 50</option>
                        <option value="100">US$ 100</option>
                        <option value="">Sem limite</option>
                    </select>
                </label>
                <span class="plataforma-nota">Ofertas para PC</span>
            </div>
            <div class="promocoes-container" aria-live="polite" aria-busy="true">
                <p class="loading">Carregando promoções...</p>
            </div>
        </section>
    </main>


    <?php include '../includes/footer.php'; ?>
    <script type="module" src="../js/script.js"></script>
</body>
</html>