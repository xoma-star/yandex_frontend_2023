const q = require('./q.js')
const s = require('./spinner.js')
const salary = require('./salary.js')

console.log(q.min(), q.max(), q.shift())
q.push(3)
q.push(44)
q.push(12)
console.log(q.queue)
console.log(q.shift())
console.log(q.queue)

console.log(salary([
    ['login', 1674979200000], // 08:00 - 15:00 29.01.2023
    ['logout', 1675004400000],
    ['login', 1675090800000], // 15:00 - 21:00 30.01.2023
    ['logout', 1675112400000],
    ['login', 1675116000000], // 22:00 31.01.2023 - 01:00 01.02.2023
    ['logout', 1675126800000],
    ['login', 1675234800000], // 07:00 - 13:00 01.02.2023
    ['logout', 1675256400000]
], 10))

const a = new Promise((resolve) => setTimeout(resolve, 255))
const show = () => console.log('shown')
const hide = () => console.log('hidden')

s(a, show, hide)