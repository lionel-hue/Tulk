import {articles_post, articles_get} from "./accueil/articles.js"
    
let params = new URLSearchParams(window.location.search)
let page = params.get("page")
if (!page) page = "accueil"

;(async function() {
    const data = await fetch('/views/clients/' + page + '.html')
    const res = await data.text()
    document.getElementById('mainContent').innerHTML = res

    //controller    
    switch(page){
        case "accueil":
            //GET /api/accueil/articles.php endpoint
            articles_get()
            
            // PSOT  /api/accueil/envoyer_article.php endpoint
            articles_post()

            break
        
        case "profile":
            break
        case "amis":
            break
    }
})()