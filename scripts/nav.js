$('.navI').click(function() {
    var mine = this.id.split('~')[1];
    $('.post').hide()
    $('#'+mine).show()
})

$('#viewAll').click(function() { $('.post').show() } )
$('#hideAll').click(function() { $('.post').hide() } )

$('.post').hide()

$('.post').each(function() {
    if (window.location.href.split('#')[1] == this.id) {$('#'+this.id).show()}
})
