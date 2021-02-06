function makeLogoCard(competition_name) {
    const logo_card = document.createElement("div");
    logo_card.classList.add("logo");
    logo_card.setAttribute("id", competition_name);
    logo_card.style.backgroundImage = 'url(./images/competition_logo/' + competition_name + '.png)';
    logo_card.style.opacity = 0.5;
    logo_card.style.transition = "all ease 1.5s";

    const title = document.createElement("div");
    title.classList.add("title");
    const text = document.createTextNode(competition_name.toUpperCase());
    title.appendChild(text);
    logo_card.appendChild(title);

    return logo_card;
}

const competition_names = ['epl', 'laliga', 'league1', 'bundesliga', 'seria', 'ucl'];
const competition = document.querySelector(".competition");

for (const cname of competition_names) {
    // console.log(cname);
    competition.appendChild(makeLogoCard(cname));
}

function changeOpacityExcept(competition_name, opacityVal) {
    for (const cname of competition_names) {
        if (cname !== competition_name) {
            document.querySelector(`#${cname}`).style.opacity = opacityVal;
        }
    }
}
const titleCards = document.querySelectorAll(".title");
for (const titleCard of titleCards) {
    titleCard.addEventListener('mouseenter', () => {
        // console.log(titleCard.style);
        titleCard.style.transform = "scale(1.06)";
        titleCard.style.boxShadow = "0px 1px 2px 2px rgba(0, 0, 0, .2)";
        titleCard.style.transition = "all ease 0.6s";

        const logoCard = document.querySelector(`#${titleCard.textContent}`);
        logoCard.style.transform = "translateX(1em)";
        logoCard.style.opacity = 1;
        changeOpacityExcept(titleCard.textContent.toLowerCase(), 0.1);
        logoCard.style.transition = "all ease 0.6s";
    })

    titleCard.addEventListener('mouseleave', () => {
        // console.log(titleCard.style);
        titleCard.style.transform = "scale(1)";
        titleCard.style.boxShadow = "";
        titleCard.style.transition = "all ease 2s";


        const logoCard = document.querySelector(`#${titleCard.textContent}`);
        logoCard.style.transform = "scale(1)";
        logoCard.style.opacity = 0.5;
        changeOpacityExcept(titleCard.textContent.toLowerCase(), 0.5);
        logoCard.style.transition = "all ease 1.5s";
    })
}