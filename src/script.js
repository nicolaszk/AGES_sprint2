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
            for(var i = 0; i < historicalRates.length; i++){
                var barContainer = document.createElement('div');
                barContainer.classList.add('bar-container');
                var dateLabel = document.createElement('div');
                dateLabel.classList.add('bar-label');
                dateLabel.textContent = historicalRates[i].date.slice(-2);
                var rateLabel = document.createElement('div');
                rateLabel.classList.add('bar-label');
                rateLabel.textContent = historicalRates[i].rate.toFixed(2);
                // fica com exatos 2 numeros apos o ponto decimal

                var bar = document.createElement('div');
                bar.classList.add('bar');// uma bar é uma barrinha no grafico
                console.log(barAltura);
                
                var barAltura  = ((historicalRates[i].rate - minRate) / (maxRate - minRate)) * 50  + 25;
               
                bar.style.height = barAltura + "%"; // tamanho da barrinha vai ser a porcentagem de altura calculada do container
                barContainer.appendChild(dateLabel);
                barContainer.appendChild(bar);
                barContainer.appendChild(rateLabel);
                containerGrafico.appendChild(barContainer);
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

