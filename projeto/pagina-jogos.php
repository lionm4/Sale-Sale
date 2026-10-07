<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sale-Sale - Detalhes do Jogo</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
        
        <?php
        // ============================================
        // 1. PEGA O ID DA URL
        // ============================================
        $gameID = isset($_GET['id']) ? trim($_GET['id']) : '';
        
        // Verifica se o ID é válido
        if (empty($gameID) || !is_numeric($gameID)) {
            echo '<div style="text-align: center; padding: 60px 20px;">';
            echo '  <h2 style="color: white; font-size: 28px;">🔍 Jogo não encontrado</h2>';
            echo '  <p style="color: #a0aec0; font-size: 16px;">ID inválido: ' . htmlspecialchars($gameID) . '</p>';
            echo '  <a href="index.php" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #4d6fff; color: white; text-decoration: none; border-radius: 8px;">';
            echo '    ← Voltar para a página inicial';
            echo '  </a>';
            echo '</div>';
            include '../includes/footer.php';
            exit;
        }
        
        // ============================================
        // 2. BUSCA NA API
        // ============================================
        $proxyUrl = "http://localhost/sale-sale/api/proxy.php?endpoint=games&params=" . urlencode("id={$gameID}");

// Usa cURL em vez de file_get_contents
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $proxyUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Ignora verificação SSL (só para dev)
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Sale-Sale/1.0'); // User-Agent
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

    if ($response === false || $httpCode !== 200) {
        echo '<div style="text-align: center; padding: 60px 20px;">';
        echo '  <h2 style="color: white; font-size: 28px;">❌ Erro na requisição</h2>';
        echo '  <p style="color: #a0aec0; font-size: 16px;">Não foi possível acessar a API.</p>';
        echo '  <p style="color: #a0aec0; font-size: 14px;">ID: ' . $gameID . '</p>';
        echo '  <p style="color: #a0aec0; font-size: 14px;">HTTP Code: ' . $httpCode . '</p>';
        echo '  <a href="index.php" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #4d6fff; color: white; text-decoration: none; border-radius: 8px;">';
        echo '    ← Voltar para a página inicial';
        echo '  </a>';
        echo '</div>';
        include '../includes/footer.php';
        exit;
}
        
        $dados = json_decode($response, true);
        
        // Verifica se os dados são válidos
        if (!$dados || empty($dados['info'])) {
            echo '<div style="text-align: center; padding: 60px 20px;">';
            echo '  <h2 style="color: white; font-size: 28px;">🎮 Jogo não encontrado</h2>';
            echo '  <p style="color: #a0aec0; font-size: 16px;">O jogo com ID ' . $gameID . ' não existe ou não está disponível.</p>';
            echo '  <a href="index.php" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: #4d6fff; color: white; text-decoration: none; border-radius: 8px;">';
            echo '    ← Voltar para a página inicial';
            echo '  </a>';
            echo '</div>';
            include '../includes/footer.php';
            exit;
        }
        
        // ============================================
        // 3. EXTRAI OS DADOS
        // ============================================
        $info = $dados['info'];
        $deals = $dados['deals'] ?? [];
        
        $nome = $info['title'] ?? 'Nome desconhecido';
        $thumb = $info['thumb'] ?? '';
        $descricao = $info['description'] ?? 'Descrição não disponível.';
        ?>
        
        <!-- ============================================ -->
        <!-- EXIBIÇÃO DO JOGO -->
        <!-- ============================================ -->
        
        <div style="display: flex; gap: 30px; background: #3a3f4b; padding: 30px; border-radius: 12px; margin-bottom: 30px; flex-wrap: wrap;">
            <?php if ($thumb): ?>
                <img src="<?php echo $thumb; ?>" alt="<?php echo $nome; ?>" style="width: 200px; height: auto; border-radius: 8px; flex-shrink: 0;">
            <?php endif; ?>
            
            <div style="flex: 1;">
                <h1 style="color: white; margin: 0 0 10px 0;"><?php echo htmlspecialchars($nome); ?></h1>
                <p style="color: #c7c9cf; margin: 0; line-height: 1.6;"><?php echo htmlspecialchars($descricao); ?></p>
                <p style="color: #a0aec0; font-size: 14px; margin-top: 10px;">ID: <?php echo $gameID; ?></p>
            </div>
        </div>
        
        <!-- ============================================ -->
        <!-- PREÇOS NAS LOJAS -->
        <!-- ============================================ -->
        
        <h2 style="color: white; margin-bottom: 20px;">💰 Preços nas lojas</h2>
        
        <?php
    // Define as 4 lojas que queremos exibir
         $LOJAS_PERMITIDAS = ['1', '25', '27', '29'];

// Filtra os deals para mostrar apenas essas lojas
            $dealsFiltrados = array_filter($deals, function($deal) use ($LOJAS_PERMITIDAS) {
        return in_array((string)$deal['storeID'], $LOJAS_PERMITIDAS);
    });

// Reindexa o array (importante para o foreach)
            $dealsFiltrados = array_values($dealsFiltrados);
        ?>
        <?php if (count($dealsFiltrados) === 0): ?>
            <p style="color: #c7c9cf;">Nenhuma oferta disponível para este jogo.</p>
        <?php else: ?>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                <?php foreach ($dealsFiltrados as $deal): ?>
                    <?php
                    $lojas = [
                        '1'  => ['nome' => 'Steam',      'icone' => 'steam_logo.png'],
                        '25' => ['nome' => 'Epic Games', 'icone' => 'epic_games.png'],
                        '27' => ['nome' => 'PlayStation','icone' => 'playstation-store.png'], // Simulada
                        '29' => ['nome' => 'Xbox Store', 'icone' => 'xbox_store.png']
                    ];
                    
                    $storeID = $deal['storeID'];
                    $preco = $deal['price'] ?? 'N/A';
                    $loja = $lojas[$storeID] ?? ['nome' => 'Loja ' . $storeID, 'icone' => 'placeholder.png'];
                    ?>
                    
                    <div style="background: #3a3f4b; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                         <img 
                            src="../assets/images/<?php echo $loja['icone']; ?>" 
                            alt="<?php echo $loja['nome']; ?>" 
                            style="width: 50px; height: 50px; object-fit: contain; margin-bottom: 10px;"
                            onerror="this.style.display='none'"
                        >

                        <h3 style="color: white; margin: 0 0 10px 0;">
                            <?php echo $loja['nome']; ?>
                        </h3>

                        <?php if ($preco !== 'N/A'): ?>
                            <p style="color: #48bb78; font-size: 24px; font-weight: 700; margin: 0;">
                                $<?php echo number_format($preco, 2); ?>
                            </p>
                        <?php else: ?>
                            <p style="color: #a0aec0; font-size: 16px; margin: 0;">Indisponível</p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <!-- Botão Voltar -->
        <div style="text-align: center; margin-top: 40px;">
            <a href="index.php" style="display: inline-block; padding: 12px 30px; background: #3a3f4b; color: #c7c9cf; text-decoration: none; border-radius: 8px; transition: all 0.3s;">
                ← Voltar para a página inicial
            </a>
        </div>
        
    </main>
    
    <?php include '../includes/footer.php'; ?>
    
<script type="module" src="../js/script.js"></script>
</body>
</html>