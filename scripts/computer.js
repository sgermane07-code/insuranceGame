let nextzIndex = 1000;
let dayManager = GameDayManager.loadFromStorage();
let canShutDown;

document.addEventListener("DOMContentLoaded", () => {

    canShutDown = false;
    const event = localStorage.getItem("event");
    const isNextDay = localStorage.getItem("isNextDay") == "true";
    if (isNextDay)
    {
        localStorage.setItem("isNextDay","false");
        const [insurance,value] = dayManager.eventInformation(event);
        dayManager.changeDay();
        if(dayManager.getDay() > 15)
        {
            localStorage.clear();
            if(dayManager.getBalance() < 30000)
            {
                window.location.href = 'lose.html';
            }
            else
            {
                window.location.href = 'win.html';
            }
        }
        if(event == "none")
        {
            UpdateNotepadText(1);
        }
        else if(!dayManager.isInsuranceWork(insurance))
        {
            dayManager.changeBalance(-value);
            UpdateNotepadText(2);
        }
        else if(dayManager.isInsuranceWork(insurance))
        {
            dayManager.changeBalance(-(Math.floor(value*(1-dayManager.getInsurancePercent(insurance)))));
            UpdateNotepadText(3);
        }
    }
    if (dayManager.getDay() == 1)
    {
        UpdateNotepadText(1);
    }
    UpdateBalance();
    openWindow("notepadApp");
    createTaskList();
    addNewsToListNews();
    updatePriceOnCards();
    setInsurancePrice();
    startGameTimer();
});

function UpdateBalance()
{
    document.getElementById("balanceValue").textContent = dayManager.getBalance();
}

function UpdateNotepadText(option)
{
    document.getElementById("notepadText").textContent = "Дневник день " + dayManager.getDay();
    document.getElementById("notepadContent").value = dayManager.getNotepadText(option);
}

function openWindow(id)
{
    const element = document.getElementById(id);
    element.classList.add("active");
    nextzIndex += 1;
    element.style.zIndex = nextzIndex;
}

function closeWindow(id) 
{
    document.getElementById(id).classList.remove("active");
}

document.getElementById("notepadShortcut").addEventListener("click", () => 
{
    openWindow("notepadApp");
});

document.getElementById("internetShortcut").addEventListener("click", () => 
{
    openWindow("internetApp");
});

document.getElementById("nutShortcut").addEventListener("click", () => 
{
    openWindow("nutApp");
});

document.querySelectorAll(".close-modal").forEach(element => 
{
    element.addEventListener("click", () =>
        {
            if(element.dataset.app == "notepad")
            {
                closeWindow("notepadApp")
            }
            if(element.dataset.app == "internet")
            {
                closeWindow("internetApp")
            }
            if(element.dataset.app == "nut")
            {
                closeWindow("nutApp")
            }
        });
});

function createTaskItem(taskInfo)
{
    const [text, difficulty, reward, clicks] = taskInfo;

    const item = document.createElement("div");
    item.className = "task-item";

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("h4");
    title.textContent = text;
    info.appendChild(title);

    const diff = document.createElement("div");
    diff.className = "task-difficulty";
    if (difficulty === 0) diff.textContent = "Лёгкая";
    if (difficulty === 1) diff.textContent = "Средняя";
    if (difficulty === 2) diff.textContent = "Сложная";
    if (difficulty === 3) diff.textContent = "Очень сложная";
    info.appendChild(diff);

    item.appendChild(info);

    const rewardEl = document.createElement("div");
    rewardEl.className = "task-reward";
    rewardEl.textContent = reward + " монет";
    item.appendChild(rewardEl);

    const btn = document.createElement("button");
    btn.className = "task-do-btn";
    btn.textContent = "Выполнить";

    btn.addEventListener("click", () => {
        const modal = document.getElementById("executionModal");
        modal.classList.add("active");
        let currentClicks = 0;
        const execbtn = document.getElementById("execution-btn");
        execbtn.addEventListener("click", () =>
            {
                currentClicks += 1;
                let progress = (currentClicks/clicks)*100;
                execFill.style.width = `${progress}%`;
                if (currentClicks == clicks)
                {
                    modal.classList.remove("active");
                    execFill.style.width = '0%';
                    dayManager.changeBalance(reward);
                    item.remove();
                    addTaskToList();
                    UpdateBalance();
                }
            });
    });

    item.appendChild(btn);

    return item;
}



function addTaskToList()
{
    const container = document.getElementById("taskListContainer");
    const taskInfo = dayManager.getRandomTask();
    const taskItem = createTaskItem(taskInfo);
    container.appendChild(taskItem);
}

function createTaskList()
{
    for(let i = 0; i < 3; i++)
    {
        addTaskToList();
    }
}

document.querySelectorAll(".tab-btn").forEach(element =>
    {
        element.addEventListener("click", () => 
            {
                const newsweb = document.querySelector("button[data-tab='news']");
                const selfweb = document.querySelector("button[data-tab='self']");
                const insureweb = document.querySelector("button[data-tab='insure']");
                newsweb.classList.remove("active");
                selfweb.classList.remove("active");
                insureweb.classList.remove("active");
                if(element.dataset.tab === "news")
                {
                    newsweb.classList.add("active");
                    document.getElementById("selfTab").classList.remove("active");
                    document.getElementById("newsTab").classList.add("active");
                    document.getElementById("insureTab").classList.remove("active");
                }
                if(element.dataset.tab === "self")
                {
                    selfweb.classList.add("active");
                    document.getElementById("selfTab").classList.add("active");
                    document.getElementById("newsTab").classList.remove("active");
                    document.getElementById("insureTab").classList.remove("active");
                }
                if(element.dataset.tab === "insure")
                {
                    insureweb.classList.add("active");
                    document.getElementById("selfTab").classList.remove("active");
                    document.getElementById("newsTab").classList.remove("active");
                    document.getElementById("insureTab").classList.add("active");
                }
            });
    });

function addNewsToListNews()
{
    const [newsText1,newsText2,newsText3] = dayManager.getNews();
    document.getElementById("news1").textContent = newsText1;
    document.getElementById("news2").textContent = newsText2;
    document.getElementById("news3").textContent = newsText3;
}

function updatePriceOnCards()
{
    document.getElementById("self-card1-price").textContent = dayManager.getImprovementValue(1);
    document.getElementById("self-card2-price").textContent = dayManager.getImprovementValue(2);
    document.getElementById("self-card3-price").textContent = dayManager.getImprovementValue(3);
    if(dayManager.getImprovementValue(1) == -1)
    {
        document.getElementById("purchase_upgrade_btn1").classList.remove("active");
        document.getElementById("self-card1-price").textContent = "Максимальный уровень";
    }
    if(dayManager.getImprovementValue(2) == -1)
    {
        document.getElementById("purchase_upgrade_btn2").classList.remove("active");
        document.getElementById("self-card2-price").textContent = "Максимальный уровень";
    }
    if(dayManager.getImprovementValue(3) == -1)
    {
        document.getElementById("purchase_upgrade_btn3").classList.remove("active");
        document.getElementById("self-card3-price").textContent = "Максимальный уровень";
    }
}

document.getElementById("purchase_upgrade_btn1").addEventListener("click",() => 
    {
        console.log(dayManager.getImprovementCurrentLevel(1));
        if(dayManager.getImprovementValue(1) > dayManager.getBalance()){return}
        dayManager.changeBalance(-dayManager.getImprovementValue(1));
        dayManager.changeImprovementLevel(1);
        updatePriceOnCards();
        UpdateBalance();
    });

document.getElementById("purchase_upgrade_btn2").addEventListener("click",() => 
    {
        if(dayManager.getImprovementValue(2) > dayManager.getBalance()){return}
        dayManager.changeBalance(-dayManager.getImprovementValue(2));
        dayManager.changeImprovementLevel(2);
        updatePriceOnCards();
        UpdateBalance();
    });

document.getElementById("purchase_upgrade_btn3").addEventListener("click",() => 
    {
        if(dayManager.getImprovementValue(3) > dayManager.getBalance()){return}
        dayManager.changeBalance(-dayManager.getImprovementValue(3));
        dayManager.changeImprovementLevel(3);
        updatePriceOnCards();
        UpdateBalance();
    });

function setInsurancePrice()
{
    document.getElementById("insure1").textContent = dayManager.getInsuranceValue("gadgets");
    document.getElementById("insure2").textContent = dayManager.getInsuranceValue("administrative");
    document.getElementById("insure3").textContent = dayManager.getInsuranceValue("transport");
    document.getElementById("insure4").textContent = dayManager.getInsuranceValue("health");
    document.getElementById("insure5").textContent = dayManager.getInsuranceValue("websafety");
}

document.getElementById("insure-buy").addEventListener("click", () => {
    let totalprice = 0;

    if (document.querySelector("input[data-insure='gadgets']").checked) {
        totalprice += dayManager.getInsuranceValue("gadgets");
    }
    if (document.querySelector("input[data-insure='administrative']").checked) {
        totalprice += dayManager.getInsuranceValue("administrative");
    }
    if (document.querySelector("input[data-insure='transport']").checked)
    {
        totalprice += dayManager.getInsuranceValue("transport");
    }
    if (document.querySelector("input[data-insure='health']").checked) 
    {
        totalprice += dayManager.getInsuranceValue("health");
    }
    if (document.querySelector("input[data-insure='websafety']").checked) {
        totalprice += dayManager.getInsuranceValue("gadgets");
    }

    if (dayManager.getBalance() < totalprice) {return;}

    if (document.querySelector("input[data-insure='gadgets']").checked) 
    {
        dayManager.increaseInsurance("gadgets");
    }
    if (document.querySelector("input[data-insure='administrative']").checked) 
    {
        dayManager.increaseInsurance("administrative");
    }
    if (document.querySelector("input[data-insure='transport']").checked) 
    {
        dayManager.increaseInsurance("transport");
    }
    if (document.querySelector("input[data-insure='health']").checked) 
    {
        dayManager.increaseInsurance("health");
    }
    if (document.querySelector("input[data-insure='websafety']").checked) 
    {
        dayManager.increaseInsurance("websafety");
    }

    dayManager.changeBalance(-totalprice);
    UpdateBalance();
});


function startGameTimer()
{
    const [startHour, endHour] = dayManager.getDayTimer();
    dayManager.gameTime.hours = startHour;
    dayManager.gameTime.minutes = 0;
    
    if (dayManager.timerInterval) clearInterval(this.timerInterval);
    
    dayManager.timerInterval = setInterval(() => {
        updateGameTime();
    }, 1500);
}

function updateGameTime()
{
    const [startHour, endHour] = dayManager.getDayTimer();
    dayManager.gameTime.minutes += 1;
    if(dayManager.gameTime.minutes >= 60)
    {
        dayManager.gameTime.hours += 1;
        dayManager.gameTime.minutes = 0;
    }

    document.getElementById("liveClock").textContent = dayManager.gameTime.hours.toString().padStart(2, '0') + ':' + 
    dayManager.gameTime.minutes.toString().padStart(2, '0');
    if(dayManager.gameTime.hours >= endHour)
    {
        endDayComputer();
    }
}

function endDayComputer()
{
    canShutDown = true;
    if (dayManager.dayEnded) return;

    dayManager.dayEnded = true;
    stopGameTimer();
    
    document.querySelectorAll('button, input, .tab-btn').forEach(el => {
        if (!el.id.includes('shutdownBtn')) {
            el.disabled = true;
            el.style.opacity = '0.5';
            el.style.pointerEvents = 'none';
        }
    });

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.getElementById("executionModal").remove("active");
    document.getElementById("notepadShortcut").style.pointerEvents = 'none';
    document.getElementById("internetShortcut").style.pointerEvents = 'none';
    document.getElementById("nutShortcut").style.pointerEvents = 'none';
    document.getElementById("notepadApp").classList.remove("active");
    document.getElementById("internetApp").classList.remove("active");
    document.getElementById("nutApp").classList.remove("active");

    const endDayNotice = document.createElement('div');
    endDayNotice.id = 'end-day-notice';
    endDayNotice.innerHTML = `
        <h2>Время закончилось!</h2>
        <p>Нажмите "Выключить компьютер" для продолжения</p>
    `;
    endDayNotice.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 40px;
        border-radius: 10px;
        text-align: center;
        z-index: 10000;
        font-size: 1.2rem;
    `;
    document.body.appendChild(endDayNotice);
}

document.getElementById("shutdownBtn").addEventListener("click", () =>
    {
        if(canShutDown)
        {
            endDayPhase();
        }
    });


function stopGameTimer() 
{
    if (dayManager.timerInterval) 
    {
        clearInterval(dayManager.timerInterval);
        dayManager.timerInterval = null;
    }
}

function endDayPhase()
{
    localStorage.setItem("day",dayManager.getDay());
    window.location.href = 'Game.html';
}
