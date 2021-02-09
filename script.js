const competition_names = ['epl', 'laliga', 'ligue1', 'bundesliga', 'seria', 'ucl']
const apiCode = { epl: 'PL', laliga: 'PD', ligue1: 'FL1', bundesliga: 'BL1', seria: 'SA', ucl: 'CL' }
const apiUrl = "https://api.football-data.org/v2/"
const daysToView = 7
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
        if (cname.toUpperCase() !== competition_name) {
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

function showScoreCard(matches) {
    const feed = document.querySelector(".feed")
    feed.innerHTML = ""

    if (matches === undefined) return

    for (const match of matches) {
        let homeTeamID = match['homeTeam']['id']
        let awayTeamID = match['awayTeam']['id']
        let homeScore = match['score']['fullTime']['homeTeam']
        let awayScore = match['score']['fullTime']['awayTeam']
        let matchStatus = match['status']
        let homeTeamTLA = null
        let awayTeamTLA = null

        console.log(matchStatus)

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
                if (matchStatus.toUpperCase() === "LIVE" || matchStatus.toUpperCase() === "IN_PLAY" ||
                    matchStatus.toUpperCase() === "PAUSED") {
                    const live = document.createElement("div")
                    live.classList.add("live", "text")
                    scoreWrap.appendChild(live)
                }
                scoreWrap.appendChild(awayCard)

                feed.appendChild(scoreWrap)
            })
    }
}

function makePageButton(pageIndex) {
    const pageButton = document.createElement("div")
    pageButton.classList.add("page-button")
    pageButton.setAttribute("value", pageIndex)

    return pageButton
}

async function fetchScore(compID, dateFrom, dateTo) {
    const response = await fetch(apiUrl + `competitions/${compID}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
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
let curClickedLogo = ""

for (const titleCard of titleCards) {
    titleCard.addEventListener('mouseenter', () => {
        // console.log(titleCard.style) 
        titleCard.style.transform = "scale(1.06)"
        titleCard.style.boxShadow = "0px 1px 2px 2px rgba(0, 0, 0, .2)"
        titleCard.style.transition = "all ease 0.6s"

        const logoCard = document.querySelector(`#${titleCard.textContent}`)
        logoCard.style.transform = "translateX(1em)"
        logoCard.style.opacity = "1"
        changeOpacityExcept(titleCard.textContent, 0.1)
        logoCard.style.transition = "all ease 0.6s"
    })

    titleCard.addEventListener('mouseleave', () => {
        // console.log(titleCard.style) 
        titleCard.style.transform = "scale(1)"
        titleCard.style.boxShadow = ""
        titleCard.style.transition = "all ease 2s"


        const logoCard = document.querySelector(`#${titleCard.textContent}`)
        logoCard.style.transform = "scale(1)"
        if (curClickedLogo !== "") document.querySelector(`#${curClickedLogo}`).style.opacity = "1"
        changeOpacityExcept(curClickedLogo, 0.5)
        logoCard.style.transition = "all ease 1.5s"
    })

    titleCard.addEventListener('click', () => {
        let compID = apiCode[titleCard.textContent.toLowerCase()]
        let dateFrom = new Date(new Date().getTime() - (daysToView * 86400000)).toISOString().slice(0, 10)
        let dateTo = new Date().toISOString().slice(0, 10)

        curClickedLogo = titleCard.textContent

        fetchScore(compID, dateFrom, dateTo).then(data => {
            let matchesUnfiltered = data['matches'].reverse()

            let matches = matchesUnfiltered.filter(item => {
                let status = item['status']
                if (status === "LIVE" || status === "FINISHED" || status === "IN_PLAY" || status === "PAUSED") return item
            })

            const count = matches.length
            console.log(count)
            const pageCount = Math.ceil(count / scorePerPage)
            console.log(pageCount)
            let currentPage = 0
            let pages = []

            for (let i = 0; i < pageCount; i++) {
                let temp = []
                for (let j = 0; j < scorePerPage; j++) {
                    let index = scorePerPage * i + j

                    if (index < count) //this check is required for the residual items
                    {
                        temp.push(matches[index])
                    }
                }
                pages.push(temp)
            }

            showScoreCard(pages[currentPage])

            const pagination = document.querySelector(".pagination")
            pagination.innerHTML = ""
            for (let i = 0; i < pageCount; i++) {
                const button = makePageButton(i)

                if (i === 0) button.style.backgroundColor = "rgba(10, 20, 10, 0.4)"
                button.addEventListener('click', () => {
                    let index = parseInt(button.getAttribute("value"))

                    if (currentPage !== index) {
                        showScoreCard(pages[index])
                        currentPage = index
                    }

                    buttons = document.querySelectorAll(".page-button")
                    for (b of buttons) {
                        b.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                    }

                    button.style.backgroundColor = "rgba(10, 20, 10, 0.4)"

                })

                pagination.appendChild(button)
            }
        })
    })
}