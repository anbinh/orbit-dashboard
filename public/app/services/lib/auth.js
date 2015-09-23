'use strict';


module.exports = function(m) {

    m.factory('authService', ['store', '$location', 'userService', '$modal', '$http',
        function(store, $location, userService, $modal, $http) {



            var login = function(callback) {

            };


            // 
            var logout = function(callback) {

            };

            var auth = function() {

            };

            var adminAuthenticate = function() {

                console.log('CURRENT LOGGINED USER', store.get('user'));
                if (store.get('admin')) {
                    return true;
                } else {
                    window.location = './admin-login/#/';
                    return false;
                }
            };

            var isAuthenticated = function() {

                console.log('CURRENT LOGGINED USER', store.get('user'));
                if (store.get('user')) {
                    return true;
                } else {
                    return false;
                }
            };



            return {
                'login': login,
                'logout': logout,
                'auth': auth,
                'adminAuthenticate': adminAuthenticate,
                isAuthenticated: isAuthenticated

            };
        }
    ]).factory('utilService', [

        function() {

            var COUNTRY_MAP = {
                "AE": "United Arab Emirates",
                "AF": "Afghanistan",
                "AG": "Antigua and Barbuda",
                "AL": "Albania",
                "AM": "Armenia",
                "AO": "Angola",
                "AR": "Argentina",
                "AT": "Austria",
                "AU": "Australia",
                "AZ": "Azerbaijan",
                "BA": "Bosnia and Herzegovina",
                "BB": "Barbados",
                "BD": "Bangladesh",
                "BE": "Belgium",
                "BF": "Burkina Faso",
                "BG": "Bulgaria",
                "BI": "Burundi",
                "BJ": "Benin",
                "BN": "Brunei Darussalam",
                "BO": "Bolivia",
                "BR": "Brazil",
                "BS": "Bahamas",
                "BT": "Bhutan",
                "BW": "Botswana",
                "BY": "Belarus",
                "BZ": "Belize",
                "CA": "Canada",
                "CD": "Congo",
                "CF": "Central African Republic",
                "CG": "Congo",
                "CH": "Switzerland",
                "CI": "Cote d'Ivoire",
                "CL": "Chile",
                "CM": "Cameroon",
                "CN": "China",
                "CO": "Colombia",
                "CR": "Costa Rica",
                "CU": "Cuba",
                "CV": "Cape Verde",
                "CY": "Cyprus",
                "CZ": "Czech Republic",
                "DE": "Germany",
                "DJ": "Djibouti",
                "DK": "Denmark",
                "DM": "Dominica",
                "DO": "Dominican Republic",
                "DZ": "Algeria",
                "EC": "Ecuador",
                "EE": "Estonia",
                "EG": "Egypt",
                "ER": "Eritrea",
                "ES": "Spain",
                "ET": "Ethiopia",
                "FI": "Finland",
                "FJ": "Fiji",
                "FK": "Falkland Islands",
                "FR": "France",
                "GA": "Gabon",
                "GB": "United Kingdom",
                "GD": "Grenada",
                "GE": "Georgia",
                "GF": "French Guiana",
                "GH": "Ghana",
                "GL": "Greenland",
                "GM": "Gambia",
                "GN": "Guinea",
                "GQ": "Equatorial Guinea",
                "GR": "Greece",
                "GT": "Guatemala",
                "GW": "Guinea-Bissau",
                "GY": "Guyana",
                "HN": "Honduras",
                "HR": "Croatia",
                "HT": "Haiti",
                "HU": "Hungary",
                "ID": "Indonesia",
                "IE": "Ireland",
                "IL": "Israel",
                "IN": "India",
                "IQ": "Iraq",
                "IR": "Iran",
                "IS": "Iceland",
                "IT": "Italy",
                "JM": "Jamaica",
                "JO": "Jordan",
                "JP": "Japan",
                "KE": "Kenya",
                "KG": "Kyrgyz Republic",
                "KH": "Cambodia",
                "KM": "Comoros",
                "KN": "Saint Kitts and Nevis",
                "KP": "North Korea",
                "KR": "South Korea",
                "KW": "Kuwait",
                "KZ": "Kazakhstan",
                "LA": "Lao People's Democratic Republic",
                "LB": "Lebanon",
                "LC": "Saint Lucia",
                "LK": "Sri Lanka",
                "LR": "Liberia",
                "LS": "Lesotho",
                "LT": "Lithuania",
                "LV": "Latvia",
                "LY": "Libya",
                "MA": "Morocco",
                "MD": "Moldova",
                "MG": "Madagascar",
                "MK": "Macedonia",
                "ML": "Mali",
                "MM": "Myanmar",
                "MN": "Mongolia",
                "MR": "Mauritania",
                "MT": "Malta",
                "MU": "Mauritius",
                "MV": "Maldives",
                "MW": "Malawi",
                "MX": "Mexico",
                "MY": "Malaysia",
                "MZ": "Mozambique",
                "NA": "Namibia",
                "NC": "New Caledonia",
                "NE": "Niger",
                "NG": "Nigeria",
                "NI": "Nicaragua",
                "NL": "Netherlands",
                "NO": "Norway",
                "NP": "Nepal",
                "NZ": "New Zealand",
                "OM": "Oman",
                "PA": "Panama",
                "PE": "Peru",
                "PF": "French Polynesia",
                "PG": "Papua New Guinea",
                "PH": "Philippines",
                "PK": "Pakistan",
                "PL": "Poland",
                "PT": "Portugal",
                "PY": "Paraguay",
                "QA": "Qatar",
                "RE": "Reunion",
                "RO": "Romania",
                "RS": "Serbia",
                "RU": "Russian Federationß",
                "RW": "Rwanda",
                "SA": "Saudi Arabia",
                "SB": "Solomon Islands",
                "SC": "Seychelles",
                "SD": "Sudan",
                "SE": "Sweden",
                "SI": "Slovenia",
                "SK": "Slovakia",
                "SL": "Sierra Leone",
                "SN": "Senegal",
                "SO": "Somalia",
                "SR": "Suriname",
                "ST": "Sao Tome and Principe",
                "SV": "El Salvador",
                "SY": "Syrian Arab Republic",
                "SZ": "Swaziland",
                "TD": "Chad",
                "TG": "Togo",
                "TH": "Thailand",
                "TJ": "Tajikistan",
                "TL": "Timor-Leste",
                "TM": "Turkmenistan",
                "TN": "Tunisia",
                "TR": "Turkey",
                "TT": "Trinidad and Tobago",
                "TW": "Taiwan",
                "TZ": "Tanzania",
                "UA": "Ukraine",
                "UG": "Uganda",
                "US": "United States",
                "UY": "Uruguay",
                "UZ": "Uzbekistan",
                "VE": "Venezuela",
                "VN": "Vietnam",
                "VU": "Vanuatu",
                "YE": "Yemen",
                "ZA": "South Africa",
                "ZM": "Zambia",
                "ZW": "Zimbabwe"
            }





            return {
                'COUNTRY_MAP': COUNTRY_MAP
            };
        }
    ]);
};