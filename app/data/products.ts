

export interface Product {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
    description?: string;
}

export const products: Product[] = [
    {
        id: "oignon-local",
        name: "Oignon Local",
        price: 400,
        unit: "kg",
        image: "/oignon.png",
        category: "Légumes",
        description: "Oignons locaux frais, parfaits pour vos plats quotidiens. Cultivés au Sénégal."
    },
    {
        id: "pomme-de-terre",
        name: "Pomme de terre",
        price: 500,
        unit: "kg",
        image: "/pomme-terre.png",
        category: "Tubercules",
        description: "Pommes de terre de qualité supérieure, idéales pour les frites, purées ou ragoûts."
    },
    {
        id: "carotte",
        name: "Carotte",
        price: 600,
        unit: "kg",
        image: "/carotte.png",
        category: "Légumes",
        description: "Carottes croquantes et sucrées, riches en vitamines."
    },
    {
        id: "tomate-fraiche",
        name: "Tomate Fraîche",
        price: 800,
        unit: "kg",
        image: "/tomate.png",
        category: "Légumes",
        description: "Tomates rouges et juteuses, indispensables pour vos sauces et salades."
    },
    {
        id: "chou-pomme",
        name: "Chou Pommé",
        price: 300,
        unit: "unité",
        image: "/chou-pomme.png",
        category: "Légumes",
        description: "Chou pommé frais, excellent pour le Tiep ou les salades."
    },
    {
        id: "poivron-vert",
        name: "Poivron Vert",
        price: 1000,
        unit: "kg",
        image: "/poivron-vert.png",
        category: "Légumes",
        description: "Poivrons verts croquants pour relever le goût de vos plats."
    },
    {
        id: "aubergine",
        name: "Aubergine",
        price: 500,
        unit: "kg",
        image: "/aubergine.png",
        category: "Légumes",
        description: "Aubergines violettes, parfaites pour les ragoûts et les plats mijotés."
    },
    {
        id: "concombre",
        name: "Concombre",
        price: 400,
        unit: "kg",
        image: "/concombre.png",
        category: "Légumes",
        description: "Concombres frais et rafraîchissants pour vos entrées."
    },
    {
        id: "haricot-vert",
        name: "Haricot Vert",
        price: 900,
        unit: "kg",
        image: "/haricot_vert.png",
        category: "Légumes",
        description: "Haricots verts frais et croquants, riches en fibres."
    },
    {
        id: "laitue",
        name: "Laitue",
        price: 350,
        unit: "unité",
        image: "/laitue.png",
        category: "Légumes",
        description: "Laitue fraîche et croquante pour vos salades."
    },
    {
        id: "betterave",
        name: "Betterave",
        price: 450,
        unit: "kg",
        image: "/betterave.png",
        category: "Légumes",
        description: "Betteraves fraîches, idéales pour les salades ou cuites."
    },
    {
        id: "navet",
        name: "Navet",
        price: 400,
        unit: "kg",
        image: "/navet.png",
        category: "Légumes",
        description: "Navets frais pour vos soupes et ragoûts traditionnels."
    },
    {
        id: "persil-frais",
        name: "Persil Frais",
        price: 200,
        unit: "botte",
        image: "/persil_frais.png",
        category: "Herbes",
        description: "Persil frais pour assaisonner vos plats."
    },
    {
        id: "menthe-fraiche",
        name: "Menthe Fraîche",
        price: 200,
        unit: "botte",
        image: "/menthe_fraiche.png",
        category: "Herbes",
        description: "Menthe fraîche pour le thé ou vos salades."
    },
    {
        id: "piment-fort",
        name: "Piment Fort",
        price: 1500,
        unit: "kg",
        image: "/piment_fort.png",
        category: "Épices",
        description: "Piments forts pour relever vos plats."
    },
    {
        id: "ail",
        name: "Ail",
        price: 800,
        unit: "kg",
        image: "/ail.png",
        category: "Condiments",
        description: "Ail frais et aromatique pour vos préparations culinaires."
    },
    {
        id: "gingembre",
        name: "Gingembre",
        price: 1200,
        unit: "kg",
        image: "/gingembre.png",
        category: "Épices",
        description: "Gingembre frais pour vos tisanes et plats épicés."
    },
    {
        id: "pomme",
        name: "Pomme",
        price: 1500,
        unit: "kg",
        image: "/pomme.png",
        category: "Fruits",
        description: "Pommes fraîches et croquantes, importées pour une qualité optimale."
    },
    {
        id: "banane",
        name: "Banane",
        price: 800,
        unit: "kg",
        image: "/banane.png",
        category: "Fruits",
        description: "Bananes mûres et sucrées, idéales pour vos collations."
    },
    {
        id: "orange",
        name: "Orange",
        price: 1200,
        unit: "kg",
        image: "/orange.png",
        category: "Fruits",
        description: "Oranges juteuses et riches en vitamine C."
    },
    {
        id: "mangue",
        name: "Mangue",
        price: 1000,
        unit: "kg",
        image: "/mangue.png",
        category: "Fruits",
        description: "Mangues locales savoureuses, fondantes et sucrées."
    },
    {
        id: "patate-douce",
        name: "Patate Douce",
        price: 600,
        unit: "kg",
        image: "/patate.png",
        category: "Tubercules",
        description: "Patates douces locales fraîches, riches en vitamines et savoureuses."
    },
    {
        id: "limon",
        name: "Limon (Citron Vert)",
        price: 1000,
        unit: "kg",
        image: "/limon.png",
        category: "Fruits",
        description: "Petits limons verts locaux très juteux et parfumés pour vos assaisonnements et jus."
    },
    {
        id: "courgette",
        name: "Courgette",
        price: 700,
        unit: "kg",
        image: "/courgette.png",
        category: "Légumes",
        description: "Courgettes fraîches et fermes, idéales pour vos sautés et ragoûts."
    },
    {
        id: "hibiscus",
        name: "Hibiscus (Bissap)",
        price: 1200,
        unit: "kg",
        image: "/hibiscus.png",
        category: "Épices",
        description: "Fleurs d'hibiscus séchées de qualité supérieure pour un bissap rouge intense et rafraîchissant."
    },
    {
        id: "aubergine-amere",
        name: "Aubergine Amère (Jaxatu)",
        price: 500,
        unit: "kg",
        image: "/aubergine-amere.png",
        category: "Légumes",
        description: "Aubergines amères (Jaxatu / Diakhatou) fraîches, indispensables pour un authentique Thiéboudienne."
    },
    {
        id: "pain-de-singe",
        name: "Pain de Singe (Bouye)",
        price: 1500,
        unit: "kg",
        image: "/pain-de-singe.png",
        category: "Fruits",
        description: "Fruit du baobab (Bouye) 100% naturel, riche en calcium et vitamine C pour de délicieux jus onctueux."
    }
];
