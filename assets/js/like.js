
  let currentReaction = null;
  let hoverTimer;
  let number_of_touches = 0

  function showReactions() {
    document.getElementById("reactionPopup").style.display = "flex";
  }

  function hideReactions() {
    document.getElementById("reactionPopup").style.display = "none";
    }

  function startHoverTimer() {
    hoverTimer = setTimeout(showReactions, 500); // Affiche après 0.5 sec
  }

  function cancelHoverTimer() {
    clearTimeout(hoverTimer);
  }

  function setReaction(emoji, label) {
    currentReaction = emoji;
    document.querySelector(".like-button").innerHTML = emoji + ' ' + label;
    hideReactions();
  }

  function toggleLike() {
    number_of_touches++

    let detect_click = setTimeout(() => {

      if (currentReaction === "👍") {
      number_of_touches = 0;
      currentReaction = null;
      document.querySelector(".like-button").innerHTML = '<i class="fa fa-thumbs-up"></i> J’aime';
      document.getElementById("reactionDisplay").innerText = "";
      
      } else if( number_of_touches == 1 )
        {
            number_of_touches = 0;
            setReaction("👍", "J’aime");
            clearTimeout(detect_click);

     } else if(  number_of_touches == 2 ){ 
            startHoverTimer()
            clearTimeout(detect_click);
    }else{
      currentReaction = "👍"
    }

    }, 500);      
 }

  