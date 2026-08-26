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


/////////////////////////////////////////////////////////////////////////////////

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let filtroAtual = 'Mais avaliados';

// ============================================
// FUNÇÃO PARA BUSCAR PROMOÇÕES
// ============================================
async function buscarPromocoes(filtro = 'Mais avaliados') {
    const sectionPromocoes = document.querySelector('.promocoes');
    const containerPromocoes = sectionPromocoes.querySelector('.promocoes-container');
    
    if (!containerPromocoes) {
        const novoContainer = document.createElement('div');
        novoContainer.className = 'promocoes-container';
        sectionPromocoes.appendChild(novoContainer);
    }

    const container = sectionPromocoes.querySelector('.promocoes-container');
    container.innerHTML = '<p class="loading">Carregando promoções...</p>';

    // Define a URL base
    let url = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50&pageSize=25';

    // Adiciona o filtro escolhido
    switch(filtro) {
        case 'Mais Descontos':
            url += '&sortBy=Savings&desc=true';
            break;
        case 'Mais avaliados':
            url += '&sortBy=DealRating&desc=true';
            break;
        case 'Lançamentos':
            url += '&sortBy=Release&desc=true';
            break;
        default:
            url += '&sortBy=Savings&desc=true';
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar promoções');
        }

        const dados = await response.json();

        if (dados.length === 0) {
            container.innerHTML = '<p class="sem-promocoes">Nenhuma promoção disponível no momento.</p>';
            return;
        }

        container.innerHTML = '';

        dados.forEach((deal, index) => {
            const desconto = Math.round((1 - (deal.salePrice / deal.normalPrice)) * 100);
            
            const dataTimestamp = deal.lastChange * 1000;
            const dataFormatada = new Date(dataTimestamp).toLocaleDateString('pt-BR');
            
            const card = document.createElement('div');
            card.className = 'promocao-card';
            card.style.animationDelay = `${index * 0.05}s`;

            // ========================================
            // CORREÇÃO: Usar Steam Capsules
            // ========================================
            const steamAppID = deal.steamAppID || deal.appID;
            let urlImagem;
            
            if (steamAppID) {
                urlImagem = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamAppID}/capsule_231x87.jpg`;
            } else {
                urlImagem = `https://www.cheapshark.com/img/deals/${deal.thumb}`;
            }
            
            const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="231" height="87" viewBox="0 0 231 87"%3E%3Crect width="231" height="87" fill="%2326315c"/%3E%3Ctext x="115.5" y="43.5" font-family="Arial" font-size="12" fill="%23c7c9cf" text-anchor="middle"%3ESem imagem%3C/text%3E%3C/svg%3E';
            
            card.innerHTML = `
                <div class="promocao-imagem">
                    <img 
                        src="${urlImagem}" 
                        alt="${deal.title}" 
                        loading="lazy"
                        onerror="this.onerror=null; this.src='${placeholder}';"
                        style="width: 100%; height: 100%; object-fit: cover;"
                    >
                    <span class="promocao-desconto">-${desconto}%</span>
                </div>
                <div class="promocao-info">
                    <h3 class="promocao-titulo">${deal.title}</h3>
                    <div class="promocao-precos">
                        <span class="preco-antigo">$${deal.normalPrice}</span>
                        <span class="preco-atual">$${deal.salePrice}</span>
                    </div>
                    <div class="promocao-meta">
                        <span class="promocao-rating">⭐ ${deal.dealRating || 'N/A'}</span>
                        <span class="promocao-data">${dataFormatada}</span>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                const inputJogo = document.getElementById('inputJogo');
                if (inputJogo) {
                    inputJogo.value = deal.title;
                    inputJogo.dispatchEvent(new Event('input'));
                    inputJogo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            
            container.appendChild(card);
        });

    } catch (erro) {
        console.error('Erro ao buscar promoções:', erro);
        container.innerHTML = `
            <p class="erro-promocoes">
                Erro ao carregar promoções. Tente novamente mais tarde.
                <button onclick="buscarPromocoes('${filtroAtual}')" class="btn-recarregar">Tentar novamente</button>
            </p>
        `;
    }
}

// ============================================
// FUNÇÃO PARA FILTRAR PROMOÇÕES
// ============================================
function filtrarPromocoes(filtro, event) {
    // Atualiza o filtro atual
    filtroAtual = filtro;
    
    // Remove a classe ativa de todos os filtros
    document.querySelectorAll('.promocoes-filtros span').forEach(el => {
        el.className = 'filtro-inativo';
    });
    
    // Adiciona a classe ativa ao filtro clicado
    if (event && event.target) {
        event.target.className = 'filtro-ativo';
    } else {
        // Se não tiver event (chamado programaticamente), procura pelo texto
        document.querySelectorAll('.promocoes-filtros span').forEach(el => {
            if (el.textContent === filtro) {
                el.className = 'filtro-ativo';
            }
        });
    }
    
    // Busca com o filtro escolhido
    buscarPromocoes(filtro);
}

// ============================================
// EXECUTA A BUSCA QUANDO A PÁGINA CARREGAR
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.promocoes')) {
        // Inicializa com "Mais Descontos" ativo
        buscarPromocoes('Mais avaliados');
        
        // Adiciona eventos de clique aos filtros
        document.querySelectorAll('.promocoes-filtros span').forEach(el => {
            el.addEventListener('click', function(event) {
                const filtro = this.textContent;
                filtrarPromocoes(filtro, event);
            });
        });
    }
});

