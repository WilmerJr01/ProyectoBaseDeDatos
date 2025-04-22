exports.validarLiga = (data) => {
    const ligas = [
        'spain', 'germany', 'italy', 'england', 'france',
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
