function assert(t){
	if (!t){
		console.log('assertion failed');
	}
};
function TimeTrack(millis){
	this.reset();
	this.remaining=millis;
  this.state = 'pause';
};

TimeTrack.prototype.reset = function(){
	this.pause();
	this.remaining=0;
	this.last_tick = null;
};

TimeTrack.prototype.add_time = function(millis){
	this.remaining = this.remaining + millis;
};
TimeTrack.prototype.play = function(){
	if (this.state != 'play'){
		this.last_tick = (new Date()).getTime();
		this.state = 'play';
		this._schedule();
	}
};
TimeTrack.prototype.pause = function(){
	if (this.state === 'play'){
		this._unschedule();
		var now = (new Date()).getTime();
		var elapsed = now - this.last_tick;
		this.remaining = this.remaining - elapsed;
		this.last_tick = null;
		this.state = 'pause';
	}
};
TimeTrack.prototype._schedule = function(){
	assert(this._interval == null);
	var that = this;
	this._interval = setInterval(function(){that.tick()}, 50);
};
TimeTrack.prototype._unschedule = function(){
	assert(this._interval !== null);
	clearInterval(this._interval);
	this._interval = null;
};
TimeTrack.prototype.tick = function(){
	var now = (new Date()).getTime();
	var elapsed = now - this.last_tick;
	if (elapsed >= this.remaining){
		if (this.timeout_notify){
			this.pause();
			this.timeout_notify()
		}
	}else{
		this.tick_notify(this.remaining - elapsed, this.remaining, this.elapsed)
	}
};
TimeTrack.prototype.on_tick = function(f){
	this.tick_notify = f;	
};
TimeTrack.prototype.on_timeout = function(f){
	this.timeout_notify = f;	
};

$(document).ready(function() {
	var players = [];
	$('.clock').each(function(){
		var t = new TimeTrack(360000);
		players.push(t);
		var that = this;
		t.on_tick( function(remaining) {
			$(that).html(Math.floor((remaining/60000)) + ':' + ((remaining % 60000)/1000).toFixed(1));
			//$('counter').html('hey');
		});
		$(this).parent().click(function(){
			if (t.state == 'play'){
				t.pause();
			}else if (t.state == 'pause'){
				t.play();
			}else{
				console.log('error');
			}
		});
		t.on_timeout(function(){
			$(that).text("Pechaste!!!");
		});		
	});
	$('#reset').click(function(){
		$.each(players, function(){
			this.pause();
			this.reset();
			this.add_time(360000);
		});
		$('.clock').each(function(){
			$(this).html("6:00"); // :D
		})
	});
});


	
