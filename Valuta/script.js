if (!sessionStorage.getItem('rates')) {
    fetch('https://openexchangerates.org/api/latest.json?app_id=47e54e35f393419e90b3d3aece06a115')
        .then((response) => response.json())
        .then((json) => sessionStorage.setItem('rates', JSON.stringify(json)));
}

document.forms.inputForm.addEventListener('submit', e => {
    e.preventDefault();
})

const rates = JSON.parse(sessionStorage.getItem('rates'));
const from = document.getElementById('fromCur');
const to = document.getElementById('toCur');
const option1 = document.createElement('option');
option1.innerText = rates['base'];
option1.value = rates['base'];
from.append(option1);
const getQuant = document.getElementById('inputQuantity');
getQuant.addEventListener('input', convert);
to.addEventListener('input', convert);

for(let i in rates['rates']) {
    const option2 = document.createElement('option');
    option2.innerText = i;
    option2.value = i;
    to.append(option2)
}

function convert() {
    const result = document.getElementById('result');
    const inputValue = getQuant.value;
    result.innerText = `${(inputValue * rates['rates'][to.value]).toFixed(4)}`;
}