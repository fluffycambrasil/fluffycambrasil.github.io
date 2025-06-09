// Amazon Product Advertising API Integration

// Importar CryptoJS (você precisará adicionar o script no HTML)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

// Configurações da API
const amazonAPI = {
    // Credenciais da API (você precisará substituir com suas próprias credenciais)
    credentials: {
        accessKey: 'SUA_ACCESS_KEY',
        secretKey: 'SUA_SECRET_KEY',
        partnerTag: 'SEU_PARTNER_TAG' // Seu ID de associado da Amazon
    },
    
    // Configurações regionais (Brasil)
    region: {
        host: 'webservices.amazon.com.br',
        region: 'sa-east-1'
    },
    
    // Função para gerar a assinatura da requisição usando HMAC-SHA256
    generateSignature: function(stringToSign, secretKey) {
        // Criar a chave de assinatura
        const signature = CryptoJS.HmacSHA256(stringToSign, secretKey);
        // Converter para base64
        return CryptoJS.enc.Base64.stringify(signature);
    },
    
    // Função para formatar a data no formato ISO 8601
    getFormattedDate: function() {
        return new Date().toISOString().replace(/\.[0-9]{3}/, '');
    },
    
    // Função para criar os cabeçalhos de autenticação
    createAuthHeaders: function(requestParams, requestMethod, requestPath) {
        const timestamp = this.getFormattedDate();
        const amzDate = timestamp.replace(/[:\-]|\..+/g, '');
        const dateStamp = timestamp.split('T')[0].replace(/-/g, '');
        
        // Criar o payload canônico
        const requestBody = JSON.stringify(requestParams);
        const payloadHash = CryptoJS.SHA256(requestBody).toString(CryptoJS.enc.Hex);
        
        // Criar a requisição canônica
        const canonicalRequest = [
            requestMethod,
            requestPath,
            '',
            'host:' + this.region.host,
            'x-amz-date:' + amzDate,
            'x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.' + requestParams.Operation,
            '',
            'host;x-amz-date;x-amz-target',
            payloadHash
        ].join('\n');
        
        // Criar o escopo da credencial
        const credentialScope = dateStamp + '/' + this.region.region + '/ProductAdvertisingAPI/aws4_request';
        
        // Criar a string para assinar
        const stringToSign = [
            'AWS4-HMAC-SHA256',
            amzDate,
            credentialScope,
            CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex)
        ].join('\n');
        
        // Calcular a chave de assinatura
        let signingKey = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + this.credentials.secretKey);
        signingKey = CryptoJS.HmacSHA256(this.region.region, signingKey);
        signingKey = CryptoJS.HmacSHA256('ProductAdvertisingAPI', signingKey);
        signingKey = CryptoJS.HmacSHA256('aws4_request', signingKey);
        
        // Calcular a assinatura
        const signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(CryptoJS.enc.Hex);
        
        // Criar o cabeçalho de autorização
        const authorizationHeader = [
            'AWS4-HMAC-SHA256 Credential=' + this.credentials.accessKey + '/' + credentialScope,
            'SignedHeaders=host;x-amz-date;x-amz-target',
            'Signature=' + signature
        ].join(', ');
        
        // Retornar os cabeçalhos
        return {
            'host': this.region.host,
            'x-amz-date': amzDate,
            'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.' + requestParams.Operation,
            'content-encoding': 'amz-1.0',
            'content-type': 'application/json; charset=utf-8',
            'authorization': authorizationHeader
        };
    },
    
    // Função para buscar produtos por palavra-chave
    searchProducts: async function(keyword, searchIndex = 'All', resources = []) {
        try {
            console.log(`Buscando produtos com a palavra-chave: ${keyword}`);
            
            // Definir os recursos padrão se não forem fornecidos
            if (resources.length === 0) {
                resources = [
                    'Images.Primary.Large',
                    'ItemInfo.Title',
                    'Offers.Listings.Price',
                    'Offers.Listings.SavingBasis',
                    'CustomerReviews.StarRating',
                    'CustomerReviews.Count'
                ];
            }
            
            // Criar o corpo da requisição
            const requestParams = {
                'Operation': 'SearchItems',
                'PartnerTag': this.credentials.partnerTag,
                'PartnerType': 'Associates',
                'Keywords': keyword,
                'SearchIndex': searchIndex,
                'Resources': resources
            };
            
            // Criar os cabeçalhos de autenticação
            const headers = this.createAuthHeaders(requestParams, 'POST', '/');
            
            // Fazer a requisição para a API da Amazon
            const response = await fetch(`https://${this.region.host}/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestParams)
            });
            
            // Verificar se a requisição foi bem-sucedida
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            // Converter a resposta para JSON
            const data = await response.json();
            
            // Verificar se a resposta contém itens
            if (data.SearchResult && data.SearchResult.Items) {
                // Converter os dados para o formato usado pela aplicação
                const formattedProducts = this.convertApiDataToProductFormat(data.SearchResult.Items);
                
                return {
                    success: true,
                    message: 'Produtos encontrados com sucesso',
                    data: formattedProducts
                };
            } else {
                // Se não houver itens, retornar uma mensagem de erro
                console.warn('Nenhum produto encontrado:', data);
                
                // Usar os produtos estáticos como fallback
                return {
                    success: true,
                    message: 'Usando dados de fallback',
                    data: products // Usando os produtos estáticos como fallback
                };
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            
            // Em caso de erro, retornar os produtos estáticos como fallback
            return {
                success: true,
                message: 'Erro ao buscar produtos, usando dados de fallback',
                data: products // Usando os produtos estáticos como fallback
            };
        }
    },
    
    // Função para buscar detalhes de um produto específico por ASIN
    getProductDetails: async function(asin) {
        try {
            console.log(`Buscando detalhes do produto com ASIN: ${asin}`);
            
            // Definir os recursos a serem retornados
            const resources = [
                'Images.Primary.Large',
                'ItemInfo.Title',
                'Offers.Listings.Price',
                'Offers.Listings.SavingBasis',
                'CustomerReviews.StarRating',
                'CustomerReviews.Count'
            ];
            
            // Criar o corpo da requisição
            const requestParams = {
                'Operation': 'GetItems',
                'PartnerTag': this.credentials.partnerTag,
                'PartnerType': 'Associates',
                'ItemIds': [asin],
                'Resources': resources
            };
            
            // Criar os cabeçalhos de autenticação
            const headers = this.createAuthHeaders(requestParams, 'POST', '/');
            
            // Fazer a requisição para a API da Amazon
            const response = await fetch(`https://${this.region.host}/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestParams)
            });
            
            // Verificar se a requisição foi bem-sucedida
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            // Converter a resposta para JSON
            const data = await response.json();
            
            // Verificar se a resposta contém itens
            if (data.ItemsResult && data.ItemsResult.Items && data.ItemsResult.Items.length > 0) {
                // Converter os dados para o formato usado pela aplicação
                const formattedProduct = this.convertApiDataToProductFormat(data.ItemsResult.Items)[0];
                
                return {
                    success: true,
                    message: 'Detalhes do produto encontrados com sucesso',
                    data: formattedProduct
                };
            } else {
                // Se não houver itens, tentar encontrar nos dados estáticos
                const product = products.find(p => p.id.toString() === asin);
                
                if (product) {
                    return {
                        success: true,
                        message: 'Detalhes do produto encontrados nos dados de fallback',
                        data: product
                    };
                } else {
                    return {
                        success: false,
                        message: 'Produto não encontrado',
                        error: 'ASIN inválido ou produto não disponível'
                    };
                }
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes do produto:', error);
            
            // Em caso de erro, tentar encontrar nos dados estáticos
            const product = products.find(p => p.id.toString() === asin);
            
            if (product) {
                return {
                    success: true,
                    message: 'Erro ao buscar detalhes do produto, usando dados de fallback',
                    data: product
                };
            } else {
                return {
                    success: false,
                    message: 'Erro ao buscar detalhes do produto',
                    error: error.message
                };
            }
        }
    },
    
    // Função para converter os dados da API para o formato usado pela aplicação
    convertApiDataToProductFormat: function(apiData) {
        return apiData.map((item, index) => ({
            id: item.ASIN || index + 1,
            title: item.ItemInfo?.Title?.DisplayValue || 'Produto sem título',
            price: parseFloat(item.Offers?.Listings[0]?.Price?.Amount || 0),
            originalPrice: parseFloat(item.Offers?.Listings[0]?.SavingBasis?.Amount || 0) || 
                          parseFloat(item.Offers?.Listings[0]?.Price?.Amount || 0),
            category: 'pets',
            image: item.Images?.Primary?.Large?.URL || '',
            rating: parseFloat(item.CustomerReviews?.StarRating?.Value || 0),
            ratingCount: parseInt(item.CustomerReviews?.Count || 0),
            link: item.DetailPageURL || ''
        }));
    }
};
