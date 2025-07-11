import {articles_post, articles_get} from "./accueil/articles.js"
import { setFormulaire } from "./accueil/setFormulaire.js"; 
    
let params = new URLSearchParams(window.location.search)
let page = params.get("page")
if (!page) page = "accueil"

;(async function() 
{
    const pg = await fetch('/views/clients/' + page + '.html')
    const res = await pg.text()
    document.getElementById('mainContent').innerHTML = res
    
    //controller    
    switch(page){
        case "accueil":
            //GET /api/accueil/articles.php endpoint
            await setFormulaire()
            await articles_get()

            // POST  /api/accueil/envoyer_article.php endpoint
            await articles_post()

            break
        
        case "profile":
            break
        case "amis":
            break
    }
})()