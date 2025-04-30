exports.validarLiga = (data) => {
    const ligas = [
        'spain', 'germany', 'italy', 'england', 'france', 'portugal', 'netherlands',
        'argentina', 'brazil', 'colombia', 'uruguay', 'ecuador',
        'UEFA CL', 'Copa Lib', 'Fifa Club'
    ];

    return data.competition && ligas.includes(data.competition);
};

exports.validarNulos = (data) => {
    return !Object.values(data).some(value => {
        return value === null || value === undefined || value.toString().trim() === '';
    });
};

exports.validarLigaAPI  = (data => {
    const ligas = [
        'Primera División', 'Bundesliga', 'Serie A', 'Premier League', 'Ligue 1', 'Liga Portuguesa', 'Eredivisie'
    ];

    return data.name && ligas.includes(data.name);
});

exports.interceptor = (name => {
    switch (name) {
        case 'spain':
            return '1';
        case 'germany':
            return '8';
        case 'italy':
            return '7';
        case 'england':
            return '10';
        case 'france':
            return '16';
        case 'portugal':
            return '19';
        case 'netherlands':
            return '9';
    }
})

exports.equiposSpain = (name => {
    switch(name) {
        case "Real Madrid": return "Real Madrid";
        case "Barcelona": return "FC Barcelona";
        case "Girona": return "Girona FC";
        case "Atlético": return "Atletico Madrid";
        case "Athletic": return "Athletic Bilbao";
        case "Real Sociedad": return "Real Sociedad";
        case "Real Betis": return "Real Betis";
        case "Villarreal": return "Villarreal CF";
        case "Valencia": return "Valencia CF";
        case "Deportivo Alavés": return "Cd Alaves";
        case "Osasuna": return "CA Osasuna";
        case "Getafe": return "Getafe CF";
        case "Celta": return "Celta Vigo";
        case "Sevilla": return "Sevilla FC";
        case "Mallorca": return "RCD Mallorca";
        case "UD Las Palmas": return "Ud Las Palmas";
        case "Rayo Vallecano": return "Rayo Vallecano";
        case "Cádiz": return "Cadiz CF";
        case "Almería": return "Ud Almeria";
        case "Granada": return "Granada CF";
        case "Espanyol": return "Espanyol Barcelona";
        case "Leganés": return "CD Leganes";
        case "Real Valladolid": return "Real Valladolid";
    }
});

exports.equiposEngland = (name => {
    switch(name) {
        case "Manchester City": return "Manchester City";
        case "Arsenal": return "Arsenal FC";
        case "Liverpool": return "Liverpool FC";
        case "Aston Villa": return "Aston Villa";
        case "Tottenham Hotspur": return "Tottenham Hotspur";
        case "Chelsea": return "Chelsea FC";
        case "Newcastle": return "Newcastle United";
        case "Manchester United": return "Manchester United";
        case "West Ham": return "West Ham United";
        case "Crystal Palace": return "Crystal Palace";
        case "Brighton & Hove Albion": return "Brighton Hove Albion";
        case "AFC Bournemouth": return "Afc Bournemouth";
        case "Fulham": return "Fulham FC";
        case "Wolves": return "Wolverhampton Wanderers";
        case "Everton": return "Everton FC";
        case "Brentford": return "Brentford FC";
        case "Nottingham Forest": return "Nottingham Forest";
        case "Luton Town": return "Luton Town";
        case "Burnley": return "Burnley FC";
        case "Sheffield United": return "Sheffield United";
        case "Ipswich Town": return "Ipswich Town";
        case "Leicester": return "Leicester City";
        case "Southampton": return "Southampton FC";
    }
});




