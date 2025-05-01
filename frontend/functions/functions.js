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