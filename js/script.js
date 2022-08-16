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
    const li = document.createElement('li');

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

    function showGreeting() {
        const timeOfDay = getTimeOfDay(getHours());
        const greetingText = `Good ${timeOfDay}`;
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
    }

    function playPrev() {
        playNum = (playNum === 0 ? 3 : playNum - 1);
    }

    let playNum = 0;

    nextAudo.addEventListener('click', (event) => {
        playNext();
        playAudio();
        playBtnAudio.classList.add('pause');
    });
    prevAudo.addEventListener('click', (event) => {
        playPrev();
        playAudio();
        playBtnAudio.classList.add('pause');
    } );
});         
