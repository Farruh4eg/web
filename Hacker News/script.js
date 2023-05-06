/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable require-jsdoc */
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
  for (const i in data) {
    if (Object.hasOwn(data, i)) {
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
              kids: json['kids'],
            });
            save.sort((a, b) => b.time - a.time);
            prepareSecond(json);
          });
    }
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
    kids: data['kids'],
  });
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
    fetchFunc();
  }, 60000);
  container.innerHTML = '';
  if (typeof data == 'string') {
    data = JSON.parse(data);
  }
  const nav = document.getElementById('nav');
  nav.innerHTML = `<span class="hn">Hacker News</span>`;
  const refresh = document.createElement('p');
  refresh.innerText = 'Обновить';
  refresh.id = 'refresh';
  refresh.addEventListener('click', () => {
    fetchFunc();
    clearTimeout(timeout);
  });
  nav.append(refresh);
  for (const i in data) {
    if (Object.hasOwn(data, i)) {
      let time = new Date(data[i]['time'] * 1000);
      time = time.toLocaleDateString('en-GB', {
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      const div = document.createElement('div');
      const secondDiv = document.createElement('div');
      div.classList = 'news';
      div.id = data[i]['id'];
      div.innerHTML = `
    <a class='link'>${data[i]['title']}</a>`;
      secondDiv.classList = 'bot';
      secondDiv.innerHTML = `
    ${data[i]['points']} points by ${data[i]['author']} ${time}`;
      div.append(secondDiv);
      container.append(div);
    }
  }
  [...document.getElementsByClassName('link')].forEach((element) => {
    element.addEventListener('click', (e) => {
      showPage(e['target']['parentElement']['id']);
    });
  });
}

const commentAll = document.createElement('div');
commentAll.id = 'commentAll';
commentAll.classList = 'commentAll';
let currentMargin = null;
let newsVar = null;
let parent = null;

function showPage(id) {
  try {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  } catch (error) {
    console.log(error);
  }
  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then((response) => response.json())
      .then((json) => {
        if (json['type'] === 'story') {
          const url = new URL(location);
          url.searchParams.set('id', id);
          history.pushState({}, '', url);
          document.title = json['title'];
          let data = json;
          container.innerHTML = '';
          if (document.getElementById('back')) {
            document.getElementById('back').innerHTML = '';
          }
          if (document.getElementById('refresh')) {
            document.getElementById('refresh').innerHTML = '';
          }
          const nav = document.getElementById('nav');
          nav.innerHTML = `<span class="hn">Hacker News</span>`;
          const back = document.createElement('p');
          back.innerText = 'Назад';
          back.id = 'back';
          back.addEventListener('click', () => {
            commentAll.innerHTML = '';
            show(JSON.stringify(save));
          });
          nav.append(back);
          const refresh = document.createElement('p');
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
          time = time.toLocaleDateString('en-GB', {
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          });
          const div = document.createElement('div');
          const secondDiv = document.createElement('div');
          div.classList = 'news';
          div.id = data['id'];
          newsVar = div.id;
          div.innerHTML = `
    <a href='${data['url']}' class='link'>${data['title']}</a>`;
          secondDiv.classList = 'bot';
          secondDiv.innerHTML = `
    ${data['score']} points by ${data['by']} ${time}`;
          div.append(secondDiv);
          container.append(div);
          if (data['kids']) {
            const kids = data['kids'];
            kids.forEach((kid) => showPage(kid));
          }
        } else if (json['type'] === 'comment') {
          if (json['kids']) {
            const kids = json['kids'];
            kids.forEach((kid) => showPage(kid));
          }
          const received = json;
          if (!received['deleted']) {
            const secondDiv = document.createElement('div');
            const comment = document.createElement('div');
            let time = new Date(json['time'] * 1000);
            time = time.toLocaleDateString('en-GB', {
              timezone: 'UTC',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            });
            secondDiv.classList = 'comment';
            secondDiv.innerHTML = `
    <span class='top'>${json['by']} ${time}</span>
    <span class='brackets'>[
      <a class='toggleVisibility' id='toggleVisibility'
    onclick='collapse(this)'>hide</a>
  ]</span>`;
            secondDiv.id = received['id'];
            comment.classList = 'text';
            comment.innerHTML = `
                ${received['text']}`;
            secondDiv.appendChild(comment);
            parent = document.getElementById(received['parent']);
            if (received['parent'] == newsVar) {
              secondDiv.style.marginLeft = 0;
              commentAll.appendChild(secondDiv);
            } else if (received['parent'] != newsVar) {
              currentMargin = parent.style.marginLeft;
              secondDiv.className = 'child';
              // eslint-disable-next-line max-len
              secondDiv.style.marginLeft = `${+ (currentMargin.match(/(\d)/)[0] || 0) + 30}px`;
              parent.insertAdjacentElement('afterend', secondDiv);
            }
          }
        }
        container.append(commentAll);
      });
}

// eslint-disable-next-line no-unused-vars
function collapse(element) {
  if (element.parentElement?.nextSibling?.className === 'text') {
    element.parentElement.nextSibling.style.display = 'none';
    collapse(element.parentElement.parentElement.nextSibling);
    // eslint-disable-next-line max-len
  } else if (parseInt(element.parentElement?.nextSibling?.style?.marginLeft) >= parseInt(element.parentElement?.parentElement?.style?.marginLeft)) {
    element.parentElement.parentElement.nextSibling.style.display = 'none';
    collapse(element.parentElement.parentElement.nextSibling);
  } else if (element.className === 'child') {
    // eslint-disable-next-line max-len
    if (parseInt(element.style.marginLeft) === parseInt(element.nextSibling.style.marginLeft)) {
      return;
    } else {
      element.style.display = 'none';
      collapse(element.nextSibling);
    }
  }
}
