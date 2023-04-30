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
        time: data['time']
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

function show(data) {
    container.innerHTML = '';
    if(typeof data == 'string') {
        data = JSON.parse(data);
    }
    for (let i in data) {
        let time = new Date(data[i]['time'] * 1000);
        time = time.toLocaleDateString('en-GB', { timezone: 'UTC', hour: 'numeric', minute: 'numeric', second: 'numeric' });
        const div = document.createElement('div');
        const secondDiv = document.createElement('div');
        div.classList = 'news';
        div.id = data[i]['id'];
        div.innerHTML = `
    <a href='${data[i]["link"]}'>${data[i]["title"]}</a>`;
        secondDiv.classList = 'bot';
        secondDiv.innerHTML = `
    ${data[i]["points"]} points by <a>${data[i]["author"]}</a> ${time}`;
        div.append(secondDiv);
        container.append(div);
    }

}

const interval = setInterval(() => {
    fetchFunc();
}, 60000);

document.getElementById('refresh').addEventListener('click', () => {
    fetchFunc();
    clearInterval(interval);
});