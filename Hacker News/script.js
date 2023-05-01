window.addEventListener('DOMContentLoaded', fetchFunc);

function fetchFunc() {
    fetch(`https://hacker-news.firebaseio.com/v0/newstories.json?orderBy="$priority"&limitToFirst=100`)
        .then((response) => response.json())
        .then((json) => prepareFirst(json));
}
function prepareFirst(data) {
    for (let i in data) {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${data[i]}.json`)
            .then((response) => response.json())
            .then((json) => prepareSecond(json));
    }
}

let info = [];
let count = 0;

function prepareSecond(data) {
    info.push({
        link: data['url'],
        title: data['title'],
        author: data['by'],
        points: data['score'],
        id: data['id'],
        time: data['time'],
        kids: data['kids']
    })
    count++;
    if (count === 100) {
        count = 0;
        info.sort((a, b) => b.time - a.time);
        show(JSON.stringify(info.slice(0)));
        info = [];
    }
}

const container = document.getElementById('wrapper');

if (document.getElementById('back')) {
    document.getElementById('back').innerHTML = '';
}
if (document.getElementById('refresh')) {
    document.getElementById('refresh').innerHTML = '';
}

function show(data) {
    container.innerHTML = '';
    if (typeof data == 'string') {
        data = JSON.parse(data);
    }
    let nav = document.getElementById('nav');
    nav.innerHTML = `<span class="hn">Hacker News</span>`;
    let refresh = document.createElement('p');
    refresh.innerText = 'Обновить';
    refresh.id = 'refresh';
    refresh.addEventListener('click', () => {
        fetchFunc();
        clearInterval(interval);
    });
    nav.append(refresh);
    for (let i in data) {
        let time = new Date(data[i]['time'] * 1000);
        time = time.toLocaleDateString('en-GB', { timezone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric' });
        const div = document.createElement('div');
        const secondDiv = document.createElement('div');
        div.classList = 'news';
        div.id = data[i]['id'];
        div.innerHTML = `
    <a class='link'>${data[i]["title"]}</a>`;
        secondDiv.classList = 'bot';
        secondDiv.innerHTML = `
    ${data[i]["points"]} points by ${data[i]["author"]} ${time}`;
        div.append(secondDiv);
        container.append(div);
    }
    [...document.getElementsByClassName('link')].forEach(element => {
        element.addEventListener('click', (e) => {
            showPage(e['target']['parentElement']['id']);
        })
    })
}

const interval = setInterval(() => {
    fetchFunc();
}, 60000);

const commentAll = document.createElement('div');
commentAll.id = 'commentAll';
comment.classList = 'commentAll';

function showPage(id) {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(response => response.json())
        .then(json => {
            if (json['type'] === 'story') {
                let data = json;
                container.innerHTML = '';
                if (document.getElementById('back')) {
                    document.getElementById('back').innerHTML = '';
                }
                if (document.getElementById('refresh')) {
                    document.getElementById('refresh').innerHTML = '';
                }
                let nav = document.getElementById('nav');
                nav.innerHTML = `<span class="hn">Hacker News</span>`;
                let back = document.createElement('p');
                back.innerText = 'Назад';
                back.id = 'back';
                back.addEventListener('click', fetchFunc);
                nav.append(back);
                let refresh = document.createElement('p');
                refresh.innerText = 'Обновить';
                refresh.id = 'refresh';
                refresh.addEventListener('click', () => {
                    showPage(id);
                    clearInterval(interval);
                });
                nav.append(refresh);
                if (typeof data == 'string') {
                    data = JSON.parse(data);
                }
                let time = new Date(data['time'] * 1000);
                time = time.toLocaleDateString('en-GB', { timezone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric' });
                const div = document.createElement('div');
                const secondDiv = document.createElement('div');
                div.classList = 'news';
                div.id = data['id'];
                div.innerHTML = `
    <a href='${data['url']}' class='link'>${data["title"]}</a>`;
                secondDiv.classList = 'bot';
                secondDiv.innerHTML = `
    ${data["score"]} points by ${data["by"]} ${time}`;
                div.append(secondDiv);
                container.append(div);
                if (data['kids']) {
                    const kids = data['kids'];
                    kids.forEach(kid => showPage(kid));
                }
            } else if (json['type'] === 'comment') {
                let received = json;
                const comment = document.createElement('div');
                comment.id = received['id'];
                comment.classList = 'comment';
                comment.innerHTML = `
                            ${received['text']}`;
                commentAll.append(comment);
            }
            container.append(commentAll);
            setInterval(() => clearInterval(interval), 15);
        });
}