// busca da barra de pesquisa

let timeoutID = null;
let ultimaBusca = '';

export async function buscarJogos(query) {
    const divResultado = document.getElementById('resultado');
    
    if (!query || query.length < 3) {
        divResultado.innerHTML = query.length > 0 ? "Digite pelo menos 3 caracteres..." : "";
        return;
    }

    if (query === ultimaBusca) return;
    ultimaBusca = query;

    divResultado.innerHTML = "Buscando...";

    try {
        const resBusca = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}`);
        const dadosBusca = await resBusca.json();

        if (dadosBusca.length === 0) {
            divResultado.innerHTML = "Nenhum jogo encontrado com esse nome.";
            return;
        }

        const primeirosJogos = dadosBusca.slice(0, 5);

        const promessasDetalhes = primeirosJogos.map(jogo => 
            fetch(`https://www.cheapshark.com/api/1.0/games?id=${jogo.gameID}`)
                .then(res => res.json())
                .then(detalhes => {
                    const deals = detalhes.deals || [];
                    
                    // Conta TODAS as lojas disponíveis
                    const numLojas = deals.length;
                    
                    // Conta lojas COM promoção ativa (savings > 0)
                    const numLojasComPromocao = deals.filter(d => 
                        parseFloat(d.savings) > 0
                    ).length;
                    
                    return {
                        ...detalhes,
                        gameID: jogo.gameID,
                        numLojas: numLojas,
                        numLojasComPromocao: numLojasComPromocao
                    };
                })
        );

      const listaDetalhes = await Promise.all(promessasDetalhes);



        const jogosFiltrados = listaDetalhes.filter(dados => 
            dados.numLojas >= 2 && dados.numLojasComPromocao >= 1
        );

        // Se nenhum jogo passou no filtro
        if (jogosFiltrados.length === 0) {
            divResultado.innerHTML = "Nenhum jogo multiplataforma encontrado com promoção ativa.";
            return;
        }

        // ============================================
        // ETAPA 4: Renderiza os cards
        // ============================================
        divResultado.innerHTML = "";

        jogosFiltrados.forEach(dadosDetalhes => {
            const nomeDoJogo = dadosDetalhes.info.title;
            const urlImagem = dadosDetalhes.info.thumb;
            const menorPreco = dadosDetalhes.cheapestPriceEver.price;
            const gameID = dadosDetalhes.gameID;
            const numLojas = dadosDetalhes.numLojas;
            const numLojasComPromocao = dadosDetalhes.numLojasComPromocao;
            
            const dataTimestamp = dadosDetalhes.cheapestPriceEver.date * 1000;
            const dataFormatada = new Date(dataTimestamp).toLocaleDateString('pt-BR');

            // Cria o card usando createElement (permite addEventListener)
            const resultadoDiv = document.createElement('div');
            resultadoDiv.innerHTML = `
                <img src="${urlImagem}" alt="Capa do jogo ${nomeDoJogo}">
                <h3>${nomeDoJogo}</h3>
                <p>Menor preço histórico: <strong>$${menorPreco}</strong> em ${dataFormatada}.</p>
                <span class="badge-lojas">
                    🏪 ${numLojas} lojas • 🔥 ${numLojasComPromocao} em promoção
                </span>
            `;
            
            // Redireciona para a página de detalhes
            resultadoDiv.addEventListener('click', () => {
                if (gameID) {
                    window.location.href = `pagina-jogos.php?id=${gameID}`;
                }
            });
            
            resultadoDiv.style.cursor = 'pointer';
            divResultado.appendChild(resultadoDiv);
        });

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        divResultado.innerHTML = "Ocorreu um erro ao buscar os dados da API.";
    }
}   

export function handleInput(event) {
    const query = event.target.value.trim();
    const divResultado = document.getElementById('resultado');

    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    if (query.length < 3) {
        divResultado.innerHTML = query.length > 0 ? "Digite pelo menos 3 caracteres..." : "";
        ultimaBusca = '';
        return;
    }

    timeoutID = setTimeout(() => {
        buscarJogos(query);
    }, 500);
}

export function handleKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        const query = event.target.value.trim();
        if (query.length >= 3) {
            buscarJogos(query);
        }
    }
}

export function handleSubmit(event) {
    event.preventDefault();
    
    const inputJogo = document.getElementById('inputJogo');
    const divResultado = document.getElementById('resultado');
    const query = inputJogo.value.trim();
    
    if (!query) {
        divResultado.innerHTML = "Por favor, digite o nome de um jogo.";
        return;
    }

    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    buscarJogos(query);
}