var getColorForAreaOfLaw = function(areaOfLaw) {
    switch(areaOfLaw.toUpperCase()) {
        case "Housing & Property".toUpperCase():
            return "#ff7043";
        case "Family Law".toUpperCase():
            return "#aa00ff";
        case "Wills, Trusts & Probate".toUpperCase():
            return "#007aff";
        case "Immigration".toUpperCase():
            return "#009688";
        case "Employment".toUpperCase():
            return "#5e35b1";
        case "Personal Injury".toUpperCase():
            return "#e2115c";
        case "Clinical Negligence".toUpperCase():
            return "#ff7043";
        case "Company & Commercial".toUpperCase():
            return "#663e33";
        case "Commercial Property".toUpperCase():
            return "#00a13d";
        case "Driving Offences".toUpperCase():
            return "#ff7043";
        case "Crime/ Criminal Defence".toUpperCase():
            return "#aa00ff";
        case "Commercial Litigation Matters".toUpperCase():
            return "#007aff";
        case "Litigation Law".toUpperCase():
            return "#009688";
        case "IT & Intellectual Property".toUpperCase():
            return "#5e35b1";
        case "Actions against the police".toUpperCase():
            return "#e2115c";
        case "Agriculture".toUpperCase():
            return "#ff7043";
        case "Banking".toUpperCase():
            return "#663e33";
        case "Charities".toUpperCase():
            return "#00a13d";
        case "Construction".toUpperCase():
            return "#ff7043";
        case "Consumer".toUpperCase():
            return "#aa00ff";
        case "Dispute Resolution".toUpperCase():
            return "#007aff";
        case "Divorce".toUpperCase():
            return "#009688";
        case "Education".toUpperCase():
            return "#5e35b1";
        case "Energy & Transport".toUpperCase():
            return "#e2115c";
        case "Human rights".toUpperCase():
            return "#ff7043";
        case "Money & Tax".toUpperCase():
            return "#663e33";
        case "Notary".toUpperCase():
            return "#00a13d";
        case "Professional Negligence".toUpperCase():
            return "#ff7043";
        case "Regulations".toUpperCase():
            return "#aa00ff";
        case "Welfare & Benefits".toUpperCase():
            return "#007aff";
        case "Mediation".toUpperCase():
            return "#009688";
        case "Employment - business".toUpperCase():
            return "#5e35b1";
        default:
            return "#00a13d";
    }
};