class Observer {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    }

    notify(data) {
        this.subscribers.forEach(subscriber => subscriber(data));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const itemsTable = document.querySelectorAll('.opponent .battlefield .battlefield-item');
    const hodBtn = document.querySelector('#hod-btn');

    for (let i = 0; i < itemsTable.length; i++) {
        let res = document.createElement('div');

        itemsTable[i].addEventListener('pointerenter', () => {
            let xData = +itemsTable[i].getAttribute('data-x');
            let yData = itemsTable[i].getAttribute('data-y');
            let y = +yData + 1;

            let x;
            if (xData == 0) x = 'А';
            else if (xData == 1) x = 'Б';
            else if (xData == 2) x = 'В';
            else if (xData == 3) x = 'Г';
            else if (xData == 4) x = 'Д';
            else if (xData == 5) x = 'Е';
            else if (xData == 6) x = 'Ж';
            else if (xData == 7) x = 'З';
            else if (xData == 8) x = 'И';
            else if (xData == 9) x = 'К';

            res.innerHTML = x + '-' + y;
            itemsTable[i].append(res);
        });

        itemsTable[i].addEventListener('pointerleave', () => {
            res.remove();
        });
    }
});

$(document).ready(function () {
    const elemOpponent = document.querySelector('.opponent .battlefield-polygon');
    const elemPlayer = document.querySelector('.player .battlefield-polygon');

    const observerOpponent = new Observer();
    const observerPlayer = new Observer();

    const updateOpponentStatus = () => {
        const shots = document.querySelectorAll('.opponent .shot.shot-wounded');
        document.querySelector('.battlefield-status-killed span').innerHTML = shots.length;
    };

    const updatePlayerStatus = () => {
        const shots = document.querySelectorAll('.player .shot.shot-wounded');
        document.querySelector('.battlefield-status-killed-opponent span').innerHTML = shots.length;
    };

    observerOpponent.subscribe(updateOpponentStatus);
    observerPlayer.subscribe(updatePlayerStatus);

    const mutationCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (observer === opponentMutationObserver) {
                    observerOpponent.notify();
                } else if (observer === playerMutationObserver) {
                    observerPlayer.notify();
                }
            }
        }
    };

    const config = { childList: true, subtree: true };

    const opponentMutationObserver = new MutationObserver((mutationsList) => {
        mutationCallback(mutationsList, opponentMutationObserver);
    });
    opponentMutationObserver.observe(elemOpponent, config);

    const playerMutationObserver = new MutationObserver((mutationsList) => {
        mutationCallback(mutationsList, playerMutationObserver);
    });
    playerMutationObserver.observe(elemPlayer, config);
});