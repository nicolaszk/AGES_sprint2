document.addEventListener('DOMContentLoaded', function() { 
    const amountInput = document.getElementById('value_input');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert');
    const resultDiv = document.getElementById('display_result');
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

            // criar o grafico:        
            // as barras vao ser varias divs dentro do container-grafico
            const containerGrafico = document.getElementById("graph");
            var minRate = Infinity;
            var maxRate = -Infinity;
            for(var i = 0; i < historicalRates.length; i++){
                if(historicalRates[i].rate > maxRate){
                    maxRate = parseFloat(historicalRates[i].rate);
                }
                if(historicalRates[i].rate < minRate){
                    minRate = parseFloat(historicalRates[i].rate);
                }   

            }
for (var i = 0; i < historicalRates.length; i++) {
    if (i == 0) {
        var bar = document.getElementById("today");
    } else {
        var bar = document.getElementById(i);
    }

    if (!bar) {
        console.warn(`Element with ID ${i} not found.`);
        continue; 
    }

    var rate = parseFloat(historicalRates[i].rate);
    
    if (isNaN(rate) || rate <= 0 || minRate <= 0 || maxRate <= 0) {
        console.error(`Invalid rate detected: rate=${rate}, minRate=${minRate}, maxRate=${maxRate}`);
        continue;
    }

    var barAltura = ((Math.log(rate) - Math.log(minRate)) /
        (Math.log(maxRate) - Math.log(minRate))) * 100;

    if (isNaN(barAltura)) {
        console.error("barAltura calculation failed:", barAltura);
        continue;
    }

    bar.style.height = barAltura + "%";
    console.log(`Bar ${i} height set to ${barAltura}%`);
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

