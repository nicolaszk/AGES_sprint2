document.addEventListener('DOMContentLoaded', function () {
    const amountInput = document.getElementById('value_input');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert');
    const resultDiv = document.getElementById('display_result');
    const currentRateDiv = document.getElementById('conversion');
    const currencyToCountryCode = {
        USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp',
        BRL: 'br', CAD: 'ca', AUD: 'au', CHF: 'ch',
        CNY: 'cn', INR: 'in', MXN: 'mx', ZAR: 'za',
        RUB: 'ru', KRW: 'kr', SEK: 'se', NZD: 'nz',
        SGD: 'sg', HKD: 'hk', NOK: 'no', TRY: 'tr',
        PLN: 'pl', THB: 'th', IDR: 'id', HUF: 'hu',
        CZK: 'cz', ILS: 'il', CLP: 'cl', PHP: 'ph',
        AED: 'ae', COP: 'co', SAR: 'sa', MYR: 'my'
    };
    const numberToNameMonth = {
        '01': 'JAN', '02': 'FEV', '03': 'MAR', '04': 'ABR',
        '05': 'MAI', '06': 'JUN', '07': 'JUL', '08': 'AGO',
        '09': 'SET', '10': 'OUT', '11': 'NOV', '12': 'DEZ'
    }
    ///////////

  let rawInput = "";
  amountInput.addEventListener("input", updateCurrency);

    fromCurrencySelect.addEventListener("change", updateCurrency);
function updateCurrency() {
    let value = amountInput.value.replace(/[^0-9.]/g, ""); // Allow numbers & decimals
    let currency = fromCurrencySelect.value;
    
    rawInput = value; // Store the raw numeric value
    
    if (value) {
        amountInput.value = `${value} ${currency}`;
    } else {
        amountInput.value = "";
    }
    amountInput.setSelectionRange(value.length, value.length);
}   
    //
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

        const currencyCode = selectElement.value;
        const flagUrl = await getFlagUrl(currencyCode);
        flagElement.src = flagUrl ? flagUrl : '';
    }

    document.getElementById('from-currency').addEventListener('change', () => {
        updateFlag('from-currency', 'flag_from');
    });

    document.getElementById('to-currency').addEventListener('change', () => {
        updateFlag('to-currency', 'flag_to');
    });

    window.onload = function () {
        updateFlag('from-currency', 'flag_from');
        updateFlag('to-currency', 'flag_to');
    };
    resetButton = document.getElementById('reset');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            try {
                const fromSelect = document.getElementById('from-currency');
                const toSelect = document.getElementById('to-currency');
                const amountInput = document.getElementById('value_input');
                const resultDisplay = document.getElementById('display_result');
                const conversionDiv = document.getElementById('conversion');
                console.log('Reset button clicked');
                console.log('Conversion Div:', conversionDiv);
                
                if (fromSelect) fromSelect.value = 'BRL';
                if (toSelect) toSelect.value = 'EUR';
                if (amountInput) amountInput.value = '';
                if (resultDisplay) resultDisplay.textContent = '';
                rawInput = "";
                for (i = 0; i < 15; i++) {
                    document.getElementById('value_'+i).textContent = '';
                    document.getElementById('date_'+i).textContent = '';
                }
                if (conversionDiv) {
                    console.log('Attempting to reset conversion div');
                    conversionDiv.textContent = '';
                    conversionDiv.style.display = 'block'; // Change from 'none' to 'block'
                }

                for(let i = 0; i < 15; i++){
                    const bar = document.getElementById(i.toString());
                    if (bar) {
                        bar.style.height = "5%";
                    }
                }
                updateFlag('from-currency', 'flag_from');
                updateFlag('to-currency', 'flag_to');

                console.log('Reset complete');
            } catch (error) {
                console.error('Error in reset function:', error);
            }
        });
    } else {
        console.error('Reset button not found');
    }
fromCurrencySelect.addEventListener('change', convert);
toCurrencySelect.addEventListener('change', convert);    
convertBtn.addEventListener('click', convert);
    async function convert(){

        const amount = rawInput;
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        if(fromCurrency == toCurrency){
            resultDiv.textContent = 'As moedas não podem ser as mesmas';
            return;
        }
        if (isNaN(amount)) {
            resultDiv.textContent = 'Insira um valor válido';
            return;
        }

        try {
            const response = await fetch(`https://economia.awesomeapi.com.br/json/daily/${fromCurrency}-${toCurrency}/15`);
            const data = await response.json();

            let historicalRates = [];
            let currentRate = null;

            if (!data[0]) {
                const dollarHistoryResponse = await fetch(`https://economia.awesomeapi.com.br/json/daily/${fromCurrency}-USD/15`);
                const dollarHistory = await dollarHistoryResponse.json();

                const usdToCurrencyResponse = await fetch(`https://economia.awesomeapi.com.br/json/daily/USD-${toCurrency}/15`);
                const usdToCurrencyData = await usdToCurrencyResponse.json();

                if (!dollarHistory.length || !usdToCurrencyData.length) {
                    throw new Error(`Missing historical data for triangulation.`);
                }

                historicalRates = dollarHistory.map((entry, index) => {
                    if (!usdToCurrencyData[index]) return null;
                    let formattedDate = new Date(entry.timestamp * 1000).toISOString().split("T")[0];
                    let rate = parseFloat(entry.bid) * parseFloat(usdToCurrencyData[index].bid);
                    return { date: formattedDate, rate: rate };
                }).filter(Boolean);

                currentRate = historicalRates[0]?.rate ?? null;
            } else {
                historicalRates = data.map(entry => {
                    let formattedDate = new Date(entry.timestamp * 1000).toISOString().split("T")[0];
                    return { date: formattedDate, rate: parseFloat(entry.bid) };
                });

                currentRate = historicalRates[0]?.rate ?? null;
            }

            if (!currentRate) {
                resultDiv.textContent = 'Não foi possível obter a taxa de câmbio.';
                return;
            }

            console.log("Historical Rates:", historicalRates);

            const containerGrafico = document.getElementById("container-grafico");
            let minRate = Math.min(...historicalRates.map(h => h.rate));
            let maxRate = Math.max(...historicalRates.map(h => h.rate));

            historicalRates.forEach((entry, i) => {
                let bar = document.getElementById(i.toString());
                let value = document.getElementById('value_' + i);
                let date = document.getElementById('date_' + i);
                if (!bar || !value || !date) return;
                console.log(typeof(entry.rate));
                let numberString = ''+entry.rate;
                if (numberString.length > 4) {
                    numberString = numberString.slice(0,4)
                }
                value.textContent = Number(numberString)

                date.textContent = entry.date.slice(-5).replace('-','/')
                
                let barAltura = ((entry.rate - minRate) / (maxRate - minRate)) * 50 + 25;
                console.log(`Bar ${i} altura: ${barAltura}%`);
                bar.style.height = barAltura + "%";
            });

            console.log("Câmbio atual:", currentRate);
            console.log("Câmbio dos últimos 15 dias:", historicalRates);

            const convertedAmount = amount * currentRate;
            resultDiv.textContent = `${convertedAmount.toFixed(2)} ${toCurrency}`;
            //resultDiv.textContent = `${convertedAmount.toFixed(2)}`;
            currentRateDiv.textContent = `1 ${fromCurrency} = ${currentRate} ${toCurrency}`;
        } catch (error) {
            console.error(error);
            resultDiv.textContent = 'Erro ao converter moedas';
        }
    };

const switch_btn = document.getElementById('switch-btn');
switch_btn.addEventListener('click', () => {
    const aux_from = document.getElementById('from-currency');
    const aux_from_value = aux_from.value;
    const aux_to = document.getElementById('to-currency');
    const aux_to_value = aux_to.value;
    const aux_input = document.getElementById('value_input');
    const aux_input_value = aux_input.value;
    const aux_output = document.getElementById('display_result');
    const aux_output_value = aux_output.textContent;
    aux_from.value = aux_to_value;
    aux_to.value = aux_from_value;
    aux_input.value = parseFloat(aux_output_value);
    aux_output.textContent = '';
    updateCurrency();
    convert();
    updateFlag('from-currency', 'flag_from');
    updateFlag('to-currency', 'flag_to');
    });})
