function alternarTema() {
    // Alterna a classe 'tema-claro' no body (que você já configurou no CSS)
    const corpo = document.body;
    corpo.classList.toggle('tema-claro');
    
    // Verifica se o tema claro ficou ativo após o clique
    const ehTemaClaro = corpo.classList.contains('tema-claro');
    
    // Salva a escolha do usuário no navegador
    localStorage.setItem('temaPreferido', ehTemaClaro ? 'claro' : 'escuro');
}
