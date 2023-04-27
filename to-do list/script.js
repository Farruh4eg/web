const form = document.forms.inputForm;

window.addEventListener('DOMContentLoaded', load);

form.addEventListener('submit', e => {
    e.preventDefault();
    console.log(e.target);
    save(e.target);
    e.currentTarget[0].value = '';
})


function save(element) {
    if (!localStorage.getItem('list')) {
        let savedList = {
            tasks: [],
            taskId: [],
            isInactive: [],
            count: 0,
        };
        localStorage.setItem('list', JSON.stringify(savedList));
    }
    savedList = JSON.parse(localStorage.getItem('list'));
    console.log(savedList);
    for (let i = 0; i < Object.keys(element).length - 1; i++) {
        savedList['tasks'].push(element[i].value);
        savedList['isInactive'].push(false);
        savedList['taskId'].push(`taskText${++savedList['count']}`);
    }
    localStorage.setItem('list', JSON.stringify(savedList));
}

function load() {
    let retrieved = JSON.parse(localStorage.getItem('list'));
    show(retrieved);
    inactiveOnLoad();
}

function show(retrieved) {
    const ul = document.createElement('ul');
    ul.id = 'List';
    let count = 0;
    const savedList = JSON.parse(localStorage.getItem('list'));
        try {
            for (let i in retrieved.tasks) {
                const showList = document.createElement('li');
                const showTask = document.createElement('p');
                showTask.innerText = ++count + '. ' + retrieved.tasks[i];
                showTask.classList = 'taskText';
                showTask.id = savedList['taskId'][i];
                console.log(showList);
                showTask.addEventListener('click', inactiveOnClick);
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
                localStorage.setItem('list', JSON.stringify(savedList));
            }
        } catch (error) {
            
        }
}

function deleteTask(element) {
    const parent = element.target.parentElement;
    const getId = parent.children[0].id;
    const savedList = JSON.parse(localStorage.getItem('list'));
    const index = savedList.taskId.indexOf(getId);
    savedList.tasks.splice(index, 1);
    savedList.isInactive.splice(index, 1);
    savedList.taskId.splice(index, 1);
    localStorage.setItem('list', JSON.stringify(savedList));
    parent.style.display = "none";
}

function inactiveOnClick(element) {
    const child = element.target.parentElement.children[0];
    const index = parseInt(child.innerText);
    console.log(index);
    const savedList = JSON.parse(localStorage.getItem('list'));
    savedList.isInactive[index - 1] = !savedList.isInactive[index - 1];
    localStorage.setItem('list', JSON.stringify(savedList));
    if (savedList.isInactive[index - 1]) {
        child.style.textDecoration = 'line-through red 3px';
    } else {
        child.style.textDecoration = 'none';
    }
}

function inactiveOnLoad() {
    const savedList = JSON.parse(localStorage.getItem('list'));
    const tasksCollection = savedList.taskId;
    for (let i in tasksCollection) {
        let inactiveTask = document.getElementsByClassName('taskText');
        if (savedList.isInactive[i]) {
            inactiveTask[i].style.textDecoration = 'line-through red 3px';
        } else {
            inactiveTask[i].style.textDecoration = 'none';
        }
    }
}