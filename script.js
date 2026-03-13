/* ===============================
KONSTANTA FISIKA
=============================== */

const h = 6.626e-34
const scaleFactor = 50



/* ===============================
AMBIL ELEMENT HTML
=============================== */

const massSlider = document.getElementById("massSlider")
const velocitySlider = document.getElementById("velocitySlider")
const massInput = document.getElementById("massInput")

const massValue = document.getElementById("massValue")
const velocityValue = document.getElementById("velocityValue")

const momentumValue = document.getElementById("momentumValue")
const lambdaValue = document.getElementById("lambdaValue")

const particleSelect = document.getElementById("particleSelect")

const playBtn = document.getElementById("playBtn")
const pauseBtn = document.getElementById("pauseBtn")
const resetBtn = document.getElementById("resetBtn")
const compareBtn = document.getElementById("compareBtn")

const canvas = document.getElementById("waveCanvas")
const ctx = canvas.getContext("2d")



/* ===============================
CANVAS RESPONSIVE
=============================== */

function resizeCanvas(){

canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

}

window.addEventListener("resize",resizeCanvas)
resizeCanvas()



/* ===============================
VARIABEL ANIMASI
=============================== */

let animationRunning = true
let phase = 0

let particleTrail = []
let particleX = 0

let compareMode = false

let soundCounter = 0



/* ===============================
AUDIO SYSTEM
=============================== */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function playClick(){

const osc = audioCtx.createOscillator()
const gain = audioCtx.createGain()

osc.connect(gain)
gain.connect(audioCtx.destination)

osc.frequency.value = 600
gain.gain.value = 0.05

osc.start()
osc.stop(audioCtx.currentTime + 0.05)

}

function playSlider(){

const osc = audioCtx.createOscillator()
const gain = audioCtx.createGain()

osc.connect(gain)
gain.connect(audioCtx.destination)

osc.frequency.value = 300
gain.gain.value = 0.02

osc.start()
osc.stop(audioCtx.currentTime + 0.03)

}

function playWave(freq){

const osc = audioCtx.createOscillator()
const gain = audioCtx.createGain()

osc.connect(gain)
gain.connect(audioCtx.destination)

osc.frequency.value = freq
gain.gain.value = 0.01

osc.start()
osc.stop(audioCtx.currentTime + 0.04)

}



/* ===============================
CHART.JS
=============================== */

const chartCtx = document.getElementById("lambdaChart").getContext("2d")

const lambdaChart = new Chart(chartCtx,{

type:"line",

data:{
labels:[],
datasets:[

{
label:"Kurva λ = h/p",
data:[],
borderWidth:2,
pointRadius:0,
tension:0.35
},

{
label:"Momentum saat ini",
data:[],
pointRadius:6,
showLine:false
}

]
},

options:{

animation:false,
responsive:true,

plugins:{
legend:{position:"top"}
},

scales:{

x:{
title:{display:true,text:"Momentum (p)"}
},

y:{
title:{display:true,text:"Panjang Gelombang (visual)"}
}

}

}

})



/* ===============================
PERHITUNGAN FISIKA
=============================== */

function calculate(){

let m = parseFloat(massSlider.value)
let v = parseFloat(velocitySlider.value)

let p = m * v

if(p === 0){
p = 0.0001
}

let lambda = h / p
let lambdaVisual = scaleFactor / p


massValue.textContent = m.toFixed(2)
velocityValue.textContent = v

momentumValue.textContent = p.toExponential(3)
lambdaValue.textContent = lambda.toExponential(3)


updateChart(p,lambdaVisual)

return lambdaVisual

}



/* ===============================
UPDATE GRAFIK
=============================== */

function updateChart(currentP,currentLambda){

let labels=[]
let curveData=[]

for(let p=0.1;p<=100;p+=1){

labels.push(p.toFixed(1))
curveData.push(scaleFactor/p)

}

lambdaChart.data.labels = labels
lambdaChart.data.datasets[0].data = curveData

lambdaChart.data.datasets[1].data = [{
x:currentP,
y:currentLambda
}]

lambdaChart.update()

}



/* ===============================
GRID LATAR
=============================== */

function drawGrid(){

let gridSize = 40

ctx.strokeStyle = "#dbeafe"
ctx.lineWidth = 1

for(let x=0;x<canvas.width;x+=gridSize){

ctx.beginPath()
ctx.moveTo(x,0)
ctx.lineTo(x,canvas.height)
ctx.stroke()

}

for(let y=0;y<canvas.height;y+=gridSize){

ctx.beginPath()
ctx.moveTo(0,y)
ctx.lineTo(canvas.width,y)
ctx.stroke()

}

}



/* ===============================
GAMBAR GELOMBANG
=============================== */

function drawWave(lambdaVisual){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawGrid()

let amplitude = 50

ctx.beginPath()

ctx.lineWidth = 3
ctx.strokeStyle = "#0f172a"

let startY = canvas.height/2 +
Math.sin((0*0.02/lambdaVisual)+phase)*amplitude

ctx.moveTo(0,startY)

for(let x=0;x<canvas.width;x++){

let y = canvas.height/2 +
Math.sin((x*0.02/lambdaVisual)+phase)*amplitude

ctx.lineTo(x,y)

}

ctx.stroke()



particleX += 2

if(particleX > canvas.width){
particleX = 0
particleTrail = []
}


let particleY = canvas.height/2 +
Math.sin((particleX*0.02/lambdaVisual)+phase)*amplitude


particleTrail.push({x:particleX,y:particleY})

if(particleTrail.length>40){
particleTrail.shift()
}



for(let t of particleTrail){

ctx.beginPath()
ctx.fillStyle = "rgba(0,0,0,0.15)"
ctx.arc(t.x,t.y,6,0,Math.PI*2)
ctx.fill()

}



ctx.beginPath()
ctx.fillStyle = "black"
ctx.arc(particleX,particleY,8,0,Math.PI*2)
ctx.fill()



if(compareMode){

drawCompareWaves()

}

}



/* ===============================
MODE EKSPERIMEN
=============================== */

function drawCompareWaves(){

let v = parseFloat(velocitySlider.value)

let electronMass = 0.0005
let protonMass = 1.67

let pE = electronMass * v
let pP = protonMass * v

let lambdaE = scaleFactor / pE
let lambdaP = scaleFactor / pP



ctx.strokeStyle = "#3b82f6"
ctx.beginPath()
ctx.moveTo(0,canvas.height*0.3)

for(let x=0;x<canvas.width;x++){

let y = canvas.height*0.3 +
Math.sin((x*0.02/lambdaE)+phase)*30

ctx.lineTo(x,y)

}

ctx.stroke()



ctx.strokeStyle = "#ef4444"
ctx.beginPath()
ctx.moveTo(0,canvas.height*0.7)

for(let x=0;x<canvas.width;x++){

let y = canvas.height*0.7 +
Math.sin((x*0.02/lambdaP)+phase)*30

ctx.lineTo(x,y)

}

ctx.stroke()

}



/* ===============================
LOOP ANIMASI
=============================== */

function animate(){

if(animationRunning){

let lambdaVisual = calculate()

drawWave(lambdaVisual)

phase += 0.05

soundCounter++

if(soundCounter % 15 === 0){

let freq = 200 + (500/lambdaVisual)

playWave(freq)

}

}

requestAnimationFrame(animate)

}



/* ===============================
EVENT LISTENER
=============================== */

massSlider.addEventListener("input",()=>{

playSlider()

massInput.value = massSlider.value
calculate()

})



massInput.addEventListener("input",()=>{

massSlider.value = massInput.value
calculate()

})



velocitySlider.addEventListener("input",()=>{

playSlider()
calculate()

})



particleSelect.addEventListener("change",function(){

if(this.value==="electron"){
massSlider.value = 0.0005
}

else if(this.value==="proton"){
massSlider.value = 1.67
}

else if(this.value==="neutron"){
massSlider.value = 1.67
}

massInput.value = massSlider.value

calculate()

})



playBtn.addEventListener("click",()=>{

playClick()
animationRunning = true

})



pauseBtn.addEventListener("click",()=>{

playClick()
animationRunning = false

})



resetBtn.addEventListener("click",()=>{

playClick()

massSlider.value = 1
velocitySlider.value = 10
massInput.value = 1

particleSelect.value = "custom"

phase = 0
particleX = 0
particleTrail = []

calculate()

})



compareBtn.addEventListener("click",()=>{

playClick()

compareMode = !compareMode

})



calculate()
animate()
