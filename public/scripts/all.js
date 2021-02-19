window.onload = function () {
  const bookmarks = document.getElementsByClassName("bookmark");
  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");
  const comment = document.getElementById("comment");
  const commentHolder = document.getElementById("comment-holder");

  [...bookmarks].forEach((bookmark) => {
    bookmark.style.cursor = "pointer";
    bookmark.addEventListener("click", function (e) {
      let target = e.target.parentElement;

      let headers = new Headers();
      headers.append("Accept", "Application/JSON");

      let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
        method: "GET",
        headers,
        mode: "cors",
      });

      fetch(req)
        .then((res) => res.json())
        .then((data) => {
          if (data.bookmark) {
            target.innerHTML = '<i class="fas fa-bookmark"></i>';
          } else {
            target.innerHTML = '<i class="far fa-bookmark"></i>';
          }
        })
        .catch((e) => {
          console.error(e.response.data);
          alert(e.response.data.error);
        });
    });
  });

  likeBtn.addEventListener("click", function (e) {
    let postId = likeBtn.dataset.post;
    reqLikeDislike("likes", postId)
      .then((res) => res.json())
      .then((data) => {
        let likeIcon = data.liked
          ? '<i class="fas fa-thumbs-up"></i>'
          : '<i class="far fa-thumbs-up"></i>';
        likeIcon = likeIcon + ` (${data.totalLikes})`;
        let dislikeIcon =
          '<i class="far fa-thumbs-down"></i>' + ` (${data.totalDislikes})`;

        likeBtn.innerHTML = likeIcon;
        dislikeBtn.innerHTML = dislikeIcon;
      })
      .catch((e) => {
        console.error(e.response.data);
        alert(e.response.data.error);
      });
  });

  dislikeBtn.addEventListener("click", function (e) {
    let postId = dislikeBtn.dataset.post;
    reqLikeDislike("dislikes", postId)
      .then((res) => res.json())
      .then((data) => {
        let dislikeIcon = data.disliked
          ? '<i class="fas fa-thumbs-down"></i>'
          : '<i class="far fa-thumbs-down"></i>';
        dislikeIcon = dislikeIcon + ` (${data.totalDislikes})`;
        let likeIcon =
          '<i class="far fa-thumbs-up"></i>' + ` (${data.totalLikes})`;

        likeBtn.innerHTML = likeIcon;
        dislikeBtn.innerHTML = dislikeIcon;
      })
      .catch((e) => {
        console.error(e.response.data);
        alert(e.response.data.error);
      });
  });

  comment.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      if (e.target.value) {
        let postId = comment.dataset.post;
        let data = {
          body: e.target.value,
        };
        let req = generateRequest(`/api/comments/${postId}`, "POST", data);
        fetch(req)
          .then((res) => res.json())
          .then((data) => {
            let commentElement = createComment(data);
            commentHolder.insertBefore(
              commentElement,
              commentHolder.children[0]
            );
            e.target.value = "";
          })
          .catch((e) => {
            console.log(e.message);
            alert(e.message);
          });
      } else {
        alert("Please enter a valid comment");
      }
    }
  });

  commentHolder.addEventListener("keypress", function (e) {
    if (commentHolder.hasChildNodes(e.target)) {
      if (e.key === "Enter") {
        let commentId = e.target.dataset.comment;
        let value = e.target.value;

        if (value) {
          let data = {
            body: value,
          };

          let req = generateRequest(
            `/api/comments/replies/${commentId}`,
            "POST",
            data
          );
          fetch(req)
            .then((res) => res.json())
            .then((data) => {
              let replyElement = createReply(data);
              let parent = e.target.parentElement;
              parent.previousElementSibling.appendChild(replyElement);
              e.target.value = "";
            })
            .catch((e) => {
              console.log(e.message);
              alert(e.message);
            });
        } else {
          alert("Please enter a valid reply");
        }
      }
    }
  });
};

function createComment(comment) {
  let innerHTML = `
    <img
        src="${comment.user.profilePics}" 
        class="rounded-circle mx-3 mt-2" style="width:40px;">
    <div class="media-body">
        <p class="mx-3 mt-2">${comment.body}</p>

        <div class="mx-3 my-2">
            <input class="form-control" type="text" placeholder="Press Enter to Reply" name="reply" data-comment=${comment._id} />
        </div>
    </div>
      `;

  let div = document.createElement("div");
  div.className = "media border";
  div.innerHTML = innerHTML;

  return div;
}

function createReply(reply) {
  let innerHTML = `
        <img style="width:30px;"
            src="${reply.profilePics}" 
            class="align-self-start mx-5 rounded-circle">
        <div class="media-body mx-5">
            <p>${reply.body}</p>
        </div>
  `;

  let div = document.createElement("div");
  div.className = "media mt-3";
  div.innerHTML = innerHTML;

  return div;
}

function generateRequest(url, method, body) {
  let headers = new Headers();
  headers.append("Accept", "Application/JSON");
  headers.append("Content-Type", "Application/JSON");

  let req = new Request(url, {
    method,
    headers,
    body: JSON.stringify(body),
    mode: "cors",
  });

  return req;
}

function reqLikeDislike(type, postId) {
  let headers = new Headers();
  headers.append("Accept", "Application/JSON");
  headers.append("Content-Type", "Application/JSON");

  let req = new Request(`/api/${type}/${postId}`, {
    method: "GET",
    headers,
    mode: "cors",
  });

  return fetch(req);
}
