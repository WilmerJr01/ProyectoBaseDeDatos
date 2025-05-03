export function formDate(date){
    const fecha = date.toString()
    return `${fecha.substring(0, 4)}-${fecha.substring(4, 6)}-${fecha.substring(6, 8)}`
}

export function interceptorCompetition(competition){
    switch (competition) {
        case "Copa Lib":
            return "Copa Libertadores";
        case "spain":
            return "La Liga";
        case "england":
            return "Premier League";
        case "italy":
            return "Serie A";
        case "france":
            return "Ligue 1";
        case "germany":
            return "Bundesliga";
        case "portugal":
            return "Primeira Liga";
        case "netherlands":
            return "Eredivisie";
        case "colombia":
            return "Liga BetPlay";
        case "argentina":
            return "Liga Profesional de Fútbol";
        case "brazil":
            return "Campeonato Brasileiro Série A";
        case "uruguay":
            return "Primera División de Uruguay";
        case "Fifa Club":
            return "FIFA Club World Cup";
        case "ecuador":
            return "Liga Pro Betcris";
        default:
            return competition;
    }
}

export function interceptorCompetitionCountry(competition) {
    switch (competition) {
        case "Copa Lib":
            return "Sudamerica";  // Copa Libertadores y FIFA Club World Cup son de Sudamérica
        case "spain":
            return "España";
        case "england":
            return "Inglaterra";
        case "italy":
            return "Italia";
        case "france":
            return "Francia";
        case "germany":
            return "Alemania";
        case "portugal":
            return "Portugal";
        case "netherlands":
            return "Países Bajos";
        case "colombia":
            return "Colombia";
        case "argentina":
            return "Argentina";
        case "brazil":
            return "Brasil";
        case "uruguay":
            return "Uruguay";
        case "ecuador":
            return "Ecuador";
        case "Fifa Club":
            return "Mundo"
    }
}
