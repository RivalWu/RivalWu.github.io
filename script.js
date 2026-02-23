document.addEventListener('DOMContentLoaded', function(){

// ---- splash & musik ----

var splash = document.getElementById('splash-screen')
var enterBtn = document.getElementById('enter-button')
var music = document.getElementById('background-music')
var volIcon = document.querySelector('#volume-control i')
    var volSlider = document.getElementById('volume-slider')

var lastVol = 0.2
    music.volume = volSlider.value

// preload biar ga delay
music.load()

    enterBtn.addEventListener('click', function(){
    // langsung play
        music.play().catch(function(){
      setTimeout(function(){ music.play() }, 100)
        })

    splash.classList.add('hidden')

        // reveal konten
    setTimeout(function(){
            doReveal()
        }, 400)
})


// ---- volume ----

volSlider.addEventListener('input', function(){
        music.volume = this.value
    music.muted = (this.value == 0)
})

    volIcon.addEventListener('click', function(){
  if(music.muted || music.volume === 0){
            music.muted = false
      music.volume = lastVol
        volSlider.value = lastVol
    } else {
      lastVol = music.volume
            music.muted = true
        volSlider.value = 0
  }
    })

music.addEventListener('volumechange', function(){
    volIcon.classList.remove('fa-volume-high','fa-volume-low','fa-volume-xmark')

        if(music.muted || music.volume === 0){
      volIcon.classList.add('fa-volume-xmark')
        } else if(music.volume < 0.5){
    volIcon.classList.add('fa-volume-low')
    } else {
            volIcon.classList.add('fa-volume-high')
        }
})


    // ---- typing effect ----

var texts = [
        "a person who pursues a money-making venture with uncertain methods",
    "am just another human being crossing your life",
        "aiming to making more than average"
]

    var typeSpeed = 70
var delSpeed = 35
var pauseAfter = 2500
    var pauseBefore = 500
var typingEl = document.getElementById("typing-text")

var tIdx = 0
    var cIdx = 0
var deleting = false

    function doType(){
  var txt = texts[tIdx]

        if(deleting){
    typingEl.textContent = txt.substring(0, cIdx - 1)
      cIdx--
  } else {
            typingEl.textContent = txt.substring(0, cIdx + 1)
        cIdx++
    }

  if(!deleting && cIdx === txt.length){
        deleting = true
            setTimeout(doType, pauseAfter)
    } else if(deleting && cIdx === 0){
      deleting = false
        tIdx = (tIdx + 1) % texts.length
    setTimeout(doType, pauseBefore)
        } else {
      setTimeout(doType, deleting ? delSpeed : typeSpeed)
  }
    }

doType()


// ---- reveal animasi ----

    function doReveal(){
  var els = document.querySelectorAll('[data-reveal]')
        els.forEach(function(el, i){
      setTimeout(function(){
                el.classList.add('revealed')
    }, i * 200)
        })
}


    // ---- tilt effect card ----

var cards = document.querySelectorAll('.link-card')

    cards.forEach(function(card){
  card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect()
            var x = e.clientX - r.left
        var y = e.clientY - r.top
      var cx = r.width / 2
            var cy = r.height / 2
    var rx = (y - cy) / cy * -3
        var ry = (x - cx) / cx * 3

            card.style.transform = 'perspective(600px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateX(5px)'
  })

        card.addEventListener('mouseleave', function(){
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateX(0)'
    })
})

})
