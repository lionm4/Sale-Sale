let filtroAtual = 'Mais avaliados';
const cacheDetalhes = new Map();
const CACHE_TTL = 5 * 60 * 1000;
let requisicaoAtual = 0;
let cacheNomesLojas;

async function buscarNomesLojas() {
    if (!cacheNomesLojas) {
        cacheNomesLojas = fetch('https://www.cheapshark.com/api/1.0/stores')
            .then(response => response.ok ? response.json() : [])
            .then(lojas => new Map(lojas.map(loja => [String(loja.storeID), loja.storeName])))
            .catch(() => new Map());
    }

    return cacheNomesLojas;
}

function formatarPreco(valor) {
    const preco = Number(valor);
    if (!Number.isFinite(preco)) return 'Preço indisponível';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD'
    }).format(preco);
}

function criarCardPromocao(deal, destaque = false) {
    const desconto = Math.max(0, Math.round((1 - (Number(deal.salePrice) / Number(deal.normalPrice))) * 100));
    const dataFormatada = deal.lastChange
        ? new Date(deal.lastChange * 1000).toLocaleDateString('pt-BR')
        : '';
    const steamAppID = deal.steamAppID || deal.appID;
    const imagemAlternativa = deal.thumb
        ? new URL(deal.thumb, 'https://www.cheapshark.com/img/deals/').href
        : '';
    const imagem = steamAppID
        ? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${encodeURIComponent(steamAppID)}/capsule_231x87.jpg`
        : imagemAlternativa;
    const card = document.createElement('a');
    card.className = destaque ? 'promocao-card promocao-destaque' : 'promocao-card';
    card.href = `pagina-jogos.php?id=${encodeURIComponent(deal.gameID)}`;
    card.setAttribute('aria-label', `${deal.title}, desconto de ${desconto} por cento, ${formatarPreco(deal.salePrice)}`);

    const media = document.createElement('div');
    media.className = 'promocao-imagem';
    const img = document.createElement('img');
    img.src = imagem;
    img.alt = deal.title || 'Capa do jogo';
    img.loading = destaque ? 'eager' : 'lazy';
    img.onerror = () => {
        if (img.dataset.fallbackTried !== 'true' && imagemAlternativa && imagemAlternativa !== imagem) {
            img.dataset.fallbackTried = 'true';
            img.src = imagemAlternativa;
            return;
        }

        img.remove();
        const placeholder = document.createElement('span');
        placeholder.className = 'imagem-indisponivel';
        placeholder.textContent = deal.title || 'Imagem indisponível';
        media.appendChild(placeholder);
    };
    if (imagem) media.appendChild(img);
    else img.onerror();

    const descontoBadge = document.createElement('span');
    descontoBadge.className = 'promocao-desconto';
    descontoBadge.textContent = `-${desconto}%`;
    media.appendChild(descontoBadge);

    const info = document.createElement('div');
    info.className = 'promocao-info';
    const titulo = document.createElement('h3');
    titulo.className = 'promocao-titulo';
    titulo.textContent = deal.title || 'Jogo sem título';
    info.appendChild(titulo);

    const contexto = document.createElement('div');
    contexto.className = 'promocao-contexto';
    const loja = document.createElement('span');
    loja.className = 'promocao-loja';
    loja.textContent = deal.storeName || (deal.storeID === '1' || deal.storeID === 1 ? 'Steam' : 'Loja digital');
    contexto.appendChild(loja);
    if (steamAppID) {
        const plataforma = document.createElement('span');
        plataforma.className = 'promocao-plataforma';
        plataforma.textContent = 'PC';
        contexto.appendChild(plataforma);
    }
    if (deal.numLojas > 1) {
        const lojas = document.createElement('span');
        lojas.className = 'promocao-outras-lojas';
        lojas.textContent = `${deal.numLojas} lojas`;
        contexto.appendChild(lojas);
    }
    info.appendChild(contexto);

    const precos = document.createElement('div');
    precos.className = 'promocao-precos';
    const atual = document.createElement('span');
    atual.className = 'preco-atual';
    atual.textContent = formatarPreco(deal.salePrice);
    const antigo = document.createElement('span');
    antigo.className = 'preco-antigo';
    antigo.textContent = formatarPreco(deal.normalPrice);
    precos.append(atual, antigo);
    info.appendChild(precos);

    const meta = document.createElement('div');
    meta.className = 'promocao-meta';
    const rating = document.createElement('span');
    rating.className = 'promocao-rating';
    rating.textContent = `Nota da oferta ${deal.dealRating || 'N/A'}`;
    meta.appendChild(rating);
    if (dataFormatada) {
        const data = document.createElement('span');
        data.className = 'promocao-data';
        data.textContent = `Atualizado ${dataFormatada}`;
        meta.appendChild(data);
    }
    info.appendChild(meta);

    if (deal.cheapestPriceEver && deal.cheapestPriceEver.price !== undefined) {
        const historico = document.createElement('p');
        historico.className = 'promocao-historico';
        historico.textContent = `Menor histórico: ${formatarPreco(deal.cheapestPriceEver.price)}`;
        info.appendChild(historico);
    }

    card.append(media, info);
    return card;
}

function mostrarEstado(container, classe, mensagem, permitirNovaTentativa = false) {
    container.replaceChildren();
    const estado = document.createElement('div');
    estado.className = classe;
    const texto = document.createElement('p');
    texto.textContent = mensagem;
    estado.appendChild(texto);

    if (permitirNovaTentativa) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'btn-recarregar';
        botao.textContent = 'Tentar novamente';
        botao.addEventListener('click', () => buscarPromocoes(filtroAtual));
        estado.appendChild(botao);
    }

    container.appendChild(estado);
}

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
    const requisicao = ++requisicaoAtual;
    const sectionPromocoes = document.querySelector('.promocoes');
    let container = sectionPromocoes.querySelector('.promocoes-container');
    const destaque = document.querySelector('#oferta-destaque');

    if (!container) {
        const novoContainer = document.createElement('div');
        novoContainer.className = 'promocoes-container';
        sectionPromocoes.appendChild(novoContainer);
        container = sectionPromocoes.querySelector('.promocoes-container');
    }

    container.setAttribute('aria-busy', 'true');
    destaque?.setAttribute('aria-busy', 'true');
    mostrarEstado(container, 'estado-carregando', 'Carregando ofertas...');
    if (destaque) mostrarEstado(destaque, 'loading', 'Buscando oferta em destaque...');

    const parametros = new URLSearchParams({ pageSize: '15' });
    const lojaSelecionada = document.querySelector('#filtro-loja')?.value || '1';
    const precoMaximo = document.querySelector('#filtro-preco')?.value || '';
    if (lojaSelecionada !== 'todas') parametros.set('storeID', lojaSelecionada);
    if (precoMaximo) parametros.set('upperPrice', precoMaximo);

    switch (filtro) {
        case 'Mais Descontos':
            parametros.set('sortBy', 'Savings');
            parametros.set('desc', 'true');
            break;
        case 'Mais avaliados':
            parametros.set('sortBy', 'DealRating');
            parametros.set('desc', 'true');
            break;
        case 'Lançamentos':
            parametros.set('sortBy', 'Release');
            parametros.set('desc', 'true');
            break;
        default:
            parametros.set('sortBy', 'Savings');
            parametros.set('desc', 'true');
    }

    try {
        const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?${parametros.toString()}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar promoções');
        }

        const dados = await response.json();

        if (requisicao !== requisicaoAtual) return;

        if (dados.length === 0) {
            mostrarEstado(container, 'sem-promocoes', 'Nenhuma oferta encontrada agora. Tente outro filtro.');
            if (destaque) mostrarEstado(destaque, 'sem-promocoes', 'Nenhum destaque disponível no momento.');
            container.setAttribute('aria-busy', 'false');
            destaque?.setAttribute('aria-busy', 'false');
            return;
        }

        mostrarEstado(container, 'estado-carregando', 'Comparando disponibilidade nas lojas...');
        const nomesLojas = await buscarNomesLojas();
        if (requisicao !== requisicaoAtual) return;

        const promessasLojas = dados.map(deal => 
            buscarDetalhesComCache(deal.gameID)
                .then(detalhes => {
                    const numLojas = detalhes.deals ? detalhes.deals.length : 0;
                    return {
                        ...deal,
                        numLojas: numLojas,
                        deals: detalhes.deals || [],
                        cheapestPriceEver: detalhes.cheapestPriceEver || null,
                        storeName: nomesLojas.get(String(deal.storeID))
                    };
                })
                .catch(erro => {
                    console.error(`Erro ao buscar detalhes do gameID ${deal.gameID}:`, erro);
                    return { ...deal, numLojas: 0, deals: [] };
                })
        );

        const dealsComLojas = await Promise.all(promessasLojas);
        if (requisicao !== requisicaoAtual) return;
        
        const melhoresOfertas = new Map();
        dealsComLojas.filter(deal => deal.numLojas >= 2).forEach(deal => {
            const existente = melhoresOfertas.get(String(deal.gameID));
            if (!existente || Number(deal.salePrice) < Number(existente.salePrice)) {
                melhoresOfertas.set(String(deal.gameID), deal);
            }
        });
        const dealsFiltrados = Array.from(melhoresOfertas.values());

        // Se não tiver nenhum, mostra mensagem
        if (dealsFiltrados.length === 0) {
            mostrarEstado(container, 'sem-promocoes', 'Nenhum jogo com ofertas em mais de uma loja foi encontrado nesta categoria. Tente outro filtro.');
            if (destaque) mostrarEstado(destaque, 'sem-promocoes', 'Não encontramos uma oferta para destacar nesta categoria.');
            container.setAttribute('aria-busy', 'false');
            destaque?.setAttribute('aria-busy', 'false');
            return;
        }

        container.replaceChildren();
        if (destaque) {
            destaque.replaceChildren(criarCardPromocao(dealsFiltrados[0], true));
            destaque.setAttribute('aria-busy', 'false');
        }
        dealsFiltrados.slice(1).forEach((deal, index) => {
            const card = criarCardPromocao(deal);
            card.style.animationDelay = `${index * 0.05}s`;
            container.appendChild(card);
        });
        container.setAttribute('aria-busy', 'false');

    } catch (erro) {
        console.error('Erro ao buscar promoções:', erro);
        if (requisicao !== requisicaoAtual) return;
        mostrarEstado(container, 'erro-promocoes', 'Não foi possível carregar as ofertas. Verifique sua conexão e tente novamente.', true);
        if (destaque) mostrarEstado(destaque, 'sem-promocoes', 'O destaque não carregou.', true);
        container.setAttribute('aria-busy', 'false');
        destaque?.setAttribute('aria-busy', 'false');
    }
}

export function filtrarPromocoes(filtro, event) {
    filtroAtual = filtro;

    document.querySelectorAll('.promocoes-filtros button').forEach(el => {
        const ativo = el.textContent.trim() === filtro;
        el.className = ativo ? 'filtro-ativo' : 'filtro-inativo';
        el.setAttribute('aria-pressed', String(ativo));
    });

    buscarPromocoes(filtro);
}

export function initPromocoes() {
    if (document.querySelector('.promocoes')) {
        buscarPromocoes('Mais avaliados');

        document.querySelectorAll('.promocoes-filtros button').forEach(el => {
            el.addEventListener('click', function (event) {
                const filtro = this.textContent;
                filtrarPromocoes(filtro, event);
            });
        });

        document.querySelectorAll('#filtro-loja, #filtro-preco').forEach(el => {
            el.addEventListener('change', () => buscarPromocoes(filtroAtual));
        });
    }
}