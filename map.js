//definir les constantes de base
const PRIX = 1.49
const lAuCent = new Map([
    ["berline" , 8],
    ["hatchback" , 9],
    ["VUS" , 10],
    ["minivan" , 12],
 ]);

// variables qui vont servir aux calculs
let conso;
let centkm;
let swapped1 = false;
let swapped2 = false;
let type;
let distance;
let litre;
let cout;
let arondi;
let aLitre;
let aKm;
let Km;

//input du html
const vehicule = document.getElementById("typeChoice");
const origine = document.getElementById("origine");
const destination1 = document.getElementById("destination")
const confirmation = document.getElementById("confirm")
const clear = document.getElementById("clear");

// texts a partir du html
const mType = document.getElementById("dropQuestion");
const mKilo = document.getElementById("kiloQuestion");
const mRep = document.getElementById("rep");
// debut du autocomplete et call du distance matrix api
let autocomplete;
    
function initMap() {
                // Initialize the autocomplete functionality for the input field
    distanceService = new google.maps.DistanceMatrixService();
    
    autocomplete = new google.maps.places.Autocomplete(origine, {
                types: ['geocode'], // Limit results to geocoding (places like addresses)
            });

                // Add listener for when a place is selected
    autocomplete.addListener("place_changed");
    
    autocomplete = new google.maps.places.Autocomplete(destination1, {
            types: ['geocode'], // Limit results to geocoding (places like addresses)
        });
    
                // Add listener for when a place is selected
        autocomplete.addListener("place_changed");
};

//fonction pour aller chercher la distance
function calculateDistance() {
    verification();
    if(swapped1 === true){
        const origin = origine.value
        const destination2 = destination1.value
        
        if (!origin || !destination2) {
            mKilo.innerText = "Veuillez fournir une reponse adequate";
            mKilo.style.color = "red";
            origine.value = '';
            destination1.value = '';
            return;
        }
    
        // creer la request pour le api
        const request = {
            origins: [origin],
            destinations: [destination2],
            travelMode: google.maps.TravelMode.DRIVING, // Can be DRIVING, WALKING, BICYCLING, or TRANSIT
            unitSystem: google.maps.UnitSystem.METRIC,   // Change to IMPERIAL for miles
        };
    
        // envoyer la request et chercher une reponse
        distanceService.getDistanceMatrix(request, (response, status) => {
            
            if (status === google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status === "OK") {
                mKilo.innerText = "Maintenant, entrez votre origine et votre destination...";
                mKilo.style.color = "aliceblue";
                trouverDistace(response)
    
            } else if(status === google.maps.DistanceMatrixStatus.OK) {
            mKilo.innerText = "Aucun itineraire possible";
            mKilo.style.color = "red";
            origine.value = '';
            destination1.value = '';
                
            } else {
                alert("Une erreur est survenue");
                vehicule.selectedIndex = 0;
                destination.value = '';
                origine.value = '';
                mRep.innerText = "";
                mKilo.innerText = "Maintenant, entrez votre origine et votre destination...";
                mType.innerText = "D'abord, selectionez le type de vehicule...";
                mKilo.style.color = "aliceblue";
                mType.style.color = "aliceblue";
            }
        });}
}
//recuperer la distance a partir du fichier de reponse de l'api 
function trouverDistace(reponse){
    const un = reponse.rows[0].elements;
    const deux = un[0];
    const trois = deux.distance.value;
    calculer(trois);
};
// fonction qui valide si le choix a ete fait
function verification(){
    swapped1 = false
    if (vehicule.selectedIndex !== 0){
        swapped1 = true
        mType.innerText = "D'abord, selectionez le type de vehicule...";
        mType.style.color = "aliceblue";
    }
    else {
        swapped1 = false
        mType.innerText = "Veuiller choisir un type";
        mType.style.color = "red";
    };
};

//fonction qui calcul et retourne la valeur a l'usager
function calculer(D){
    centkm = D/100000
    distance = D/1000
    conso = lAuCent.get(vehicule.value)
    litre = conso * centkm;
    cout = litre * PRIX;
    arondi = cout.toFixed(2);
    aLitre = litre.toFixed(2);
    Km = parseFloat(distance)
    aKm = Km.toFixed(2);
    mRep.innerText = `Pour ${aKm} km, vous utiliserez ${aLitre} litre(s) pour un total de ${arondi} $. `;
};
//fonction qui efface la page
function clean(){
    alert("Etes-vous sur de vouloir effacer votre selection?")
    vehicule.selectedIndex = 0;
    destination.value = '';
    origine.value = '';
    mRep.innerText = "";
    mKilo.innerText = "Maintenant, entrez votre origine et votre destination...";
    mType.innerText = "D'abord, selectionez le type de vehicule...";
    mKilo.style.color = "aliceblue";
    mType.style.color = "aliceblue";
}
// creer une action au bouton
confirmation.addEventListener('click', calculateDistance);
clear.addEventListener('click', clean);
