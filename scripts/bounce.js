let keep_going=false;
let b = $('#bouncer');
let y=0; let x=0;
let dy=1;  let dx=1;
let smooth=10;
const START_SPEED=1;
let speed=START_SPEED;
let angle,ady,adx;
let speedIncreasing=true;
function bounce() {
    y = y + dy*(smooth/100*speed);
    x = x + dx*(smooth/100*speed);
    if (speedIncreasing) {
	speed = speed + 0.01;
	if (speed > 250) speedIncreasing=false;
    } else {
	speed = speed - 0.005;
	if (speed < 5) speedIncreasing=true;
	
    }
    b.css('top',y);
    b.css('left',x);
    
    if (b.position().top + b.height() > window.innerHeight && dy > 0) { // $('body').height()
	angle=-1*angle;
    }
    if (b.position().top < 0 && dy < 0) {
	angle=-1*angle;
    }

    if (b.position().left < 0 && dx < 0) {
	angle=Math.PI-angle;
    }
    if (b.position().left + b.width() >  window.innerWidth && dx > 0) { // $('body').width()
	angle=Math.PI-angle;
    }
    dy=Math.sin(angle)*Math.sqrt(2);
    dx=Math.cos(angle)*Math.sqrt(2);
    axy=dy;adx=dx;
    if (keep_going) {setTimeout(function() {bounce()}, smooth)}
}

function start_bouncing() {
    if (!keep_going) {
	console.log("comence bouncing");
	b.show()
	keep_going=true;
	speed=START_SPEED;
	angle = Math.random() * 2 * Math.PI;
	dy=Math.sin(angle)*Math.sqrt(2);
	dx=Math.cos(angle)*Math.sqrt(2);
	axy=dy;adx=dx;
	bounce();
    }
}

$('#startBouncing').click(function() {
    $('#stopBouncing').css('background','none');
    $(this).css('background','gold');
    start_bouncing();
})

$('#stopBouncing').click(function() {
    $('#startBouncing').css('background','none');
    $(this).css('background','lightslategrey');
    keep_going = false;
    speedIncreasing=true;
})

function randomTurn(w) {
    r = Math.random()
    angle += r*w - w/2;
    dy=Math.sin(angle)*Math.sqrt(2);
    dx=Math.cos(angle)*Math.sqrt(2);
}
$('#turnBouncer').click(function() {
    angle += Math.PI;
    randomTurn(Math.PI/3);
    old_speed=speed*.8;
    decayBurst();
})
$('#turnBouncer').mousedown(function(){$(this).css('background','lightcoral')})
$('#turnBouncer').mouseup(function(){$(this).css('background','none')})


let old_speed,burst,max_burst;
function growBurst(){
    burst = burst*2;
    speed = old_speed + burst;
    if (speed < max_burst) setTimeout(growBurst,10);
    else decayBurst();
}
function decayBurst(){
    burst = burst *.95;
    speed = old_speed + burst;
    if (speed > old_speed * 1.1) setTimeout(decayBurst,50);
    else console.log("done: speed="+speed+"; burst="+burst+"; max_burst="+max_burst);
}

function startBurst() {
    randomTurn(Math.PI/4);
    old_speed=speed;
    max_burst=speed*3;
    burst=1;
    growBurst();
}

$('#burst').click(startBurst);
$('#burst').mousedown(function(){$(this).css('background','darkseagreen')})
$('#burst').mouseup(function(){$(this).css('background','none')})
