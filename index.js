window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);
    //** Getting Elements **//
    const cardsMainContainerScroll = document.querySelector(".cardsMainContainerScroll");
    const cards = document.querySelectorAll(".card");
    const ctbn = document.querySelectorAll(".ctbn");

    /** GLOBAL VARS **/
    const amountArr = [45670.00,364.00,6754.00,0000]

    // vars for scrollTrigger
    let leftmargin = "20px";
    let cardScrollerTotalWidth = null;
    let cardsAmtCtbnChangePos = null;
    _cardsScrollerWidth();

    for(let i =0; i < 3; i++){

        let anim = gsap.timeline({})
        anim.to(cards[i], {
            rotate: -20,
            duration: 0.5,
            scale: 0.6,
            opacity: 0,
            transformOrigin: "bottom right"
        })

        ScrollTrigger.create({
            animation: anim,
            scroller: cardsMainContainerScroll,
            trigger: cards[i],
            horizontal: true,
            start: `left ${leftmargin}`,
            scrub: 1,
            snap:{
                snapTo: 1,
                duration: 0.4,
                delay: 0,
                ease: "ease-in-out"
            },
            invalidateOnRefresh: true,
            onEnter: () => {
                // later exp scrolling left
            },
        })
    }

    // ctbn markers and Amount
    ctbn.forEach((element, index) => {
        const t = gsap.timeline()
        t.pause();
        t.to(element, {
            backgroundColor: "#ddd",
            height: 6,
            width: 6,
            duration: 0.3,
            delay: 0,
            ease: "circ.inOut"
        })
        gsap.to(element, {
            scrollTrigger: {
                scroller: cardsMainContainerScroll,
                trigger: cards[index],
                horizontal: true,
                start: `left ${cardsAmtCtbnChangePos}`,
                //markers: true,
                invalidateOnRefresh: true,
                onEnter: () => {
                    t.play();
                    // changeAmount
                    _changeAmount(amountArr[index], 300)
                },
                onLeave: () => {
                    t.reverse();
                },
                onEnterBack: () => {
                    t.play();
                    _changeAmount(amountArr[index], 300)
                },
                onLeaveBack: () => {
                    t.reverse();
                }
            }
        })
    })


    // setting wheel to horizontal scroll--- check for device later on
    cardsMainContainerScroll.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        cardsMainContainerScroll.scrollLeft += (evt.deltaY);
    });

    /* HELPER FUNCTIONS */
    function _cardsScrollerWidth(){
        let margin = window.getComputedStyle(cards[0]).marginLeft;
        let width = window.getComputedStyle(cards[0]).width;
        let totalScrollWidth = (parseInt(margin) * cards.length) + (parseInt(width) * cards.length);


        cardScrollerTotalWidth = totalScrollWidth;
        cardsAmtCtbnChangePos = parseInt(margin) + parseInt(width)
    }

    function _changeAmount(end, duration){
        let container = document.querySelector(".AmountDisplay h4");
        let start = parseInt((container.innerText).split("$")[1]);
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          container.innerText = "$" + Math.floor(progress * (end - start) + start).toFixed(2);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
    }
})