const MS_PER_FRAME=33.33333;
const START_SPEED=5;
const spinThresh=0.01;

let objects_jq = $('body').children()
let objects = {};
objects_jq.each(function() {
    objects[this.id] = {
	id: this.id,
	speed:0,
	angle:0,
	spinSpeed:0,
	spinDecay:0.99
	rotationAngle:0,
	b:$(this),
	speedIncreasing:true,
	stopping:false,
	running_children: [],
	overlaping: [],
	x: $(this).offset().left,
	y: $(this).offset().top,
	dy: 0, dx: 0,
	next_speed: default_next_speed,
	acc:{}
    }
})
function default_next_speed(speed,acceleration) {
    return speed + 0.1
}

let keep_going=false;
let destroy_mode=false;


function animate() {
    for (i in objects) {
	o = objects[i]

	// Check for hitting the walls to reflect direction and spin object
	let spinFactor=0;
	if (o.b.position().top + o.b.height() > window.innerHeight && o.dy > 0) { // $('body').height()
	    o.angle=-1*o.angle;
	    spinFactor=Math.cos(o.angle);
	}
	if (b.position().top < 0 && o.dy < 0) {
	    o.angle=-1*o.angle;
	    spinFactor=Math.cos(o.angle) * -1;
	}
	if (b.position().left < 0 && o.dx < 0) {
	    o.angle=Math.PI-o.angle;
	    spinFactor=Math.sin(o.angle);
	}
	if (b.position().left + b.width() >  window.innerWidth && o.dx > 0) { // $('body').width()
	    o.angle=Math.PI-o.angle;
	    spinFactor=Math.sin(o.angle) * -1;
	}
	o.spinSpeed+=Math.sqrt(o.speed) * spinFactor

	if (Math.abs(o.spinSpeed) > spinThresh) {
	    o.rotationAngle = (o.rotationAngle + o.spinSpeed*0.5) % 360;
	    b.css("transform", "rotate(" + rotationAngle + "deg)");
	    o.spinSpeed = o.spinSpeed * o.spinDecay;
	}
	
	// controll speed
	if (!stopping) {
	    o.speed = o.next_speed(o.speed,o.acc)
	} else {
	    o.speed = o.speed*(Math.max(0.5,0.97-(o.speed/350)))
	}
	
	// calculate direction
	o.dy=Math.sin(angle)*Math.sqrt(2);
	o.dx=Math.cos(angle)*Math.sqrt(2);

	o.y = o.y + o.dy*(MS_PER_FRAME/100*speed);
	o.x = o.x + o.dx*(MS_PER_FRAME/100*speed);
	
	o.b.css('top',o.y);
	o.b.css('left',o.x);

	
	// if (o.speed <= 0.1) {//stop
	//     o.speed_increasing=true;
	//     o.stopping=false;
	// }
	
	// Colisions
	if (o.id == 'bouncer') {
	    if (destroy_mode) {
		for (i2 in objects) {
		    o2=objects[i2];
		    if (o2.id != o.id && !o.overlaping.includes(o2.id)) {
			if (checkColiding(o.b,o2.b)) {
			    mass_ratio =  (o2.b.height() * o2.b.width()) /  (o.b.height() * o.b.width())
			    console.log('starting new child on '+this+"with mass ratio"+mass_ratio)
			    o2.speed=START_SPEED*100/mass_ratio
			    o2.spinSpeed+=Math.sqrt(o2.speed) * Math.sin(o2.angle) * Math.cos(o2.angle);
			    ///
			    // run_bouncing_ball(o2.b, MS_PER_FRAME * 2, speed * 100/mass_ratio, angle,true);
			    // o.running_children = o.running_children.concat(this)
			    // o.overlaping = o.overlaping.concat(this.id)
			}
		    }
		    else {
			if (! checkColiding(o.b,o2.b)) {
			    o.overlaping.splice(o.overlaping.indexOf(o2.id),1)
			}   
		    }
		});
	}
	
	if (keep_going) {
	    setTimeout(animate, MS_PER_FRAME)}
    }
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

//
function start_bouncing(by_id) {
    if (!keep_going) {
	console.log("comence bouncing");
	$('#'+by_id).show()
	keep_going=true;
	objects[by_id].speed=START_SPEED;
	if (angle == 'none')
	    objects[by_id].angle = Math.random() * 2 * Math.PI;
	animate();
    }
}
    
function randomTurn(w) {
    r = Math.random()
    new_angle += r*w - w/2;
    return new_angle
}

    
// let old_speed,burst,max_burst;
// function growBurst(){
//     burst = burst*2;
//     speed = old_speed + burst;
//     if (speed < max_burst) setTimeout(growBurst,10);
//     else decayBurst();
// }

// function decayBurst(){
//     burst = burst *.95;
//     speed = old_speed + burst;
//     if (speed > old_speed * 1.1) setTimeout(decayBurst,50);
//     else console.log("done: speed="+speed+"; burst="+burst+"; max_burst="+max_burst);
//     }

// function startBurst() {
//     randomTurn(Math.PI/4);
//     old_speed=speed;
//     max_burst=1500-(400000/(speed+266.67))
// 	burst=1;
//     growBurst();
// }
/////////////
$('#startBouncing').click(function() {
    if (!keep_going) {
	$('#stopBouncing').css('background','none');
	$(this).css('background','gold');

	start_bouncing('bouncer');
    }
})
$('#stopBouncing').click(function() {
    if (keep_going) {
	$('#startBouncing').css('background','none');
	$(this).css('background','lightslategrey');

	for (i in objects) objects[i].stopping=true
    }
})
$('#destroy_mode').click(function() {
    destroy_mode = !destroy_mode
    if (destroy_mode) $(this).css('background','red')
    else $(this).css('background','none')
});



// Buttons

// if (jq_string == '#bouncer') { //code for the bouncing ball only
    
//     // The button on the left ____ (slow down and reverse bouncer)
//     $('#slowDown').click(function() {
// 	angle += Math.PI;
// 	randomTurn(Math.PI/3);
// 	if (speed > 5)
// 	    old_speed=speed*.8;
// 	decayBurst();                   })
//     $('#slowDown').mousedown(function(){$(this).css('background','lightcoral')})
//     $('#slowDown').mouseup(function(){$(this).css('background','none')})
    
//     // The button on the right ----- (push along bouncer)
//     $('#speedUp').click(startBurst);
//     $('#speedUp').mousedown(function(){$(this).css('background','darkseagreen')})
//     $('#speedUp').mouseup(function(){$(this).css('background','none')})

//     $('#clearAll').click(function() {
// 	running_children = [];
//     });
// }
// else { //code for all the other objects only
//     $('#destroy_mode').click(function() {
//         destroy_mode = false
//     });
    
//     // starting via collision!
//     console.log('rogue start! bounce on!')
//     console.log(jq_string);
//     spinSpeed+=Math.sqrt(speed) * Math.sin(angle) * Math.cos(angle);
//     spin();
//     start_bouncing();
// }
// }
