let out = false;
$('.book').click(function() {
if (out) {
     $(this).css('top','0px')
     $(this).css('z-index','9')
    out = false;
} else {
     $(this).css('top','150px')
     $(this).css('left','40x')
     $(this).css('z-index','10')
    out = true;
}
})
