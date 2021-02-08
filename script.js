const competition_names = ['epl', 'laliga', 'ligue1', 'bundesliga', 'seria', 'ucl']
const apiCode = { epl: 'PL', laliga: 'PD', ligue1: 'FL1', bundesliga: 'BL1', seria: 'SA', ucl: 'CL' }
const apiUrl = "https://api.football-data.org/v2/"
const daysToView = 1
const scorePerPage = 5

function makeLogoCard(competition_name) {
    const logoCard = document.createElement("div")
    logoCard.classList.add("logo")
    logoCard.setAttribute("id", competition_name)
    logoCard.style.backgroundImage = 'url(./images/competition_logo/' + competition_name + '.png)'
    logoCard.style.opacity = 0.5
    logoCard.style.transition = "all ease 1.5s"

    const title = document.createElement("div")
    title.classList.add("title")
    const text = document.createTextNode(competition_name.toUpperCase())
    title.appendChild(text)
    logoCard.appendChild(title)

    return logoCard
}

function changeOpacityExcept(competition_name, opacityVal) {
    for (const cname of competition_names) {
        if (cname !== competition_name) {
            document.querySelector(`#${cname}`).style.opacity = opacityVal
        }
    }
}

function makeScoreCard(teamName, score, isHome) {
    const scoreCard = document.createElement("div")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    const teamLogo = document.createElement("div")

    scoreCard.classList.add("scorebar", "text")
    teamLogo.classList.add("team-logo")

    if (isHome == true) {
        p1.textContent = teamName
        p2.textContent = score
    } else {
        p1.textContent = score
        p2.textContent = teamName
    }

    teamLogo.style.backgroundImage = `url(./images/team_logo/${teamName}.png)`

    scoreCard.appendChild(p1)
    scoreCard.appendChild(teamLogo)
    scoreCard.appendChild(p2)

    return scoreCard
}

async function fetchScore(compID, dateFrom, dateTo) {
    const response = await fetch(apiUrl + `competitions/${compID}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&status=FINISHED`, {
        method: "GET",
        headers: { "X-Auth-Token": "7363f87364d44da89e034ab7bf772943" }
    })
    const score = await response.json()
    return score
}

async function fetchTeamName(teamID) {
    const response = await fetch(apiUrl + `/teams/${teamID}`, {
        method: "GET",
        headers: { "X-Auth-Token": "7363f87364d44da89e034ab7bf772943" }
    })
    const team = await response.json()
    return team
}

const competition = document.querySelector(".competition")
for (const cname of competition_names) {
    // console.log(cname) 
    competition.appendChild(makeLogoCard(cname))
}

const titleCards = document.querySelectorAll(".title")
for (const titleCard of titleCards) {
    titleCard.addEventListener('mouseenter', () => {
        // console.log(titleCard.style) 
        titleCard.style.transform = "scale(1.06)"
        titleCard.style.boxShadow = "0px 1px 2px 2px rgba(0, 0, 0, .2)"
        titleCard.style.transition = "all ease 0.6s"

        const logoCard = document.querySelector(`#${titleCard.textContent}`)
        logoCard.style.transform = "translateX(1em)"
        logoCard.style.opacity = 1
        changeOpacityExcept(titleCard.textContent.toLowerCase(), 0.1)
        logoCard.style.transition = "all ease 0.6s"
    })

    titleCard.addEventListener('mouseleave', () => {
        // console.log(titleCard.style) 
        titleCard.style.transform = "scale(1)"
        titleCard.style.boxShadow = ""
        titleCard.style.transition = "all ease 2s"


        const logoCard = document.querySelector(`#${titleCard.textContent}`)
        logoCard.style.transform = "scale(1)"
        logoCard.style.opacity = 0.5
        changeOpacityExcept(titleCard.textContent.toLowerCase(), 0.5)
        logoCard.style.transition = "all ease 1.5s"
    })
}

for (const titleCard of titleCards) {
    titleCard.addEventListener('click', () => {
        let compID = apiCode[titleCard.textContent.toLowerCase()]
        let dateFrom = new Date(new Date().getTime() - (daysToView * 86400000)).toISOString().slice(0, 10)
        let dateTo = new Date().toISOString().slice(0, 10)

        fetchScore(compID, dateFrom, dateTo).then(data => {
            const matches = data['matches']
            const count = data['count']
            console.log(count)
            const pageCount = Math.ceil(count / 5)
            let currentPage = 0
            let pages = []

            for (let i = 0; i < pageCount; i++) {
                let temp = []
                for (let j = 0; j < scorePerPage; j++) {
                    temp.push(matches[scorePerPage * i + j])
                }
                pages.push(temp)
            }

            const feed = document.querySelector(".feed")
            feed.innerHTML = ""
            for (const match of pages[currentPage]) {
                let homeTeamID = match['homeTeam']['id']
                let awayTeamID = match['awayTeam']['id']
                let homeScore = match['score']['fullTime']['homeTeam']
                let awayScore = match['score']['fullTime']['awayTeam']

                let homeTeamTLA = null
                let awayTeamTLA = null
                fetch("./data.json").then(response => response.json())
                    .then(data => {
                        data.filter(team => {
                            if (homeTeamID == team.id) homeTeamTLA = team.TLA
                        })
                        data.filter(team => {
                            if (awayTeamID == team.id) awayTeamTLA = team.TLA
                        })

                        console.log(homeTeamTLA + " " + homeScore + " VS " + awayScore + " " + awayTeamTLA)

                        if (homeTeamTLA == null) homeTeamTLA = 'ZZZ'
                        if (awayTeamTLA == null) awayTeamTLA = 'ZZZ'

                        const homeCard = makeScoreCard(homeTeamTLA, homeScore, true)
                        const awayCard = makeScoreCard(awayTeamTLA, awayScore, false)

                        const scoreWrap = document.createElement("div")
                        scoreWrap.classList.add("scorebar-wrap")

                        scoreWrap.appendChild(homeCard)
                        scoreWrap.appendChild(awayCard)

                        feed.appendChild(scoreWrap)
                    })
            }
        })
    })
}