// For smooth scrolling and other interactive elements
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Fetch posts from the server and render them
function fetchAndRenderPosts() {
    fetch('/posts') // Change this URL to match your server's endpoint
        .then((response) => response.json())
        .then((posts) => {
            console.log('Posts from server:', posts.data)
            renderPosts(posts.data);
        })
        .catch((error) => {
            console.error('Error fetching posts:', error);
        });
}

// Render posts in the designated section
function renderPosts(posts) {
    const postList = document.getElementById('post-list');

    posts.forEach((post) => {
        const postItem = document.createElement('div');
        postItem.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
    `;
        postList.appendChild(postItem);
    });
}

// Call the fetchAndRenderPosts function to load posts when the page loads
//window.addEventListener('load', fetchAndRenderPosts);
