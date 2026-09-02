export function alternarTema() {
    const corpo = document.body;
    corpo.classList.toggle('tema-claro');
    
    const ehTemaClaro = corpo.classList.contains('tema-claro');
    localStorage.setItem('temaPreferido', ehTemaClaro ? 'claro' : 'escuro');
}

export function sincronizarTema() {
    const temaSalvo = localStorage.getItem('temaPreferido');
    if (temaSalvo === 'claro') {
        document.body.classList.add('tema-claro');
    }
}