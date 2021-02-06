function makeLogoCard(competition_name) {
    const logo_card = document.createElement("div");
    logo_card.classList.add("logo");
    logo_card.style.backgroundImage = 'url(./images/competition_logo/' + competition_name + '.png)';

    const title = document.createElement("div");
    title.classList.add("title");
    const text = document.createTextNode(competition_name);
    title.appendChild(text);
    logo_card.appendChild(title);

    return logo_card;
}

function makeTitle(competition_name) {
    const title = document.createElement("div");
    title.classList.add("title");
    const text = document.createTextNode(competition_name);
    title.appendChild(text);
    return title;
}

const main_card = document.querySelector(".main-card");

const competition_names = ['epl', 'laliga', 'lg1', 'bund', 'seria', 'ucl'];
const competition = document.querySelector(".competition");
const competition_title = document.querySelector(".competition-title");

for (cname of competition_names) {
    // console.log(cname);
    competition.appendChild(makeLogoCard(cname));
}


console.log(main_card.scrollHeight)