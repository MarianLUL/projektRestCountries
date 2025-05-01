const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalHeader = document.getElementById("modal-header-content");
const modal = new bootstrap.Modal(document.getElementById("one-country"));
const modalBody = document.getElementById("modal-body-content");

function loadCountries(region) {
    countriesList.innerHTML = "";
    fetch(`https://restcountries.com/v3.1/region/${region}`)
        .then(res => res.json())
        .then(data => {
            data.forEach((country) => {
                console.log(country)
                let blockCountry = `
                    <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                        <div class="card border border-dark">
                            <img class="card-img-top border border-secondary" src="${country.flags.png}" alt="Vlajka ${country.name.common}" style="height: 250px; width: 100%; object-fit: cover;" />
                            <div class="card-body">
                                <h4 class="card-title"><a href="#">${country.translations.ces.common}</a></h4>
                                <p class="card-text">Počet Obyvatel: ${country.population}</p>
                                <p class="card-text">Hlavní město: <b>${country.capital ? country.capital[0] : "Neuvedeno"}</b></p>
                                <p><button class="btn btn-info" data-name="${country.name.common}">Informace</button></p>
                            </div>
                        </div>                                        
                    </div>
                `;
                countriesList.innerHTML += blockCountry;
            });

            document.querySelectorAll('button[data-name]').forEach(button => {
                button.addEventListener('click', () => {
                    const countryName = button.getAttribute('data-name');
                    modal.show();

                    // Načti detailní informace o zemi
                    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
                        .then(res => res.json())
                        .then(data => {
                            const country = data[0];
                            const languages = country.languages ? Object.values(country.languages) : [];
                            const currencyKey = Object.keys(country.currencies || {})[0];
                            const currencyName = currencyKey ? country.currencies[currencyKey].name : "Neuvedeno";
                            const currencySymbol = currencyKey ? country.currencies[currencyKey].symbol : "Neuvedeno";

                            modalHeader.innerHTML = `
                                <h4>${country.translations.ces.common}</h4>
                            `;

                            modalBody.innerHTML = `
                                <img class="card-img-top border border-dark" src="${country.flags.png}" alt="Vlajka ${country.name.common}" style="width: 100%; height: 250px;" />
                                <p></p>
                                <p style="word-wrap: break-word;">Populace: ${country.population}</p>
                                <p style="word-wrap: break-word;">Zkratka: <b>${country.cca3}</b></p>
                                <p style="word-wrap: break-word;">Jazyk: <b>${languages}</b></p>
                                <p style="word-wrap: break-word;">Hlavní město: <b>${country.capital ? country.capital[0] : "Neuvedeno"}</b></p>
                                <p style="word-wrap: break-word;">Měna: <b>${currencyName}</b> (${currencySymbol})</p>
                                <p style="word-wrap: break-word;">Sousedí s: <b>${country.borders ? country.borders.join(", ") : "Nemá sousedy"}</b></p>
                                <p style="word-wrap: break-word;">Podregion: <b>${country.subregion}</b></p>
                                <p style="word-wrap: break-word;">Časové zóny: ${country.timezones.join(", ")}</p>
                            `;

                            // Použij API pro jazyky a nahraď %%%
                            
                                fetch(`https://restcountries.com/v3.1/lang/${language}`)
                                    .then(res => res.json())
                                    .then(langData => langData[0]?.name?.common || language)
                                    .catch(err => {
                                        console.log(`Chyba při načítání informací o jazyku: ${err}`);
                                        return "Neuvedeno";
                                    })
                            

                            Promise.all(languageFetches)
                                .then(languageNames => {
                                    const languageText = languageNames.length
                                        ? languageNames.join(", ")
                                        : "Informace o jazycích nejsou k dispozici";
                                })
                                .catch(err => {
                                    console.log(`Chyba při zpracování jazyků: ${err}`);
                                });
                        })
                        .catch(error => {
                            console.log(`Nastala chyba: ${error}`);
                        });
                });
            });
        })
        .catch(error => {
            console.log(error);
        });
}

// Inicializace s Evropou
loadCountries("europe");

// Změna kontinentu
continent.addEventListener("change", function(event) {
    loadCountries(event.target.value);
});
