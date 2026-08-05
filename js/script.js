// Seleciona o formulário, o input e a div de resultado
const form = document.getElementById('formBusca');
const inputJogo = document.getElementById('inputJogo');
const divResultado = document.getElementById('resultado');

// Intercepta o envio do formulário
form.addEventListener('submit', async function(event) {
    // Previne que a página recarregue (comportamento padrão do form)
    event.preventDefault(); 
    
    const query = inputJogo.value.trim();
    
    if (!query) {
        divResultado.innerHTML = "Por favor, digite o nome de um jogo.";
        return;
    }

    divResultado.innerHTML = "Buscando...";

    try {
        // ETAPA 1: Busca o jogo pelo nome digitado para descobrir o gameID
        const resBusca = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}`);
        const dadosBusca = await resBusca.json();

        if (dadosBusca.length === 0) {
            divResultado.innerHTML = "Nenhum jogo encontrado com esse nome.";
            return;
        }

        // Pega o ID do primeiro jogo da lista de resultados
        const gameID = dadosBusca[0].gameID;

        // ETAPA 2: Usa o gameID para buscar os detalhes do jogo
        const resDetalhes = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`);
        const dadosDetalhes = await resDetalhes.json();

        // Extrai as informações de preço histórico
        const nomeDoJogo = dadosDetalhes.info.title;
        const menorPreco = dadosDetalhes.cheapestPriceEver.price;
        
        // A API retorna a data em timestamp UNIX (segundos), então multiplicamos por 1000 para converter para milissegundos
        const dataTimestamp = dadosDetalhes.cheapestPriceEver.date * 1000;
        const dataFormatada = new Date(dataTimestamp).toLocaleDateString('pt-BR');

        // Exibe o resultado na tela
        divResultado.innerHTML = `O menor preço histórico de <strong>${nomeDoJogo}</strong> foi <strong>$${menorPreco}</strong> em ${dataFormatada}.`;

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


