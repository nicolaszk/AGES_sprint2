const apiUrl ="https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_ypx7TkjjltYJoPTm2KJw07zTMB9rBr7xTG1sqjD9"
fetch(apiUrl)
.then(response => {
    if(!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log(data);
})
.catch(error => { 
    console.error('Error:', error);
});



















