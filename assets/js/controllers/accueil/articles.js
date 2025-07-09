import { append_article } from "./append_article.js"

export async function articles_post()
{
    const accueilForm = document.getElementById('accueilForm')
    if (accueilForm) 
    {
        accueilForm.addEventListener('submit', (e) => 
        {
            e.preventDefault()
            const formData = new FormData(accueilForm)
            //console.log(formData)
            return fetch('/api/accueil/articles.php', 
            {
                method: 'POST',
                body: formData
            })

            .then(res => res.json() )

            .then(data => {
                for( let i=0; i< data.length; i++) append_article(data, i)
            })
        })
    }
}


export async function articles_get(){

    const formData = new FormData(accueilForm)
    return fetch('/api/accueil/articles.php')

    .then(res => res.json() )

    .then(data => {
        for( let i=0; i< data.length; i++) append_article(data, i)
    })
}