let filtroAtual = 'Mais avaliados';
const cacheDetalhes = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const LOJAS_PERMITIDAS = ['1', '25', '27', '29'];

async function buscarDetalhesComCache(gameID) {
        const agora = Date.now();

    if (cacheDetalhes.has(gameID)) {
        const { dados, timestamp } = cacheDetalhes.get(gameID);
        if (agora - timestamp < CACHE_TTL) {
            console.log(`Cache hit para gameID ${gameID}`);
            return dados;
        }

        cacheDetalhes.delete(gameID);
    }

    console.log(`Buscando detalhes do gameID ${gameID}`);
    const res = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`);
    const dados = await res.json();

    cacheDetalhes.set(gameID, { dados, timestamp: agora });

    return dados;

}




export async function buscarPromocoes(filtro = 'Mais avaliados') {
    const sectionPromocoes = document.querySelector('.promocoes');
    let container = sectionPromocoes.querySelector('.promocoes-container');

    if (!container) {
        const novoContainer = document.createElement('div');
        novoContainer.className = 'promocoes-container';
        sectionPromocoes.appendChild(novoContainer);
        container = sectionPromocoes.querySelector('.promocoes-container');
    }

    container.innerHTML = '<p class="loading">Carregando promoções...</p>';

    let url = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50&pageSize=15';

    switch (filtro) {
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

        container.innerHTML = '<p class="loading">Filtrando jogos multiplataforma...</p>';


        const promessasLojas = dados.map(deal => 
            buscarDetalhesComCache(deal.gameID)
                .then(detalhes => {
                    const deals = detalhes.deals || [];
                    
                    // Filtra apenas as 4 lojas permitidas
                    const dealsFiltrados = deals.filter(d => 
                        LOJAS_PERMITIDAS.includes(String(d.storeID))
                    );
                    
                    // Conta quantas lojas permitidas têm o jogo
                    const numLojas = dealsFiltrados.length;
                    
                    // Conta quantas dessas estão em promoção (savings > 0)
                    const numLojasComPromocao = dealsFiltrados.filter(d => 
                        parseFloat(d.savings) > 0
                    ).length;
                    
                    return {
                        ...deal,
                        numLojas: numLojas,
                        numLojasComPromocao: numLojasComPromocao
                    };
                })
                .catch(erro => {
                    console.error(`Erro no gameID ${deal.gameID}:`, erro);
                    return { ...deal, numLojas: 0, numLojasComPromocao: 0 };
                })
        );

        const dealsComLojas = await Promise.all(promessasLojas);
        
        // Filtra apenas jogos com 2 ou mais lojas
        const dealsFiltrados = dealsComLojas.filter(deal => 
            deal.numLojas >= 2 && deal.numLojasComPromocao >= 1
        );

        // Se não tiver nenhum, mostra mensagem
        if (dealsFiltrados.length === 0) {
            container.innerHTML = `
                <p class="sem-promocoes">
                    Nenhum jogo multiplataforma encontrado nesta categoria.
                    <br>
                    <small>Tente outro filtro.</small>
                </p>
            `;
            return;
        }

        // ============================================
        // RENDERIZA OS CARDS
        // ============================================
        container.innerHTML = '';

        dealsFiltrados.forEach((deal, index) => {
            const desconto = Math.round((1 - (deal.salePrice / deal.normalPrice)) * 100);

            const dataTimestamp = deal.lastChange * 1000;
            const dataFormatada = new Date(dataTimestamp).toLocaleDateString('pt-BR');

            const card = document.createElement('div');
            card.className = 'promocao-card';
            card.style.animationDelay = `${index * 0.05}s`;

            const steamAppID = deal.steamAppID || deal.appID;
            let urlImagem;

            if (steamAppID) {
                urlImagem = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamAppID}/capsule_231x87.jpg`;
            } else {
                urlImagem = `https://www.cheapshark.com/img/deals/${deal.thumb}`;
            }

            const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="231" height="87" viewBox="0 0 231 87"%3E%3Crect width="231" height="87" fill="%2326315c"/%3E%3Ctext x="115.5" y="43.5" font-family="Arial" font-size="12" fill="%23c7c9cf" text-anchor="middle"%3ESem imagem%3C/text%3E%3C/svg%3E';

            const textoLojas = `🏪 ${deal.numLojas} lojas • 🔥 ${deal.numLojasComPromocao} em promoção`;

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
                    <div class="promocao-lojas-badge">
                        ${textoLojas}
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                if (deal.gameID) {
                    window.location.href = `pagina-jogos.php?id=${deal.gameID}`;
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

export function filtrarPromocoes(filtro, event) {
    filtroAtual = filtro;

    document.querySelectorAll('.promocoes-filtros span').forEach(el => {
        el.className = 'filtro-inativo';
    });

    if (event && event.target) {
        event.target.className = 'filtro-ativo';
    } else {
        document.querySelectorAll('.promocoes-filtros span').forEach(el => {
            if (el.textContent === filtro) {
                el.className = 'filtro-ativo';
            }
        });
    }

    buscarPromocoes(filtro);
}

export function initPromocoes() {
    if (document.querySelector('.promocoes')) {
        buscarPromocoes('Mais avaliados');

        document.querySelectorAll('.promocoes-filtros span').forEach(el => {
            el.addEventListener('click', function (event) {
                const filtro = this.textContent;
                filtrarPromocoes(filtro, event);
            });
        });
    }
}