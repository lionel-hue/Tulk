export function afficher_articles_get(){

    const formData = new FormData(accueilForm)
    fetch('/api/accueil/afficher_articles.php')

    .then(res => res.json() )

    .then(data => {
        for( let i=0; i< data.length; i++){
            const article = document.createElement('div')
            article.innerHTML = document.querySelector('.posts').innerHTML

            article.setAttribute("class", document.querySelector('.posts').getAttribute("class") )

            article.querySelector('.post-content').innerHTML = data[i].description

            article.querySelector('.post-image').setAttribute('src', `./assets/images/${data[i].image}`)

            document.querySelector("div[class='main-content py-4 flex-grow-1 mt-0']").appendChild(article)
        }
    })
}