export const brandLogos = {
    // Marques de vêtements existantes
    'adidas': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    'nike': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Nike_Logo.svg',
    'zara': 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg',
    'h&m': 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg',
    'puma': 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg',
    'lacoste': 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Lacoste_logo.svg',
    'ralph lauren': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Ralph_Lauren_logo.svg',
    'tommy hilfiger': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Tommy_Hilfiger_logo.svg',
    'the north face': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/The_North_Face_logo.svg',
    'uniqlo': 'https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg',

    // Marques de motos
    'honda': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg',
    'yamaha': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Yamaha_logo.svg',
    'yamaha motors': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Yamaha_logo.svg',
    'yamaha motor': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Yamaha_logo.svg',
    'yamaha moto': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Yamaha_logo.svg',
    'kawasaki': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Kawasaki_Logo.svg',
    'suzuki': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg',
    'ducati': 'https://upload.wikimedia.org/wikipedia/commons/0/06/Ducati_Corse_logo.svg',
    'harley davidson': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Harley-Davidson_logo.svg',
    'ktm': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/KTM-Logo.svg',
    'bmw motorrad': 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    'triumph': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Triumph_logo.svg',
    'aprilia': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Aprilia_logo.svg',
    'moto guzzi': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Moto_Guzzi_logo.svg',
    'royal enfield': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Royal_Enfield_logo.svg',

    // Marques de voitures
    'mercedes': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
    'bmw': 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    'audi': 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
    'volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
    'porsche': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Porsche_logo.svg',
    'ferrari': 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Ferrari-Logo.svg',
    'lamborghini': 'https://upload.wikimedia.org/wikipedia/commons/d/df/Lamborghini_Logo.svg',
    'maserati': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Maserati_logo.svg',
    'alfa romeo': 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Alfa_Romeo_logo.svg',
    'fiat': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Fiat_Automobiles_logo.svg',
    'renault': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Renault_2009_logo.svg',
    'peugeot': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Peugeot_2021_logo.svg',
    'citroen': 'https://upload.wikimedia.org/wikipedia/commons/3/39/Citro%C3%ABn.svg',
    'toyota': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
    'lexus': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Lexus_division_emblem.svg',
    'nissan': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Nissan_logo.svg',
    'mazda': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Mazda_logo_2.svg',
    'subaru': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Subaru_Corporation_logo.svg',
    'mitsubishi': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Mitsubishi_logo.svg',
    'volvo': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Volvo_Trucks_Logo.svg',
    'jaguar': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Jaguar_2012_logo.svg',
    'land rover': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Land_Rover_logo2.svg',
    'mini': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/MINI_logo.svg',
    'rolls royce': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Rolls-Royce_Motor_Cars_logo.svg',
    'bentley': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Bentley_logo_2.svg',
    'aston martin': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Aston_Martin_Logo.svg',
    'mclaren': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/McLaren_logo.svg',
    'bugatti': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Bugatti_logo.svg',
    'tesla': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.svg',

    // Logo par défaut
    'default': 'https://via.placeholder.com/150?text=Brand'
};

// Fonction utilitaire pour obtenir le logo d'une marque
export const getBrandLogo = (brandName) => {
    const normalizedBrandName = brandName.toLowerCase().trim();
    return brandLogos[normalizedBrandName] || brandLogos.default;
};

// Fonction pour obtenir le nom formaté de la marque
export const formatBrandName = (brandName) => {
    return brandName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};
