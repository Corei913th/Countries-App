
let filter = document.querySelector('.region-filter');
let searchInput = document.querySelector('.search-input');
let countriesContainer = document.querySelector('.countries-container');
const themeToggler = document.querySelector('.theme-toggler');
const loader = document.getElementById("loader");
const btnDetail = document.querySelectorAll('.eye-container .btnDetail');



const updateTheme = ()=>{
    document.body.classList.toggle('dark-mode');

    let darkMode =  document.body.classList.contains('dark-mode');

    let html = darkMode ? ` <i class="fas fa-sun"></i> Light Mode ` : ` <i class="fas fa-moon"></i> Dark Mode `;

    themeToggler.innerHTML = html;
}

const fetchCountries = async ()=>{
    try{
        const response = await fetch('../assets/datas/data.json');

        if(!response.ok){
            throw new Error(`Erreur :  ${response.status}`);
        }

        const data = await response.json();

        return data;
    }
    catch(error){
        console.error("Erreur :", error.message);
        
    }
}

const updateCountriesUI = async (region = "") => {
    try {
        const data = await fetchCountries();
        let html = "";

        if (data) {
            
            const filteredData = region
                ? data.filter(country => country.region.trim().toLowerCase() === region.trim().toLowerCase())
                : data;

            countriesContainer.innerHTML = "";

            filteredData.forEach(country => {
                html = `
                    <div class="country-card" data-name="${country.name}">
                        <img src="${country.flags.png}" alt="flag of ${country.name}" />
                        <div class="card-body">
                            <h3 class="countries-name">${country.name}</h3>
                            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                            <p><strong>Region:</strong> ${country.region}</p>
                            <p><strong>Capital:</strong> ${country.capital}</p>
                        </div>
                        <div class="eye-container"><i  data-name="${country.name}" onClick="detailCountries(this)" class="fas fa-eye btnDetail"></i></div>
                    </div>
                `;
                countriesContainer.insertAdjacentHTML('beforeend', html);
            });
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour des pays:", error);
    }
};

const detailCountries = async (btnView)=>{

    const name = btnView.getAttribute('data-name');

    const data = await fetchCountries();

    const filteredData = data.filter(c => c.name.trim().toLowerCase() === name.trim().toLowerCase());

    let mainContainer = document.querySelector('.main');

    //let borders = document.querySelector('.detail-container .borders');

    let html;


    if(filteredData){
        mainContainer.classList.add('active');
        //borders.innerHTML = '';
        filteredData.forEach(c => {

            

            html = `
                
            <div class="detail-container">
                     <button class="back-btn" onClick = "toHomePage()">← Back</button>

                <div class="detail-content">
                     <img class="detail-flag" src="${c.flags.png}" alt="${c.name}" />

                    <div class="detail-info">
                        <h2 class="detail-name">${c.name}</h2>

                        <div class="detail-columns">
                        <div class="column">
                            <p><strong>Native Name:</strong> ${c.nativeName}</p>
                            <p><strong>Population:</strong>${c.population.toLocaleString()}</p>
                            <p><strong>Region:</strong> ${c.region}</p>
                            <p><strong>Sub Region:</strong>${c.subregion}</p>
                            <p><strong>Capital:</strong> ${c.capital}</p>
                        </div>

                        <div class="column">
                            <p><strong>Top Level Domain:</strong> ${c.topLevelDomain}</p>
                            <p><strong>Currencies:</strong> ${c.currencies.map( n => n.name ).join(', ')}</p>
                            <p><strong>Languages:</strong> ${c.languages.map( l => l.name ).join(', ')}</p>
                        </div>
                        </div>

                        <div class="border-countries">
                        <p><strong>Border Countries:</strong></p>
                        <div class="borders">
                         
                            
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            
            `;

            

            //borders.insertAdjacentHTML('beforeend', borderContent);

            mainContainer.insertAdjacentHTML('beforeend', html);

            const borderContainer = document.querySelector('.borders');
                borderContainer.innerHTML = "";
                if (c.borders) {
                        c.borders.forEach(border => {
                            let html = `<span class="border-btn">${border}</span>`
                            borderContainer.insertAdjacentHTML ('beforeend', html);
                        });
                } else {
                borderContainer.innerHTML = `<span class="border-btn">None</span>`;
                }

        })
    }

}

const searchCountries = (name) => {
    const searchText = name.trim().toLowerCase();
    const allCards = countriesContainer.querySelectorAll('.country-card');

    allCards.forEach(card => {
        const countryName = card.querySelector('.countries-name').textContent.trim().toLowerCase();

        if (countryName.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};


const toHomePage = ()=>{
    location.reload();

}


 searchInput.addEventListener('input', (e)=>{
    let name = e.target.value;

    searchCountries(name);

 })


filter.addEventListener('change', async(e)=>{
    const selectedRegion = e.target.value;
    await updateCountriesUI(selectedRegion);
})

document.addEventListener('DOMContentLoaded', async()=>{
    updateTheme();
    await updateCountriesUI("");
});

themeToggler.addEventListener('click', updateTheme);

window.addEventListener("load", () => {  
    if (loader) {
      loader.style.display = "none";
    }
  });
  