const form = document.getElementById('formBusca');
const inputJogo = document.getElementById('inputJogo');
const divResultado = document.getElementById('resultado');

form.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const query = inputJogo.value.trim();
    
    if (!query) {
        divResultado.innerHTML = "Por favor, digite o nome de um jogo.";
        return;
    }

    divResultado.innerHTML = "Buscando...";

    try {
        // ETAPA 1: Busca os jogos pelo nome
        // ETAPA 1
const resBusca = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}`);
        const dadosBusca = await resBusca.json();

        if (dadosBusca.length === 0) {
            divResultado.innerHTML = "Nenhum jogo encontrado com esse nome.";
            return;
        }

        // Limita a busca aos 5 primeiros resultados (ou menos, se a API trouxer menos de 5)
        const primeirosJogos = dadosBusca.slice(0, 5);

        // ETAPA 2: Cria uma lista de requisições para os detalhes de cada um dos 5 jogos
        const promessasDetalhes = primeirosJogos.map(jogo => 
            fetch(`https://www.cheapshark.com/api/1.0/games?id=${jogo.gameID}`).then(res => res.json())
                );

        // Aguarda a resposta de todas as 5 requisições ao mesmo tempo
        const listaDetalhes = await Promise.all(promessasDetalhes);

        // Limpa o texto de "Buscando..." para colocar os cards
        divResultado.innerHTML = "";

        // ETAPA 3: Passa por cada jogo e cria o HTML dele
        listaDetalhes.forEach(dadosDetalhes => {
            const nomeDoJogo = dadosDetalhes.info.title;
            const urlImagem = dadosDetalhes.info.thumb;
            const menorPreco = dadosDetalhes.cheapestPriceEver.price;
            
            const dataTimestamp = dadosDetalhes.cheapestPriceEver.date * 1000;
            const dataFormatada = new Date(dataTimestamp).toLocaleDateString('pt-BR');

            // Cria uma caixinha (card) para cada jogo e adiciona na div de resultado
            divResultado.innerHTML += `
                <div style="display: flex; align-items: center; gap: 15px; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                    <img src="${urlImagem}" alt="Capa do jogo ${nomeDoJogo}" style="width: 120px; height: auto; border-radius: 4px; object-fit: cover;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${nomeDoJogo}</h3>
                        <p style="margin: 0;">Menor preço histórico: <strong>$${menorPreco}</strong> em ${dataFormatada}.</p>
                    </div>
                </div>
            `;
        });

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        divResultado.innerHTML = "Ocorreu um erro ao buscar os dados da API.";
    }
});


function alternarTema() {
    // Alterna a classe 'tema-claro' no body (que você já configurou no CSS)
    const corpo = document.body;
    corpo.classList.toggle('tema-claro');
    
    // Verifica se o tema claro ficou ativo após o clique
    const ehTemaClaro = corpo.classList.contains('tema-claro');
    
    // Salva a escolha do usuário no navegador
    localStorage.setItem('temaPreferido', ehTemaClaro ? 'claro' : 'escuro');
}


