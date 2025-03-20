let stage = localStorage.getItem('stage')

function convert() {
    stage = localStorage.getItem('stage')
    if (stage == null) {
        document.body.classList.add("stage_two")
        localStorage.setItem('stage','stage-two')
    }
}

function reset() {
    stage = localStorage.getItem('stage')
    if (stage !== null) {
        document.body.classList.remove("stage_two")
    }
}