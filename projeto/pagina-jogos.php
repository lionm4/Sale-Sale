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
        $url = "https://www.cheapshark.com/api/1.0/games?id=" . urlencode($gameID);
        $response = @file_get_contents($url);
        
        if ($response === false) {
            echo '<div style="text-align: center; padding: 60px 20px;">';
            echo '  <h2 style="color: white; font-size: 28px;">❌ Erro na requisição</h2>';
            echo '  <p style="color: #a0aec0; font-size: 16px;">Não foi possível acessar a API.</p>';
            echo '  <p style="color: #a0aec0; font-size: 14px;">ID: ' . $gameID . '</p>';
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
        
        <?php if (count($deals) === 0): ?>
            <p style="color: #c7c9cf;">Nenhuma oferta disponível para este jogo.</p>
        <?php else: ?>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                <?php foreach ($deals as $deal): ?>
                    <?php
                    $lojas = [
                        '1' => ['nome' => 'Steam', 'cor' => '#1b2838'],
                        '2' => ['nome' => 'Epic Games', 'cor' => '#2a2a2a'],
                        '3' => ['nome' => 'PlayStation', 'cor' => '#003791'],
                        '4' => ['nome' => 'Xbox', 'cor' => '#107c10']
                    ];
                    
                    $storeID = $deal['storeID'];
                    $preco = $deal['price'] ?? 'N/A';
                    $loja = $lojas[$storeID] ?? ['nome' => 'Loja ' . $storeID, 'cor' => '#333'];
                    ?>
                    
                    <div style="background: #3a3f4b; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color: white; margin: 0 0 10px 0;"><?php echo $loja['nome']; ?></h3>
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
</body>
</html>