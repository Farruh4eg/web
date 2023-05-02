window.addEventListener('DOMContentLoaded', fetchFunc);

let timeout = null;
let save = [];

function fetchFunc() {
    fetch(`https://hacker-news.firebaseio.com/v0/newstories.json?orderBy="$priority"&limitToFirst=100`)
        .then((response) => response.json())
        .then((json) => {
            prepareFirst(json);
        });
}
function prepareFirst(data) {
    save = [];
    for (let i in data) {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${data[i]}.json`)
            .then((response) => response.json())
            .then((json) => {
                save.push({
                    link: json['url'],
                    title: json['title'],
                    author: json['by'],
                    points: json['score'],
                    id: json['id'],
                    time: json['time'],
                    kids: json['kids']
                });
                save.sort((a, b) => b.time - a.time);
                prepareSecond(json);
            });
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
    document.title = 'Hacker News';
    history.pushState({}, '', './index.html');
    timeout = setTimeout(() => {
        fetchFunc()
    }, 60000)
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
        clearTimeout(timeout);
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

const commentAll = document.createElement('div');
commentAll.id = 'commentAll';
comment.classList = 'commentAll';
var currentMargin = null;
var newsVar = null;
var parent = null;

function showPage(id) {
    try {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    } catch (error) {

    };
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(response => response.json())
        .then(json => {

            let url = new URL(location);
            url.searchParams.set('id', id);
            history.pushState({}, '', url);
            if (json['type'] === 'story') {
                document.title = json['title'];
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
                back.addEventListener('click', () => {
                    show(JSON.stringify(save));
                    history.pushState({}, '', './index.html');
                });
                nav.append(back);
                let refresh = document.createElement('p');
                refresh.innerText = 'Обновить';
                refresh.id = 'refresh';
                refresh.addEventListener('click', () => {
                    if (document.getElementById('commentAll')) {
                        document.getElementById('commentAll').innerHTML = '';
                    }
                    showPage(id);
                    clearTimeout(timeout);
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
                newsVar = div.id;
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
                if (json['kids']) {
                    const kids = json['kids'];
                    kids.forEach(kid => showPage(kid));
                }
                let received = json;
                if (!received['deleted']) {
                    const secondDiv = document.createElement('div');
                    const comment = document.createElement('div');
                    let time = new Date(json['time'] * 1000);
                    time = time.toLocaleDateString('en-GB', { timezone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric' });
                    secondDiv.classList = 'comment';
                    secondDiv.innerHTML = `
    <span class='top'>${json["by"]} ${time}</span>`;
                    secondDiv.id = received['id'];
                    comment.classList = 'text';
                    comment.innerHTML = `
                ${received['text']}`;
                    secondDiv.appendChild(comment);
                    parent = document.getElementById(received['parent']);
                    let children = parent.querySelector('.children');
                    if (received['parent'] === newsVar) {
                        secondDiv.style.marginLeft = 0;
                        commentAll.appendChild(secondDiv);                  
                    } else if(received['parent'] !== newsVar){
                        if(!children) {
                            children = document.createElement('div');
                            children.classList = 'children';
                            parent.append(children);
                        }
                        currentMargin = parent.style.marginLeft;
                        secondDiv.style.marginLeft = Number(+(currentMargin.match(/(\d)/) || 0)  + 2) + 'rem';
                        children.append(secondDiv);
                    }
                }
            }
            container.append(commentAll);
        });
}