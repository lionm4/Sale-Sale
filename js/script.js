const form = document.getElementById('formBusca');
const inputJogo = document.getElementById('inputJogo');
const divResultado = document.getElementById('resultado');
let timeoutID = null;
let ultimaBusca = '';


async function buscarJogos(query) {
    
    if (!query || query.length < 3) {
        divResultado.innerHTML = query.length > 0 ? "Digite pelo menos 3 caracteres..." : "";
        return;
    }

    
    if (query === ultimaBusca) return;
    ultimaBusca = query;

    divResultado.innerHTML = "Buscando...";

    try {
        // endpoint
        const resBusca = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(query)}`);
        const dadosBusca = await resBusca.json();

        if (dadosBusca.length === 0) {
            divResultado.innerHTML = "Nenhum jogo encontrado com esse nome.";
            return;
        }

        // Limita a busca aos 5 primeiros resultados
        const primeirosJogos = dadosBusca.slice(0, 5);

        // ETAPA 2: Cria uma lista de requisições para os detalhes
        const promessasDetalhes = primeirosJogos.map(jogo => 
            fetch(`https://www.cheapshark.com/api/1.0/games?id=${jogo.gameID}`).then(res => res.json())
        );

        const listaDetalhes = await Promise.all(promessasDetalhes);

        
        divResultado.innerHTML = "";

       
        listaDetalhes.forEach(dadosDetalhes => {
            const nomeDoJogo = dadosDetalhes.info.title;
            const urlImagem = dadosDetalhes.info.thumb;
            const menorPreco = dadosDetalhes.cheapestPriceEver.price;
            
            const dataTimestamp = dadosDetalhes.cheapestPriceEver.date * 1000;
            const dataFormatada = new Date(dataTimestamp).toLocaleDateString('pt-BR');

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
}


function handleInput(event) {
    const query = event.target.value.trim();

    
    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    
    if (query.length < 3) {
        divResultado.innerHTML = query.length > 0 ? "Digite pelo menos 3 caracteres..." : "";
        ultimaBusca = ''; // Reseta para permitir nova busca depois
        return;
    }

    
    timeoutID = setTimeout(() => {
        buscarJogos(query);
    }, 500);
}


form.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const query = inputJogo.value.trim();
    
    if (!query) {
        divResultado.innerHTML = "Por favor, digite o nome de um jogo.";
        return;
    }

    // Cancela qualquer busca automática pendente
    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    // Executa a busca imediatamente
    await buscarJogos(query);
});


inputJogo.addEventListener('input', handleInput);


inputJogo.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        const query = this.value.trim();
        if (query.length >= 3) {
            buscarJogos(query);
        }
    }
});


function alternarTema() {
   
    const corpo = document.body;
    corpo.classList.toggle('tema-claro');
    
    
    const ehTemaClaro = corpo.classList.contains('tema-claro');
    
    
    localStorage.setItem('temaPreferido', ehTemaClaro ? 'claro' : 'escuro');
}


