let stage = localStorage.getItem('stage')

function convert() {O problema com a sua função 
    stage = localStorage.getItem('stage')
    if (stage == null) {
        document.body.classList.add("stage_two")
        localStorage.setItem('stage','stage-two')
    }
}

document.addEventListener('DOMContentLoaded',function reset() {
    
    localStorage.removeItem('stage');
    document.body.classList.remove("stage_two");

    const resultDiv = document.getElementById('result');
    const currentRateDiv = document.getElementById('cambioatual');
    const containerGrafico = document.getElementById("container-grafico");

    if(resultDiv) resultDiv.textContent = '';
    if(currentRateDiv) currentRateDiv.textContent = '';
    if(containerGrafico) containerGrafico.innerHTML = '';

    updateFlag('from-currency', 'from-curr-flag-img');
    updateFlag('to-currency', 'to-curr-flag-img');
    document.addEventListener('DOMContentLoaded', function())
    const amountInput = document.getElementById('amount');
    amountInput.value = '';
    
    const resetBtn = document.getElementById('reset-btn');
    if(resetBtn){
        resetBtn.addEventListener('click', reset);
    }
    });

}