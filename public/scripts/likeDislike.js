window.onload = function () {
  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");

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
};

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
