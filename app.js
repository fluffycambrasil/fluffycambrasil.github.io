document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando produtos...';
    
    // Função para gerar as estrelas de avaliação
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Estrelas cheias
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Meia estrela (se aplicável)
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Estrelas vazias
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    // Função para calcular a porcentagem de desconto
    function calculateDiscount(price, originalPrice) {
        if (originalPrice > price) {
            return Math.round(((originalPrice - price) / originalPrice) * 100);
        }
        return 0;
    }
    
    // Função para formatar o preço em reais
    function formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
    
    // Função para renderizar os produtos
    function renderProducts(productsToRender) {
        productsContainer.innerHTML = '';
        
        productsToRender.forEach(product => {
            const discount = calculateDiscount(product.price, product.originalPrice);
            const discountBadge = discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : '';
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    ${discountBadge}
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <span class="product-category">Pets</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        ${formatPrice(product.price)}
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span class="rating-count">(${product.ratingCount})</span>
                    </div>
                    <a href="${product.link}" class="product-button" target="_blank" rel="nofollow noopener">
                        Ver na Amazon
                    </a>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
    }
    
    // Adicionar estilos CSS adicionais para elementos que não estavam no CSS original
    function addAdditionalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .discount-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #ff5500;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 0.9rem;
                z-index: 1;
            }
            
            .original-price {
                text-decoration: line-through;
                color: #999;
                font-size: 0.9rem;
                font-weight: normal;
                margin-left: 8px;
            }
            
            .loading {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 200px;
                width: 100%;
                font-size: 1.2rem;
                color: #4CAF50;
            }
            
            .loading i {
                margin-right: 10px;
                font-size: 1.5rem;
            }
            
            .error-message {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 200px;
                width: 100%;
                font-size: 1.2rem;
                color: #f44336;
                text-align: center;
                flex-direction: column;
            }
            
            .error-message i {
                margin-bottom: 10px;
                font-size: 2rem;
            }
            
            .retry-button {
                margin-top: 15px;
                padding: 8px 16px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
            }
            
            .retry-button:hover {
                background-color: #388E3C;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Função para mostrar mensagem de erro
    function showError(message) {
        productsContainer.innerHTML = '';
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button class="retry-button" id="retry-button">
                <i class="fas fa-sync-alt"></i> Tentar novamente
            </button>
        `;
        productsContainer.appendChild(errorElement);
        
        // Adicionar evento ao botão de tentar novamente
        document.getElementById('retry-button').addEventListener('click', () => {
            fetchProducts();
        });
    }
    
    // Função para buscar produtos da API da Amazon
    async function fetchProducts() {
        // Mostrar indicador de carregamento
        productsContainer.innerHTML = '';
        productsContainer.appendChild(loadingElement);
        
        try {
            // Tentar buscar produtos da API da Amazon
            const result = await amazonAPI.searchProducts('produtos para pets', 'PetSupplies');
            
            if (result.success) {
                // Renderizar os produtos retornados pela API
                renderProducts(result.data);
            } else {
                // Mostrar mensagem de erro
                showError(`Não foi possível carregar os produtos: ${result.message}`);
                console.error('Erro ao buscar produtos:', result.error);
            }
        } catch (error) {
            // Mostrar mensagem de erro em caso de falha na requisição
            showError('Ocorreu um erro ao buscar os produtos. Por favor, tente novamente mais tarde.');
            console.error('Erro ao buscar produtos:', error);
            
            // Usar os produtos estáticos como fallback
            console.log('Usando produtos estáticos como fallback');
            renderProducts(products);
        }
    }
    
    // Inicializar a página
    function init() {
        // Adicionar estilos adicionais
        addAdditionalStyles();
        
        // Buscar produtos da API da Amazon
        fetchProducts();
    }
    
    // Inicializar a página
    init();
});
