fetch('https://economia.awesomeapi.com.br/json/daily/USD-BRL/15')
  .then((resp) => resp.json())
  .then((data) => {
    // Get the most recent exchange rate (first item in the array)
    let currentRate = parseFloat(data[0].bid); 
  
 
      let historicalRates = data.map(entry => {
    // Convert the timestamp (in seconds) to a Date object
    let dateObject = new Date(entry.timestamp * 1000);

    // Format the date as YYYY-MM-DD
    let formattedDate = dateObject.toISOString().split("T")[0];

    // Convert the bid price to a float for numerical operations
    let exchangeRate = parseFloat(entry.bid);

    // Return the formatted object
    return {
        date: formattedDate,
        rate: exchangeRate
    };
});

// Reverse the array to have the oldest date first (better for graphing)
historicalRates.reverse();




    console.log("Current Exchange Rate (USD to BRL):", currentRate);
    console.log("Last 15 Days of Exchange Rates:", historicalRates);
  })
  .catch((error) => console.error("Error fetching exchange rates:", error));
