// Patterns pour la détection des langues
export const languagePatterns = {
    // Français - Large vocabulaire et expressions courantes
    france: {
        pattern: /\b(merci|parfait|super|impeccable|recommande|très|envoi|rapide|vendeur|nikel|rien\s+[àa]\s+dire|au\s+top|excellent[e]?|bien|satisfait[e]?|content[e]?|conforme|comme\s+prévu|sympa|poli|sérieux|génial|top|ras|nickel|emballage|livraison|communication|service|article|produit|état|condition|colis|reçu|petit\s+cadeau|petit\s+plus|envoi\s+soigné|bien\s+emballé|je\s+recommande|[àa]\s+recommander|recommand[ée]|conseill[ée]|satisfaisant[e]?|agréable|magnifique|superbe|extra)\b/i,
        examples: [
            "Merci beaucoup",
            "Parfait, je recommande",
            "Envoi rapide",
            "Vendeur sérieux",
            "Rien à dire"
        ]
    },

    // Italien - Large gamme d'expressions et mots courants
    italie: {
        pattern: /\b(grazie|mille|oggetto|venditor[ei]|gentil[ei]|perfetto|tutto|spedizione|ottimo|bellissimo|arrivato|pacco|veloce|consigliato|bello|bella|benissimo|preciso|precisa|eccellente|fantastico|fantastica|stupendo|stupenda|meraviglioso|meravigliosa|contento|contenta|soddisfatto|soddisfatta|raccomandato|raccomandabile|puntuale|affidabile|cortese|cortesia|professionale|professionalità|qualità|ottima|celere|rapidissimo|rapidissima|perfettamente|conforme|descrizione|venditrice|acquisto|ricevuto|imballaggio|impeccabile|come nuovo|come nuova|condizioni|esattamente|conferme|positivo|positiva|serietà|gentilezza|disponibile|disponibilità)\b/i,
        examples: [
            "Grazie mille",
            "Spedizione veloce",
            "Venditore professionale",
            "Tutto perfetto",
            "Ottima qualità"
        ]
    },

    // Espagnol - Expressions variées et idiomatiques
    espagne: {
        pattern: /\b((?:muchas\s)?gracias|todo\s+perfecto|muy\s+bien|vendedor[ae]s?|envío|rápido|excelente|genial|estupendo|encantad[oa]|perfecto|perfecta|recomendable|recomiendo|satisfech[oa]|content[oa]|maravilloso|maravillosa|fantástico|fantástica|excelente|buenísimo|buenísima|magnífico|magnífica|impecable|como\s+nuevo|como\s+nueva|descripción|exactamente|calidad|profesional|amable|atent[oa]|rápido|rapidísimo|puntual|fiable|seguro|segura|estado|condición|embalaje|envío|recibido|recibida|llegó|comunicación|servicio|atención|respuesta|producto|artículo|tal\s+cual|según\s+lo\s+anunciado|mejor\s+imposible|sin\s+problema|repetiré|volveré\s+a\s+comprar)\b/i,
        examples: [
            "Muchas gracias",
            "Todo perfecto",
            "Vendedor excelente",
            "Envío rápido",
            "Muy recomendable"
        ]
    },

    // Allemand - Vocabulaire riche et expressions courantes
    allemagne: {
        pattern: /\b(?<!au\s|le\s|du\s)(danke|sehr|guten\s+tag|vielen\s+dank|schönen|verkäufer(?:in)?|hallo|nochmals|sticker|für\s+die|LG|alles\s+gut|super\s+schnell|perfekt|toll|wunderbar|ausgezeichnet|bestens|prima|klasse|empfehlenswert|empfehlung|zufrieden|sehr\s+zufrieden|schnell|schnelle|lieferung|versand|verpackung|wie\s+beschrieben|wie\s+neu|einwandfrei|tadellos|genau|pünktlich|zuverlässig|freundlich|nett|super|gut|gerne\s+wieder|bis\s+bald|viele\s+grüße|herzlichen\s+dank|besten\s+dank|passt|stimmt|entspricht|qualität|super\s+service|reibungslos|problemlos|schnell\s+geliefert|gut\s+verpackt|wie\s+abgebildet|wie\s+angegeben|alles\s+bestens|sehr\s+schön|empfehlenswert)\b/i,
        examples: [
            "Vielen Dank",
            "Alles bestens",
            "Super schnelle Lieferung",
            "Gerne wieder",
            "Sehr zufrieden"
        ]
    },

    // Tchèque - Expressions courantes et variations
    republiqueTcheque: {
        pattern: /\b(děkuji|dobře|perfektní|prodejce|zboží|rychlé|doporučuji|spokojenost|výborné|výborný|skvělé|skvělý|super|prima|přesně|podle\s+popisu|jako\s+nové|jako\s+nový|rychlé\s+dodání|spolehlivý|spolehlivá|komunikace|ochota|vstřícnost|kvalita|stav|balení|doručení|vše\s+ok|vše\s+v\s+pořádku|naprostá\s+spokojenost|určitě\s+doporučuji|rád[aa]\s+nakupuji|perfektní\s+komunikace|rychlé\s+jednání|bezproblémové|seriózní|profesionální|přístup|ochoten|ochotná|spokojená|spokojený)\b/i,
        examples: [
            "Děkuji moc",
            "Vše v pořádku",
            "Rychlé dodání",
            "Perfektní komunikace",
            "Určitě doporučuji"
        ]
    },

    // Lituanien - Expressions complètes et variations
    lituanie: {
        pattern: /\b(ačiū|puiku|tobula|pardavėjas|prekė|greitas|labai|patenkint[ai]|rekomenduoju|puikus|puiki|labai\s+geras|labai\s+gera|kokybė|būklė|aprašymas|atitinka|greitai|patikimai|maloniai|profesionaliai|aptarnavimas|bendravimas|pristatymas|įpakavimas|kaip\s+nauja|kaip\s+naujas|rekomenduočiau|patenkint[ai]|viskas\s+gerai|puikiai|tvarkingai|malonu|ačiū\s+labai|labai\s+patenkint[ai]|super|rekomenduosiu|tikrai\s+rekomenduoju)\b/i,
        examples: [
            "Ačiū labai",
            "Puikus pardavėjas",
            "Greitas pristatymas",
            "Kokybė puiki",
            "Labai patenkinta"
        ]
    },

    // Néerlandais - Large vocabulaire et expressions idiomatiques
    paysBas: {
        pattern: /\b(bedankt|artikel|zoals|beschreven|advertentie|bestelling|ontvangen|goede|snelle|levering|tevreden|prima|heel|erg|netjes|keurig|precies|volgens|afspraak|verpakking|verzending|communicatie|super|perfect|top|geweldig|uitstekend|helemaal|goed|snel|correct|proper|mooi|fijn|vriendelijk|behulpzaam|service|kwaliteit|staat|conditie|verzorgd|aanbevolen|aanrader|zeker|weer|bestellen|contact|verkoper|verkoopster|dank|hartelijk|bedankt|zeer|tevreden|blij|precies|zoals|verwacht|klopt|helemaal|goed|verpakt|verzonden)\b/i,
        examples: [
            "Bedankt voor alles",
            "Snelle levering",
            "Netjes verpakt",
            "Precies zoals beschreven",
            "Heel tevreden"
        ]
    },

    // Anglais - Vocabulaire riche et expressions courantes
    anglais: {
        pattern: /\b(?:(?:thank\s*you)|(?:very\s*good)|perfect|great|seller|received|quick|shipping|excellent|fast|recommended|amazing|awesome|brilliant|fantastic|wonderful|satisfied|happy|pleased|delighted|exactly|described|condition|quality|service|communication|professional|friendly|helpful|reliable|prompt|quick|fast|delivery|packaging|packed|item|product|arrived|received|condition|new|mint|recommend|definitely|surely|absolutely|positive|experience|smooth|transaction|pleasure|dealing|responsive|efficient|excellent|superb|outstanding|impressive)\b/i,
        examples: [
            "Thank you very much",
            "Perfect condition",
            "Fast shipping",
            "Excellent service",
            "Highly recommended"
        ]
    }
};

// Mots à exclure pour éviter les faux positifs
export const exclusionPatterns = {
    // Mots français à exclure des autres langues
    allemagne: /\b(au\s+top|le\s+top|du\s+top|super\s+sympa|super\s+content|super\s+vendeur|top\s+je\s+recommande)\b/i,
    
    // Mots espagnols similaires au français
    espagne: /\b(très|bien|parfait|merci|super|top|recommande|excellent|rapide|parfaitement|conforme|description|vendeur|vendeuse|envoi|reçu|comme\s+neuf|comme\s+prévu|satisfait|satisfaite|content|contente|qualité|emballage|livraison|communication|service|article|produit|état|condition|recommande|conseille|impeccable|nickel|génial)\b/i,
    
    // Mots néerlandais similaires à l'anglais
    anglais: /\b(bedankt|artikel|zoals|stars|goed|prima|snel|perfect|super|service|kwaliteit|conditie|precies|netjes|correct|proper)\b/i
};

// Exemples de commentaires pour tester
export const testComments = [
    {
        text: "Grazie mille, spedizione veloce, venditore professionale",
        expectedLanguage: "italie"
    },
    {
        text: "Muchas gracias, todo perfecto, envío rápido",
        expectedLanguage: "espagne"
    },
    {
        text: "Vielen Dank, alles bestens, sehr zufrieden",
        expectedLanguage: "allemagne"
    },
    {
        text: "Děkuji moc, perfektní komunikace",
        expectedLanguage: "republiqueTcheque"
    },
    {
        text: "Ačiū labai, puikus pardavėjas",
        expectedLanguage: "lituanie"
    },
    {
        text: "Bedankt, artikel zoals beschreven, snelle levering",
        expectedLanguage: "paysBas"
    },
    {
        text: "Thank you, perfect condition, fast shipping",
        expectedLanguage: "anglais"
    },
    {
        text: "Merci beaucoup, envoi rapide, vendeur sérieux",
        expectedLanguage: "france"
    }
];
