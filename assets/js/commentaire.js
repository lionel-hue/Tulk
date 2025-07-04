// JS pour l'interface de commentaire Facebook
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    // Handle comment button click
    mainContent.addEventListener('click', function(e) {
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
        }
    });

    // Handle comment input enter
    mainContent.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('commentInput') && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const input = e.target;
            const value = input.value.trim();
            if (value) {
                const post = input.closest('.posts');
                if (!post) return;
                const commentList = post.querySelector('.commentList');
                if (!commentList) return;
                addComment('Lionel Sisso', 'https://i.pravatar.cc/36?u=currentuser', value, commentList);
                input.value = '';
            }
        }
    });

    function addComment(name, avatar, text, commentList) {
        const comment = document.createElement('div');
        comment.className = 'fb-comment-item d-flex align-items-start mb-2';
        comment.innerHTML = `
            <img src="${avatar}" class="fb-comment-avatar me-2" alt="${name}">
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
