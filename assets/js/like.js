document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    // Single click: toggle like/unlike or reset emoji
    mainContent.addEventListener('click', function(e) {
        const likeBtn = e.target.closest('.like-button');
        if (likeBtn) {
            const post = likeBtn.closest('.posts');
            if (!post) return;
            // If already has a reaction (emoji), revert to initial state
            if (post.dataset.currentReaction && post.dataset.currentReaction !== "👍") {
                resetLike(post, likeBtn);
            } else {
                toggleLike(post, likeBtn);
            }
        }
        // Click on emoji in popup
        const reaction = e.target.closest('.reaction');
        if (reaction) {
            const post = reaction.closest('.posts');
            if (!post) return;
            const emoji = reaction.childNodes[0].nodeValue.trim(); // gets the emoji only
            const label = reaction.querySelector('span').textContent.trim();
            setReaction(post, emoji, label);
        }
    });

    // Double click: show popup
    mainContent.addEventListener('dblclick', function(e) {
        const likeBtn = e.target.closest('.like-button');
        if (likeBtn) {
            const post = likeBtn.closest('.posts');
            if (!post) return;
            showReactions(post);
        }
    });

    function setReaction(post, emoji, label) {
        const likeBtn = post.querySelector('.like-button');
        likeBtn.innerHTML = `${emoji} ${label}`;
        hideReactions(post);
        post.dataset.currentReaction = emoji;
    }

    function toggleLike(post, likeBtn) {
        let currentReaction = post.dataset.currentReaction;
        const reactionDisplay = post.querySelector('.reactionDisplay');
        if (currentReaction === "👍") {
            post.dataset.currentReaction = "";
            likeBtn.innerHTML = '<i class="fa fa-thumbs-up"></i> J’aime';
            if (reactionDisplay) reactionDisplay.innerText = "";
        } else {
            setReaction(post, "👍", "J’aime");
        }
    }

    function resetLike(post, likeBtn) {
        post.dataset.currentReaction = "";
        likeBtn.innerHTML = '<i class="fa fa-thumbs-up"></i> J’aime';
        const reactionDisplay = post.querySelector('.reactionDisplay');
        if (reactionDisplay) reactionDisplay.innerText = "";
    }

    function showReactions(post) {
        const popup = post.querySelector('.reaction-popup');
        if (popup) popup.style.display = "flex";
    }

    function hideReactions(post) {
        const popup = post.querySelector('.reaction-popup');
        if (popup) popup.style.display = "none";
    }
});

