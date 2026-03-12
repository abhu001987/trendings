const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("cat");

fetch("posts.json")
.then(res => res.json())
.then(data => {

const container = document.getElementById("posts");
container.innerHTML = "";

// filter posts
let filteredPosts = data;

if(category){
filteredPosts = data.filter(post => post.category === category);
}

// render posts
filteredPosts.forEach(post => {

const card = document.createElement("div");
card.className = "post";

card.innerHTML = `
<div class="image-container">

<img src="${post.image}">

<div class="back-btn" onclick="goBack()">←</div>

</div>

<div class="post-meta">
<span class="category-badge">${post.category}</span>
<span class="post-date">${post.time}</span>
</div>

<div class="content">
<h2>${post.title}</h2>
<p>${post.content}</p>
</div>
`;

container.appendChild(card);

});

});

// BACK BUTTON FUNCTION
function goBack(){
window.location.href="http://bloggirl.online/APP";
}
