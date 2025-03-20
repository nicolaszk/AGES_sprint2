document.addEventListener('DOMContentLoaded', function() { 
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');
    const currentRateDiv = document.getElementById('cambioatual');
    document.querySelectorAll(".bar-label").forEach(label => {
         let textLength = label.textContent.length;
         if(textLength > 5){
             label.style.fontSize = "1vmin";
            } else if(textLength > 5){
                label.style.fontSize = "1.3vmin";
               } else{
                   label.style.fontSize = "1.6vmin";
               }
    });

    // TRANSFORMAR CURRENCY EM CODIGO
    const currencyToCountryCode = {
  USD: 'us',
  EUR: 'eu',
  GBP: 'gb',
  JPY: 'jp',
  BRL: 'br',
  CAD: 'ca',
  AUD: 'au',
  CHF: 'ch',
  CNY: 'cn',
  INR: 'in',
  MXN: 'mx'
};

// MOSTRAR A BANDEIRA

/////////////////////////////////////////////////


async function getFlagUrl(currencyCode) {
if (typeof currencyCode !== 'string') {
    console.error(`Invalid currency code: ${currencyCode}`);
    return null;
}

    const countryCode = currencyToCountryCode[currencyCode.toUpperCase()];

  if (!countryCode) {
    console.error(`No country code found for currency: ${currencyCode}`);
    return null;
  }
  return `https://flagcdn.com/256x192/${countryCode}.png`;
}

async function updateFlag(selectId, flagId) {
 const selectElement = document.getElementById(selectId);
const flagElement = document.getElementById(flagId);

if (!selectElement || !flagElement) {
    console.error(`Element not found: ${selectId} or ${flagId}`);
    return;
}

    const currencyCode = document.getElementById(selectId).value;
  const flagUrl = await getFlagUrl(currencyCode);
if (flagUrl) {
    flagElement.src = flagUrl;
} else {
    console.error(`Flag URL not found for currency: ${currencyCode}`);
    flagElement.src = ''; // Clear the flag image
}
  if (flagUrl) {
    document.getElementById(flagId).src = flagUrl;
  }
}

// Add event listeners to the dropdowns
document.getElementById('from-currency').addEventListener('change', () => {
  updateFlag('from-currency', 'from-curr-flag-img');
});

document.getElementById('to-currency').addEventListener('change', () => {
  updateFlag('to-currency', 'to-curr-flag-img');
});

// Initialize flags on page load
window.onload = function(){

updateFlag('from-currency', 'from-curr-flag-img');
updateFlag('to-currency', 'to-curr-flag-img');
};
/////////////////////////////////////////////////







convertBtn.addEventListener('click', async function() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount)) {
            resultDiv.textContent = 'Insira um valor válido';
            return;
        }

        try {
            const response = await fetch(`https://economia.awesomeapi.com.br/json/daily/${fromCurrency}-${toCurrency}/15`);
            const data = await response.json();
            // bid é o preco atual da moeda
            let currentRate = parseFloat(data[0].bid); 
            console.log(data);
            let historicalRates = data.map(entry => {
                let dateObject = new Date(entry.timestamp * 1000);
                    // transforma aquele timestamp FEIO em uma data REAL que pode ser utilizada 
                // timestamp feio era um timestamp UNIX, o do javascript é em milisegundos e o do unix em segundos
                // ou seja precisamos multiplicar por mil pra criar uma data javascript
                //
                let formattedDate = dateObject.toISOString().split("T")[0];
                   // depois, formatamos a data javascript para uma string normalizada
                // exemplo: Wed Mar 18 2025 00:00:00 GMT+0000 (UTC)  - > "2025-03-18T00:00:00.000Z"
                // depois queremos splitar naquele T e pegar apenas a parte da esquerda, por isso o .split("T") e index 0
                let exchangeRate = parseFloat(entry.bid);
                //transformar a rate da entrada em float, pois tem ponto decimal ne 

                return {
                    date: formattedDate,
                    rate: exchangeRate  // isso aqui retorna o dicionario com os campos data (com a data formatada) e o cambio (com ele parseado pra float) 

                };
            });

            historicalRates.reverse(); // isso aqui coloca os dados em ordem cronologica, de (11,10,9,8) para (8,9,10,11) por exemplo
            // criar o grafico:        
            // as barras vao ser varias divs dentro do container-grafico
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const containerGrafico = document.getElementById("container-grafico");
            var minRate = Infinity;
            var maxRate = -Infinity;
            for(var i = 0; i < historicalRates.length; i++){
                if(historicalRates[i].rate > maxRate){
                    maxRate = historicalRates[i].rate;
                }
                if(historicalRates[i].rate < minRate){
                    minRate = historicalRates[i].rate;
                }

            }
            var averageRate =( minRate+maxRate)/2;
            containerGrafico.innerHTML = "";
                var i = 0; i < historicalRates.length; i++){
               var path = document.createElement("path");
                containerGrafico.appendChild(path)
            }
    });
});

