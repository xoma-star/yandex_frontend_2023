/*
Часто злоумышленники применяют DDoS-атаки: на сервер-жертву отправляется огромное количество
запросов, чтобы нарушить его работоспособность. Вам необходимо написать функцию-декоратор, которая бы помогла противостоять такому виду атак.

Ваш декоратор должен принимать три параметра: исходную функцию, временной интервал T и количество запросов N,
которое можно совершить одному устройству за определённое время.

В качестве результата должна возвращаться «защищённая функция», она принимает IP-адрес устройства,
текущее время и все аргументы, которые были у исходной функции.

Если в течение последних T секунд «защищённая функция» была вызвана больше N раз, то IP устройства
отправляется в бан и больше запросы к исходной функции от него не проходят.

Файл с ответом должен экспортировать функцию с тремя параметрами:

originalFunction — исходная функция, которую необходимо «защитить»
timeInterval — временной интервал, гарантируется, что с каждым новым вызовом «защищённой функции» он будет только увеличиваться
maxRequests — максимально количество запросов, которое можно сделать за временной интервал timeInterval, чтобы не попасть в бан
Шаблон:

module.exports = function(originalFunction, timeInterval, maxRequests) {
  // ваш код
}
Ваш декоратор должен вернуть «защищённую» функцию, которая принимает следующие аргументы:

ip — уникальный идентификатор устройства, которое вызывает функцию
timestamp — Unix-время вызова функции
...args — остальные аргументы исходной функции
Пример использования (в предположении, что решение находится в файле solution.js):

const antifraud = require('solution.js')

// функция, которую будем «защищать»
function sendSMS(phoneNumber, message) {
  // код отправки SMS
  console.log(`Отправлено SMS "${message}"`)
}

const protectedFunction = antifraud(sendSMS, 10, 2)

protectedFunction('128.0.0.1', 0, '+7 000 000 00-00', 'Первое сообщение')
// console.log('Отправлено SMS "Первое сообщение"')

protectedFunction('128.0.0.1', 5, '+7 000 000 00-00', 'Второе сообщение')
// console.log('Отправлено SMS "Второе сообщение"')

protectedFunction('128.0.0.1', 10, '+7 000 000 00-00', 'Третье сообщение')
// ничего не произошло, IP 128.0.0.1 отправился в бан

protectedFunction('128.0.0.1', 15, '+7 000 000 00-00', 'Третье сообщение')
// ничего не произошло, IP 128.0.0.1 отправился в бан

protectedFunction('192.168.0.1', 20, '+7 000 000 00-00', 'Вызов 1 со второго IP')
// console.log('Отправлено SMS "Вызов 1 со второго ip"')

protectedFunction('192.168.0.1', 30, '+7 000 000 00-00', 'Вызов 2 со второго IP')
// console.log('Отправлено SMS "Вызов 2 со второго IP"')
// IP не отправился в бан, потому что было сделано ровно 2 вызова в течение 10 секунд

protectedFunction('192.168.0.1', 40, '+7 000 000 00-00', 'Вызов 3 со второго IP');
// console.log('Отправлено SMS "Вызов 3 со второго IP"')
 */

module.exports = function(originalFunction, timeInterval, maxRequests) {
    let requests = []

    return (ip, timestamp, ...args) => {
        const index = requests.findIndex(x => x.ip === ip)
        if(index < 0) {
            const obj = {ip, requests: 1, firstRequest: timestamp, blackList: false}
            requests = [...requests, obj]
            originalFunction(...args)
        }
        else{
            if(requests[index].firstRequest + timeInterval < timestamp) requests[index] = {...requests[index], requests: 1, firstRequest: timestamp}
            else requests[index] = {...requests[index], requests: requests[index].requests + 1}
            if(requests[index].requests > maxRequests) requests[index].blackList = true
            if(!requests[index].blackList) originalFunction(...args)
        }
    }
}
