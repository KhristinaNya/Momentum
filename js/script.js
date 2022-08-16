import playList from './playList.js';

document.addEventListener("DOMContentLoaded", async () => {
    const time = document.querySelector('.time');
    const day = document.querySelector('.date');
    const greeting = document.querySelector('.greeting');
    const greetingText = document.querySelector('.greeting-container .name');

    const body = document.querySelector('body');

    const next = document.querySelector('.slide-next');
    const prev = document.querySelector('.slide-prev');
    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const wind = document.querySelector('.wind');
    const humidity = document.querySelector('.humidity');

    const city = document.querySelector('.city');
    
    const quote = document.querySelector('.quote');
    const author = document.querySelector('.author');
    const changeQuote = document.querySelector('.change-quote');
    const nextAudo = document.querySelector('.play-next');
    const prevAudo = document.querySelector('.play-prev');
    const state = {
        ['Language']: 'en',
        ['Photo Source']: 'github',
        //blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio', 'todolist'],
    }
    const greetingTranslation = {
        'en' :  `Good ${getTimeOfDay(getHours())}`,
        'ru' :  getTimeOfDayRus(getHours())
    }
    let userName = '';

    function showTime() {
        const date = new Date();
        const currentDate = date.toLocaleTimeString();
        time.textContent = currentDate;
        if (currentDate === '00:00:00') {
            showDay();
        }
        showGreeting()
        setTimeout(showTime, 1000);
    }

    showTime();

    function showDay() {
        const date = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        day.textContent = date.toLocaleDateString('en-US', options);
    }

    showDay();

    function getHours() {
        const date = new Date();
        const hours = date.getHours();
        return hours;
    }

    function getTimeOfDay(time) {
        if (time < 6) {
            return 'night';
        }
        else if (time < 12) {
            return 'morning';
        }
        else if (time < 18) {
            return 'afternoon';
        }
        else {
            return 'evening';
        }
    }

    function getTimeOfDayRus(time) {
        if (time < 6) {
            return 'Спокойной ночи';
        }
        else if (time < 12) {
            return 'Доброе утро';
        }
        else if (time < 18) {
            return 'Добрый день';
        }
        else {
            return 'Добрый вечер';
        }
    }

    function showGreeting() {
        const greetingText = greetingTranslation[[state['Language']]];
        greeting.textContent = greetingText;
    }

    showGreeting();

    function setLocalStorage() {
        localStorage.setItem('name', greetingText.value);
        localStorage.setItem('city', city.value);
    }

    window.addEventListener('beforeunload', setLocalStorage)

    function getLocalStorage() {
        if (localStorage.getItem('name')) {
            greetingText.value = localStorage.getItem('name');
        }
    }

    getLocalStorage();

    if (localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
    else {
        city.value = 'Minsk';
    }

    function getRandomNum() {
        return (`${Math.floor(Math.random(19) * 10) + 1}`).padStart(2, '0');
    }

    function setBg() {
        const img = new Image();
        img.src = `https://raw.githubusercontent.com/KhristinaNya/stage1-tasks/assets/images/${getTimeOfDay(getHours())}/${randomNum}.jpg`;
        img.onload = () => {
            body.style.backgroundImage = `url(https://raw.githubusercontent.com/KhristinaNya/stage1-tasks/assets/images/${getTimeOfDay(getHours())}/${randomNum}.jpg)`;
        };
    }

    function getSlideNext() {
        randomNum = `${(randomNum === '20' ? 1 : (+randomNum + 1))}`.padStart(2, '0');
        console.log(randomNum)
        setBg();
    }

    function getSlidePrev() {
        randomNum = `${(randomNum === '01' ? 20 : randomNum - 1)}`.padStart(2, '0');
        setBg();
    }

    let randomNum = getRandomNum();
    setBg();

    next.addEventListener('click', getSlideNext);
    prev.addEventListener('click', getSlidePrev);

    async function getWeather() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=cf82e000bcfee802083cab868bd55a10&units=metric`;
            const res = await fetch(url);
            const data = await res.json();

            weatherIcon.className = 'weather-icon owf';
            weatherIcon.classList.add(`owf-${data.weather[0].id}`);
            temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
            weatherDescription.textContent = data.weather[0].description;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s `;
        }
        catch (err) {
            weatherIcon.className = 'weather-icon owf';
            temperature.textContent = 'Error! city not found for broken clouds!';
            weatherDescription.textContent = '';
            humidity.textContent = '';
            wind.textContent = '';
        }
    }

    function setCity(event) {
        if (event.key === 'Enter' || event.type === 'blur') {
            getWeather();
            city.blur();
        }
    }

    getWeather();
    city.addEventListener('keypress', setCity);
    city.addEventListener('blur', setCity);

    async function getQuotes() {
        const quotes = 'https://type.fit/api/quotes';
        const res = await fetch(quotes);
        const data = await res.json();
        return data;
    }

    const arrQuotes = await getQuotes();

    function randomQuote() {
        let random = arrQuotes[Math.floor(Math.random() * arrQuotes.length)];
        quote.innerText = `${random.text}.`;
        author.innerText = random.author;
    }

    randomQuote();

    changeQuote.addEventListener('click', randomQuote);

    const audio = new Audio();
    const playBtnAudio = document.querySelector('.play');

    function playAudio() {
        audio.src = playList[playNum]['src'];
        audio.currentTime = 0;
        audio.play();
        toggleList ();
        audio.onended = () => {
            playNext();
        }
    }

    function pauseAudio() {
        audio.pause();
    }

    playBtnAudio.addEventListener('click', (event) => {
        if(event.target.classList.contains('pause')) {
            pauseAudio() 
        }
        else {
            playAudio();
        }
        playBtnAudio.classList.toggle('pause');
    });


    function playNext() {
        playNum = (playNum === 3 ? 0 : playNum + 1);
        playAudio();
        playBtnAudio.classList.add('pause');
        
    }

    function playPrev() {
        playNum = (playNum === 0 ? 3 : playNum - 1);
        playAudio();
        playBtnAudio.classList.add('pause');
    }

    let playNum = 0;

    nextAudo.addEventListener('click', playNext);
    prevAudo.addEventListener('click', playPrev);

    const playListContainer = document.querySelector('.player');

    const ul = document.createElement('ul');
    ul.classList.add('play-list');
    playListContainer.append(ul);

    playList.forEach(element =>{
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.textContent = element['title'];
        ul.append(li);
    })

    const playListItems = document.querySelectorAll('.play-item');
     
    function toggleList () {
        playListItems.forEach((element, index)=>{
            if (index === playNum) {
               element.classList.add('item-active');
            }
            else{
                element.classList.remove('item-active');
            }
        });
    }

    const settingList = document.querySelector('.setting');
    const ul2 = document.createElement('ul');

    ul2.classList.add('setting-list');
    settingList.append(ul2);
    
    Object.keys(state).forEach((element, index) =>{
        const li = document.createElement('li');
        li.classList.add('setting-item');
        if (index === 0){
            li.textContent = `${element} : ${state['Language']}`;
            ul2.append(li);
            li.addEventListener('click', () => {
                state['Language'] = (state['Language'] === 'en'? 'ru' : 'en');
                greeting.textContent = greetingTranslation[[state['Language']]] ;
                li.textContent = `${element} : ${state['Language']}`;
            });
        }
        if (index === 1){
            const a = document.createElement('a');
            a.classList.add('a');
            a.href="https://github.com/KhristinaNya/stage1-tasks/tree/assets/images";
            a.target="_blank";
            a.textContent =  element;
            ul2.append(li);
            li.append(a);
        }
    })
    const settingUl = document.querySelector('.setting-list');
    const settingImg = document.querySelector('.img-setting');
    settingList.addEventListener('click', (event)=>{
        settingUl.classList.toggle('opened');
        settingImg.classList.toggle('opened');
    })
})
