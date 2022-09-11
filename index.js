

window.addEventListener("load", () => {
    // seting css
    // outerGlobalsVa
    //MainGlobal
    const colorArr  = ["red", "blue", "green"]
    init();
    intialCSSSet();
    intialAnimation();
    // setting css values intitally--calculated--to fill the container space
    gsap.registerPlugin(ScrollTrigger);
    //** Getting Elements **//
    // initStart
    function init(){
    setTime();
    //? containers
    const mobileContainer = document.querySelector(".mobileContainer")
    const header = document.querySelector(".header")
    const topWrapper = document.querySelector(".topWrapper")
    const listSectionFirst = document.querySelector(".listSectionFirst");

    const cardsContainerWrapper = document.querySelector(".cardsContainerWrapper");
    const cardsMainContainerScroll = document.querySelector(".cardsMainContainerScroll");
    const cards = document.querySelectorAll(".card");
    const ctbn = document.querySelectorAll(".ctbn");


    //* BUTTON
    const backButton = document.querySelector(".backButton");
    //** GLOBAL VARS **/
    const amountArr = [45670.00,364.00,6754.00,0000]
    const timelineArray = []
    let currentActiveClickableIndex = null;
    let stepSecond = false;
    let scrollDisabled = false;
    let scrollPos = 0;

    //* GLOBALTIMELINES *//
    // in order
    let timelinesArray = [];
    let triggerArray = [];
    /** **/
    // vars for scrollTrigger
    let leftmargin = "20px";
    let cardScrollerTotalWidth = null;
    let cardsAmtCtbnChangePos = null;
    _cardsScrollerWidth();


    // scrollTrigger for CARDS
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
                delay: 0.5,
                ease: "ease-in-out",
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
                    currentActiveClickableIndex = index
                    // scrolling to the position on Scroll
                    // subtracting the margin_left amount
                    // cardsMainContainerScroll.scrollTo({
                    //     left: cards[index].offsetLeft - 20,
                    //     behavior: 'smooth'})
                },
                onLeave: () => {
                    t.reverse();
                },
                onEnterBack: () => {
                    t.play();
                    _changeAmount(amountArr[index], 300);
                    currentActiveClickableIndex = index
                    // cardsMainContainerScroll.scrollTo({
                    //     left: cards[index].offsetLeft - 20,
                    //     behavior: 'smooth'})
                },
                onLeaveBack: () => {
                    t.reverse();
                }
            }
        })
    })


    // setting wheel to horizontal scroll--- check for device later on
    cardsMainContainerScroll.addEventListener("wheel", (evt) => {
        if(scrollDisabled) return
        evt.preventDefault();
        cardsMainContainerScroll.scrollLeft += (evt.deltaY);
    });

    //** EVENT LISTENERS **//
    cards.forEach((cardElem,index) => {
        if(index === cards.length - 1) return null; // for the last card--neglect
        cardElem.addEventListener("click", (e) => {
            _step2(index)
        })
    })
    cardsMainContainerScroll.addEventListener("scroll", (e) => {
       //console.log(cardsMainContainerScroll.scrollLeft)
       if(scrollDisabled){
        cardsMainContainerScroll.scrollTo(scrollPos, 0)
       }
    })

    //reverseButton
    backButton.addEventListener("click",() => {_reverseStep2(currentActiveClickableIndex)})
   
    //* HELPER FUNCTIONS *//
    function _cardsScrollerWidth(){
        const cards = document.querySelectorAll(".card")
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

    function _step2(index){
        // ? receoves index of the clicked card
        // checking the index
        if(index !== currentActiveClickableIndex) return null;
        // ? Positioning to the scrollLeft  --// just in case
        //TODO: maybe scroll to leftall the way
        cardsMainContainerScroll.scrollTo({left: cards[cards.length-1].offsetLeft - 20})
        //cardsMainContainerScroll.scrollTo({left: 0,behavior: 'smooth'})
        // overflow--scroll --- change scroll --paddidng --style
        //** Disabling the scroll **/
        scrollPos = cardsMainContainerScroll.scrollLeft;
        scrollDisabled = true;
        stepSecond = true;
        //return;
        //** Disabling the scroll **/
        cardsMainContainerScroll.style.pointerEvents = "none";
        //** Creating the copy on  the same place **/
        const newCard = document.createElement("DIV");
        const newCardBgFix = document.createElement("DIV")
        newCard.setAttribute("class", `newCard`) // setting data attribute laterON for card type
        newCardBgFix.setAttribute("class",'newCardBgFix')
        // todo: height and width of the card as well
        cardsContainerWrapper.appendChild(newCard);
        cardsContainerWrapper.appendChild(newCardBgFix)
        //** Creating the copy on  the same place **/


        //** REMOVING ALL THE CARDS WITH OPACITY */
        //--> t1
        let t1 = gsap.timeline({
            onReverseComplete: () => {
                timelineArray[0].kill();
                timelineArray.length = 0;
                _reverseRest()
            }
        });
        // pushing the timeline
        timelineArray.push(t1)
        t1.to(".card", {
            opacity: 0,
            duration: 0.3
        })
        .addLabel("startMainCard")
        .to(".ctbn", {
            opacity: 0,
            duration: 0.3
        }, "<")
        .to([".title_profile_con h2", ".profileImage", " .AmountDisplay h6", " .AmountDisplay h4"], {
            top: "-20px",
            duration: 0.3,
            opacity: 0
        }, "<0.2")
        .to(['.phaseSecondTop h4', ".phaseSecondTop p"], {
            top: "-20px",
            duration: 0
        })
        .to(['.phaseSecondTop h4', ".phaseSecondTop p"], {
            top: "0px",
            opacity: 1,
            duration: 0.6
        })
        .to(newCard, {
            //scale: 0.4,
            xPercent:-50, 
            left:"50%", 
            yPercent:-50, 
            top:"50%", 
            x:0, 
            y:0,
            duration: 0.2,
            scale: 0.5,
            rotate: 90,
            transformOrigin: "center center"
        }, "startMainCard")
        .to(newCard, {
            // height BecomesWIdth and width becomes height
            height:  260,// become width
            width:  150,// actually height
            scale: 1,
            duration: 0.3,
            delay: 0
        }, ">")
        // decreaing size to fit
        .to(".cardsContainerWrapper", {
            height: 200, // laterOn based on mediaQueries
            duration: 0.2,
            onComplete: () => {
               enableScroll()
            }
        }, "<")
        //** enabling the scroll option and attaching the scroller*/
        function enableScroll(){
            mobileContainer.style.overflowY = "scroll";
            // animation for topWrapper and cardsContainerWrapper
            
            const topPos = window.getComputedStyle(header).height;
            triggerArray = ["id1", "id2"];
            gsap.to(".phaseSecondTop", {
                scrollTrigger: {
                    id: triggerArray[0],
                    scroller: mobileContainer,
                    trigger: ".topWrapper",
                    start: `top ${topPos}`,
                    scrub: 1,
                    pin: true,
                    pinSpacing: false 
                },
                opacity: 0,
                duration: 1
            })
            // creating the scollTrigger
            gsap.to(newCard, {
                scrollTrigger: {
                    id: triggerArray[1],
                    scroller: mobileContainer,
                    trigger: ".cardsContainerWrapper",
                    start: `top ${topPos}`,
                    scrub: 1,
                    pin: true,
                    pinSpacing: false,
                },
                scale: 0.4,
                duration: 1
            })
      

        
        }
        
    }

    // insteadOfReverse
    function _reverseStep2(index){
        if(!scrollDisabled || !stepSecond) return null;

        // step second is on---> scroll to top
        mobileContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        // removing scroll Behaviour--and scrollTriggers
        mobileContainer.style.overflowY = "hidden";
        // removing the triggers
        triggerArray.forEach((triggerID, index) => {
            ScrollTrigger.getById(triggerID).kill();
        })
        triggerArray.length = 0;

        // reverting the timeline animation
        timelineArray[0].reverse();
        /** EnablingBefore */
        scrollDisabled = false;
        stepSecond = false;
        // setting now for smooth later on
        cardsMainContainerScroll.scrollTo({left: cards[cards.length-1].offsetLeft - 20})
    }

    function _reverseRest(){
        //afterReverseComplete
        // onComplete killed from onReverseComplete

        //todo: remove card
        cards.forEach(card => {
            card.style.opacity = 1;
        })
        const newCard = document.querySelector(".newCard");
        const newCardBgFix = document.querySelector(".newCardBgFix");
        newCard.remove();
        newCardBgFix.remove();
       
        //**allowing scroll**/
        cardsMainContainerScroll.style.pointerEvents = "auto";
        //**setValuesBack--variables
        //**scrollingBack */
        cardsMainContainerScroll.scrollTo({
                left: cards[0].offsetLeft - 20,
                behavior: 'smooth'})
    }

    function setTime(){
        const time = document.querySelector(".time");
        const date = new Date();
        const hours = date.getHours() % 12 || 12;
        let ampm = date.getHours() > 12 ? "PM" : "AM";
        let minute = date.getMinutes();
        if(minute < 10){
            let temp = minute;
            minute = "0" + minute
        }
        time.innerText = hours + ":" + minute + " " + ampm;
        setTimeout(setTime, 1000 * 60)
    }
    }
    // initclose
    // setting responsiveness
    function intialCSSSet(){
        const container_height = parseInt(window.getComputedStyle(document.querySelector(".mobileContainer")).height)
        const header_height  = parseInt(window.getComputedStyle(document.querySelector(".header")).height);
        const topWrapper_height = parseInt(window.getComputedStyle(document.querySelector(".topWrapper")).height);
        const CButtonsCon_height = parseInt(window.getComputedStyle(document.querySelector(".CButtonsCon")).height);
        // top of bot UL
        const  ulFix = parseInt(window.getComputedStyle(document.querySelector(".ulFix")).height)
        // height to set
        const cardsContainerWrapper = document.querySelector(".cardsContainerWrapper");
        // getting set Margin-top
        let marginTop = window.getComputedStyle(cardsContainerWrapper).marginTop;
        
        const calculatedHeight = container_height - (header_height + topWrapper_height +CButtonsCon_height+ parseInt(marginTop))
        cardsContainerWrapper.style.height = `${calculatedHeight + 8}px`;// for the bottom ul fix
         // setting the height of cardsMainContainerScroll to that of parent
         //cardsMainContainerScroll.style.height = `${calculatedHeight+ 5}px`;
         const cards = document.querySelectorAll(".card")
         const container = document.querySelector(".cardsMainContainerScroll");
         container.scrollTo(cards[cards.length -1].offsetLeft, 0)
         cards.forEach(card => {
            //card.style.opacity = 0
         })
    }

    /** FUNCTION INITIAL LOAD ANIMATION */
    function intialAnimation(){
        /**Entering the loaderChild */
        gsap.to(".mobileContainer", {
            opacity: 1,
            duration: 0
        })
        let t1;
        let ms = gsap.timeline({});
        ms.pause();

        let ratio = window.innerWidth/window.innerHeight;
        let maxWidth = ratio < 1 ? window.innerHeight* 1.4 : window.innerWidth * 1.4;
        colorArr.forEach((color, index) => {
            const elem = document.createElement("DIV");
            elem.setAttribute("class", "loader");
            elem.style.backgroundColor = color;
            console.log(color)
            document.body.appendChild(elem);
            const t1 = gsap.timeline();
            t1.to(elem, {
                height: maxWidth,
                width: maxWidth,
                duration: 1 - (index * 0.1),
                ease: "circ.inOut",
                //ease: "slow(0.9, 0.7, false)",
                delay: 0
            })

            ms.add(t1, "<0.2")

            if(index === colorArr.length -1){
                ms.from(".mobileContainer", {
                    scale: 0,
                    duration: 1
                }, "<")
            }
        })

        
        // setting scroll to left
        t1 = gsap.timeline({})
        //t1.pause();
        const ease = "linear";
        t1.from([".time", '.network', '.wifi', '.battery'], {
            top: "-50%",
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        })
        .from(".backButton", {
            opacity: 0,
            left: 15,
            duration: 0.8
        }, ">-0.6")
        .from([".title_profile_con h2", ".profileImage"], {
            opacity: 0,
            top: -10,
            duration: 0.8,
            onComplete: () => {setTimeout(scrollDIV, 150); console.log("here")}
        }, "<0.3")
        .from([".AmountDisplay h6"], {
            opacity: 0,
            top: -15,
            duration: 0.8,
        }, "<0.4")
        .from(".AmountDisplay h4", {
            opacity: 0,
            top: -10,
            duration: 0.8
        }, "<0.4")
        .from('.ctbn', {
            opacity: 0,
            duration: 0.3
        }, "<0.1")

        // adding to main timeline
        ms.add(t1, "<0.5")
        ms.play();
        
        function scrollDIV(){
            const cards = document.querySelectorAll(".card")
            const container = document.querySelector(".cardsMainContainerScroll");
            container.scrollTo({left: cards[0].offsetLeft - 20, behavior: "smooth"})
        }
    }
})