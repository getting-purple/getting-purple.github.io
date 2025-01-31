$('.navI').click(function() {
    var mine = this.id.split('~')[1];
    $('.post').hide()
    $('#'+mine).show()

    $('.navI').css('background','none')
    if (this.id.includes('button~')) {    
        $(this).css('background','darkseagreen')
    }

    
})

$('#viewAll').click(function() {
    $('.post').show()
    $(this).css('background','darkseagreen')
})
$('#hideAll').click(function() {
    $('.post').hide()
    $(this).css('background','lightslategrey')
} )

$('a').attr('target', function() {
  if(this.host == location.host) return '_self'
  else return '_blank'
})

let keep_going=true;
let b = $('#bouncer');
let y=0; let x=0;
let dy=1;  let dx=1;
let smooth=10;
const START_SPEED=1;
let speed=START_SPEED;
function bounce() {
    y = y + dy*(smooth/100*speed);
    x = x + dx*(smooth/100*speed);
    speed = speed + 0.01
    
    b.css('top',y);
    b.css('left',x);
    
    if (b.position().top + b.height() > $('body').height()) {dy=-1}
    if (b.position().top < 0) {dy=1}

    if (b.position().left < 0) {dx=1}
    if (b.position().left + b.width() > $('body').width()) {dx=-1}

    if (keep_going) {setTimeout(function() {bounce()}, smooth)}
}
function start_bouncing() {
    console.log("comence bouncing");
    b.show()
    keep_going = true;
    speed=START_SPEED;
    bounce();
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
    burst=1
    growBurst()
}

$('#burst').click(startBurst);
$('#burst').mousedown(function(){$(this).css('background','indianred')})
$('#burst').mouseup(function(){$(this).css('background','none')})
