var dt_obj = new Date(Date.now())
var date = String(dt_obj.toLocaleDateString()).replace(/\//g, '')

var hour = String(dt_obj.toTimeString({hour12: false})).split(':')
var time = hour[0] + hour[1]

var datetime = date + '_' + time;
console.log(datetime)


// var m2 = new Date(Date.now()).toLocaleString().split(' ')[1].split(':')[1]
// console.log(`m2: ${m2}`)
// var time = h+':'+m2+' '+new Date(Date.now()).toLocaleString().split(' ')[2]
// console.log(`time: ${time}`)
// var date = new Date(Date.now()).toLocaleString().split(' ')[0] + new Date(Date.now()).toLocaleString().split(' ')[2]
// console.log(`date: ${date}`)