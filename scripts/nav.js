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
let b = $('#bouncer')
function bounce(top, left,dy,dx,smooth,speed) {
    top = top + dy*(smooth*speed);
    left = left + dx*(smooth*speed);
    speed = speed + 0.1
    
    b.css('top',top);
    b.css('left',left);
    
    if (b.position().top + b.height() > window.innerHeight) {dy=-1}
    if (b.position().top < 0) {dy=1}

    if (b.position().left < 0) {dx=1}
    if (b.position().left + b.width() > window.innerWidth) {dx=-1}

    console.log("  top: "+top);
    console.log("left: "+left);
    if (keep_going) {setTimeout(function() {bounce(top,left,dy,dx,smooth,speed)}, 100*smooth)}
}
function start_bouncing() {
    console.log("comence bouncing");
    b.show()
    if (keep_going)
	bounce(0,0,1,1,.1,1);
    else {
	keep_going = true;
	bounce(b.position().top,
	       b.position().left,
	       1,1,.1,1);
    }
}
$('#startBouncing').click(function() {
    $(this).css('background','darkseagreen');
    start_bouncing();
})

$('#stopBouncing').click(function() {
    $('#startBouncing').css('background','none');
    keep_going = false;
})
