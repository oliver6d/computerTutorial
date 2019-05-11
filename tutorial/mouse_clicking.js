// This is my mouse_clicking js file

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d'); 

const title_text = document.getElementById('title_text');
const help_text = document.getElementById('help_text');
const error_text = document.getElementById('error_text');
const buttons = document.getElementById('buttons');

//TODO: change cursor on draging element
//TODO: add scrolling

buttons.style.display = "none"
function continue_clicked(){
	window.location.replace("typing.html");
}
function practice_clicked(){
	buttons.style.display = "none"
	stage = STAGES.single_click;
	changeText(stage.help_text, stage.title);
	stage_success = false;
}

function changeText(new_help, new_title){
	help_text.innerHTML = new_help;
	if(new_title != undefined){
		title_text.innerHTML = new_title;
		error_text.innerHTML = "";
	}
}
function errorText(new_error){
	error_text.innerHTML = new_error;
}

function getColor(old){
	do{
		color = "hsl("+ Math.ceil(Math.random()*10) * 36 + ",80%,50%)";
	} while (color == old);
	return color;
}

// Determine if a point is inside the shape's bounds
function contains(mx, my, rect) {
	// Area between shape's X and (X + Width) and its Y and (Y + Height)
	return  (rect.x <= mx) && (rect.x + rect.w >= mx) &&
	(rect.y <= my) && (rect.y + rect.h >= my);
}

function getMouse(e, drag, old_mouse){
	if (drag == undefined) drag = {x:0, y:0};
	var new_mouse = {
		x: e.pageX - clickOffset.x - (drag.x || 0), 
		y: e.pageY - clickOffset.y - (drag.y || 0)
	}
	if (old_mouse != undefined){
		drag_distance += Math.sqrt(
			Math.pow(new_mouse.x - old_mouse.x, 2) + Math.pow(new_mouse.y - old_mouse.y, 2));
	}
	return new_mouse;
}

//TODO: check when this is being invalidated
// if our state is invalid, redraw and validate!	
setInterval(function draw() {
	if (!valid) {
		ctx.font = "60px Verdana";
		ctx.textAlign = "center"; 
		ctx.fillText("Click on the shapes", window.innerWidth/2, 100);

		var shape = rectangle;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = shape.fill;
		ctx.fillRect(shape.x, shape.y, shape.w, shape.h);

		valid = true;

		/* if (this.selection != null) {	// outline
			ctx.strokeStyle = '#cc0000';
			ctx.lineWidth = this.selectionWidth;
			var mySel = this.selection;
			ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
		} */			
	}
}, 30);


var rectangle = {
	x:200, y:200,
	w:100, h:100,
	fill:getColor()
}
var shapes = [rectangle];
var mouse = {x: 0, y: 0};
var clickOffset = {x:0, y:0}; // if canvas had padding around it
var dragOffset = {x:0, y:0}; // Where in shape clicked
var dragging = false; // Keep track of when we are dragging
var drag_distance = 0;
var selection = null;	// Current selected object
var valid = false; // when set to false, the canvas will redraw everything

const STAGES = {
	single_click: {
		title: "Click on the box",
		help_text: "Move your cursor over the box, then press the left button on the mouse with your index finger and release." },
	double_click: {
		title: "Double click the box",
		help_text: "Press the left button on the mouse twice quickly" },
	right_click: {
		title: "Right click the box",
		help_text: "Press the right button on your mouse once" },
	drag: {
		title: "Drag the box",
		help_text: "Click and hold on the box.  While pressing, move your mouse to drag." },
		// THREE WAYS.  double tap.  press down.  two fingers
	next: {
		title: "Great job!",
		help_text: "Now click on the \"next\" button to continue, or \"practice\" to restart." },
}
	// TODO: scrolling
var stage = STAGES.single_click;
var stage_success = false;
var fail_reason = "";


//fixes a problem where double clicking causes text to get selected on the canvas
canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
canvas.addEventListener('contextmenu', function(e) {
	// Error: right clicking
	if (stage != STAGES.right_click){
		stage_success = false;
		errorText("That was a RIGHT click.");
		// TODO: calls single click right after right click
	}
}, true);
canvas.addEventListener('dblclick', function(e) {
	double_clicking = false;

	// Error: double clicking
	if (stage != STAGES.double_click){
		stage_success = false;
		errorText("That was a DOUBLE click.");
	}
	// Error: moving during double click
	else if (drag_distance > 100){
		stage_success = false;
		errorText("Your mouse moved during those clicks. Hold it firmly in place.");
	}
}, true);
canvas.addEventListener('click', function(e) {
	// Error: moving mouse during click
	if (stage == STAGES.single_click || stage == STAGES.double_click || stage == STAGES.right_click	){
		if (drag_distance > 120){
			stage_success = false;
			errorText("That was dragging. Do not move your mouse during the click.");
		} else if (drag_distance > 75){
			stage_success = false;
			errorText("Your mouse moved during that click. Hold it firmly in place.");
		}
	}

	// Error: left clicking
	if (stage == STAGES.right_click){
		stage_success = false;
		errorText("That was a left click.");
	}

	if(stage == STAGES.drag){
		// Error: not moving
		if(drag_distance < 200){
			stage_success = false;
			errorText("You need to move your mouse to drag the box.");
		}

		// Error: moving after clicking
		drag_distance = 0;
		setTimeout(function(){ 
			if(drag_distance > 200){
				stage_success = false;
				errorText("You must hold the button down while dragging.  Keep pressing with your finger until the object is moved.");
			}
		}, 750);
	}
}, true);
canvas.addEventListener('mouseup', function(e) {
	clicking = false;
	dragging = false;
	mouse = getMouse(e);

	// Changes Color
	for (var i = shapes.length-1; i >= 0; i--) {
		if (contains(mouse.x, mouse.y, shapes[i])) {
			shapes[i].fill = getColor(shapes[i].fill);
			valid = false;
			return;
		}
	}
	if (stage != STAGES.next) {
		// Error: not clicking inside of an object
		errorText("Click on the colored box.");
	}
	stage_success = false;
}, true);
onMoveClick = function(){ 
	stage_success = false;
	errorText("Your mouse moved during that click. Hold it firmly in place.");
};
canvas.addEventListener('mousemove', function(e) {
	mouse = getMouse(e, dragOffset, mouse)
	
	// Error:  moving the mouse before you click
	canvas.addEventListener('mousedown', onMoveClick);
	setTimeout(function(){ 
		canvas.removeEventListener('mousedown', onMoveClick);
	}, 30);

	// if drag
	if (dragging){
		selection.x = mouse.x;
		selection.y = mouse.y;   
		valid = false; // Something's dragging so we must redraw
	}
}, true);
canvas.addEventListener('mousedown', function(e) {
	mouse = getMouse(e);
	drag_distance = 0;

	// Timer to detect errors or success
	stage_success = true;
	setTimeout(function(){ 
		if(stage_success){
			switch(stage){
				//TODO: dragging was valid
				case STAGES.single_click:
					stage = STAGES.double_click;
					break;
				case STAGES.double_click:
					stage = STAGES.right_click;
					break;
				case STAGES.right_click:
					stage = STAGES.drag;
					break;
				case STAGES.drag:
				//TODO: continued to next without dragging!
					stage = STAGES.next;
			    	buttons.style.display = "inline";
					break;
				case STAGES.next:
					console.log("error, pass next?");
				// TODO: error message appear (move click, double click) - should they?
			}
			changeText(stage.help_text, stage.title);
			stage_success = false;
		}
	}, 700);

	// Error: click lasting too long
	clicking = true;
	setTimeout(function(){ 
		if(stage == STAGES.click && clicking){
			stage_success = false;
			errorText("That click lasted too long, they should be very fast.");
		}
	}, 500);

	// Error: double click lasting too long
	double_clicking = true;
	setTimeout(function(){ 
		if(stage == STAGES.double_click && double_clicking){
			stage_success = false;
			errorText("Those clicks were too slow.  Your clicks must be very fast, with no pause between.");
			// TODO: calls single click right after right click
		}
	}, 500);

	// What is being clicked?
	for (var i = shapes.length-1; i >= 0; i--) {
		if (contains(mouse.x, mouse.y, shapes[i])) {
			var mySel = shapes[i];
			dragOffset = {x: mouse.x - mySel.x,  y: mouse.y - mySel.y};
			dragging = true;
			selection = mySel;
			valid = false;
			return;
		}
	}
}, true);
