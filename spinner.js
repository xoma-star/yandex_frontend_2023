/*
При запросах в интерфейсах мы заправшиваем данные и иногда показываем спиннер, но если запрос выполняется быстро, то его показывать пользователю нету смысла — всё и так готово!

Нужно реализовать подобную логику в асинхронной функции.

На вход подается функция request, которая возвращает Promise.
Если она выполняется меньше чем за 250 миллисекунд, то спиннер показывать нет смысла.
А если она выполняется дольше, то нужно показать спиннер, при помощи функции showSpinner, который должен крутиться не меньше 1000 миллисекунд и скрыться при помощи функции hideSpinner.
Гарантируется, что запрос выполняется не дольше 1000 миллисекунд.
Файл с ответом должен экспортировать функцию с тремя параметрами:

module.exports = async function (request, showSpinner, hideSpinner) {
    // ваш код
}
У функции нет возвращаемого значения, нужно корректно вызвать переданные функции и завершиться.
 */
/**
 * request: () => Promise
 * showSpinner: () => void
 * hideSpinner: () => void
 */
module.exports = async function (request, showSpinner, hideSpinner) {
    // ваш код
    let done = false
    let spin = false
    const showSpinnerCheck = () => {
        if(!done) {
            showSpinner()
            spin = true
            // setTimeout(hideSpinnerCheck, 1000)
        }
    }
    const hideSpinnerCheck = () => {
        if(spin) hideSpinner()
        spin = false
    }
    request.then(() => {
        done = true
        hideSpinnerCheck()
    })
    setTimeout(showSpinnerCheck, 250)
}