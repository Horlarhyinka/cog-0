Project title: COG-api
Description: COG-api is an api endpoint for a real estate management application including features that enables users to showcase their properties for sales, rental, lease. 
Authentication: 
JWT- 
Oauth - 

Services: 
payment service: payment is implemented using the moniepoint api
location: 
    base url - /api/v1/services/locations

    getStates - /states
        options:
            - extended: default is false, setting extended value to true returns a json array of states with towns and lgas
        example: curl "/api/v1/services/locations/states"
                response: ["lagos, "oyo", "ogun"...]
        example2: curl "/api/v1/services/locations/states?extended=true"
                response: "anambra":{"lgas":["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onistsha South","Orumba North","Orumba South","Oyi"],"towns":["Onitsha","Nnewi","Ihiala"]},
                "kwara":{"lgas":["Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],"towns":["Jebba","Offa","Omu-Aran"]},
                "niger":{"lgas":["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako","Gurara","Katcha","Kotangora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Moya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"],"towns":["Bida","Kotangora","Suleja","Zungeru"]}...

    getTowns - /{state}/towns
        - state: name of the state you want to get the town
        exanmple: curl "/api/v1/services/locations/lagos/towns
            response:["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagary","Epe","Eti-Osa","Ibeju-Lekki", "Ifako-Ijaye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Somolu","Surulere"]

        getTowns - /{state}/lgsa
        - state: name of the state you want to get the local governments
        exanmple: 
        `curl "/api/v1/services/locations/lagos/lgas"`
            response: ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagary","Epe","Eti-Osa","Ibeju-Lekki", "Ifako-Ijaye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Somolu","Surulere"],
        