
function comments(event) {
  event.preventDefault();
  window.scrollTo(0, 0);
  const verseText = event.target.textContent;
  const commentInput = document.getElementById("comment");
  commentInput.value = "<< " + verseText + " >>";

}



function salvaCommento(event) {
  event.preventDefault();
  const form = document.querySelector('#post');
  const formData = new FormData(form);

  fetch("salva_commento", {
    method: 'POST',
    body: formData
  }).then(response => {
    if (response.ok) {
      return response.json(); 
    } else {
      throw new Error("Errore nella richiesta: " + response.status);
    }
  }).then(data => {
    console.log(data);
    window.location.reload();
    }).catch(error => {
    console.error(error);
  });

  const commentInput = document.getElementById("comment");
  commentInput.value = "";
}





function caricaPosts() {
  fetch("/carica_post")
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nella richiesta: " + response.status);
      }
    })
    .then(data => {
      console.log("JSON restituito:", data);
      onJSON(data);
    })
    .catch(error => {
      console.error(error);
    });
}


caricaPosts();

function onJSON(json) {
  console.log(json);
  const library = document.querySelector("#posts");
  library.innerHTML = '';

  json.sort((a, b) => new Date(b.time) - new Date(a.time)); 

  for (let i = 0; i < json.length; i++) {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("comment-container");

    const commentInfo = document.createElement("div");
    commentInfo.classList.add("comment-info");

    const username = document.createElement("span");
    username.classList.add("username");
    username.textContent = "@" + json[i].username;
    commentInfo.appendChild(username);

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = formatTimestamp(json[i].time);
    commentInfo.appendChild(timestamp);

    commentContainer.appendChild(commentInfo);

    const commentBlock = document.createElement("div");
    const commentText = document.createElement("p");
    commentBlock.classList.add("comment-block");
    commentText.classList.add("comment-text")
    commentText.textContent = json[i].commentText;
    commentBlock.appendChild(commentText)
    commentContainer.appendChild(commentBlock);


    const likesContainer = document.createElement("div");
    likesContainer.classList.add("likes-container");

    const likeButton = document.createElement("button");
    likeButton.innerHTML = "&#10084;"; 
    likeButton.dataset.postId = json[i].id;
    likesContainer.appendChild(likeButton);

    const likesCount = document.createElement("span");
    likesCount.classList.add("likes-count");
    likesCount.textContent = json[i].nlikes;
    likesContainer.appendChild(likesCount);
    if(json[i].liked){
      likeButton.addEventListener("click", unlikePost);
      likeButton.classList.add('liked-button');
      likeButton.classList.remove('like-button');
  
    }else{
      likeButton.addEventListener("click", LikePost);
      likeButton.classList.remove('liked-button');
      likeButton.classList.add('like-button');
  
    }
    commentContainer.appendChild(likesContainer);


    library.appendChild(commentContainer);
  }
}



function LikePost(event) {
  const button = event.currentTarget;
  const formData = new FormData();
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  formData.append('_token', csrfToken);

  formData.append('postId', button.dataset.postId); 

  console.log(formData);
  fetch("/like_post", {method: "post", body: formData})
  .then(response => response.json())
  .then(json => {
      console.log(json); 
      updateLikes(json, button.parentNode);
  })
  .catch(error => console.error(error));

  button.classList.remove('like-button');
  button.classList.add('liked-button');

  button.removeEventListener('click', LikePost);
  button.addEventListener('click', unlikePost);
}


function unlikePost(event) {
    const button = event.currentTarget;
    const formData = new FormData();
  
    formData.append('postId', event.currentTarget.dataset.postId);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    formData.append('_token', csrfToken);
  
    fetch("/unlike_post", {method: "post", body: formData})
      .then(response => response.json())
      .then(json => updateLikes(json, button.parentNode))
      .catch(error => console.error(error));
  
    button.classList.remove('liked-button');
    button.classList.add('like-button');
  
    button.addEventListener('click', LikePost);
    button.removeEventListener('click', unlikePost);
}

function updateLikes(json, button) {
 
  if (!json || typeof json.ok === 'undefined') {
      console.log("Errore: proprietà 'ok' mancante nell'oggetto JSON");
      return;
  }
  const likesCount = button.getElementsByClassName('likes-count')[0];
  if (likesCount) {
      likesCount.textContent = json.nlikes;
      console.log("update " + json.nlikes);
  }

}




function formatTimestamp(timestamp) {
  const currentDate = new Date();
  const postDate = new Date(timestamp);

  const diffInMilliseconds = currentDate - postDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Pochi secondi fa';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minuti fa`;
  } else if (diffInMinutes < 1440) {
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} ore fa`;
  } else {
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return `${diffInDays} giorni fa`;
  }
}






const submitButton = document.querySelector('#post');
submitButton.addEventListener("submit", salvaCommento);


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchPeople');
    const userContainers = document.querySelectorAll('.user-container');

    searchInput.addEventListener('keyup', () => {
      const searchText = searchInput.value.trim().toLowerCase();
      userContainers.forEach(userContainer => {
        const username = userContainer.querySelector('span').innerText.toLowerCase();
          if (username.includes(searchText)) {
              userContainer.style.display = 'flex';
          } else {
              userContainer.style.display = 'none';
            }
        });
      });
});

