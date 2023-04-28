window.addEventListener('DOMContentLoaded', load);

document.forms.inputForm.addEventListener('submit', e => {
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
    for (let i = 0; i < Object.keys(element).length - 1; i++) {
        let listToShow = {
            tasks: [],
            taskId: [],
            isInactive: [],
            count: 0,
        }
        savedList['tasks'].push(element[i].value);
        listToShow['tasks'].push(element[i].value);
        savedList['isInactive'].push(false);
        listToShow['isInactive'].push(false);
        savedList['taskId'].push(`taskText${++savedList['count']}`);
        listToShow['taskId'].push(`taskText${++listToShow['count']}`);
        show(listToShow);
    }
    localStorage.setItem('list', JSON.stringify(savedList));
}

function load() {
    let retrieved = JSON.parse(localStorage.getItem('list'));
    show(retrieved);
    inactiveOnLoad();
}

function show(retrieved) {
    const savedList = JSON.parse(localStorage.getItem('list'));
    const ul = document.getElementsByClassName('list')[0];
        try {
            for (let i in retrieved.tasks) {
                const showList = document.createElement('li');
                const showTask = document.createElement('p');
                showTask.innerText = retrieved.tasks[i];
                showTask.classList = 'taskText';
                showTask.id = savedList['taskId'][i];
                showTask.addEventListener('click', inactiveOnClick);
                showList.classList = 'myTask' + Number(+i + 1) + ' myTask';
                showList.id = 'myTask' + Number(+i + 1);
                const deleteBtn = document.createElement('button');
                deleteBtn.id = 'delete';
                deleteBtn.addEventListener('click', deleteTask);
                showList.appendChild(showTask);
                showList.appendChild(deleteBtn);
                ul.append(showList);
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
    const savedList = JSON.parse(localStorage.getItem('list'));
    const index = savedList['taskId'].indexOf(element.target.id);
    savedList.isInactive[index] = !savedList.isInactive[index];
    localStorage.setItem('list', JSON.stringify(savedList));
    if (savedList.isInactive[index]) {
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