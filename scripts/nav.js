$('.navI').click(function() {
    var mine = this.id.split('~')[1];
    $('.post').hide()
    $('#'+mine).show()
    $('#'+mine).css('transform','rotate(0deg)')
    $('#'+mine).css('position','initial')
    
    $('.navI').css('background','none')
    if (this.id.includes('button~')) {    
        $(this).css('background','darkseagreen')
    }

    
})

$('#viewAll').click(function() {
    $('.post').show()
    $('.post').css('transform','rotate(0deg)')
    $('.post').css('position','initial')
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
