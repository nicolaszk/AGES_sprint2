
document.addEventListener('DOMContentLoaded', function() { 
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');

    convertBtn.addEventListener('click', async function() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount)) {
            resultDiv.textContent = 'Insira um valor válido';
            return;
        }

        try {
            const response = await fetch('link{fromcurrency}{tocurrency}')// depende da api
            const data = await response.json();
            const rate = data.rate; // alterar isso aqui tambem
                                    
            resultDiv.textContent = `Converting ${amount} ${fromCurrency} to ${toCurrency}...`;
            
            
                                                    
             const convertedAmount = amount * rate; // valor x cambio;
             resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
        } catch (error) {
            resultDiv.textContent = 'Error fetching conversion rate. Please try again later.';
            console.error('Conversion error:', error);
        }
    });
});
