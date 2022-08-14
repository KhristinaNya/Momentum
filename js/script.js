const time = document.querySelector('.time');
const day = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const greetingText = document.querySelector('.greeting.text');

function showTime() {
    const date = new Date();
    const currentDate = date.toLocaleTimeString();
    time.textContent = currentDate;
    if (currentDate === '00:00:00'){
        showDay();
    }
    showGreeting()
    setTimeout(showTime, 1000);
}

showTime();

function showDay() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
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
    else if (time < 12){
        return 'morning';
    }
    else if (time < 18){
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
    localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
  }
  window.addEventListener('load', getLocalStorage)