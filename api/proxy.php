<?php
function limparCacheAntigo($cacheDir, $horasExpiracao = 24) {
    if (!is_dir($cacheDir)) return;
    
    $arquivos = glob($cacheDir . '*.json');
    $agora = time();
    $segundosExpiracao = $horasExpiracao * 3600;
    $limpos = 0;
    
    foreach ($arquivos as $arquivo) {
        if (($agora - filemtime($arquivo)) > $segundosExpiracao) {
            @unlink($arquivo);
            $limpos++;
        }
    }
    
    return $limpos;
}

// Executa a limpeza (com 5% de chance em cada requisição, para não pesar)
if (mt_rand(1, 100) <= 5) {
    limparCacheAntigo($cacheDir, 24);
}
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$cacheDir = __DIR__ . '/cache/';
$cacheExpiry = 7200; // tempo do cache
$userAgent = 'Sale-Sale-TCC/1.0 (contato@sale-sale.com)';

$endpoint = $_GET['endpoint'] ?? '';
$params = $_GET['params'] ?? '';

$endpointsPermitidos = ['deals', 'games', 'stores', 'game'];
if (!in_array($endpoint, $endpointsPermitidos)) {
    http_response_code(400);
    echo json_encode(['error' => 'Endpoint não permitido']);
    exit;
}

$apiUrl = "https://www.cheapshark.com/api/1.0/{$endpoint}";
if (!empty($params)) {
    $apiUrl .= "?{$params}";
}

if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}

$cacheKey = md5($apiUrl);
$cacheFile = $cacheDir . $cacheKey . '.json';

if (file_exists($cacheFile)) {
    $lastModified = filemtime($cacheFile);
    if (time() - $lastModified < $cacheExpiry) {
       
        echo file_get_contents($cacheFile);
        exit;
    }
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Necessário em alguns hosts
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent); // OBRIGATÓRIO pela API
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($httpCode === 200 && !empty($response)) {
   
    @file_put_contents($cacheFile, $response, LOCK_EX);
    echo $response;
} elseif ($httpCode === 429) {
    
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit atingido',
            'message' => 'Muitas requisições. Tente novamente em alguns segundos.'
        ]);
    }
} else {
     if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        http_response_code($httpCode ?: 500);
        echo json_encode([
            'error' => 'Falha ao buscar dados',
            'http_code' => $httpCode,
            'curl_error' => $curlError
        ]);
    }
}






?>