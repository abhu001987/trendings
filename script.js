const params = new URLSearchParams(window.location.search)
const category = params.get("cat")

let allPosts = []
let visiblePosts = 0
const loadCount = 10

function goBack(){
window.location.href="https://myaffiliatepage.com/termandconditions"
}

/* fetch JSON without caching */

fetch("posts.json?v=" + new Date().getTime())
.then(res => res.json())
.then(data => {

if(category){
allPosts = data.filter(post => post.category === category)
}else{
allPosts = data
}

loadMore()

})

function loadMore(){

const container = document.getElementById("posts")

let nextPosts = allPosts.slice(visiblePosts, visiblePosts + loadCount)

nextPosts.forEach(post => {

const card = document.createElement("div")
card.className = "post"

card.innerHTML = `

<div class="image-frame">

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

`

container.appendChild(card)

})

visiblePosts += loadCount

}

/* detect scroll to bottom */

document.getElementById("posts").addEventListener("scroll",function(){

const container = this

if(container.scrollTop + container.clientHeight >= container.scrollHeight - 5){

loadMore()

}

})
