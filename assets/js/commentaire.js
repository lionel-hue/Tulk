// JS pour l'interface de commentaire Facebook

document.addEventListener('DOMContentLoaded', function() {
    const commentBtn = document.getElementById('commentBtn');
    const commentSection = document.getElementById('commentSection');
    const commentInput = document.getElementById('commentInput');
    const commentList = document.getElementById('commentList');

    if (commentBtn && commentSection) {
        commentBtn.addEventListener('click', function() {
            commentSection.style.display = (commentSection.style.display === 'none' || commentSection.style.display === '') ? 'block' : 'none';
            if (commentSection.style.display === 'block') {
                commentInput.focus();
            }
        });
    }

    if (commentInput) {
        commentInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const value = commentInput.value.trim();
                if (value) {
                    addComment('Lionel Sisso', 'https://i.pravatar.cc/36?u=currentuser', value);
                    commentInput.value = '';
                }
            }
        });
    }

    function addComment(name, avatar, text) {
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
