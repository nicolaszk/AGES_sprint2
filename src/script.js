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
    }; // de currency para pais (pras bandeiras) 
    const numberToNameMonth = {
        '01': 'JAN', '02': 'FEV', '03': 'MAR', '04': 'ABR',
        '05': 'MAI', '06': 'JUN', '07': 'JUL', '08': 'AGO',
        '09': 'SET', '10': 'OUT', '11': 'NOV', '12': 'DEZ'
    } // pras datas no grafico
    ///////////

    let rawInput = ""; // para salvar o valor do input sem a moeda
    amountInput.addEventListener("input", updateCurrency);

    fromCurrencySelect.addEventListener("change", updateCurrency);
function updateCurrency() {
    let value = amountInput.value.replace(/[^0-9.]/g, ""); //isso aqui remove tudo que nao for numero ou um ponto (pras casas decimais)
    let currency = fromCurrencySelect.value; // pega a moeda selecionada
    
    rawInput = value; // guarda o valor do input sem a moeda
    
    if (value) { // se o valor EXISTIR
        amountInput.value = `${value} ${currency}`; // coloca o valor e a moeda no input
    } else { 
        amountInput.value = ""; // se nao.. deixa o input vazio
    }
    amountInput.setSelectionRange(value.length, value.length); // coloca o cursor no final dos NUMEROS do input (nao deixa ele ir pra depois da currency, pq se nao buga o backspace)
}   
    //
    async function getFlagUrl(currencyCode) { // para puxar o link da imagem da bandeira pela api
        if (typeof currencyCode !== 'string') { // se o tipo do currencyCode nao for string
            console.error(`Invalid currency code: ${currencyCode}`); //ta quebrado. nao fazer nada
            return null;
        }

        const countryCode = currencyToCountryCode[currencyCode.toUpperCase()]; // pega o pais pela moeda
        if (!countryCode) { // se nao tiver o pais
            console.error(`No country code found for currency: ${currencyCode}`); //ta quebrado. nao fazer nada
            return null;
        }
        return `https://flagcdn.com/256x192/${countryCode}.png`; // se tiver tudo certo, retorna o link da imagem da bandeira
        // essa api nao precisa de fetch, ela ja tem as imagens prontas
    }

    async function updateFlag(selectId, flagId) { // para atualizar a bandeira
        const selectElement = document.getElementById(selectId);
        const flagElement = document.getElementById(flagId);
        if (!selectElement || !flagElement) { // se nao tiver o select ou a bandeira
            console.error(`Element not found: ${selectId} or ${flagId}`); //ta quebrado. nao fazer nada
            return;
        }

        const currencyCode = selectElement.value;
        const flagUrl = await getFlagUrl(currencyCode);
        flagElement.src = flagUrl ? flagUrl : ''; // se tiver o link da bandeira, coloca ela na imagem, se nao, deixa a imagem vazia
    }

    document.getElementById('from-currency').addEventListener('change', () => {
        updateFlag('from-currency', 'flag_from'); // atualiza a bandeira do from-currency
    });

    document.getElementById('to-currency').addEventListener('change', () => {
        updateFlag('to-currency', 'flag_to'); // atualiza a bandeira do to-currency
    });

    window.onload = function () { // quando a pagina carregar
        updateFlag('from-currency', 'flag_from'); // atualiza a bandeira do from-currency
        updateFlag('to-currency', 'flag_to'); // atualiza a bandeira do to-currency
    };
    resetButton = document.getElementById('reset'); 
    if (resetButton) { // se tiver o botao de reset
        resetButton.addEventListener('click', function () { // quando clicar no botao de reset
            try {
                const fromSelect = document.getElementById('from-currency'); 
                const toSelect = document.getElementById('to-currency');
                const amountInput = document.getElementById('value_input');
                const resultDisplay = document.getElementById('display_result');
                const conversionDiv = document.getElementById('conversion');
                
                if (fromSelect) fromSelect.value = 'BRL'; // valor default do from-currency
                if (toSelect) toSelect.value = 'EUR'; // valor default do to-currency
                if (amountInput) amountInput.value = '';
                if (resultDisplay) resultDisplay.textContent = '';
               // se TUDO existir, reseta tudo
                rawInput = "";
                for (i = 0; i < 15; i++) {
                    document.getElementById('value_'+i).textContent = ''; // reseta o valor da barrinha
                    document.getElementById('date_'+i).textContent = ''; // reseta a data da barrinha
                }
                if (conversionDiv) {
                    conversionDiv.textContent = '';  // reseta a div q aparece o cambio da moeda
                    conversionDiv.style.display = 'block'; // pra nao bugar com o "none" do css (ou seja, pra aparecer)
                }

                for(let i = 0; i < 15; i++){
                    const bar = document.getElementById(i.toString()); // reseta a altura da barrinha
                    if (bar) {
                        bar.style.height = "5%"; // valor default de 5%
                    }
                }
                updateFlag('from-currency', 'flag_from'); // atualiza a bandeira do from-currency
                updateFlag('to-currency', 'flag_to'); // atualiza a bandeira do to-currency

                console.log('Reset complete'); // printa no console que o reset foi completado
            } catch (error) {
                console.error('Error in reset function:', error); // se der erro, printa no console
            }
        });
    } else {
        console.error('Reset button not found'); // se nao tiver o botao de reset, printa no console
    }
fromCurrencySelect.addEventListener('change', convert); 
toCurrencySelect.addEventListener('change', convert);    
convertBtn.addEventListener('click', convert); // quando o botao de convert for clicado
    async function convert(){

        const amount = rawInput;  // pega o valor do input sem a moeda
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        if(fromCurrency == toCurrency){ // se as moedas forem iguais
            resultDiv.textContent = 'As moedas não podem ser as mesmas'; // nao faz nada
            return;
        }
        if (isNaN(amount)) { // se o valor nao for um numero
            resultDiv.textContent = 'Insira um valor válido'; // nao faz nada
            return;
        }

        try {
            const response = await fetch(`https://economia.awesomeapi.com.br/json/daily/${fromCurrency}-${toCurrency}/15`); // puxa a api pra pegar a taxa de cambio
            const data = await response.json(); // pega os dados da api

            let historicalRates = []; //pra salvar as rates dos dias passados, um array de floats
            let currentRate = null; // pra salvar a taxa de cambio atual, um float

            if (!data[0]) { // se nao tiver a taxa de cambio, fazer a triangulacao com dolar
                const dollarHistoryResponse = await fetch(`https://economia.awesomeapi.com.br/json/daily/${fromCurrency}-USD/15`); 
                const dollarHistory = await dollarHistoryResponse.json();
                    // puxar a historia da fromcurrency para o dollar
                const usdToCurrencyResponse = await fetch(`https://economia.awesomeapi.com.br/json/daily/USD-${toCurrency}/15`);
                const usdToCurrencyData = await usdToCurrencyResponse.json();
                 // puxar a historia do dollar para a tocurrency
                if (!dollarHistory.length || !usdToCurrencyData.length) { // se nao tiver a historia de alguma das duas moedas
                    throw new Error(`Falta dados para a triangulacao`); // erro
                }

                historicalRates = dollarHistory.map((entry, index) => { // para cada dia do dollarHistory, vai pegar o valor do bid e o index
                    if (!usdToCurrencyData[index]) return null; // se nao tiver o valor da tocurrency, retorna null
                    let formattedDate = new Date(entry.timestamp * 1000).toISOString().split("T")[0]; // transforma timestamp unix em timestamp javascript, e depois em string, depois pega a parte antes do T
                    let rate = parseFloat(entry.bid) * parseFloat(usdToCurrencyData[index].bid); // pega o valor do bid do dollar e multiplica pelo valor do bid da tocurrency
                    return { date: formattedDate, rate: rate }; // retorna um dicionario com a data e a taxa de cambio, no historicalRates
                }).filter(Boolean); // filtra os valores nulos, se tiver nulo, nao vai estar no dicionario

                currentRate = historicalRates[0]?.rate ?? null; // pega a taxa de cambio atual, se nao tiver, retorna null, operadores esquisitos ne
            } else {
                historicalRates = data.map(entry => {
                    let formattedDate = new Date(entry.timestamp * 1000).toISOString().split("T")[0];
                    return { date: formattedDate, rate: parseFloat(entry.bid) };
                });

                currentRate = historicalRates[0]?.rate ?? null; // se hrates[0] existir, procura .rate, se nao existir, retorna null
            }

            if (!currentRate) { // se currentrate for null ou undefined, nao funcionou 
                resultDiv.textContent = 'Não foi possível obter a taxa de câmbio.'; // nao faz nada, da erro
                return;
            }

            console.log("Historical Rates:", historicalRates); // printa no console as rates historicas para fins de debug

            const containerGrafico = document.getElementById("container-grafico");  // pega o container do grafico
            let minRate = Math.min(...historicalRates.map(h => h.rate)); // pega a menor taxa de cambio
            let maxRate = Math.max(...historicalRates.map(h => h.rate)); // pega a maior taxa de cambio

            historicalRates.forEach((entry, i) => { // para cada entrada no historicalRates
                let bar = document.getElementById(i.toString()); // pega a barrinha
                let value = document.getElementById('value_' + i); // pega o valor da barrinha
                let date = document.getElementById('date_' + i); // pega a data da barrinha
                if (!bar || !value || !date) return; // se nao tiver a barrinha, o valor ou a data, nao faz nada
                console.log(typeof(entry.rate)); // printa no console o tipo da taxa de cambio
                let numberString = ''+entry.rate; // transforma a taxa de cambio em string
                if (numberString.length > 5) { // se a string for maior que 4
                    numberString = numberString.slice(0,4) // corta a string pra ter 4 caracteres
                } 
                value.textContent = Number(numberString) // coloca o valor da taxa de cambio na barrinha

                date.textContent = entry.date.slice(-5).replace('-','/') // coloca a data na barrinha
                
                let barAltura = ((entry.rate - minRate) / (maxRate - minRate)) * 50 + 25; // calcula e normaliza a data da barrinha para ficar entre 25 e 75
                // (rate - minRate) / (maxRate - minRate) = porcentagem da taxa de cambio entre a menor e a maior -> * 50 + 25 = normaliza entre 25 e 75

                console.log(`Bar ${i} altura: ${barAltura}%`);
                bar.style.height = barAltura + "%"; // coloca a altura da barrinha no css
            });

            console.log("Câmbio atual:", currentRate);
            console.log("Câmbio dos últimos 15 dias:", historicalRates);

            const convertedAmount = amount * currentRate; // multiplica o valor pelo cambio atual
            resultDiv.textContent = `${convertedAmount.toFixed(2)} ${toCurrency}`; // coloca o valor convertido no display
            currentRateDiv.textContent = `1 ${fromCurrency} = ${currentRate} ${toCurrency}`; // coloca o cambio atual no display
        } catch (error) {
            console.error(error); // se der erro, printa no console
            resultDiv.textContent = 'Erro ao converter moedas';
        }
    };

const switch_btn = document.getElementById('switch-btn'); 
switch_btn.addEventListener('click', () => { // funcionalidade do botao de switch
    const aux_from = document.getElementById('from-currency');
    const aux_from_value = aux_from.value;
    const aux_to = document.getElementById('to-currency');
    const aux_to_value = aux_to.value;
    const aux_input = document.getElementById('value_input');
    const aux_input_value = aux_input.value;
    const aux_output = document.getElementById('display_result');
    const aux_output_value = aux_output.textContent;
    aux_from.value = aux_to_value; // troca o valor do from pelo do to
    aux_to.value = aux_from_value; // troca o valor do to pelo do from
    aux_input.value = parseFloat(aux_output_value); // coloca o valor convertido no input
    aux_output.textContent = ''; 
    updateCurrency(); // atualiza o valor do input
    convert(); // converte o valor
    updateFlag('from-currency', 'flag_from'); // atualiza a bandeira do from-currency
    updateFlag('to-currency', 'flag_to'); // atualiza a bandeira do to-currency
    });})
