document.addEventListener('DOMContentLoaded', function() { 
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');
    const currentRateDiv = document.getElementById('cambioatual');

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
          
            let historicalRates = data.map(entry => {
                let dateObject = new Date(entry.timestamp * 1000);

                let formattedDate = dateObject.toISOString().split("T")[0];

                let exchangeRate = parseFloat(entry.bid);

                return {
                    date: formattedDate,
                    rate: exchangeRate
                };
            });

            historicalRates.reverse();
            // criar o grafico:        
            // as barras vao ser varias divs dentro do container-grafico
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

            for(var i = 0; i < historicalRates.length; i++){
                var bar = document.createElement('div');
                bar.classList.add('bar');// uma bar é uma barrinha no grafico
                console.log(barAltura);
          
                var barAltura = ((Math.log(historicalRates[i].rate) - Math.log(minRate)) / 
                 (Math.log(maxRate) - Math.log(minRate))) * 100; // formula logaritmica de calcular a altura das barrinhas, para dar uma diferenca maior entre variacoes pequenas
                bar.style.height = barAltura + "%"; // tamanho da barrinha vai ser a porcentagem de altura calculada do container
                containerGrafico.appendChild(bar); // colocar a barrinha no grafico
                console.log("barrinha de altura " + barAltura + " adicionada");
            }

            console.log("câmbio atual:", currentRate);
            console.log("câmbio dos ultimos 15 dias:", historicalRates);
            //calcular e mostrar o resultado da conversao
            const convertedAmount = amount * currentRate; 
            resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
            currentRateDiv.textContent = `1 ${fromCurrency} = ${currentRate} ${toCurrency}`; 
        } catch (error) {
            resultDiv.textContent = 'Erro na api, tente novamente.';
            console.error('Erro de conversão:', error);
        }
    });
});

