/*
Посчитать заработную плату сотрудника за отработанные часы.

Условия:

Всё время должно рассчитываться в UTC, результат должен оставаться тем же самым вне зависимости от таймзоны на сервере.
Время отработанное с 08 до 18 оплачичивается в размере 100%.
Время отработанное с 18 до 23 оплачичивается в размере 150%.
Время отработанное с 23 до 08 оплачичивается в размере 200%.
Никто не работает больше 12 часов подряд.
Входные данные уже отсортирован по времени.
Файл с ответом должен экспортировать функцию с тремя параметрами:

timesheet — массив с отметками о входе и выходе на работу (например: [['login', 1669914900000], ['logout', 1669914900000]])
hourRate — оплата за час работы
Шаблон:

module.exports = function (timesheet, hourRate) {
  // ваш код
}
Ваша функция должна вернуть число с двумя знаками после запятой (например: 1550.25).
*/

module.exports = function (timesheet, hourRate) {
    let salary = 0
    while (timesheet.length) {
        const [start, end] = timesheet.splice(0, 2).map(x => x[1])
        const startDate = new Date(start)
        const endDate = new Date(end)

        const split8am = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 8)).getTime()
        const split6pm = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 18)).getTime()
        const split11pm = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 23)).getTime()
        const split8am_n = split8am + 1000 * 60 * 60 * 24

        const [splitPoint] = [split11pm, split8am_n, split6pm, split8am].filter(x => x > start && x < end)
        switch (splitPoint){
            case split8am:
                salary += ((splitPoint - start) * 2 + (end - splitPoint)) * hourRate / 1000 / 60 / 60
                break
            case split6pm:
                salary += ((splitPoint - start) + (end - splitPoint) * 1.5) * hourRate / 1000 / 60 / 60
                break
            case split11pm:
                salary += ((splitPoint - start) * 1.5 + (end - splitPoint) * 2) * hourRate / 1000 / 60 / 60
                break
            case split8am_n:
                salary += ((splitPoint - start) * 2 + (end - splitPoint)) * hourRate / 1000 / 60 / 60
                break
            default:
                const hour = startDate.getUTCHours()
                if(hour >= 8 && hour < 18) salary += (end - start) * hourRate / 1000 / 60 / 60
                else if(hour >= 18 && hour < 23) salary += 1.5 * (end - start) * hourRate / 1000 / 60 / 60
                else salary += 2 * (end - start) * hourRate / 1000 / 60 / 60
        }
    }
    return Number(salary.toFixed(2))
}