// https://economia.awesomeapi.com.br/json/last/:moedas
// https://economia.awesomeapi.com.br/last/USD-BRL

async function getData(countries) {
    try {
        const response = await fetch(`https://economia.awesomeapi.com.br/last/${countries}`);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }


}

const money_from = 'BRL';    // GET BY FRONT END
const money_to = 'USD';
const x = money_from + "-" + money_to;
const value = 10;       // GET BY FORNT END
getData(x).then(data => {
    console.log(data);
    console.log('------------------------------');
    const replaced_value = x.replace('-', '');
    console.log(data[replaced_value].bid);

    const phrase = document.getElementById('local');
    phrase.textContent = `A conversao de ${value}${money_from} para ${money_to} eh = ${(data[replaced_value].bid*value).toFixed(2)}`;
});

//para amanha. pegar api bandeiras