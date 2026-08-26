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

    <section class="promocoes">
        <div class="promocoes-header">
            <h2>Promoções em Destaque</h2>
            <div class="promocoes-filtros">
                <span class="filtro-ativo">Mais Descontos</span>
                <span class="filtro-inativo">Melhor Rating</span>
                <span class="filtro-inativo">Lançamentos</span>
            </div>
        </div>
        <div class="promocoes-container">
            <p>Carregando promoções...</p>
        </div>
    </section>


    <?php include '../includes/footer.php'; ?>
    <script src="../js/script.js"></script>
</body>
</html>