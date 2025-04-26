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
