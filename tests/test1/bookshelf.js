let out = {}
$('.book').click(function() {
    if (out[this.id]) {
	$(this).css('top','0px')
	$(this).css('left','0px')
	out[this.id] = false;
    } else {
	$(this).css('top','231px')
	$(this).css('left','66px')
	out[this.id] = true;
    }
});

let x=0;
$('.shelf').children().each(function() {
    $(this).css('z-index',x-1)
    $(this).css('background','rgb('+(110+(x+30)^2)+','+(40-1*x)+','+(217+2*x)+')')
    $(this).children().each(function() {
	console.log(this);
	$(this).css('background','rgb('+(110+(x+30)^2)+','+(40-1.5*x)+','+(217+2*x)+')')
	if (this.className == 'front') {
	    $(this).css('z-index',x-1)
	}
	else {
	    $(this).css('z-index',x-2)
	     }
	
	});
    x -= 10;
});
