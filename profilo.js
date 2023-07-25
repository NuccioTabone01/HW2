function caricaPosts() {
    fetch("/personal_posts").then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nella richiesta: " + response.status);
      }
    })
    .then(onJSON)
    .catch(error => {
      console.error(error);
    });
}

caricaPosts();

  function onJSON(json) {
  const library = document.querySelector("#posts");
  library.innerHTML = '';

  json.sort((a, b) => new Date(b.time) - new Date(a.time)); //ordina i post per data

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



    const likesCount = document.createElement("span");
    likesCount.classList.add("likes-count");
    likesCount.textContent = json[i].nlikes + '  likes';
    likesContainer.appendChild(likesCount);

    commentContainer.appendChild(likesContainer);


    library.appendChild(commentContainer);
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