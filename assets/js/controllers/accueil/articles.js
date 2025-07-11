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
            return fetch('/api/accueil/articles.php', 
            {
                method: 'POST',
                body: formData
            })
            .then(res => res.json() )
            .then(data => {
                for(let i=0; i< data.length; i++) append_article(data, i)
                // Affichage du message SweetAlert vert après publication
                Swal.fire({     
                    title: 'Succès !',
                    text: "L'article a bien été publié.",
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745'
                });
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
        
        // Après une inscription réussie					
            Swal.fire({
                title: 'Inscription réussie !',
                text: 'Bienvenue sur Facebook .',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#28a745'
            });
        
    })
}