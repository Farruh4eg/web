const form = document.forms.inputForm;

window.addEventListener('DOMContentLoaded', load);

form.addEventListener('submit', e => {
    e.preventDefault();
    save(e.target);
    e.currentTarget[0].value = '';
})

function save(element) {
    if(!localStorage.getItem('list')) {
        let savedList = {
            tasks: [],
        };
        localStorage.setItem('list', JSON.stringify(savedList));
    }
    savedList = JSON.parse(localStorage.getItem('list'));
    for (let i = 0; i < Object.keys(element).length - 1; i++) {
        savedList[element[i].name].push(element[i].value);
    }
    localStorage.setItem('list', JSON.stringify(savedList));
}

function load() {
    let retrieved = JSON.parse(localStorage.getItem('list'));
    show(retrieved);
    // inactiveMap(retrieved);
}

function show(retrieved) {
    try {
        const ul = document.createElement('ul');
        ul.id = 'List';
        let count = 0;
        for (let i in retrieved.task) {
            const showList = document.createElement('li');
            const showTask = document.createElement('p');
            showTask.innerText = ++count + '. ' + retrieved.task[i];
            showTask.classList = 'taskText';
            showTask.id = 'taskText'  + Number(+i + 1);
            // showTask.addEventListener('click', inactive);
            showList.classList = 'myTask' + Number(+i + 1) + ' myTask';
            showList.id = 'myTask' + Number(+i + 1);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'X';
            deleteBtn.id = 'delete';
            deleteBtn.addEventListener('click', deleteTask);
            showList.appendChild(showTask);
            showList.appendChild(deleteBtn);
            ul.appendChild(showList);

            document.body.appendChild(ul);
        }
    } catch (e) { }
}

function deleteTask(element) {
    const parent = element.target.parentElement;
    const index = parent.getAttribute('class').match(/(\d+)/);
    const savedList = JSON.parse(localStorage.getItem('list'));
    savedList.task.splice(index[0] - 1, 1);
    localStorage.setItem('list', JSON.stringify(savedList));
    parent.style.display = "none";
}

// function inactiveMap(element) {
//     if(!localStorage.getItem('inactive')) {
//         let inactiveList = {
//             taskStatus: new Set(),
//         };
//         localStorage.setItem('inactive', JSON.stringify(inactiveList));
//     }
// }

// function inactive(element) {
//     const getTask = element.target;
//     const myObj = {[getTask.id] : 'inactive'};
//     const inactiveList = JSON.parse(localStorage.getItem('inactive'));
//     inactiveList['taskStatus'].add(myObj);
//     console.log(getTask);
// }

// const mySet = new Set();
// console.log(mySet);