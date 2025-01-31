let keep_going=false;
let b = $('#bouncer');
let y=0; let x=0;
let dy=1;  let dx=1;
let smooth=10;
const START_SPEED=1;
let speed=START_SPEED;
let angle,ady,adx;
function bounce() {
    y = y + dy*(smooth/100*speed);
    x = x + dx*(smooth/100*speed);
    speed = speed + 0.01
    
    b.css('top',y);
    b.css('left',x);
    
    if (b.position().top + b.height() > window.innerHeight() && dy > 0) { // $('body').height()
	dy=-1 * dy;
	angle=-1*angle;
    }
    if (b.position().top < 0 && dy < 0) {
	dy=-1 * dy;
	angle=-1*angle;
    }

    if (b.position().left < 0 && dx < 0) {
	dx=-1 * dx;
	angle=Math.PI-angle;
    }
    if (b.position().left + b.width() >  window.innerWidth()&& dx > 0) { // $('body').width()
	dx=-1 * dx;
	angle=Math.PI-angle;
    }

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
    $(this).css('background','darkseagreen');
    start_bouncing();
})

$('#stopBouncing').click(function() {
    $('#startBouncing').css('background','none');
    $(this).css('background','lightcoral');
    keep_going = false;
})


$('#turnBouncer').click(function() {
    angle += Math.random()*Math.PI/2 - Math.PI/4;
    dy=Math.sin(angle)*Math.sqrt(2);
    dx=Math.cos(angle)*Math.sqrt(2);
})
$('#turnBouncer').mousedown(function(){$(this).css('background','indianred')})
$('#turnBouncer').mouseup(function(){$(this).css('background','none')})


let old_speed,burst,max_burst;
function growBurst(){
    burst = burst*2;
    speed = old_speed + burst
    if (speed < max_burst) setTimeout(growBurst,10)
    else decayBurst()
}
function decayBurst(){
    burst = burst *.95;
    speed = old_speed + burst
    if (speed > old_speed * 1.1) setTimeout(decayBurst,50)
    else console.log("done: speed="+speed+"; burst="+burst+"; max_burst="+max_burst);
}

function startBurst() {
    old_speed=speed;
    max_burst=speed*3;
    burst=1;
    growBurst();
}

$('#burst').click(startBurst);
$('#burst').mousedown(function(){$(this).css('background','indianred')})
$('#burst').mouseup(function(){$(this).css('background','none')})
