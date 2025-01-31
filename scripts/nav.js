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

let b = $('#bouncer')
async function bounce(top, right) {
    right = right + 1;
    top = top + 1;
    b.css('right',right);
    b.css('left',top);
    console.log("top"+top);
    console.log("right"+right);
    setTimeout(function() {bounce(top,right)}, 100);
}
function start_bouncing() {
    console.log("comence bouncing");
    b.show()
    bounce(0,0);
}
setTimeout(start_bouncing, 5000);
