
class GameDayManager
{
    constructor()
    {
        // localStorage.clear();
        this.day = 1;
        this.gamespeed = 400;
        this.gameTime = {hours:7, minutes:0};
        this.timerInterval = null;

        this.phases = ["computer","map","minigame"]; 
        this.phase = this.phases[0];


        this.news = [
        {
            day: 1,
            news1: "Городской округ объявил новый сезон школьных мероприятий и конкурсов.",
            news2: "В библиотеке открыли новую выставку про цифровые профессии.",
            news3: "Автобусы на центральном маршруте работают по расписанию без задержек."
        },
        {
            day: 3,
            news1: "Местный парк обновил игровую площадку для детей.",
            news2: "В школе №5 прошёл открытый день для родителей.",
            news3: "В магазинах района появился новый сезонный супермаркет‑франшизы."
        },
        {
            day: 5,
            news1: "Сегодня весь день идёт дождь, улицы скользкие, стоит быть осторожнее на дороге.",
            news2: "В школе объявили расписание дополнительных занятий по математике.",
            news3: "В магазинах района появился новый сорт фруктового сока."
        },
        {
            day: 7,
            news1: "Город запускает программу бесплатных онлайн‑курсов для школьников.",
            news2: "В парке появился новый киоск с мороженым от местного производителя.",
            news3: "В школе построят новый спортивный зал к следующему учебному году."
        },
        {
            day: 9,
            news1: "В городе участились случаи воровства на улицах, особенно в вечернее время.",
            news2: "В школе №3 прошёл открытый урок по финансовой грамотности.",
            news3: "В магазине района запустили акцию с подарками за покупки."
        },
        {
            day: 11,
            news1: "Собака из соседнего двора покусала прохожих, владельцу грозит крупный штраф.",
            news2: "В школе объявили результаты школьной олимпиады по английскому языку.",
            news3: "В парке открылся новый зелёный фонтан для отдыха жителей."
        },
        {
            day: 13,
            news1: "Местный кинотеатр запускает недельный фестиваль семейных фильмов.",
            news2: "В школе объявили результаты олимпиады по информатике.",
            news3: "В парке появился новый фонарный столб с USB‑зарядкой."
        },
        {
            day: 15,
            news1: "Город запускает бесплатный сервис онлайн‑записи к врачам для школьников.",
            news2: "В магазине района открылась распродажа техники и аксессуаров.",
            news3: "В библиотеке стартует кружок по программированию для подростков."
        }
        ];

        this.notepadText = 
        [
            {day:1,option:1, text:"Проснулся с отличным настроением! Поставил себе челлендж заработать на новый телефон за 2 недели пока не закончились скидки, он стоит всего 30000 рублей, так как нынешний уже глючит.Вчера нашел приложение, где можно заработать. У меня есть час до школы изучить его!"},
            {day:3,option:1, text:"Прекрасный субботний денек! И домашки мало задали! Сегодня договорились погулять с другом, но до него опять долго идти. Может быть взять электросамокат? А пока я могу посидеть в компе!"},
            {day:5,option:1, text:"Круто погуляли с другом. Сегодня опять в школу, всего час на комп!"},
            {day:5,option:2, text:"Круто погуляли с другом. Но по дороге к нему я поцарапал самокат. Пришлось платить... Сегодня опять в школу, всего час на комп!"},
            {day:5,option:3, text:"Круто погуляли с другом. Но по дороге к нему я поцарапал самокат. Пришлось платить, однако страховка смягчила все. Сегодня опять в школу, всего час на комп!"},
            {day:7,option:1, text:"Ура! Получил 5 за контрошу по русскому!. Еще и не задали ничего! Сегодня надо будет сходить к бабушке."},
            {day:7,option:2, text:"Ура! Получил 5 за контрошу по русскому!. Еще и не задали ничего! Эти лужи конечно, все настроение испортили, из-за них упал и повредил ногу, пришлось идти ко врачу, а там еще и заплатить немало пришлось. Сегодня надо будет сходить к бабушке."},
            {day:7,option:3, text:"Ура! Получил 5 за контрошу по русскому!. Еще и не задали ничего! Эти лужи конечно, все настроение испортили, из-за них упал и повредил ногу, пришлось идти ко врачу, а там еще и заплатить немало пришлось, но хорошо, что я купил страховку. Сегодня надо будет сходить к бабушке."},
            {day:9,option:1, text:"Сегодня было 7 уроков и я только закончил делать домашку! Мне еще в магазин идти! Посижу немного в компе."},
            {day:11,option:1, text:"Сегодня мама привезла собаку на передержку. С ней нужно будет погулять. Пока посижу в компе"},
            {day:11,option:2, text:"Вчера украли наушники! Пришлось покупать новые... Отдал 5000р! Сегодня мама привезла собаку на передержку. С ней нужно будет погулять. Пока посижу в компе"},
            {day:11,option:3, text:"Вчера украли наушники! Пришлось покупать новые... Отдал 5000р, но страховка покрыла все! Сегодня мама привезла собаку на передержку. С ней нужно будет погулять. Пока посижу в компе"},
            {day:13,option:1, text:"Сегодня было 8 уроков! Так проголодался, что доел весь суп. Вечером пожарю себе яичницу. Пока отдохну."},
            {day:13,option:2, text:"Сегодня было 8 уроков! Так еще и анлаки начудила вчера(зачем я вообще предложил ее так назвать), поцарапала штаны прохожему, пришлось отдавать штраф((.Так проголодался, что доел весь суп. Вечером пожарю себе яичницу. Пока отдохну."},
            {day:13,option:3, text:"Сегодня было 8 уроков! Так еще и анлаки начудила вчера(зачем я вообще предложил ее так назвать), поцарапала штаны прохожему, пришлось отдавать штраф((, но хоть не из моего кармана. Так проголодался, что доел весь суп. Вечером пожарю себе яичницу. Пока отдохну."},
            {day:15,option:1, text:"Последний день челленжда! Нужно сегодня поднажать, а то я не успею. Потом пойду гулять с друзьями."},
            {day:15,option:2, text:"Последний день челленжда! Все против меня, опять пришлось идти ко врачу, из-за ожога во время готовка.-Денюжки. Нужно сегодня поднажать, а то я не успею. Потом пойду гулять с друзьями."},
            {day:15,option:3, text:"Последний день челленжда! Все против меня, опять пришлось идти ко врачу, из-за ожога во время готовка. Хорошо, что я купил страховку. Нужно сегодня поднажать, а то я не успею. Потом пойду гулять с друзьями."}
        ];

        this.events = 
        [
            {name: "none", insurance: "none", value: 0},
            {name: "puddle", insurance: "health", value: 5000},
            {name: "scootercrush", insurance:"transport", value:7000},
            {name: "thiefs", insurance:"gadgets", value: 5000},
            {name: "dog", insurance: "administrative", value:7000},
            {name: "cooking", insurance:"health", value:3000}
        ]

        this.insurancees = 
        [
            {name:"transport",value: 500, activedays: 0, percent: 0.9},
            {name:"administrative",value: 500, activedays: 0, percent: 0.9},
            {name:"health",value:500, activedays: 0, percent: 0.9},
            {name:"gadgets",value:500, activedays: 0, percent: 0.9},
            {name:"websafety",value:500, activedays:0, percent: 0.9}
        ];

        this.dayTimer = 
        [
            {day:1, timeStart: 7, timeEnd: 8},
            {day:3, timeStart: 12, timeEnd: 14},
            {day:5, timeStart: 7, timeEnd: 8},
            {day:7, timeStart: 15, timeEnd: 17},
            {day:9, timeStart: 20, timeEnd: 22},
            {day:11, timeStart: 16, timeEnd: 18},
            {day:13, timeStart: 16, timeEnd: 18},
            {day:15, timeStart: 14, timeEnd: 17}
        ];

        this.balance = 0;

        this.improvement1Levels = 
        [
            {level:0, value:700, percent: 0},
            {level:1, value:1400, percent:0.2},
            {level:2, value:2000, percent: 0.3},
            {level:3, value:-1, percent:0.4}
        ];

        this.improvement2Levels = 
        [
            {level:0, value:1000, percent: 0},
            {level:1, value:1800, percent:0.1},
            {level:2, value:2500, percent: 0.2},
            {level:3, value:-1, percent:0.3}
        ];

        this.improvement3Levels = 
        [
            {level:0, value:1000, percent: 0},
            {level:1, value:2000, percent:0.05},
            {level:2, value:2700, percent: 0.1},
            {level:3, value:-1, percent:0.15}
        ];

        this.improvments = 
        [
            {id: 1,currentLevel:0},
            {id: 2,currentLevel:0},
            {id: 3,currentLevel:0}
        ];
        
        this.taskInformation = 
        [
            {difficulty:0, reward: 250, percent: 0.7, clicks: 50},
            {difficulty:1, reward: 500, percent: 0.2, clicks: 100},
            {difficulty:2, reward: 750, percent: 0.08, clicks: 150},
            {difficulty:3, reward: 1000, percent: 0.02, clicks: 200}
        ];

        this.tasks = 
        [
            {text: "Сделать презентацию", ...this.taskInformation[0]},
            {text: "Отправить отчёт по практике", ...this.taskInformation[0]},
            {text: "Написать курсовую часть 1", ...this.taskInformation[0]},
            {text: "Скачать и отсортировать файлы", ...this.taskInformation[0]},
            {text: "Собрать отчёт в таблицу Excel", ...this.taskInformation[0]},
            {text: "Проверить почту и ответить на письма", ...this.taskInformation[0]},
            {text: "Обновить пароли в браузере", ...this.taskInformation[0]},
            {text: "Составить список покупок на неделю", ...this.taskInformation[0]},
            {text: "Найти информацию для реферата", ...this.taskInformation[0]},
            {text: "Оформить документ в Word", ...this.taskInformation[0]},
            {text: "Сделать тяжёлую презентацию для группы", ...this.taskInformation[1]},
            {text: "Проверить и отредактировать все домашки", ...this.taskInformation[1]},
            {text: "Написать сложный отчёт по проекту", ...this.taskInformation[1]},
            {text: "Собрать большой PDF с материалами", ...this.taskInformation[1]},
            {text: "Проверить все письма и приложения", ...this.taskInformation[1]},
            {text: "Найти и оформить источники для работы", ...this.taskInformation[1]},
            {text: "Сделать сложную таблицу в Excel", ...this.taskInformation[1]},
            {text: "Привести в порядок весь рабочий стол", ...this.taskInformation[1]},
            {text: "Обновить все программы на компьютере", ...this.taskInformation[1]},
            {text: "Собрать портфолио для учителя", ...this.taskInformation[1]},
            {text: "Собрать большой отчёт за семестр", ...this.taskInformation[2]},
            {text: "Написать сложную курсовую до дедлайна", ...this.taskInformation[2]},
            {text: "Подготовить материки для конкурса", ...this.taskInformation[2]},
            {text: "Собрать статистику по всем проектам", ...this.taskInformation[2]},
            {text: "Проверить и исправить все ошибки в работе", ...this.taskInformation[2]},
            {text: "Сделать сложную презентацию для защиты", ...this.taskInformation[2]},
            {text: "Обработать большую таблицу с данными", ...this.taskInformation[2]},
            {text: "Собрать все фото и видео проект", ...this.taskInformation[2]},
            {text: "Проверить все сайты для школьного проекта", ...this.taskInformation[2]},
            {text: "Собрать большой файл с домашками", ...this.taskInformation[2]},
            {text: "Собрать большой отчёт за год", ...this.taskInformation[3]},
            {text: "Написать сложную курсовую", ...this.taskInformation[3]},
            {text: "Сделать огромную презентацию для учителей", ...this.taskInformation[3]},
            {text: "Обработать все данные класса", ...this.taskInformation[3]},
            {text: "Собрать большой отчёт по проекту без помощи", ...this.taskInformation[3]},
            {text: "Подготовить сложную работу для олимпиады", ...this.taskInformation[3]},
            {text: "Собрать большой файл с проектами", ...this.taskInformation[3]},
            {text: "Проверить все ошибки в сложном проекте", ...this.taskInformation[3]},
            {text: "Собрать большой отчёт по всем урокам", ...this.taskInformation[3]},
            {text: "Написать большой отчёт для родителей", ...this.taskInformation[3]}
        ];
    }

    eventInformation(name)
    {
        const elements = this.events.find(item => item.name == name);
        return [elements.insurance, elements.value];
    }

    isInsuranceWork(insurance)
    {
        if (insurance == "none"){return true;}
        const element = this.insurancees.find(item => item.name == insurance);
        return element.activedays > 0;
    }

    resetGame()
    {
        this.balance = 0;
        this.day = 1;
        this.improvments = 
        [
            {id: 1,currentLevel:0},
            {id: 2,currentLevel:0},
            {id: 3,currentLevel:0}
        ];
    }



    saveToStorage()
    {
        localStorage.setItem("dayManager",JSON.stringify(this));
    }

    static loadFromStorage()
    {
        const data = localStorage.getItem("dayManager");
        if(data)
        {
            const parsed = JSON.parse(data);
            const manager = new GameDayManager();
            Object.assign(manager,parsed);

            return manager;
        }
        return new GameDayManager();
    }

    getDay()
    {
        return this.day;
    }

    changeDay()
    {
        this.day += 2;
        this.saveToStorage();
    }

    getPhase()
    {
        return this.phase;
    }

    setPhase(phaseNumber)
    {
        this.phase = this.phases[phaseNumber];
        this.saveToStorage();
    }

    getNotepadText(option)
    {
        const notetext = this.notepadText.find(item => ((item.day == this.day) && (item.option == option)));
        return notetext.text;
    }

    getInsuranceValue(name)
    {
        const element = this.insurancees.find(item => item.name == name);
        return element.value;
    }

    increaseInsurance(name)
    {
        const insurance = this.insurancees.find(item => item.name ===name);
        insurance.activedays += 3;
        this.saveToStorage();
    }

    decreaseInsurance(name)
    {
        const insurance = this.insurancees.find(item => item.name == name);
        insurance.activedays -= 1;
        this.saveToStorage();
    }

    getInsurancePercent(name)
    {
        const element = this.insurancees.find(item => item.name == name);
        return element.percent;
    }

    getDayTimer()
    {
        const element = this.dayTimer.find(item => item.day == this.day);
        return [element.timeStart,element.timeEnd];
    }

    getImprovementCurrentLevel(id)
    {
        const element = this.improvments.find(item => item.id == id);
        return element.currentLevel;
    }

    getImprovementValue(id)
    {
        let element;
        if(id == 1)
        {
           element = this.improvement1Levels.find(item => item.level == this.getImprovementCurrentLevel(id));
        }
        if(id === 2)
        {
           element = this.improvement2Levels.find(item => item.level == this.getImprovementCurrentLevel(id));
        }
        if(id === 3)
        {
           element = this.improvement3Levels.find(item => item.level == this.getImprovementCurrentLevel(id));
        }
        return element.value;
    }

    getImprovementPercent(id)
    {
        let element;
        if(id == 1)
        {
           element = this.improvement1Levels.find(item => item.level == this.getImprovementCurrentLevel(id));
        }
        if(id == 2)
        {
           element = this.improvement2Levels.find(item => item.level == this.getImprovementCurrentLevel(id));
        }
        if(id == 3)
        {
           element = this.improvement3Levels.find(item => item.level == this.getImprovementCurrentLevel(id));
        }
        return element.percent;
    }

    changeImprovementLevel(id)
    {
        const element = this.improvments.find(item => item.id == id);
        if(id == 1 && element.currentLevel == 3){return false;}
        if(id == 2 && element.currentLevel == 3){return false;}
        if(id == 3 && element.currentLevel == 3){return false;}
        element.currentLevel += 1;
        this.saveToStorage();
    }

    getBalance()
    {
        return this.balance;
    }

    changeBalance(value)
    {
        this.balance += value;
        this.saveToStorage();
    }

    getRandomTask()
    {
        const percentDifficulty0 = this.taskInformation[0].percent - this.getImprovementPercent(3)*3;
        const percentDifficulty1 = this.taskInformation[1].percent + this.getImprovementPercent(3);
        const percentDifficulty2 = this.taskInformation[2].percent + this.getImprovementPercent(3);
        const percentDifficulty3 = this.taskInformation[3].percent + this.getImprovementPercent(3);

        const randomChance = Math.random();
        let choicetasks;
        let task;
        if(randomChance<= percentDifficulty0)
        {
            choicetasks = this.tasks.filter(item => item.difficulty == 0);
            task = choicetasks[Math.floor(Math.random() * (choicetasks.length))]
        }
        else if(randomChance > percentDifficulty0 && randomChance <= percentDifficulty0+percentDifficulty1)
        {
            choicetasks = this.tasks.filter(item => item.difficulty == 1);
            task = choicetasks[Math.floor(Math.random() * (choicetasks.length))]
        }
        else if(randomChance > percentDifficulty0+percentDifficulty1 && randomChance <= percentDifficulty0+percentDifficulty1+percentDifficulty2)
        {
            choicetasks = this.tasks.filter(item => item.difficulty == 2);
            task = choicetasks[Math.floor(Math.random() * (choicetasks.length))]
        }
        else
        {
            choicetasks = this.tasks.filter(item => item.difficulty == 3);
            task = choicetasks[Math.floor(Math.random() * (choicetasks.length))]
        }
        let information = [];
        information.push(task.text);
        information.push(task.difficulty);
        information.push(task.reward+Math.floor(this.getImprovementPercent(2) * task.reward));
        information.push(task.clicks-Math.floor(this.getImprovementPercent(1) * task.clicks));
        return information;
    }

    getNews()
    {
        const elements = this.news.find(item => item.day == this.day);
        return [elements.news1,elements.news2,elements.news3];
    }
}
