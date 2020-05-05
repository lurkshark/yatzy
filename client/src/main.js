import Yatzy from "./yatzy"
import './style.css'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

new Yatzy(window, document.body)
