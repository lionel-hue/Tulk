export function set_like(likeBtn_innerHTML, post)
{
    console.log(likeBtn_innerHTML)
    console.log(post.querySelector(".post-id").innerHTML)
    fetch("/api/accueil/liker.php",
        {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body:
            JSON.stringify
            ({
                "like_type":likeBtn_innerHTML,
                "post_id":post.querySelector(".post-id").innerHTML    
            })
        })

    .then( res => res.json() )

    .then( data =>{

        post.querySelector(".like-button").textContent = ""
        
        data.forEach(e => {

            let emoji = 
                e["type"] === "J'aime" ? "👍" : 
                e["type"] === "J'adore"? "❤" : 
                e["type"] === "Solidaire"? "🤝" : 
                e["type"] === "Haha"? "😂" :
                e["type"] === "Wouah"?"😲" :
                e["type"] === "Triste"?"😢": 
                e["type"] === "En colere"?"😡":
                1

            post.querySelector(".like-button").textContent += `${emoji}(${e["nmbr"]}) `
        })

       console.log(data)
    })
}


export function liker()
{

    document.addEventListener('DOMContentLoaded', function() 
    {
        const mainContent = document.getElementById('mainContent')
        if (!mainContent) return

        // Single click: toggle like/unlike or reset emoji
        mainContent.addEventListener('click', function(e) {
            const likeBtn = e.target.closest('.like-button')
            if (likeBtn) {
                const post = likeBtn.closest('.posts')
                if (!post) return
                // If already has a reaction (emoji), revert to initial state
                if (post.dataset.currentReaction && post.dataset.currentReaction !== "👍") {
                    resetLike(post, likeBtn)
                } else {
                    toggleLike(post, likeBtn)
                }
            }
            // Click on emoji in popup
            const reaction = e.target.closest('.reaction')
            if (reaction) {
                const post = reaction.closest('.posts')
                if (!post) return
                const emoji = reaction.childNodes[0].nodeValue.trim() // gets the emoji only
                const label = reaction.querySelector('span').textContent.trim()
                setReaction(post, emoji, label)
            }
        })

        // Double click: show popup
        mainContent.addEventListener('dblclick', function(e) {
            const likeBtn = e.target.closest('.like-button')
            if (likeBtn) {
                const post = likeBtn.closest('.posts')
                if (!post) return
                showReactions(post)
            }
        })

        function setReaction(post, emoji, label) {
            const likeBtn = post.querySelector('.like-button')
            likeBtn.innerHTML = `${emoji} ${label}`
            hideReactions(post)
            post.dataset.currentReaction = emoji
            set_like(label, post) //injecte par moi
        }

        function toggleLike(post, likeBtn) {
            let currentReaction = post.dataset.currentReaction
            const reactionDisplay = post.querySelector('.reactionDisplay')
            if (currentReaction === "👍") {
                post.dataset.currentReaction = ""
                likeBtn.innerHTML = `<i class="fa fa-thumbs-up"></i> J'aime`
                if (reactionDisplay) reactionDisplay.innerText = ""
            } else {
                setReaction(post, "👍", "J'aime")
            }
        }

        function resetLike(post, likeBtn) {
            post.dataset.currentReaction = ""
            likeBtn.innerHTML = `<i class="fa fa-thumbs-up"></i> J'aime`
            const reactionDisplay = post.querySelector('.reactionDisplay')
            if (reactionDisplay) reactionDisplay.innerText = ""
        }

        function showReactions(post) {
            const popup = post.querySelector('.reaction-popup')
            if (popup) popup.style.display = "flex"
        }

        function hideReactions(post) {
            const popup = post.querySelector('.reaction-popup')
            if (popup) popup.style.display = "none"
        }
    })
} 