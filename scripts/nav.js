$('.navI').click(function() {
    var mine = this.href.split('#')[1];
    $('.post').hide()
    $('#'+mine).show()
})

$('#viewAll').click(function() { $('.post').show() } )



