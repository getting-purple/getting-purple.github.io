const MS_PER_FRAME=33.33333;

run_bouncing_ball('#bouncer');
function run_bouncing_ball(jq_string, smooth=MS_PER_FRAME, START_SPEED=5, angle='none', destroy_mode=false, spinThresh=0.01, spinDecay=0.99) {
    let keep_going=false;
    let b = $(jq_string);
    let y=0; let x=0;
    let dy=1;  let dx=1;
    let speed=START_SPEED;
    let ady,adx;
    let speedIncreasing=true;
    let spinSpeed=0;
    let rotationAngle=0;
    let stopping=false;
    let running_children = [];
    let overlaping = [];
    
    console.log('start new run with '+jq_string+'\nspeed='+speed+'\nangle='+angle)
    
    function bounce() {
	//handle speed and direction
	y = y + dy*(smooth/100*speed);
	x = x + dx*(smooth/100*speed);
	if (jq_string == '#bouncer') {
	    if (!stopping) {
		if (speedIncreasing) {
		    speed = speed + 0.01;
		    if (speed > 250) speedIncreasing=false;
		} else {
		    speed = speed - 0.005;
		    if (speed < 5) speedIncreasing=true;
		    
		}
	    } else {
		speed = speed*(Math.max(0.5,0.97-(speed/350)))
	    }
	} else {
	    speed = speed * 0.99999
	    if (speed < 0.01) keep_going=false;
	}
	b.css('top',y);
	b.css('left',x);

	
	if (b.position().top + b.height() > window.innerHeight && dy > 0) { // $('body').height()
	    angle=-1*angle;
	    spinSpeed+=Math.sqrt(speed) * Math.cos(angle);
	    spin();
	    
	}
	if (b.position().top < 0 && dy < 0) {
	    angle=-1*angle;
	    spinSpeed+=Math.sqrt(speed) * Math.cos(angle) * -1;
	    spin();
	}

	if (b.position().left < 0 && dx < 0) {
	    angle=Math.PI-angle;
	    spinSpeed+=Math.sqrt(speed) * Math.sin(angle);
	    spin();
	}
	if (b.position().left + b.width() >  window.innerWidth && dx > 0) { // $('body').width()
	    angle=Math.PI-angle;
	    spinSpeed+=Math.sqrt(speed) * Math.sin(angle) * -1;
	    spin();
	}
	dy=Math.sin(angle)*Math.sqrt(2);
	dx=Math.cos(angle)*Math.sqrt(2);
	axy=dy;adx=dx;
	if (stopping && speed <= 0.1) {//stop
	    keep_going=false;
	    speed_increasing=true;
	    stopping=false;
	}

	// Colisions
	if (jq_string == '#bouncer') {
	    if (destroy_mode) {
		$('.post').each(function() {
		    if (!overlaping.includes(this)) {
			if (checkColiding(b,$(this))) {
			    mass_ratio =  ($(this).height() * $(this).width()) /  (b.height() * b.width())
			    console.log('starting new child on '+this+"with mass ratio"+mass_ratio)
			    run_bouncing_ball(this, MS_PER_FRAME * 2, speed * 100/mass_ratio, angle,true);
			    running_children = running_children.concat(this)
			    overlaping = overlaping.concat(this)
			}
		    }
		    else {
			if (! checkColiding(b,$(this))) {
			    overlaping = overlaping.splice(l.indexOf('b'),1)
			}   
		    }
		});
	    }
	    
	    if (keep_going) {setTimeout(function() {bounce()}, smooth)}
	    else {console.log('stopping bouncing for '+jq_string)}
	}
	else {
	    if (keep_going && destroy_mode) {setTimeout(function() {bounce()}, smooth)}
	    else {console.log('stopping bouncing for '+jq_string)}
	}
    }

    function start_bouncing() {
	if (!keep_going) {
	    console.log("comence bouncing");
	    b.show()
	    keep_going=true;
	    speed=START_SPEED;
	    if (angle == 'none')
		angle = Math.random() * 2 * Math.PI;
	    dy=Math.sin(angle)*Math.sqrt(2);
	    dx=Math.cos(angle)*Math.sqrt(2);
	    axy=dy;adx=dx;
	    bounce();
	}
    }

    function spin() {
	if (Math.abs(spinSpeed) > spinThresh) {
	    rotationAngle = (rotationAngle + spinSpeed*0.5) % 360;
	    b.css("transform", "rotate(" + rotationAngle + "deg)");
	    spinSpeed = spinSpeed * spinDecay;
	    setTimeout(spin, 10)
	}
    }
    
    function randomTurn(w) {
	r = Math.random()
	angle += r*w - w/2;
	dy=Math.sin(angle)*Math.sqrt(2);
	dx=Math.cos(angle)*Math.sqrt(2);
    }

    
    let old_speed,burst,max_burst;
    function growBurst(){
	burst = burst*2;
	speed = old_speed + burst;
	if (speed < max_burst) setTimeout(growBurst,10);
	else decayBurst();
    }

    function decayBurst(){
	burst = burst *.95;
	speed = old_speed + burst;
	if (speed > old_speed * 1.1) setTimeout(decayBurst,50);
	else console.log("done: speed="+speed+"; burst="+burst+"; max_burst="+max_burst);
    }
    
    function startBurst() {
	randomTurn(Math.PI/4);
	old_speed=speed;
	max_burst=1500-(400000/(speed+266.67))
	burst=1;
	growBurst();
    }

    // Collisions
    function checkColiding(ball,region) {
	if (ball.css('display') == 'none' || region.css('display') == 'none') return false;
	return 	(ball.offset().left + ball.width() > region.offset().left &&
		 ball.offset().left < region.offset().left + region.width()
		) && (
		    ball.offset().top + ball.height() > region.offset().top &&
			ball.offset().top < region.offset().top + region.height() )
    }


    // Buttons
    $('#stopBouncing').click(function() {
	if (keep_going) {
	    $('#startBouncing').css('background','none');
	    $(this).css('background','lightslategrey');
	    stopping=true
	}
    })
    
    if (jq_string == '#bouncer') { //code for the bouncing ball only
	$('#startBouncing').click(function() {
	    running_children = [];
	    if (!keep_going) {
		$('#stopBouncing').css('background','none');
		$(this).css('background','gold');
		start_bouncing();
	    }
	})
	
	// The button on the left ____ (slow down and reverse bouncer)
	$('#turnBouncer').click(function() {
	    angle += Math.PI;
	    randomTurn(Math.PI/3);
	    old_speed=speed*.8;
	    decayBurst();                   })
	$('#turnBouncer').mousedown(function(){$(this).css('background','lightcoral')})
	$('#turnBouncer').mouseup(function(){$(this).css('background','none')})
	
	// The button on the right ----- (push along bouncer)
	$('#burst').click(startBurst);
	$('#burst').mousedown(function(){$(this).css('background','darkseagreen')})
	$('#burst').mouseup(function(){$(this).css('background','none')})

	$('#destroy_mode').click(function() {
	    destroy_mode = !destroy_mode
	    if (destroy_mode) $(this).css('background','red')
	    else $(this).css('background','none')
	});
	$('#clearAll').click(function() {
	    running_children = [];
	});
    }
    else { //code for all the other objects only
	$('#destroy_mode').click(function() {
            destroy_mode = false
        });
	
	// starting via collision!
	console.log('rogue start! bounce on!')
	console.log(jq_string);
        start_bouncing();
    }
}
