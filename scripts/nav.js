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

$('.post').hide()

$('.post').each(function() {
    if (window.location.href.split('#')[1] == this.id) {$('#'+this.id).show()}
})

if (window.location.href.includes('viewAll')
    $('.post').show()
