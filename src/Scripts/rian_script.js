async function getData(countries) {
    try {
        const response = await fetch(`https://economia.awesomeapi.com.br/last/${countries}`);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }


}

const result_button = document.getElementById('result-button');
result_button.addEventListener('click',() => {
    let money_from = document.getElementById('from-currency').value;
    let money_to = document.getElementById('to-currency').value;
    const formated_countries = money_from + "-" + money_to;
    const value_from = parseFloat(document.getElementById('value_input').value);
    getData(formated_countries).then(data => {
        const replaced_value = formated_countries.replace('-', '');
        const converter = parseFloat(data[replaced_value].bid);

        const div_result = document.querySelector('.display_result');
        const result = (converter*value_from).toFixed(2);
        div_result.innerHTML = result;
    });
    money_from = money_from.slice(0,2);
    money_to = money_to.slice(0,2);
    const first_flagImg = document.getElementById('flag1');
    first_flagImg.src = `https://flagsapi.com/${money_from}/flat/64.png`;
    const second_flagImg = document.getElementById('flag2');
    second_flagImg.src = `https://flagsapi.com/${money_to}/flat/64.png`;
});
