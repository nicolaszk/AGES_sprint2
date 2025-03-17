// https://economia.awesomeapi.com.br/json/last/:moedas
// https://economia.awesomeapi.com.br/last/USD-BRL

async function getData(countries) {
    try {
        let response = await fetch(`https://economia.awesomeapi.com.br/last/${countries}`);
        let data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }

}

const x = 'USD-BRL'
getData(x);