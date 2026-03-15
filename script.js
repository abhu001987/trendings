const params = new URLSearchParams(window.location.search)
const category = params.get("cat")

let allPosts = []
let visiblePosts = 0
const loadCount = 10

function goBack(){
window.location.href="/"
}

fetch("posts.json")
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

const container = document.getElementById("posts")

/* HERO IMAGE POST */

if(post.heroImage){

const hero = document.createElement("div")
hero.className = "hero-post"

hero.innerHTML = `

<img src="${window.innerWidth > 768 && post.heroImageDesktop ? post.heroImageDesktop : post.heroImage}" class="hero-img">

<div class="hero-overlay">
<a href="${post.ctaLink}" class="hero-btn">${post.ctaText}</a>
</div>

${post.music ? `<audio class="hero-music" src="${post.music}" loop></audio>` : ""}

`

container.appendChild(hero)

return
}

/* NORMAL POST (your original code) */

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

document.getElementById("posts").addEventListener("scroll",function(){

const container = this

if(container.scrollTop + container.clientHeight >= container.scrollHeight - 5){

loadMore()

}

})

const heroObserver = new IntersectionObserver(entries => {

entries.forEach(entry => {

const audio = entry.target.querySelector(".hero-music")

if(!audio) return

if(entry.isIntersecting){

audio.play().catch(()=>{})

}else{

audio.pause()
audio.currentTime = 0

}

})

},{threshold:0.6})

function observeHeroPosts(){

document.querySelectorAll(".hero-post").forEach(post=>{
heroObserver.observe(post)
})

}

/* observe after posts load */

setInterval(observeHeroPosts,1000)
