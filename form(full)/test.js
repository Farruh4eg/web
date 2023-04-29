const form = document.forms.blog;

window.addEventListener('DOMContentLoaded', load);

form.addEventListener('submit', e => {
    e.preventDefault();
    save(e.target);
})

function save(element) {
    if(!localStorage.getItem('blog')) {
        let savedBlog = {
            title: [],
            date: [],
            author: [],
            desc: []
        };
        localStorage.setItem('blog', JSON.stringify(savedBlog));
    }
    savedBlog = JSON.parse(localStorage.getItem('blog'));
    for (let i = 0; i < Object.keys(element).length - 1; i++) {
        let rebornBlog = {
            title: [],
            date: [],
            author: [],
            desc: [],
        }
        savedBlog[element[i].name].push(element[i].value);
        rebornBlog['title'].push(element['title'].value);
        rebornBlog['date'].push(element['date'].value);
        rebornBlog['author'].push(element['author'].value);
        rebornBlog['desc'].push(element['desc'].value);
        console.log(rebornBlog);
        if(i === 0) {
            show(rebornBlog);
        }
    }
    localStorage.setItem('blog', JSON.stringify(savedBlog));
}

function load() {
    let retrieved = JSON.parse(localStorage.getItem('blog'));
    show(retrieved);
}

function show(retrieved) {
    try {
        for (let i in retrieved.title) {
            const div = document.createElement('div');
            div.id = 'Blog';

            const showTitle = document.createElement('h1');
            showTitle.innerHTML = retrieved.title[i];
            showTitle.id = 'title';
            div.appendChild(showTitle);

            const showDescription = document.createElement('p');
            showDescription.innerHTML = retrieved.desc[i];
            showDescription.id = 'description';
            div.appendChild(showDescription);

            const showAuthor = document.createElement('h4');
            showAuthor.innerHTML = "by " + retrieved.author[i];
            showAuthor.id = 'author';
            div.appendChild(showAuthor);

            const showDate = document.createElement('p');
            showDate.innerHTML = retrieved.date[i];
            showDate.id = 'date';
            div.appendChild(showDate);

            document.body.appendChild(div);
        }
    } catch (e) { }
}