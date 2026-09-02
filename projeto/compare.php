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
    <div id="resultado" style="margin: 20px; text-align: center;"></div>

    <section class="Ruy">
        <p>RUY RODRIGUEZ</p>
    </section>

    <!-- CONTAINER PRINCIPAL -->
    <div class="secao-layout-grupo">
        
        <!-- GRADE DE FOTOS NA ESQUERDA -->
        <div class="grade-fotos-esquerda">
            <div class="quadrado-foto">
                <img src="../assets/images/xbox_store.png" alt="Xbox Store" class="imagem-foto">
            </div>

            <div class="quadrado-foto">
                <img src="../assets/images/xbox_store.png" alt="Xbox Store" class="imagem-foto">
            </div>

            <div class="quadrado-foto">
                <img src="../assets/images/xbox_store.png" alt="Xbox Store" class="imagem-foto">
            </div>
                
            <div class="quadrado-foto">
                <img src="../assets/images/xbox_store.png" alt="Xbox Store" class="imagem-foto">
            </div>
        </div> <!-- Fechamento correto da grade -->
        
        <!-- BLOCO DA DIREITA -->
        <div class="quadrado-grupo-direita">
            <h2 class="titulo-secao">NOSSO GRUPO</h2>
            <hr class="linha-divisoria">
            
            <div class="lista-integrantes">
                <p>João Pedro Ferreira</p>
                <p>Pedro Henrique</p>
                <p>Ericky Gabriel</p>
                <p>Tiago Augusto</p>
            </div>

            <h2 class="titulo-secao">SOBRE O PROJETO</h2>
            <hr class="linha-divisoria">
            
            <div class="texto-projeto">
                <p>Somos alunos do Terceiro ano do ensino médio, fazemos parte do curso técnico do Ruy e esse site é nosso projeto de TCC</p>
                <p>Fizemos o site com o objetivo de mostrar a parte de trás dos sites/aplicativos para as pessoas verem do...</p>
            </div>
        </div>

    </div>

    <?php include '../includes/footer.php'; ?>
    <script src="../js/script.js"></script>
    <script type="module" src="../js/script.js"></script>  
</body>
</html>
