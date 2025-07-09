import { get_user } from "../user.js"

export function setProfile(post)
{
    return fetch("/api/accueil/commentaire.php?type=set_profile")
    .then( res => res.json() )

    .then( data => {
        let comment_text_area_photo = post.querySelector(".fb-comment-avatar")
        comment_text_area_photo.setAttribute("src", `./assets/images/${data["image"]}` )
    })  
}


export function commentaires_show(post)
{
    const id_article = post.querySelector("div[class='post-id']").textContent
    const commentList = post.querySelector("div[class='fb-comment-list commentList']")
    commentList.textContent = ''

    return fetch(`/api/accueil/commentaire.php?type=show_commentaire&id_arti=${id_article}`)
    .then( res => res.json() )

    .then( data => {
        data.forEach( e =>{
            const comment = document.createElement("div")
            comment.className = 'fb-comment-item d-flex align-items-start mb-2';
            comment.innerHTML = `
                <img src="./assets/images/${e["profile_pic"]}" class="fb-comment-avatar me-2" alt="${e["nom"]} ${e["prenom"]}">
                <div>   
                    <div style="background:#f0f2f5;border-radius:18px;padding:8px 12px;max-width:400px;">
                        <span style="font-weight:600;font-size:14px;">${e["nom"]} ${e["prenom"]}</span><br>
                        <span style="font-size:15px;">${e["commentaire"]}</span>
                    </div>
                    <div style="font-size:12px;color:#65676b;margin-left:4px;margin-top:2px;">${e['date']}</div>
                </div>
            `;
            commentList.appendChild(comment);
            })
        
    })
}


export function commentaire_send(post_input, post)
{
    return fetch("/api/accueil/commentaire.php",{
        method: "POST",
        headers : {"Content-Type" : "application/json"},

        body : JSON.stringify({
            "texte": post_input,
            "id_arti":post.querySelector(".post-id").textContent
        })
    })

    .then( res => res.json() )

    .then( data => {
        //console.log(data) plus besoin ici
    })
}

export function commentaire_btn_click()
{
    // JS pour l'interface de commentaire Facebook
    document.addEventListener('DOMContentLoaded', function() 
    {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Handle comment button click
        mainContent.addEventListener('click', async function(e) {
            const btn = e.target.closest('.commentBtn');
            if (btn) {
                const post = btn.closest('.posts');
                if (!post) return;
                const commentSection = post.querySelector('.commentSection');
                const commentInput = post.querySelector('.commentInput');
                if (!commentSection || !commentInput) return;
                commentSection.style.display = (commentSection.style.display === 'none' || commentSection.style.display === '') ? 'block' : 'none';
                if (commentSection.style.display === 'block') {
                    commentInput.focus();
                }
                await setProfile(post)//injecte par moi
                await commentaires_show(post) //injecte par moi
            }
        });

        // Handle comment input enter
        mainContent.addEventListener('keydown', async function(e) {
            if (e.target.classList.contains('commentInput') && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const input = e.target;
                const value = input.value.trim();
                if (value) 
                {
                    const post = input.closest('.posts');
                    if (!post) return;
                    const commentList = post.querySelector('.commentList');
                    if (!commentList) return;
                    const user = await get_user()

                    //console.log(user) //<--test
                    
                    addComment( `${user["nom"]} ${user["prenom"]}`,`${user["image"]}`, value, commentList); //modifie par moi
                    await commentaire_send(value, post) //injecte par moi
                    await commentaires_show(post)//injecte par moi
                    input.value = '';
                }
            }
        });

        function addComment(name, avatar, text, commentList) 
        {
            const comment = document.createElement('div');
            comment.className = 'fb-comment-item d-flex align-items-start mb-2';
            comment.innerHTML = `
                <img src="./assets/images/${avatar}" class="fb-comment-avatar me-2" alt="${name}">
                <div>
                    <div style="background:#f0f2f5;border-radius:18px;padding:8px 12px;max-width:400px;">
                        <span style="font-weight:600;font-size:14px;">${name}</span><br>
                        <span style="font-size:15px;">${text}</span>
                    </div>
                    <div style="font-size:12px;color:#65676b;margin-left:4px;margin-top:2px;">Just now · Like · Reply</div>
                </div>
            `;
            commentList.appendChild(comment);
            commentList.scrollTop = commentList.scrollHeight;
        }
    });
}