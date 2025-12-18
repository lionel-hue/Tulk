document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle")
  const sideMenu = document.getElementById("sideMenu")
  const closeMenu = document.getElementById("closeMenu")
  const navBtns = document.querySelectorAll(".nav-btn")
  const sections = document.querySelectorAll(".section-content")
  const headerProfile = document.getElementById("headerProfile")

  const currentUser = {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@exemple.fr",
    role: "admin", // Can be 'admin', 'mod', or 'user'
    sexe: "M",
    image: "/admin-user-profile.png",
  }

  // Initialize app
  initializeApp()

  function initializeApp() {
    setupUserRole()
    setupNavigation()
    setupModals()
    loadFeedSection()
    loadProfileSection()
    loadFriendsSection()
    loadMessagesSection()
    loadNotificationsSection()

    if (currentUser.role === "admin" || currentUser.role === "mod") {
      loadDashboardSection()
    }
  }

  function setupUserRole() {
    // Show dashboard button for admin/mod
    if (currentUser.role === "admin" || currentUser.role === "mod") {
      const dashboardBtns = document.querySelectorAll('.nav-btn[data-section="dashboard"]')
      dashboardBtns.forEach((btn) => {
        btn.style.display = "flex"
      })
    }

    // Set profile pictures
    const profilePics = document.querySelectorAll("#userProfilePic, #feedProfilePic")
    profilePics.forEach((pic) => {
      pic.src = currentUser.image
    })
  }

  function setupNavigation() {
    menuToggle.addEventListener("click", () => {
      sideMenu.classList.add("open")
    })

    closeMenu.addEventListener("click", () => {
      sideMenu.classList.remove("open")
    })

    navBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const section = e.currentTarget.dataset.section

        if (section) {
          navBtns.forEach((b) => b.classList.remove("active"))
          document.querySelectorAll(`.nav-btn[data-section="${section}"]`).forEach((b) => b.classList.add("active"))

          sections.forEach((s) => s.classList.remove("active"))
          const targetSection = document.getElementById(`${section}Section`)
          if (targetSection) {
            targetSection.classList.add("active")
          }

          sideMenu.classList.remove("open")
        }
      })
    })

    document.getElementById("logoutBtn").addEventListener("click", () => {
      customConfirm("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", () => {
        window.location.href = "login.html"
      })
    })

    headerProfile.addEventListener("click", () => {
      navBtns.forEach((b) => b.classList.remove("active"))
      document.querySelectorAll('.nav-btn[data-section="profile"]').forEach((b) => b.classList.add("active"))
      sections.forEach((s) => s.classList.remove("active"))
      document.getElementById("profileSection").classList.add("active")
    })
  }

  function setupModals() {
    document.querySelectorAll(".close-modal").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modalId = e.currentTarget.dataset.modal
        closeModal(modalId)
      })
    })

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show")
        }
      })
    })

    document.getElementById("alertOk").addEventListener("click", () => closeModal("alertModal"))
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.add("show")
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.remove("show")
    }
  }

  function customAlert(title, message) {
    document.getElementById("alertTitle").textContent = title
    document.getElementById("alertMessage").textContent = message
    openModal("alertModal")
  }

  function customConfirm(title, message, onConfirm) {
    document.getElementById("confirmTitle").textContent = title
    document.getElementById("confirmMessage").textContent = message

    const confirmOk = document.getElementById("confirmOk")
    const confirmCancel = document.getElementById("confirmCancel")

    const handleConfirm = () => {
      closeModal("confirmModal")
      if (onConfirm) onConfirm()
      cleanup()
    }

    const handleCancel = () => {
      closeModal("confirmModal")
      cleanup()
    }

    const cleanup = () => {
      confirmOk.removeEventListener("click", handleConfirm)
      confirmCancel.removeEventListener("click", handleCancel)
    }

    confirmOk.addEventListener("click", handleConfirm)
    confirmCancel.addEventListener("click", handleCancel)

    openModal("confirmModal")
  }

  // Make closeModal available globally for inline onclick
  window.closeModal = closeModal

  function loadFeedSection() {
    const addPostTrigger = document.getElementById("addPostTrigger")
    const addPostForm = document.getElementById("addPostForm")
    const postImageInput = document.getElementById("postImage")
    const postImagePreview = document.getElementById("postImagePreview")
    const postsFeed = document.getElementById("postsFeed")
    const searchInput = document.getElementById("searchInput")

    // Sample posts from Article table
    const posts = [
      {
        id: 1,
        id_uti: 2,
        user: {
          nom: "Martin",
          prenom: "Sophie",
          image: "/woman-user.png",
        },
        description: "Belle journée pour coder ! 🚀",
        image: "/coding-workspace.png",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 42,
        comments: 8,
      },
      {
        id: 2,
        id_uti: 3,
        user: {
          nom: "Bernard",
          prenom: "Luc",
          image: "/man-user.png",
        },
        description: "Nouveau projet en cours ! 💻",
        image: null,
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 28,
        comments: 5,
      },
    ]

    let filteredPosts = [...posts]

    addPostTrigger.addEventListener("click", () => openModal("addPostModal"))

    postImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          postImagePreview.innerHTML = `<img src="${event.target.result}" alt="Aperçu">`
          postImagePreview.classList.add("show")
        }
        reader.readAsDataURL(file)
      } else {
        postImagePreview.classList.remove("show")
        postImagePreview.innerHTML = ""
      }
    })

    addPostForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const description = document.getElementById("postDescription").value

      if (!description.trim()) {
        customAlert("Erreur", "Veuillez écrire quelque chose !")
        return
      }

      const newPost = {
        id: posts.length + 1,
        id_uti: currentUser.id,
        user: {
          nom: currentUser.nom,
          prenom: currentUser.prenom,
          image: currentUser.image,
        },
        description: description,
        image: postImagePreview.querySelector("img")?.src || null,
        date: new Date(),
        likes: 0,
        comments: 0,
      }

      posts.unshift(newPost)
      filteredPosts = [...posts]
      renderPosts(filteredPosts)

      addPostForm.reset()
      postImagePreview.classList.remove("show")
      postImagePreview.innerHTML = ""
      closeModal("addPostModal")

      customAlert("Succès", "Votre post a été publié !")
    })

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim()

      if (query === "") {
        filteredPosts = [...posts]
      } else {
        filteredPosts = posts.filter(
          (post) =>
            post.description.toLowerCase().includes(query) ||
            post.user.nom.toLowerCase().includes(query) ||
            (post.user.prenom && post.user.prenom.toLowerCase().includes(query)),
        )
      }

      renderPosts(filteredPosts)
    })

    function renderPosts(postsToRender) {
      if (postsToRender.length === 0) {
        postsFeed.innerHTML = `
          <div class="post-card">
            <p style="text-align: center; color: var(--muted-foreground);">Aucun post trouvé</p>
          </div>
        `
        return
      }

      postsFeed.innerHTML = postsToRender
        .map((post) => {
          const userName = `${post.user.prenom || ""} ${post.user.nom}`.trim()
          const postDate = formatDate(post.date)

          return `
            <div class="post-card" data-post-id="${post.id}">
              <div class="post-header">
                <img src="${post.user.image}" alt="${userName}" class="profile-pic-small">
                <div class="post-user-info">
                  <div class="post-user-name">${userName}</div>
                  <div class="post-date">${postDate}</div>
                </div>
              </div>
              <div class="post-content">
                <p class="post-description">${post.description}</p>
                ${post.image ? `<img src="${post.image}" alt="Image du post" class="post-image">` : ""}
              </div>
              <div class="post-actions">
                <button class="post-action-btn like-btn" data-post-id="${post.id}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>${post.likes}</span>
                </button>
                <button class="post-action-btn comment-btn" data-post-id="${post.id}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>${post.comments}</span>
                </button>
                <button class="post-action-btn share-btn" data-post-id="${post.id}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
              </div>
            </div>
          `
        })
        .join("")

      document.querySelectorAll(".like-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const postId = Number.parseInt(e.currentTarget.dataset.postId)
          const post = posts.find((p) => p.id === postId)

          if (post) {
            post.likes++
            e.currentTarget.classList.add("active")
            e.currentTarget.querySelector("span").textContent = post.likes

            setTimeout(() => {
              e.currentTarget.classList.remove("active")
            }, 300)
          }
        })
      })

      document.querySelectorAll(".comment-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const postId = Number.parseInt(e.currentTarget.dataset.postId)
          openCommentsModal(postId)
        })
      })

      document.querySelectorAll(".share-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          customAlert("Partager", "Fonctionnalité de partage bientôt disponible !")
        })
      })
    }

    renderPosts(filteredPosts)
  }

  function openCommentsModal(postId) {
    // Sample comments from Commentaire table
    const comments = [
      {
        id: 1,
        id_arti: postId,
        id_uti: 2,
        user: {
          nom: "Martin",
          prenom: "Sophie",
          image: "/woman-user.png",
        },
        texte: "Super post !",
        date: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ]

    const commentsList = document.getElementById("commentsList")
    commentsList.innerHTML = comments
      .map((comment) => {
        const userName = `${comment.user.prenom || ""} ${comment.user.nom}`.trim()
        const commentTime = formatDate(comment.date)

        return `
          <div class="comment-item">
            <img src="${comment.user.image}" alt="${userName}" class="comment-avatar">
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">${userName}</span>
                <span class="comment-time">${commentTime}</span>
              </div>
              <div class="comment-text">${comment.texte}</div>
            </div>
          </div>
        `
      })
      .join("")

    const addCommentForm = document.getElementById("addCommentForm")
    addCommentForm.onsubmit = (e) => {
      e.preventDefault()
      const commentText = document.getElementById("commentText").value

      if (!commentText.trim()) {
        customAlert("Erreur", "Veuillez écrire un commentaire !")
        return
      }

      const newComment = {
        id: comments.length + 1,
        id_arti: postId,
        id_uti: currentUser.id,
        user: {
          nom: currentUser.nom,
          prenom: currentUser.prenom,
          image: currentUser.image,
        },
        texte: commentText,
        date: new Date(),
      }

      comments.push(newComment)
      openCommentsModal(postId)
      document.getElementById("commentText").value = ""
      customAlert("Succès", "Commentaire ajouté !")
    }

    openModal("commentsModal")
  }

  function loadProfileSection() {
    document.getElementById("profileName").textContent = `${currentUser.prenom || ""} ${currentUser.nom}`.trim()
    document.getElementById("profileEmail").textContent = currentUser.email
    document.getElementById("profileAvatar").src = currentUser.image

    const roleText =
      currentUser.role === "admin" ? "Administrateur" : currentUser.role === "mod" ? "Modérateur" : "Utilisateur"
    document.getElementById("profileRole").textContent = roleText

    if (currentUser.role === "admin") {
      document.getElementById("adminStatsCard").style.display = "block"
      document.getElementById("totalUsers").textContent = "247"
      document.getElementById("totalPosts").textContent = "1,532"
      document.getElementById("totalMessages").textContent = "8,421"
      document.getElementById("totalFriendships").textContent = "3,156"
    } else if (currentUser.role === "mod") {
      document.getElementById("modStatsCard").style.display = "block"
    }

    document.getElementById("myPosts").textContent = "23"
    document.getElementById("myFriends").textContent = "45"
    document.getElementById("myLikes").textContent = "328"
    document.getElementById("myComments").textContent = "156"

    document.getElementById("editProfileBtn").addEventListener("click", () => {
      document.getElementById("editNom").value = currentUser.nom
      document.getElementById("editPrenom").value = currentUser.prenom || ""
      document.getElementById("editEmail").value = currentUser.email
      document.getElementById("editSexe").value = currentUser.sexe || ""
      openModal("editProfileModal")
    })

    document.getElementById("editProfileForm").addEventListener("submit", (e) => {
      e.preventDefault()

      currentUser.nom = document.getElementById("editNom").value
      currentUser.prenom = document.getElementById("editPrenom").value
      currentUser.email = document.getElementById("editEmail").value
      currentUser.sexe = document.getElementById("editSexe").value

      document.getElementById("profileName").textContent = `${currentUser.prenom || ""} ${currentUser.nom}`.trim()
      document.getElementById("profileEmail").textContent = currentUser.email

      closeModal("editProfileModal")
      customAlert("Succès", "Profil mis à jour avec succès !")
    })

    // Load user's posts
    const profilePosts = document.getElementById("profilePosts")
    profilePosts.innerHTML = `
      <div class="post-card">
        <p style="text-align: center; color: var(--muted-foreground);">Aucun post pour le moment</p>
      </div>
    `
  }

  function loadFriendsSection() {
    // Sample friend requests from Amitie table with statut='en attente'
    const friendRequests = [
      {
        id_1: 5,
        id_2: currentUser.id,
        user: {
          nom: "Dubois",
          prenom: "Marie",
          image: "/diverse-woman-avatar.png",
        },
      },
      {
        id_1: 6,
        id_2: currentUser.id,
        user: {
          nom: "Lefebvre",
          prenom: "Pierre",
          image: "/man-avatar.png",
        },
      },
    ]

    // Sample friends from Amitie table with statut='ami'
    const friends = [
      {
        id: 2,
        nom: "Martin",
        prenom: "Sophie",
        image: "/woman-friend.jpg",
      },
      {
        id: 3,
        nom: "Bernard",
        prenom: "Luc",
        image: "/man-friend.jpg",
      },
    ]

    const friendRequestsList = document.getElementById("friendRequests")
    if (friendRequests.length === 0) {
      friendRequestsList.innerHTML = `<p style="text-align: center; color: var(--muted-foreground);">Aucune demande d'amitié</p>`
    } else {
      friendRequestsList.innerHTML = friendRequests
        .map((req) => {
          const userName = `${req.user.prenom || ""} ${req.user.nom}`.trim()
          return `
            <div class="friend-request-item">
              <img src="${req.user.image}" alt="${userName}" class="profile-pic-small">
              <div class="friend-info">
                <div class="friend-name">${userName}</div>
              </div>
              <div class="friend-actions">
                <button class="btn-primary btn-sm accept-friend-btn" data-user-id="${req.id_1}">Accepter</button>
                <button class="btn-secondary btn-sm reject-friend-btn" data-user-id="${req.id_1}">Refuser</button>
              </div>
            </div>
          `
        })
        .join("")

      document.querySelectorAll(".accept-friend-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          customAlert("Succès", "Demande d'amitié acceptée !")
          loadFriendsSection()
        })
      })

      document.querySelectorAll(".reject-friend-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          customConfirm("Refuser", "Êtes-vous sûr de vouloir refuser cette demande ?", () => {
            loadFriendsSection()
          })
        })
      })
    }

    const friendsList = document.getElementById("friendsList")
    if (friends.length === 0) {
      friendsList.innerHTML = `<p style="text-align: center; color: var(--muted-foreground);">Aucun ami pour le moment</p>`
    } else {
      friendsList.innerHTML = friends
        .map((friend) => {
          const userName = `${friend.prenom || ""} ${friend.nom}`.trim()
          return `
            <div class="friend-item">
              <img src="${friend.image}" alt="${userName}" class="profile-pic-small">
              <div class="friend-info">
                <div class="friend-name">${userName}</div>
              </div>
              <button class="btn-secondary btn-sm message-friend-btn" data-user-id="${friend.id}">Message</button>
            </div>
          `
        })
        .join("")

      document.querySelectorAll(".message-friend-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const userId = e.currentTarget.dataset.userId
          navBtns.forEach((b) => b.classList.remove("active"))
          document.querySelectorAll('.nav-btn[data-section="messages"]').forEach((b) => b.classList.add("active"))
          sections.forEach((s) => s.classList.remove("active"))
          document.getElementById("messagesSection").classList.add("active")
          openChat(userId)
        })
      })
    }

    document.getElementById("findFriendsBtn").addEventListener("click", () => {
      openModal("findFriendsModal")
      loadSearchFriends()
    })
  }

  function loadSearchFriends() {
    const searchFriendsInput = document.getElementById("searchFriendsInput")
    const searchFriendsList = document.getElementById("searchFriendsList")

    const allUsers = [
      { id: 7, nom: "Moreau", prenom: "Julie", image: "/diverse-woman-portrait.png" },
      { id: 8, nom: "Simon", prenom: "Marc", image: "/man.jpg" },
    ]

    function renderSearchResults(users) {
      if (users.length === 0) {
        searchFriendsList.innerHTML = `<p style="text-align: center; color: var(--muted-foreground);">Aucun utilisateur trouvé</p>`
        return
      }

      searchFriendsList.innerHTML = users
        .map((user) => {
          const userName = `${user.prenom || ""} ${user.nom}`.trim()
          return `
            <div class="search-friend-item">
              <img src="${user.image}" alt="${userName}" class="profile-pic-small">
              <div class="friend-info">
                <div class="friend-name">${userName}</div>
              </div>
              <button class="btn-primary btn-sm add-friend-btn" data-user-id="${user.id}">Ajouter</button>
            </div>
          `
        })
        .join("")

      document.querySelectorAll(".add-friend-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          customAlert("Succès", "Demande d'amitié envoyée !")
        })
      })
    }

    searchFriendsInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim()
      const filtered = allUsers.filter(
        (user) => user.nom.toLowerCase().includes(query) || (user.prenom && user.prenom.toLowerCase().includes(query)),
      )
      renderSearchResults(filtered)
    })

    renderSearchResults(allUsers)
  }

  function loadMessagesSection() {
    // Sample conversations from Message table
    const conversations = [
      {
        id_uti: 2,
        user: {
          nom: "Martin",
          prenom: "Sophie",
          image: "/woman-chat.jpg",
        },
        lastMessage: "Salut ! Comment ça va ?",
        time: "Il y a 5 min",
      },
      {
        id_uti: 3,
        user: {
          nom: "Bernard",
          prenom: "Luc",
          image: "/man-chat.jpg",
        },
        lastMessage: "On se voit demain ?",
        time: "Il y a 2h",
      },
    ]

    const conversationsList = document.getElementById("conversationsList")
    conversationsList.innerHTML = conversations
      .map((conv) => {
        const userName = `${conv.user.prenom || ""} ${conv.user.nom}`.trim()
        return `
          <div class="conversation-item" data-user-id="${conv.id_uti}">
            <img src="${conv.user.image}" alt="${userName}" class="profile-pic-small">
            <div class="conversation-info">
              <div class="conversation-name">${userName}</div>
              <div class="conversation-preview">${conv.lastMessage}</div>
            </div>
            <div class="conversation-time">${conv.time}</div>
          </div>
        `
      })
      .join("")

    document.querySelectorAll(".conversation-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const userId = e.currentTarget.dataset.userId
        document.querySelectorAll(".conversation-item").forEach((i) => i.classList.remove("active"))
        e.currentTarget.classList.add("active")
        openChat(userId)
      })
    })
  }

  function openChat(userId) {
    const conversations = [
      {
        id_uti: 2,
        user: {
          nom: "Martin",
          prenom: "Sophie",
          image: "/woman-chat.jpg",
        },
      },
      {
        id_uti: 3,
        user: {
          nom: "Bernard",
          prenom: "Luc",
          image: "/man-chat.jpg",
        },
      },
    ]

    const conversation = conversations.find((c) => c.id_uti == userId)
    if (!conversation) return

    const userName = `${conversation.user.prenom || ""} ${conversation.user.nom}`.trim()

    document.getElementById("messagesPlaceholder").style.display = "none"
    document.getElementById("chatContainer").style.display = "flex"

    document.getElementById("chatUserName").textContent = userName
    document.querySelector("#chatHeader img").src = conversation.user.image

    // Sample messages from Message table
    const messages = [
      {
        id: 1,
        id_uti_1: userId,
        id_uti_2: currentUser.id,
        texte: "Salut ! Comment ça va ?",
        image: null,
        date: new Date(Date.now() - 10 * 60 * 1000),
        sent: false,
      },
      {
        id: 2,
        id_uti_1: currentUser.id,
        id_uti_2: userId,
        texte: "Très bien ! Et toi ?",
        image: null,
        date: new Date(Date.now() - 8 * 60 * 1000),
        sent: true,
      },
    ]

    const chatMessages = document.getElementById("chatMessages")
    chatMessages.innerHTML = messages
      .map((msg) => {
        const messageTime = formatDate(msg.date)
        return `
          <div class="message-item ${msg.sent ? "sent" : ""}">
            <img src="${msg.sent ? currentUser.image : conversation.user.image}" alt="Avatar" class="message-avatar">
            <div class="message-content">
              <div class="message-bubble">
                ${msg.texte}
                ${msg.image ? `<img src="${msg.image}" alt="Image" class="message-image">` : ""}
              </div>
              <div class="message-time">${messageTime}</div>
            </div>
          </div>
        `
      })
      .join("")

    chatMessages.scrollTop = chatMessages.scrollHeight

    const chatInput = document.getElementById("chatInput")
    const sendMessageBtn = document.getElementById("sendMessageBtn")

    const sendMessage = () => {
      const text = chatInput.value.trim()
      if (!text) return

      const newMessage = {
        id: messages.length + 1,
        id_uti_1: currentUser.id,
        id_uti_2: userId,
        texte: text,
        image: null,
        date: new Date(),
        sent: true,
      }

      messages.push(newMessage)
      openChat(userId)
      chatInput.value = ""
    }

    sendMessageBtn.onclick = sendMessage
    chatInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    }

    document.getElementById("chatAttachBtn").onclick = () => {
      customAlert("Pièce jointe", "Fonctionnalité de pièce jointe bientôt disponible !")
    }
  }

  function loadNotificationsSection() {
    const notifications = [
      {
        id: 1,
        type: "like",
        text: "Sophie Martin a aimé votre post",
        time: "Il y a 10 min",
        unread: true,
      },
      {
        id: 2,
        type: "comment",
        text: "Luc Bernard a commenté votre post",
        time: "Il y a 1h",
        unread: true,
      },
      {
        id: 3,
        type: "friend",
        text: "Marie Dubois a accepté votre demande d'amitié",
        time: "Il y a 2h",
        unread: true,
      },
      {
        id: 4,
        type: "message",
        text: "Nouveau message de Pierre Lefebvre",
        time: "Hier",
        unread: false,
      },
    ]

    const notificationsList = document.getElementById("notificationsList")
    notificationsList.innerHTML = notifications
      .map((notif) => {
        const iconSvg = getNotificationIcon(notif.type)
        return `
          <div class="notification-item ${notif.unread ? "unread" : ""}">
            <div class="notification-icon">${iconSvg}</div>
            <div class="notification-content">
              <div class="notification-text">${notif.text}</div>
              <div class="notification-time">${notif.time}</div>
            </div>
          </div>
        `
      })
      .join("")

    document.getElementById("markAllReadBtn").addEventListener("click", () => {
      document.querySelectorAll(".notification-item").forEach((item) => {
        item.classList.remove("unread")
      })
      customAlert("Succès", "Toutes les notifications ont été marquées comme lues")
    })
  }

  function getNotificationIcon(type) {
    const icons = {
      like: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
      comment: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
      friend: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
      message: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    }
    return icons[type] || icons.message
  }

  function loadDashboardSection() {
    // Admin-only: User Management
    if (currentUser.role === "admin") {
      document.getElementById("userManagementSection").style.display = "block"

      const users = [
        { id: 2, nom: "Martin", prenom: "Sophie", email: "sophie.martin@exemple.fr", role: "user" },
        { id: 3, nom: "Bernard", prenom: "Luc", email: "luc.bernard@exemple.fr", role: "mod" },
      ]

      const usersTableBody = document.getElementById("usersTableBody")
      usersTableBody.innerHTML = users
        .map((user) => {
          const userName = `${user.prenom || ""} ${user.nom}`.trim()
          return `
            <tr>
              <td>${userName}</td>
              <td>${user.email}</td>
              <td><span class="user-role-badge ${user.role}">${
                user.role === "admin" ? "Administrateur" : user.role === "mod" ? "Modérateur" : "Utilisateur"
              }</span></td>
              <td>
                <button class="btn-secondary btn-sm change-role-btn" data-user-id="${user.id}">Changer rôle</button>
              </td>
            </tr>
          `
        })
        .join("")

      document.querySelectorAll(".change-role-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const userId = e.currentTarget.dataset.userId
          document.getElementById("changeRoleUserId").value = userId
          openModal("changeRoleModal")
        })
      })

      document.getElementById("changeRoleForm").addEventListener("submit", (e) => {
        e.preventDefault()
        closeModal("changeRoleModal")
        customAlert("Succès", "Rôle modifié avec succès !")
        loadDashboardSection()
      })
    }

    // Mod: Reported Content
    if (currentUser.role === "mod") {
      document.getElementById("reportedContentSection").style.display = "block"

      const reportedContent = [
        { id: 1, type: "Post", content: "Contenu inapproprié...", reporter: "Jean Dupont" },
        { id: 2, type: "Commentaire", content: "Spam détecté...", reporter: "Marie Dubois" },
      ]

      const reportedContentList = document.getElementById("reportedContentList")
      reportedContentList.innerHTML = reportedContent
        .map((report) => {
          return `
            <div class="reported-item">
              <div class="reported-item-header">
                <span class="reported-item-type">${report.type}</span>
              </div>
              <div class="reported-item-content">${report.content}</div>
              <div class="reported-item-actions">
                <button class="btn-secondary btn-sm">Ignorer</button>
                <button class="btn-primary btn-sm">Supprimer</button>
              </div>
            </div>
          `
        })
        .join("")
    }
  }

  function formatDate(date) {
    const now = new Date()
    const diff = now - date
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `Il y a ${days} jour${days > 1 ? "s" : ""}`
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`
    return "À l'instant"
  }
})
