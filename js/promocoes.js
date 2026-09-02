let filtroAtual = 'Mais avaliados';

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

    let url = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50&pageSize=25';

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
            el.addEventListener('click', function(event) {
                const filtro = this.textContent;
                filtrarPromocoes(filtro, event);
            });
        });
    }
}