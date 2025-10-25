
const followerInFollowBtn = document.querySelector('#follower_in_follow');
const followingInFollowBtn = document.querySelector('#following_in_follow');
const followersContainer = document.querySelector('.followers');
const followingContainer = document.querySelector('.following');
const postInput = document.querySelector('.post_input');
const postContainer = document.querySelector('.all_posts');
const postBtn = document.querySelector('.post_btn');
const profileUserProfile = document.querySelector('.user_profile');
const followPage = document.querySelector('.head')
let change = false
let userInfo;


//change img sources
const changeState = (img, currentsrc, newsrc) => {
  if (img.src == `http://127.0.0.1:5500/html/${currentsrc}`){
    img.src = newsrc
    change = true
  } else {
    img.src = currentsrc
    change = false
  }
  
}

//hide display
const hideDisplay = (e) => {
  if (e.classList.contains('hide')) {
    e.classList.toggle('hide')
  } else {
    e.classList.toggle('hide')
  }
}

const postsControl = () => {
  const likeBtn = document.querySelectorAll('.like')
  const commentBtn = document.querySelectorAll('.commentBtn')
  const followBtn = document.querySelectorAll('.followBtn')

  
  //like button display
likeBtn.forEach(btn => {
  
  let img = btn.children[0]
  btn.addEventListener('click', () => {
    changeState(img, 'assets/heart-svgrepo-com.svg', 'assets/heart-svgrepo-com (2).svg')
    console.log('post control')
    likePost(btn)
  })
})
//comment button display
commentBtn.forEach(btn => {
  let container = btn.parentElement.parentElement.querySelector('.comments')
  btn.addEventListener('click', () => {
      hideDisplay(container)
      console.log('beep')
      getComments(btn)
    })
})
//follow button display
followBtn.forEach(btn => {
  let img = btn.children[0]
  btn.addEventListener('click', () => {
        changeState(img, 'assets/user-round-plus.svg', 'assets/user-round-check.svg')
        followUser(btn)
      })

})
}


//following display
if(followerInFollowBtn) {
followerInFollowBtn.addEventListener('click', () => {
  followerInFollowBtn.classList.add('activeBtn')
  followingInFollowBtn.classList.remove('activeBtn')
  followersContainer.classList.remove('hide')
  followingContainer.classList.add('hide')
  
})
followingInFollowBtn.addEventListener('click', () => {
  followingInFollowBtn.classList.add('activeBtn')
  followerInFollowBtn.classList.remove('activeBtn')
  followingContainer.classList.remove('hide')
  followersContainer.classList.add('hide')
})
}

//get user info from db
const getUserProfile = () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    window.location.href = 'index.html'
  }
  fetch(`http://localhost:3000/profile/${userId}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    userInfo = data
    getUserImg(data)
    if(postContainer){
        getPosts()
    }
    if(profileUserProfile) {
    renderUserProfile()
    }
  }
  )
    
}

//check if response is true
const checkTruth = (e, truesrc, falsesrc) => {
  if (e) {
    return truesrc
  } else {
    return falsesrc
  }
}

//get user img for home page
const getUserImg = (e) => {
if(postInput || followPage) {
  const userImg = document.querySelector('#user_img_home')
  userImg.src = e.avatar
}}

//call add post function
const callAddPost = () => {
  postBtn.addEventListener('click', () => {
    add()
  })
}


// current time format
const timeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date) / 1000);

    if(diff < 60) return "Just now";
    if(diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if(diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if(diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString();
}

//add new post
const addPost = () => {
  let content = document.querySelector('.post_input')
  const user_id = localStorage.getItem('userId')
  console.log(user_id)
  if(content.value.length > 0) {
  fetch('http://localhost:3000/newpost', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id: user_id,
            content: content.value
        })
    })
    .then(response => response.json())
    .then(data => { 
      console.log(data)
      appendNewPost(data)
    })
    .catch(err => console.error(err))
    content.value = ''
  }
  
}

//append new post 
const appendNewPost = (post) => {
  const container = document.querySelector('.all_posts')

  const postDiv = document.createElement('div')
  postDiv.classList.add('post_container')
  postDiv.setAttribute('data-post-id', post.post_id)
      postDiv.innerHTML =  `
          
          <div class="img_and_name_container">
            <img class="user_img" src="${post.image}" alt="user img">
            <p>${post.name}</p>
            <button id="follow" class="followBtn change hide"><img class="followImg" src="${checkTruth(post.followed, 'assets/user-round-check.svg', 'assets/user-round-plus.svg')}" alt="follow"></button>
          </div>

          <div class="post_text_and_img">
            <p class="content">${post.content}</p>
            <p class="date">${timeAgo(post.created_at)}</p>
          </div>

          <div class="like_and_follow">
            <button class="like" class="change">
              <img id="likeImg" class="true" src="${checkTruth(post.liked, 'assets/heart-svgrepo-com (2).svg','assets/heart-svgrepo-com.svg')}" alt="like">
              <span id="like_count">${post.likes_count}</span>
            </button>
            <button class="commentBtn">
            <img src="assets/comment-svgrepo-com.svg" alt="comment">
            <span id="comment_count">${post.comment_count}</span>
            </button>
            
          </div>
          <div class="comments hide">
            <div class="add_comment">
              <input type="text" placeholder="Add a comment...">
              <button  class="add_comment_btn">Comment</button>
            </div>
            <div class="comment_container">
            </div>
          </div>
          
        `
        container.prepend(postDiv)
        
        //like function for new post
        const likeBtn = document.querySelector('.like')
        let Likeimg = likeBtn.children[0]
        likeBtn.addEventListener('click', () => {
          changeState(Likeimg, 'assets/heart-svgrepo-com.svg', 'assets/heart-svgrepo-com (2).svg')
          likePost(likeBtn)
        })

        //follow function for new post
        const followBtn = document.querySelector('.followBtn')
        let followImg = followBtn.children[0]
        followBtn.addEventListener('click', () => {
        changeState(followImg, 'assets/user-round-plus.svg', 'assets/user-round-check.svg')
        })


       //follow function for new post
        const commentBtn = document.querySelector('.commentBtn')
        let followContainer = commentBtn.parentElement.parentElement.querySelector('.comments')
        commentBtn.addEventListener('click', () => {
        hideDisplay(followContainer)
        console.log('beep')
        getComments(commentBtn)
        //addComment(commentBtn)
        })


        //add new comment
        const addCommentBtn = document.querySelector('.add_comment_btn')
        addCommentBtn.addEventListener('click', () => {
        console.log('new one')
        addComment(addCommentBtn)
        })
}


//get comment button 
const getCommentBtn = () => {
  const commentBtn = document.querySelectorAll('.add_comment_btn')
  commentBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('comment was rendered here')
      addComment(btn)
    })
      
  });
}
//add new comment
const addComment = (e) => {
  let content = e.previousElementSibling
  let commentCount = e.parentElement.parentElement.parentElement.querySelector('#comment_count')
  let post_id = e.parentElement.parentElement.parentElement.dataset.postId
    const user_id = localStorage.getItem('userId')
  console.log(commentCount)
  if(content.value.length > 0) {
  fetch('http://localhost:3000/comment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            post_id: post_id,
            user_id: user_id,
            content: content.value
        })
    })
    .then(response => response.json())
    .then(data => { 
      console.log(data)
      appendNewComment(data) 
    })
    .catch(err => console.error(err))
    content.value = ''
    commentCount.innerHTML = Number(commentCount.innerHTML) + 1
    }
  }

//append new comment
const appendNewComment = (comment) => {
  const post = document.querySelector(`.post_container[data-post-id="${comment.post_id}"]`)
  const commentsContainer = post.querySelector('.comment_container')
  const commentDiv = document.createElement('div')
  commentDiv.classList.add('comment')
  commentDiv.innerHTML = ` <div class="user_info_comment">
                              <img src="${comment.avatar}" alt="user_img">
                              <p>${comment.name}</p>
                            </div>
                            <div class="comment_content">
                              <p>${comment.content}</p>
                              <p class="date">${timeAgo(comment.created_at)}</p>
                            </div>
                          </div>`

      commentsContainer.prepend(commentDiv)
      console.log(commentsContainer)

}

//get comments
const getComments = (e) => {
  let id = e.parentElement.parentElement.dataset.postId
  fetch(`http://localhost:3000/getcomments/${id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data, 'helooooo')
    renderComments(data)
  }
  )
}

//render comment
const renderComments = (comments) => {
  const commentsContainer = document.querySelectorAll('.comment_container')
  commentsContainer.forEach(container => {
      if(comments == 'No comments found'){
        container.innerHTML = ''
      } else {
      container.innerHTML = comments.map(comment => {
        return `
              <div class="comment">
                  <div class="user_info_comment">
                    <img src="${comment.avatar}" alt="user_img">
                    <p>${comment.name}</p>
                  </div>
                  <div class="comment_content">
                    <p>${comment.content}</p>
                    <p class="date">${timeAgo(comment.created_at)}</p>
                  </div>
                </div>
        `
      }).join('')
    }
  });
  console.log('before getcommentbtn')
}


//like post 
function likePost(e) {
  let post_id = e.parentElement.parentElement.dataset.postId
  const user_id = localStorage.getItem('userId')
  const likeCount = e.parentElement.parentElement.querySelector('#like_count')
  console.log(post_id, user_id)
  console.log(likeCount)

  fetch('http://localhost:3000/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      post_id: post_id,
      user_id: user_id
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.message == 'liked') {
        console.log('it is liked')
        likeCount.innerHTML = Number(likeCount.innerHTML) + 1
      } else {
        console.log('it is unliked')
        likeCount.innerHTML = Number(likeCount.innerHTML) - 1
      }
    })
    .catch(err => console.error(err))

}


// remove follow for user
const removeUserFollow = () => {
  const userId = localStorage.getItem('userId')
  const userPost = document.querySelectorAll(`.post_container[data-poster-id="${userId}"]`)
  console.log(userPost)
  userPost.forEach(post => {
    const followBtn = post.querySelector('.followBtn')
    followBtn.classList.add('hide')
  })
}


//follow user 
const followUser = (e) => {
  let poster_id = e.parentElement.parentElement.dataset.posterId
  const user_id = localStorage.getItem('userId')
  const followBtn = document.querySelectorAll(`.post_container[data-poster-id="${poster_id}"]`)
  
  console.log(poster_id, user_id)

  fetch('http://localhost:3000/follow', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            follower_id: user_id,
            following_id: poster_id
        })
    })
    .then(response => response.json())
    .then(data => { 
      console.log(data)
      followBtn.forEach(btn => {
        let fbtn = btn.querySelector('.followBtn')
        let img = fbtn.children[0]
      if(data == 'followed successfully') {
        img.src = 'assets/user-round-check.svg'
      
      } else {
        img.src = 'assets/user-round-plus.svg'
      }
      });
    })
    .catch(err => console.error(err))

}


//render all posts
const renderPosts = (posts) => {
  if(postContainer) {
    postContainer.innerHTML = posts.map(post => {
      
        return `
          <div class="post_container" data-post-id="${post.post_id}" data-poster-id="${post.user_id}">
          
          <div class="img_and_name_container">
            <img class="user_img" src="${post.image}" alt="user img">
            <p>${post.name}</p>
            <button id="follow" class="followBtn change"><img class="followImg" src="${checkTruth(post.followed, 'assets/user-round-check.svg', 'assets/user-round-plus.svg')}" alt="follow"></button>
          </div>

          <div class="post_text_and_img">
            <p class="content">${post.content}</p>
            <p class="date">${timeAgo(post.created_at)}</p>
          </div>

          <div class="like_and_follow">
            <button class="like" class="change">
              <img id="likeImg" class="true" src="${checkTruth(post.liked, 'assets/heart-svgrepo-com (2).svg','assets/heart-svgrepo-com.svg')}" alt="like">
              <span id="like_count">${post.likes_count}</span>
            </button>
            <button class="commentBtn">
            <img src="assets/comment-svgrepo-com.svg" alt="comment">
            <span id="comment_count">${post.comment_count}</span>
            </button>
            
          </div>
          <div class="comments hide">
            <div class="add_comment">
              <input type="text" placeholder="Add a comment...">
              <button  class="add_comment_btn">Comment</button>
            </div>
            <div class="comment_container">
            </div>
          </div>
          </div>
        `
    }).join('')
    postsControl()
    getCommentBtn()
    postBtn.onclick = addPost
    removeUserFollow()
  }}

//get all posts from db
const getPosts = () => {
  const userIdd = localStorage.getItem('userId')
  console.log(userIdd)
  fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userIdd: userIdd
        })
    })
    .then(response => response.json())
    .then(data => { 
      console.log(data) 
      renderPosts(data)
    })
    .catch(err => console.error(err))
}




//for profile page

const renderUserProfile = () => {
  const userImg = document.querySelector('.profile_user_img')
  const userFollowing = document.querySelector('#following_count')
  const userFollowers = document.querySelector('#followers_count')
  const name = document.querySelector('#name')
  userImg.src = userInfo.avatar


  name.innerHTML = userInfo.name
  const id = localStorage.getItem('userId')
  console.log(id)
  fetch(`http://localhost:3000/followStats/${id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data) 
    userFollowing.innerHTML = data.following 
    userFollowers.innerHTML = data.followers  
  })
  
  fetch(`http://localhost:3000/userposts/${id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data) 
    renderUserPosts(data)
    postsControl()
    getCommentBtn()
  })


}

const renderUserPosts = (posts) => {
  const container = document.querySelector('.user_posts_container')

  container.innerHTML = posts.map(post => {
      
        return `
          <div class="post_container" data-post-id="${post.post_id}" data-poster-id="${post.user_id}">
          
          <div class="img_and_name_container">
            <img class="user_img" src="${post.image}" alt="user img">
            <p>${post.name}</p>
            <button id="delete" title="Delete post"><img class="followImg" src="assets/delete-svgrepo-com.svg" alt="delete"></button>
          </div>

          <div class="post_text_and_img">
            <p class="content">${post.content}</p>
            <p class="date">${timeAgo(post.created_at)}</p>
          </div>

          <div class="like_and_follow">
            <button class="like" class="change">
              <img id="likeImg" class="true" src="${checkTruth(post.liked, 'assets/heart-svgrepo-com (2).svg','assets/heart-svgrepo-com.svg')}" alt="like">
              <span id="like_count">${post.likes_count}</span>
            </button>
            <button class="commentBtn">
            <img src="assets/comment-svgrepo-com.svg" alt="comment">
            <span id="comment_count">${post.comment_count}</span>
            </button>
            
          </div>
          <div class="comments hide">
            <div class="add_comment">
              <input type="text" placeholder="Add a comment...">
              <button  class="add_comment_btn">Comment</button>
            </div>
            <div class="comment_container">
            </div>
          </div>
          </div>
        `
    }).join('')

    const deleteBtn = document.querySelectorAll('#delete')

    deleteBtn.forEach(btn => {
      btn.addEventListener('click', () => {
          console.log(deleteBtn)
          let post_id = btn.parentElement.parentElement.dataset.postId
          fetch('http://localhost:3000/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            post_id: post_id
          })
          })
          .then(response => response.json())
          .then(data => {console.log(data)
            btn.parentElement.parentElement.remove()
          })
      })
    })
    
  
}


//for follow page

const getFollowPeople = () => {
  const followingContainer = document.querySelector('.following')
  const followersContainer = document.querySelector('.followers')
  const toFollowContainer = document.querySelector('.to_follow')
  
  
  if(followPage) {
  const id = localStorage.getItem('userId')
  fetch(`http://localhost:3000/following/${id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data) 
    followingContainer.innerHTML = data.map(user => {
      return `
      <div class="user" data-poster-id="${user.id}">
          <img class="user_img" src="${user.avatar}" alt="user_img">
          <p>${user.name}</p>
          <button id="followw" class="followBtn change"><img class="followImg" src="${checkTruth(user.followed, 'assets/user-round-check.svg', 'assets/user-round-plus.svg')}" alt="follow"></button>
        </div>
      `
    })
  })

    fetch(`http://localhost:3000/notfollowing/${id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    toFollowContainer.innerHTML = data.map(user => {
      return `
      <div class="user" data-poster-id="${user.id}">
          <img class="user_img" src="${user.avatar}" alt="user_img">
          <p>${user.name}</p>
          <button id="followw" class="followBtn change"><img class="followImg" src="${checkTruth(user.following, 'assets/user-round-check.svg', 'assets/user-round-plus.svg')}" alt="follow"></button>
        </div>
      `
    })
  })
  .then(() => {
        fetch(`http://localhost:3000/followers/${id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    followersContainer.innerHTML = data.map(user => {
      return `
      <div class="user" data-poster-id="${user.id}">
          <img class="user_img" src="${user.avatar}" alt="user_img">
          <p>${user.name}</p>
          <button id="followw" class="followBtn change"><img class="followImg" src="${checkTruth(user.following, 'assets/user-round-check.svg', 'assets/user-round-plus.svg')}" alt="follow"></button>
        </div>
      `
    })
    
  })
  .then(() => {
    let followBtn = document.querySelectorAll('#followw')
    followBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log(btn.parentElement.dataset.posterId)
      let poster_id = btn.parentElement.dataset.posterId

      fetch('http://localhost:3000/follow', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            follower_id: id,
            following_id: poster_id
        })
    })
    .then(response => response.json())
    .then(data => { 
      console.log(data)
        let img = btn.children[0]
      if(data == 'followed successfully') {
        img.src = 'assets/user-round-check.svg'
      
      } else {
        img.src = 'assets/user-round-plus.svg'
      } 
      
    })
    .catch(err => console.error(err))
    })
  })
  })
  })



  
  
  


  
}

}

if(followPage) {
  getFollowPeople()
}

postsControl()
window.onload = getUserProfile

