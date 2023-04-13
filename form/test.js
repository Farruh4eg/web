let savedBlog = {};

const form = document.forms.blog;

window.addEventListener('DOMContentLoaded', load);

form.addEventListener('submit', e => {
    console.log(e);
    e.preventDefault();
    save(e.target);
})

function save(element) {
    console.log(element);
    for(let i = 0; i < Object.keys(element).length - 1; i++) {
        savedBlog[element[i].name] = element[i].value;
    }
    localStorage.setItem('blog', JSON.stringify(savedBlog));
}

function load() {
    let retrieved = JSON.parse(localStorage.getItem('blog'));
    show(retrieved);
}

function show(retrieved) {
    console.log(retrieved);
    const div = document.createElement('div');
    div.id = 'Blog';

    const showTitle = document.createElement('h1');
    showTitle.innerHTML = retrieved.title;
    showTitle.id = 'title';
    div.appendChild(showTitle);

    const showDescription = document.createElement('p');
    showDescription.innerHTML = retrieved.desc;
    showDescription.id = 'description';
    div.appendChild(showDescription);

    const showAuthor = document.createElement('h4');
    showAuthor.innerHTML = "by " + retrieved.author;
    showAuthor.id = 'author';
    div.appendChild(showAuthor);

    const showDate = document.createElement('p');
    showDate.innerHTML = retrieved.date;
    showDate.id = 'date';
    div.appendChild(showDate);

    document.body.appendChild(div);
}