import { PREP_TIME } from "./js/menu.js";

const form = document.querySelector('.form');
const order = document.querySelector('.order-log');
const FULFILLED = 'fulfilled';

function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        if (shouldResolve) {
        resolve(delay);
        } else {
        reject(delay);
        }
    }, delay);
  });
}

function addOrderRow(drinkName) {
    const el = document.createElement('li');
    el.classList.add("row-pending");
    el.textContent = `${drinkName} у роботі…`;
    order.append(el);
    return el;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let status;
    const formData = new FormData(form);
    const data = {
        state: formData.get('state'),
        drink: formData.get('drink'),
    }

    if (data.state === FULFILLED) {
        status = true;
    } else {
        status = false;
    }
    const delay = PREP_TIME[data.drink];
    const row = addOrderRow(data.drink);
    const promise = makeOrder(delay, status);

    promise
    .then((delay) => {
        row.textContent = `✅ ${data.drink} · готове · ${delay} ms`;
        row.classList.replace("row-pending", "row-ok");
        })
    .catch((delay) => {
            row.textContent = `❌ ${data.drink} · скасовано · ${delay} ms`;
            row.classList.replace("row-pending", "row-err");
        })
    .finally(() => {
            const time = new Date().toLocaleTimeString("uk-UA");
            row.textContent += ` · ${time}`;
        }
    );
}
)