

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
        id: "1",
        name: "Oignon Local",
        price: 500,
        unit: "kg",
        image: "/oignon.png",
        category: "Légumes",
        description: "Oignons locaux frais, parfaits pour vos plats quotidiens. Cultivés au Sénégal."
    },
    {
        id: "2",
        name: "Pomme de terre",
        price: 600,
        unit: "kg",
        image: "/pomme-terre.png",
        category: "Tubercules",
        description: "Pommes de terre de qualité supérieure, idéales pour les frites, purées ou ragoûts."
    },
    {
        id: "3",
        name: "Carotte",
        price: 400,
        unit: "kg",
        image: "/carotte.png",
        category: "Légumes",
        description: "Carottes croquantes et sucrées, riches en vitamines."
    },
    {
        id: "4",
        name: "Tomate Fraîche",
        price: 800,
        unit: "kg",
        image: "/tomate.png",
        category: "Légumes",
        description: "Tomates rouges et juteuses, indispensables pour vos sauces et salades."
    },
    {
        id: "5",
        name: "Chou Pommé",
        price: 300,
        unit: "unité",
        image: "/chou-pomme.png",
        category: "Légumes",
        description: "Chou pommé frais, excellent pour le Tiep ou les salades."
    },
    {
        id: "6",
        name: "Poivron Vert",
        price: 1000,
        unit: "kg",
        image: "/poivron-vert.png",
        category: "Légumes",
        description: "Poivrons verts croquants pour relever le goût de vos plats."
    },
    {
        id: "7",
        name: "Aubergine",
        price: 500,
        unit: "kg",
        image: "/aubergine.png",
        category: "Légumes",
        description: "Aubergines violettes, parfaites pour les ragoûts et les plats mijotés."
    },
    {
        id: "8",
        name: "Concombre",
        price: 400,
        unit: "kg",
        image: "/concombre.png",
        category: "Légumes",
        description: "Concombres frais et rafraîchissants pour vos entrées."
    },
    // Légumes supplémentaires
    {
        id: "10",
        name: "Haricot Vert",
        price: 900,
        unit: "kg",
        image: "/haricot_vert.png",
        category: "Légumes",
        description: "Haricots verts frais et croquants, riches en fibres."
    },
    {
        id: "11",
        name: "Laitue",
        price: 350,
        unit: "unité",
        image: "/laitue.png",
        category: "Légumes",
        description: "Laitue fraîche et croquante pour vos salades."
    },
    {
        id: "12",
        name: "Betterave",
        price: 450,
        unit: "kg",
        image: "/betterave.png",
        category: "Légumes",
        description: "Betteraves fraîches, idéales pour les salades ou cuites."
    },
    {
        id: "13",
        name: "Navet",
        price: 400,
        unit: "kg",
        image: "/navet.png",
        category: "Légumes",
        description: "Navets frais pour vos soupes et ragoûts traditionnels."
    },
    {
        id: "14",
        name: "Persil Frais",
        price: 200,
        unit: "botte",
        image: "/persil_frais.png",
        category: "Herbes",
        description: "Persil frais pour assaisonner vos plats."
    },
    {
        id: "15",
        name: "Menthe Fraîche",
        price: 200,
        unit: "botte",
        image: "/menthe_fraiche.png",
        category: "Herbes",
        description: "Menthe fraîche pour le thé ou vos salades."
    },
    {
        id: "16",
        name: "Piment Fort",
        price: 1500,
        unit: "kg",
        image: "/piment_fort.png",
        category: "Épices",
        description: "Piments forts pour relever vos plats."
    },
    {
        id: "17",
        name: "Ail",
        price: 800,
        unit: "kg",
        image: "/ail.png",
        category: "Condiments",
        description: "Ail frais et aromatique pour vos préparations culinaires."
    },
    {
        id: "18",
        name: "Gingembre",
        price: 1200,
        unit: "kg",
        image: "/gingembre.png",
        category: "Épices",
        description: "Gingembre frais pour vos tisanes et plats épicés."
    },
    {
        id: "19",
        name: "Pomme",
        price: 1500,
        unit: "kg",
        image: "/pomme.png",
        category: "Fruits",
        description: "Pommes fraîches et croquantes, importées pour une qualité optimale."
    },
    {
        id: "20",
        name: "Banane",
        price: 800,
        unit: "kg",
        image: "/banane.png",
        category: "Fruits",
        description: "Bananes mûres et sucrées, idéales pour vos collations."
    },
    {
        id: "21",
        name: "Orange",
        price: 1200,
        unit: "kg",
        image: "/orange.png",
        category: "Fruits",
        description: "Oranges juteuses et riches en vitamine C."
    },
    {
        id: "22",
        name: "Mangue",
        price: 1000,
        unit: "kg",
        image: "/mangue.png",
        category: "Fruits",
        description: "Mangues locales savoureuses, fondantes et sucrées."
    }
];
