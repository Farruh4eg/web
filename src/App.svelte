<script>
    import { onMount } from "svelte";
    const link = `https://hacker-news.firebaseio.com/v0/newstories.json?orderBy="$priority"&limitToFirst=100`;

    let savedNews = [];
    let count = 0;
    let timeout;

    onMount(() => {
        getLatest();
        timeout = setTimeout(getLatest, 60000);
    });

    async function getLatest() {
        const response = await fetch(link);
        const dataArr = await response.json();
        await dataArr.forEach((news) => {
            getNews(news);
        });
        timeout;
    }

    const getNews = async (data) => {
        if (count === 0) savedNews = [];
        const response = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${data}.json`
        );
        savedNews.push(await response.json());
        count++;
        if (count === 100) {
            count = 0;
            
            savedNews = [...savedNews].sort((a, b) => b.time - a.time);;
        }
    };
</script>

<main>
    <div class="nav" id="nav">
        <span class="hn">Hacker News</span>
    </div>
    <div class="wrapper" id="wrapper">
        {#if savedNews.length === 0}
            <p>Loading...</p>
        {:else}
            {#each savedNews as news}
                <div class="news" id={news.id}>
                    <a class="link" href={news.url}>{news.title}</a>
                    <div class="bot">
                        {news.score} points by {news.by}
                        {new Date(news.time * 1000).toLocaleString('en-GB')}
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</main>

<style>
    body {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    * {
        padding: 0;
        margin: 0;
        box-sizing: inherit;
    }

    main {
        width: 100%;
        color: black;
        overflow-x: hidden;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        width: 80vw;
        margin: 0 auto;
        background-color: #f6f6ef;
        row-gap: 7px;
        padding: 12px 2px;
        font-size: 12px;
        font-family: Verdana, Geneva, sans-serif;
    }

    .news {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        margin: 0 10px;
    }

    .bot {
        display: flex;
        gap: 5px;
        font-size: 0.8rem;
        color: gray;
    }

    a {
        text-decoration: none;
    }

    .news > a {
        color: black;
        text-decoration: none;
    }

    #nav {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: repeat(10, 1fr);
        font-weight: bold;
        font-family: Verdana, Geneva, sans-serif;
        font-size: 14px;
        padding: 2px;
        width: 80vw;
        margin: 10px auto 0 auto;
        background-color: #ff6600;
        color: black;
        align-items: center;
    }

    #refresh {
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        grid-column: 10;
    }

    #back {
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        grid-column: 9;
    }

    .hn {
        margin-left: 4px;
    }

    #commentAll {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .top {
        color: gray;
    }

    .text {
        margin-left: 1px;
    }

    .text > p {
        margin: 8px 0;
    }

    .commentAll {
        margin-left: 10px;
        margin-right: 10px;
    }

    .commentAll > div {
        margin-top: 3px;
        margin-bottom: 3px;
    }

    .children {
        margin-top: 6px;
        margin-bottom: 6px;
    }

    .brackets {
        color: gray;
    }

    .toggleVisibility:hover {
        text-decoration: underline;
    }
</style>
