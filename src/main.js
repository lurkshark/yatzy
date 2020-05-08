import Yatzy from "./yatzy"
import './style.css'

if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('service-worker.js');
}

new Yatzy(window, document.body)
