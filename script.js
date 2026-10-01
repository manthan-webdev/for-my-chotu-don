'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;


// ==========================================================
// FRIEND'S NAME
// Change the name from <body data-name="...">
// ==========================================================

$$('.fname').forEach(e => {
    e.textContent = document.body.dataset.name || 'Bestie';
});


// ==========================================================
// SECTION NAVIGATION
// Smooth scrolling has been removed.
// All Next buttons now jump instantly.
// ==========================================================

$$('[data-scroll]').forEach(button => {

    button.onclick = () => {

        const target = $(button.dataset.scroll);

        if (target) {
            target.scrollIntoView({
                behavior: 'auto',
                block: 'start'
            });
        }

    };

});


// ==========================================================
// SCROLL REVEAL
// ==========================================================

const io = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('in');

                io.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);


$$('.reveal').forEach((element, index) => {

    element.style.transitionDelay =
        (index % 4) * 120 + 'ms';

    io.observe(element);

});


// ==========================================================
// FLOATING HEARTS / STARS
// ==========================================================

if (!calm) {

    const fx = $('#fx');

    for (let i = 0; i < 12; i++) {

        const heart = document.createElement('span');

        heart.className = 'fh';

        heart.textContent =
            i % 3 ? '♡' : '✦';

        heart.style.cssText = `
            left:${Math.random() * 100}%;
            font-size:${14 + Math.random() * 50}px;
            animation-duration:${22 + Math.random() * 20}s;
            animation-delay:${-Math.random() * 30}s;
        `;

        fx.appendChild(heart);
    }

}


// ==========================================================
// CURSOR GLOW
// Desktop only
// ==========================================================

if (
    matchMedia('(hover:hover) and (pointer:fine)').matches
) {

    const glow = $('#glow');

    addEventListener('mousemove', event => {

        glow.style.opacity = 1;

        glow.style.transform = `
            translate(${event.clientX}px, ${event.clientY}px)
        `;

    });

}


// ==========================================================
// MUSIC SYSTEM
// ==========================================================

const audio = $('#bgMusic');
const playBtn = $('#playBtn');
const playerBox = $('#player');

audio.volume = 0.6;


// Update music UI
const syncMusicUI = () => {

    const isPlaying = !audio.paused;

    playerBox.classList.toggle(
        'on',
        isPlaying
    );

    playBtn.textContent =
        isPlaying ? '❚❚' : '♪';

    playBtn.setAttribute(
        'aria-pressed',
        isPlaying
    );

    playBtn.setAttribute(
        'aria-label',
        isPlaying
            ? 'Pause music'
            : 'Play music'
    );

};


// Try playing music
const playMusic = () => {

    const promise = audio.play();

    if (promise) {

        promise
            .then(syncMusicUI)
            .catch(() => {

                // Browser blocked autoplay.
                // Music will start after user's first interaction.

                syncMusicUI();

            });

    } else {

        syncMusicUI();

    }

};


// Keep UI synchronized
audio.addEventListener(
    'play',
    syncMusicUI
);

audio.addEventListener(
    'pause',
    syncMusicUI
);


// Try autoplay
playMusic();


// ==========================================================
// AUTOPLAY FALLBACK
// Browser may block autoplay with sound.
// Start music after first interaction.
// ==========================================================

let userPaused = false;

const firstInteraction = () => {

    [
        'pointerdown',
        'keydown',
        'touchstart'
    ].forEach(eventName => {

        removeEventListener(
            eventName,
            firstInteraction
        );

    });

    if (!userPaused) {
        playMusic();
    }

};


[
    'pointerdown',
    'keydown',
    'touchstart'
].forEach(eventName => {

    addEventListener(
        eventName,
        firstInteraction,
        {
            passive: true
        }
    );

});


// ==========================================================
// MUSIC PLAY / PAUSE BUTTON
// ==========================================================

playBtn.onclick = event => {

    event.stopPropagation();

    if (audio.paused) {

        userPaused = false;

        playMusic();

    } else {

        userPaused = true;

        audio.pause();

    }

};


// ==========================================================
// VOLUME
// ==========================================================

$('#vol').oninput = event => {

    audio.volume = event.target.value;

};


// ==========================================================
// APOLOGY NOTE CARDS
// ==========================================================

const modal = $('#modal');

$$('.note').forEach(note => {

    note.onclick = () => {

        $('#mTitle').textContent =
            $('h3', note).textContent;

        $('#mText').textContent =
            $('.full', note)
                .textContent
                .trim();

        modal.hidden = false;

        $('.x', modal).focus();

    };

});


// ==========================================================
// PHOTO LIGHTBOX
// ==========================================================

const lightbox = $('#lb');

const images = $$('.ph img');

let currentImage = 0;


// Show selected image
const showImage = index => {

    currentImage =
        (index + images.length) %
        images.length;

    $('#lbImg').src =
        images[currentImage].src;

    $('#lbImg').alt =
        images[currentImage].alt;

};


// Open lightbox
images.forEach((image, index) => {

    image.parentElement.onclick = () => {

        showImage(index);

        lightbox.hidden = false;

    };

});


// Previous image
$('.prev', lightbox).onclick = event => {

    event.stopPropagation();

    showImage(currentImage - 1);

};


// Next image
$('.next', lightbox).onclick = event => {

    event.stopPropagation();

    showImage(currentImage + 1);

};


// ==========================================================
// CLOSE MODALS
// ==========================================================

[modal, lightbox].forEach(modalElement => {

    modalElement.addEventListener(
        'click',
        event => {

            if (
                event.target === modalElement ||
                event.target.hasAttribute('data-close')
            ) {

                modalElement.hidden = true;

            }

        }
    );

});


// ==========================================================
// KEYBOARD CONTROLS
// ==========================================================

addEventListener(
    'keydown',
    event => {

        // Escape = close modal
        if (event.key === 'Escape') {

            modal.hidden = true;

            lightbox.hidden = true;

        }


        // Left arrow = previous photo
        if (
            !lightbox.hidden &&
            event.key === 'ArrowLeft'
        ) {

            showImage(currentImage - 1);

        }


        // Right arrow = next photo
        if (
            !lightbox.hidden &&
            event.key === 'ArrowRight'
        ) {

            showImage(currentImage + 1);

        }

    }
);


// ==========================================================
// CONFETTI + HEARTS
// ==========================================================

function burst() {

    if (calm) return;

    const colors = [
        '#F3B6C3',
        '#FF9EAF',
        '#D9B99B',
        '#FFF3EC'
    ];


    for (let i = 0; i < 60; i++) {

        const particle =
            document.createElement('span');

        particle.className = 'bit';

        const heart =
            i % 3 === 0;

        particle.textContent =
            heart ? '♥' : '';

        particle.style.cssText = `
            left:${Math.random() * 100}%;
            color:${colors[i % 4]};
            font-size:${12 + Math.random() * 12}px;
            ${heart
                ? ''
                : `
                        width:8px;
                        height:12px;
                        background:${colors[i % 4]};
                    `
            }
            animation-duration:${2.5 + Math.random() * 2.5}s;
            animation-delay:${Math.random() * 0.8}s;
        `;

        document.body.appendChild(particle);

        setTimeout(() => {

            particle.remove();

        }, 6500);

    }

}


// ==========================================================
// FRIENDSHIP COURT
// Edit replies here if needed.
// ==========================================================

const replies = {
    forgive: 'CHOTU DON HAS FINALLY FORGIVEN ME..!! 😭❤️',
    notyet: 'Okay okay... appeal number 2 filed. 🥺',
    life: 'Lifetime punishment?! Chotu Don, thoda reham karo 😭💀'
};


$$('[data-v]').forEach(button => {

    button.onclick = () => {

        $('#verdict').textContent =
            replies[button.dataset.v];


        if (
            button.dataset.v === 'forgive'
        ) {

            burst();

        }

    };

});


// ==========================================================
// ENVELOPE
// ==========================================================

const envelope = $('#env');

envelope.onclick = () => {

    // Prevent opening twice
    if (
        envelope.classList.contains('open')
    ) {

        return;

    }


    envelope.classList.add('open');

    $('#final').classList.add('open');

    $('#finalMsg').classList.add('show');


    // IMPORTANT:
    // No automatic scrolling here.
    // User can continue manually.
};


// ==========================================================
// FINAL "I FORGIVE YOU" BUTTON
// ==========================================================

$('#okBtn').onclick = () => {
    burst();
    $('#thanks').textContent = 'Bas... ab chotu don maan bhi ja, gussa chd de... 🥺♡';
};