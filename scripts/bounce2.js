const g=9;
const MS_PER_FRAME=33.33333;
const START_SPEED=5;
const spinThresh=0.01;

let basic_objects_jq = $('body').children()
let basic_objects = {};
basic_objects_jq.each(function() {
    basic_objects[this.id] = {
	id: this.id,
	speed:0,
	gravSpeed:0,
	angle:0,
	spinSpeed:0,
	spinDecay:0.99,
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
let objects = basic_objects;

let all_objects = {}
crawl($('body').children())
function crawl(collect){
    collect.each(function(){
	if ($(this).position) {
	    all_objects[$(this).id] = $(this)
	    
	    if (!$(this).css('position')) {
		$(this).css('position','relative')
	    }
	}
        kids = $(this).children()
        if (kids.length>0){
            crawl(kids);
        }
    })
}

function default_next_speed(speed,acceleration) {
    return speed
}

let keep_going=false;
let destroy_mode=false;
let super_destroy_mode=false;
let gravity=false;
function animate() {
    let all_stopped=true;
    for (i in objects) {
	o = objects[i]

	// Check for hitting the walls to reflect direction and spin object
	let spinFactor=0;
	if (o.b.position().top + o.b.height() > window.innerHeight && o.dy > 0) { // $('body').height()
	    o.angle=-1*o.angle;
	    spinFactor=Math.cos(o.angle);
	}
	if (o.b.position().top < 0 && o.dy < 0) {
	    o.angle=-1*o.angle;
	    spinFactor=Math.cos(o.angle) * -1;
	}
	if (o.b.position().left < 0 && o.dx < 0) {
	    o.angle=Math.PI-o.angle;
	    spinFactor=Math.sin(o.angle);
	}
	if (o.b.position().left + o.b.width() >  window.innerWidth && o.dx > 0) { // $('body').width()
	    o.angle=Math.PI-o.angle;
	    spinFactor=Math.sin(o.angle) * -1;
	}
	o.spinSpeed+=Math.sqrt(o.speed) * spinFactor

	if (Math.abs(o.spinSpeed) > spinThresh) {
	    o.rotationAngle = (o.rotationAngle + o.spinSpeed*0.5) % 360;
	    o.b.css("transform", "rotate(" + o.rotationAngle + "deg)");
	    o.spinSpeed = o.spinSpeed * o.spinDecay;
	}
	
	// controll speed
	o.speed = o.next_speed(o.speed,o.acc)
	all_stopped = all_stopped && Math.abs(o.speed) < 0.1
	
	// calculate direction
	o.dy=Math.sin(o.angle)*Math.sqrt(2);
	o.dx=Math.cos(o.angle)*Math.sqrt(2);

	let old_y=o.y;
	o.y = o.y + o.dy*(MS_PER_FRAME/100*o.speed);
	o.x = o.x + o.dx*(MS_PER_FRAME/100*o.speed);

	if (gravity) {
	    if (o.b.id == 'bouncer') {
		if(o.b.position().top + o.b.height() <= window.innerHeight) {
		    o.gravSpeed += Math.max(1,Math.abs(o.y - old_y));
		    o.y = o.y + (MS_PER_FRAME/100 * o.gravSpeed);
		}
		else
		{o.gravSpeed=0;
		}
	    }
	    else {
		o.gravSpeed += Math.max(1,Math.abs(o.y - old_y));
		o.y = o.y + (MS_PER_FRAME/100 * o.gravSpeed);
	    }
	}
	
	o.b.css('top',o.y);
	o.b.css('left',o.x);

	
	// Colisions
	i2="bouncer"
	o2=objects[i2];
	if (destroy_mode && i != i2) {
	    if (!o2.overlaping.includes(o.id)) {
		if (checkColiding(o2.b,o.b)) {
		    mass_ratio =  (o.b.height() * o.b.width()) /  (o2.b.height() * o2.b.width())
		    console.log('starting new child on '+this+"with mass ratio"+mass_ratio)
		    o.speed=START_SPEED*100/mass_ratio
		    o.angle += Math.sin(o2.angle)*Math.cos(o2.angle)
		    o.spinSpeed+=Math.sqrt(o.speed) * Math.sin(o.angle) * Math.cos(o.angle);
		    o.next_speed = function(speed, acc) {return Math.max(0,speed - 0.01);}
		    
		}
	    }
	    else {
		if (! checkColiding(o2.b,o.b)) {
		    o2.overlaping.splice(o2.overlaping.indexOf(o.id),1)
		}   
	    }
	}
    }
    
    if (keep_going && !all_stopped) {
	setTimeout(animate, MS_PER_FRAME)}
    else {
	keep_going = false
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
	objects[by_id].next_speed = function(speed,acc) {return speed+0.01};
	objects[by_id].speed=START_SPEED;
	objects[by_id].angle = Math.random() * 2 * Math.PI;
	animate();
    }
}
    
function randomTurn(w) {
    r = Math.random()
    turn = r*w - w/2;
    return turn
}

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

	for (i in objects) {
	    o = objects[i]
	    o.stopping=true;
	    o.next_speed = function(speed,acc){return Math.max(0,speed*(Math.max(0.5,0.97-(speed/350))))}

	}
    }
})
$('#destroy_mode').click(function() {
    if (keep_going || destroy_mode) {
	destroy_mode = !destroy_mode
	if (destroy_mode) $(this).css('background','red')
	else $(this).css('background','none')
    }
    else {
	$('#destroyLabel').text('Turn on Bounce before Destroy Mode')
	setTimeout(function() {
	    $('#destroyLabel').text('')
	}, 5000);
    }
});
$('#gravity').click(function() {
    if (destroy_mode || gravity) {
	gravity=!gravity
	if (gravity) $(this).css('background','mediumaquamarine')
	else $(this).css('background','none')
    }
    else {
	$('#gravityLabel').text('Turn on Destroy Mode before Gravity')
	setTimeout(function() {
	    $('#gravityLabel').text('')
	}, 5000);
    }
});

$('#SUPER_destroy_mode').click(function() {
    super_destroy_mode = !super_destroy_mode
    if (super_destroy_mode) {
	$(this).css('background','red');
	objects=all_objects;
    }
    else {
	$(this).css('background','none');
	objects=basic_objects;
    }
});


let temp_acc = {}
$('#speedUp').click(function() {
    temp_acc['start']=objects['bouncer'].speed
    objects['bouncer'].angle += randomTurn(Math.PI/3.5)
    objects['bouncer'].next_speed  = function(speed, acc) {return speed*1.5}
    setTimeout(function() {
	objects['bouncer'].next_speed = function(speed, acc) {
	    if (objects['bouncer'].speed < temp_acc['start']*1.2)
		objects['bouncer'].next_speed  = function(speed, acc) {return speed+0.01}
	    
	    return speed*.9}
    }, 333)
})
$('#speedUp').mousedown(function(){$(this).css('background','darkseagreen')})
$('#speedUp').mouseup(function(){$(this).css('background','none')})

$('#slowDown').click(function() {
    objects['bouncer'].angle += Math.PI;
    objects['bouncer'].angle += randomTurn(Math.PI/3.5);
    if (objects['bouncer'].speed > 5) {
	temp_acc['start']=objects['bouncer'].speed
	objects['bouncer'].next_speed  = function(speed, acc) {return speed*.8}
	setTimeout(function() {
	    objects['bouncer'].next_speed  = function(speed, acc) {return speed+0.01}
	}, 500)
    }
})
		     
$('#slowDown').mousedown(function(){$(this).css('background','lightcoral')})
$('#slowDown').mouseup(function(){$(this).css('background','none')})

