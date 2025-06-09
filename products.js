// Dados dos produtos para pets recomendados da Amazon
const products = [
    {
        id: 1,
        title: "Ração Seca Pedigree para Cães Adultos Raças Pequenas",
        price: 119.90,
        originalPrice: 149.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/71Qe4-aWtCL._AC_SX679_.jpg",
        rating: 4.8,
        ratingCount: 3254,
        link: "https://www.amazon.com.br/Ra%C3%A7%C3%A3o-Pedigree-Adultos-Pequenas-10-1kg/dp/B07WVMB99K"
    },
    {
        id: 2,
        title: "Ração Úmida Whiskas Sachê para Gatos Adultos - Sabor Carne",
        price: 2.49,
        originalPrice: 2.99,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/61qqz3KGgIL._AC_SX679_.jpg",
        rating: 4.7,
        ratingCount: 2876,
        link: "https://www.amazon.com.br/Whiskas-Ra%C3%A7%C3%A3o-%C3%9Amida-Adultos-Unidade/dp/B07WFPNKZ2"
    },
    {
        id: 3,
        title: "Brinquedo Interativo Kong Classic para Cães",
        price: 69.90,
        originalPrice: 89.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/61LKhsJNURL._AC_SX679_.jpg",
        rating: 4.9,
        ratingCount: 1543,
        link: "https://www.amazon.com.br/Brinquedo-Kong-Classic-C%C3%A3es-Tamanho/dp/B0002AR0I8"
    },
    {
        id: 4,
        title: "Arranhador para Gatos com Poste e Plataforma",
        price: 129.90,
        originalPrice: 159.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/61Vg9x0TV+L._AC_SX679_.jpg",
        rating: 4.6,
        ratingCount: 987,
        link: "https://www.amazon.com.br/Arranhador-Gatos-Plataforma-Brinquedo-Cinza/dp/B08LMQZX5J"
    },
    {
        id: 5,
        title: "Cama Pet Redonda para Cães e Gatos",
        price: 89.90,
        originalPrice: 119.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/71Qe-raFHiL._AC_SX679_.jpg",
        rating: 4.7,
        ratingCount: 1234,
        link: "https://www.amazon.com.br/Cama-Redonda-Pelúcia-Cinza-Médio/dp/B08LMQZX5K"
    },
    {
        id: 6,
        title: "Coleira Antipulgas e Carrapatos Seresto para Cães",
        price: 189.90,
        originalPrice: 249.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/71Qs2VPiw-L._AC_SX679_.jpg",
        rating: 4.8,
        ratingCount: 2345,
        link: "https://www.amazon.com.br/Coleira-Antipulgas-Carrapatos-Seresto-Pequenos/dp/B00B8CWC9W"
    },
    {
        id: 7,
        title: "Transportadora para Pets Furacão Pet Plástica",
        price: 149.90,
        originalPrice: 179.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/61Ks6u5oAVL._AC_SX679_.jpg",
        rating: 4.5,
        ratingCount: 876,
        link: "https://www.amazon.com.br/Transportadora-Furac%C3%A3o-Pl%C3%A1stica-Tamanho-Vermelho/dp/B07WFPNKZ3"
    },
    {
        id: 8,
        title: "Bebedouro Fonte para Gatos e Cães de Pequeno Porte",
        price: 119.90,
        originalPrice: 149.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/61J6+86SRFL._AC_SX679_.jpg",
        rating: 4.6,
        ratingCount: 1098,
        link: "https://www.amazon.com.br/Bebedouro-Fonte-Autom%C3%A1tica-Gatos-Pequeno/dp/B07WVMB99L"
    },
    {
        id: 9,
        title: "Escova Furminator para Remoção de Pelos Soltos",
        price: 159.90,
        originalPrice: 199.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/71-ghLb21wL._AC_SX679_.jpg",
        rating: 4.9,
        ratingCount: 765,
        link: "https://www.amazon.com.br/Escova-Furminator-Remo%C3%A7%C3%A3o-Pelos-Tamanho/dp/B0040QQ07C"
    },
    {
        id: 10,
        title: "Tapete Higiênico para Cães Super Absorvente",
        price: 79.90,
        originalPrice: 99.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/71+xotDFAmL._AC_SX679_.jpg",
        rating: 4.7,
        ratingCount: 2134,
        link: "https://www.amazon.com.br/Tapete-Higi%C3%AAnico-Absorvente-Pacote-Unidades/dp/B07WFPNKZ4"
    },
    {
        id: 11,
        title: "Comedouro Automático para Pets com Programação",
        price: 249.90,
        originalPrice: 299.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/61GmTcVCYhL._AC_SX679_.jpg",
        rating: 4.5,
        ratingCount: 543,
        link: "https://www.amazon.com.br/Comedouro-Autom%C3%A1tico-Programa%C3%A7%C3%A3o-Capacidade-Branco/dp/B07WFPNKZ5"
    },
    {
        id: 12,
        title: "Caixa de Areia Fechada para Gatos com Filtro de Carvão",
        price: 189.90,
        originalPrice: 229.90,
        category: "pets",
        image: "https://m.media-amazon.com/images/I/61OdChjSHBL._AC_SX679_.jpg",
        rating: 4.8,
        ratingCount: 876,
        link: "https://www.amazon.com.br/Caixa-Fechada-Filtro-Carv%C3%A3o-Cinza/dp/B07WFPNKZ6"
    }
];
