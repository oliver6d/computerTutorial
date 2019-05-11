textarea = document.getElementsByTagName('textarea')[0];
body = document.getElementsByTagName('body')[0];
const title_text = document.getElementById('title_text');
const help_text = document.getElementById('help_text');
const error_text = document.getElementById('error_text');
const buttons = document.getElementById('buttons');
const keyboard_img = document.getElementById('keyboard_img');
const img_caption = document.getElementById('img_caption');
var animating_error = false;

function continue_clicked(){
	window.location.replace("keyboard.html");
}
function practice_clicked(){
	buttons.style.display = "none"
	stage = STAGES.single_click;
	changeText(stage.title, stage.help_text);
	stage_success = false;
}


//TODO: FIX ANIMATIONS
function cursorEmphasis(x, y, ex, ey){
	var cursor = document.getElementById("cursor");
	cursor.setAttribute("style", "top:"+ ey +"px; left:" + ex +"px; opacity: 0.7;");
	cursor.style.transform = 'translate('+(x-ex)+'px, '+(y-ey)+'px)';
	setTimeout(function(){	
		cursor.setAttribute("style", "top:"+ y +"px; left:" + x +"px; opacity: 1; height: 40px");
		setTimeout(function(){
			cursor.setAttribute("style", "top:-20px; left:-20px; opacity: 0;");
			cursor.style.transform = '';
		}, 1500);
	}, 1000);
}

function changeText(new_title, new_help, image, caption){
	title_text.innerHTML = new_title;
	help_text.innerHTML = new_help;
	error_text.innerHTML = "";
	keyboard_img.src = "";
	img_caption.innerHTML = "";


	if(image != undefined){
		keyboard_img.src = "../images/typing/" + image;
	}
	if(caption != undefined){
		img_caption.innerHTML = caption;
	}

}

function errorText(new_error){
	error_text.innerHTML = new_error;
	if(!animating_error){ animating_error = true;
		error_text.classList.add("tada");
		setTimeout(function(){ animating_error = false;
			error_text.classList.remove("tada");
		}, 600);
	}
}

function nextStage(){
	success = false;
	stage = STAGES[stage.next];
	changeText(stage.title, stage.help_text, stage.image, stage.caption);
	if(stage.onStart) stage.onStart();
}

//TODO: add help images??
function checkText(criteria){
	if (Object.entries(criteria).every(
		(each)=>{
			console.log(each);
			if (!each[1]){
				errorText("you need a " + (each[0]=="text"?"bit more":"") + each[0]);
			}
			else return true;
		})){
		nextStage();
	}
}

//TODO: ctrl keys - what are they?
//TODO: how to turn on caps lock
//TODO: link desktop to typing practice (external)
//TODO: quotes
const STAGES = {
	start: {
		next: "click",
	},
	click: {
		image: "keyboard.png",
		title: "Let's try typing",
		help_text: "click in the text box to start",
		next: "letters",
		onStart: function(){
			var listen = textarea.addEventListener('click', function(){
				this.removeEventListener('click',arguments.callee,false);
				nextStage();
			});
		},
		// TODO: gif moving cursor
	}, letters: {
		image: "letters.png",
		title: "Typing letters",
		help_text: "Press any key with a letter." ,
		next:"space",
	}, space: {
		image: "space.png",
		title: "Typing a space",
		help_text: "Use your thumb to press down on the space bar",
		next: "hold",
	}, hold: {
		image: "letters.png",
		title: "Typing repeated letters",
		help_text: "Now hold down a letter key." ,
		next: "backspace",
		// tries typing same letter (not repeating)
	}, backspace: {
		image: "backspace.png",
		title: "Removing letters",
		help_text: "Press \"backspace\" to remove characters." ,
		next: "shift",
	}, shift: {
		image: "shift.png",
		title: "Capital letters (a -> A)",
		help_text: "Hold down the \"shift\" key" ,
		caption: "(either shift key works, choose one)",
		next: "shift2",
		// TODO: gif
		// TODO: time how long they hold it down after
	}, shift2: {
		image: "shift.png",
		title: "Capital letters (a -> A)",
		help_text: "Keep holding down the \"shift\" key and tap on any letter." ,
		caption: "(either shift key works, choose one)",
		shifting: true,
		next: "period",
		// TODO: gif?
	}, period: {
		image: "period.png",
		title: "Punctuation",
		help_text: "Press the period key '.'" ,
		next: "comma",
	}, comma: {
		image: "comma.png",
		title: "Punctuation",
		help_text: "Press the comma key ','" ,
		next: "question",
	}, question: {
		image: "question.png",
		title: "Punctuation",
		help_text: "Press the key with the / and ?" ,
		shifting: true,
		next: "sentence",
		// TODO: "hold down the shift key to get more punctuation"
		// TODO: error, keep holding down the shift key
		// TODO: if /, prompt for ?     if ? prompt for /
	}, sentence: {
		image: "keyboard.png",
		title: "Write a sentence",
		help_text: "Use shift, space, backspace, and punctuation" ,
		next: "number",
		onStart: function(){
			var score = {
				capital: false,
				letter: false,
				space: false,
				punctuation: false,
				backspace: false,
				text: false,
			}
			//TODO: should num letters be greater than 20? Or total characters greater than 30?
			var letters = 0;
			document.addEventListener('keydown', (event) => {
				letters +=1;
				if(letters > 10) score.text = true;
				var keyname = event.key;
				if(keyname==keyname.match("[A-Z]")){
					score.capital = true;
				}
				if(keyname==keyname.match("[a-z]")){
					score.letter = true;
				}
				switch(keyname){
					case " ":
						score.space = true;
						break;
					case "Backspace":
						score.backspace = true;
						break;
					case ".":
					case "?":
					case ",":
					case "!":
					case ":":
					case ";":
						score.punctuation = true;
					default:
				}
				checkText(score);
			}, true);
		},
	}, number: {
		image: "numbers.png",
		title: "Numbers",
		help_text: "Press a number key." ,
		next: "enter",
	}, enter: {
		image: "enter.png",
		title: "New line",
		help_text: "Click the 'enter' or 'return' key on the keyboard" ,
		next: "tab",
	}, tab: {
		image: "tab.png",
		title: "Indent line",
		help_text: "To add multiple spaces, press the 'tab' key" ,
		next: "cursor",
	}, cursor: {
		title: "Move cursor",
		help_text: "Click at the begining of the text" ,
		next: "title",
		onStart: function(){
			var coordinates = {x:0, y:0};
			var mouselisten = document.addEventListener('mousemove', function(e){
				coordinates = {x: e.clientX, y: e.clientY};
			});
			textarea.addEventListener('click', function(){
				if(textarea.selectionStart != textarea.selectionEnd)
					errorText("Do not drag, that will highlight text.");
				else if(textarea.selectionStart == 0){
					this.removeEventListener('click',arguments.callee);
					this.removeEventListener('mousemove',mouselisten);
					nextStage();
				} else{
					errorText("Click at the BEGINNING");
					cursorEmphasis(20,30,coordinates.x, coordinates.y);
				}

			});
			setTimeout(function(){
				cursorEmphasis(20,30,coordinates.x, coordinates.y);
			}, 1000);
		},
		// TODO: gif
		// TODO: explain cursor shape
		// TODO: move cursor with arrow keys
	}, title: {
		title: "Type a Title",
		help_text: "Use capital letters and end with a new line" ,
		next: "highlight",
		onStart: function(){
			var score = {
				capital: false,
				letter: false,
				enter: false,
				text: false,
			}
			var letters = 0;
			document.addEventListener('keydown', (event) => {
				letters +=1;
				if(letters > 5) score.text = true;
				var keyname = event.key;
				if(keyname==keyname.match("[A-Z]")){
					score.capital = true;
				}
				if(keyname==keyname.match("[a-z]")){
					score.letter = true;
				}
				if(keyname=="Enter"){
					score.enter = true;
				}
				checkText(score);
			}, true);
		},
	}, highlight: {
		title: "Highlight text",
		help_text: "Click and drag on text to select it" ,
		next: "copy",
		onStart: function(){
			var listen = textarea.addEventListener('click', function(){
				if(textarea.selectionStart - textarea.selectionEnd > 3){
					this.removeEventListener('click',arguments.callee,false);
					nextStage();
				}
			});
		},
		// TODO: gif
	}, copy: {
		image: "copy.png",
		title: "Copy text",
		help_text: "The 'ctrl' key is used to do actions on highlighted text.  Hold down ctrl and press 'c'" ,
		next: "paste",
		onStart: function(){
			var listen = textarea.addEventListener('copy', function(){
				if(textarea.selectionStart != textarea.selectionEnd){
					this.removeEventListener('click',arguments.callee,false);
					nextStage();
				} else{
					errorText("Your text must still be highlighted!");
				}
			});
		},
	}, paste: {
		image: "paste.png",
		title: "Paste text",
		help_text: "Now click somewhere else.  Then, hold down ctrl and press 'p'" ,
		next: "undo",
		onStart: function(){
			var listen = textarea.addEventListener('paste', function(){
				this.removeEventListener('click',arguments.callee,false);
				nextStage();
			});
		},
		// TODO: check that holding down ctrl, check that new location is selected
	}, undo: {
		image: "undo.png",
		title: "Undo",
		help_text: "Now, hold down 'ctrl' and press 'z'" ,
		next: "last",
		// TODO: check that holding down ctrl, check that new location is selected
	}, last: {
		title: "Great job!",
		help_text: "Now click on the \"next\" button to continue, or \"practice\" to restart." ,
		onStart: function(){
			buttons.style.display = "inline";
		},
	}
	// TODO: scrolling again
}

var stage = STAGES.period;
nextStage();
var success = false;
//TODO: add a variable that keeps track of what's been written on this itteration?

//error: clicking a bunch of keys randomly
document.addEventListener('keyup', (event) => {
	/*if(stage.shifting && !event.shiftKey){
		errorText("Keep holding down shift!!");
	}*/  //THIS has errors before we want the error to pop up.
	/*if(!success){ /// and stages.hold?
		errorText("Hold down the key");
	}*/
}, true);
document.addEventListener('keydown', (event) => {
	var keyname = event.key;
	if (event.repeat && stage!=STAGES.hold && stage!=STAGES.backspace){
		errorText("Tap keys shortly. Holding them down will make more letters.");
	}
	switch(stage){
		case STAGES.keys:
			success = true;
			break;
		case STAGES.letters:
			success = (keyname == keyname.match("[A-Za-z]"));
			break;
		case STAGES.space:
			success = (keyname == " ");	//why was this using regex??
			break;
		case STAGES.hold:
			success = (event.repeat);
			break;
		case STAGES.backspace:
			success = (keyname == "Backspace");
			break;
		case STAGES.shift:
		// check if caps lock is on
			success = (event.shiftKey);
			break;
		case STAGES.shift2:
			success = (keyname == keyname.match("[A-Z]"));
			break;
		case STAGES.period:
			success = (keyname == ".");
			if(keyname == ">"){
				errorText("Do not use shift");
			}
			break;
		case STAGES.comma:
			success = (keyname == ",");
			if(keyname == "<"){
				errorText("Do not use shift");
			}
			break;
		case STAGES.question:
			success = (keyname == "?");
			if(keyname == ">"){
				errorText("You must use shift");
			}
			//TODO: add picture of typical keys with shift values
			break;
			//TODO; just typing numbers wins everything
		case STAGES.number:
			success = (keyname == keyname.match("[0-9]"));
			break;
		case STAGES.enter:
		// TODO: check to see if a full line has been typed yet (wrapped)
		// more than 50 characters -> wrapped
			success = (keyname == "Enter");
			break;
		case STAGES.tab:
			success = (keyname == "Tab");
			break;
		//TODO: tab just leaves the textbox


		//case STAGES.highlight:
		//case STAGES.copy:
		//case STAGES.paste:
		case STAGES.undo:
			success = (event.keycode == 90 && event.ctrlKey);
			break;
		//case STAGES.arrows:
			// "Down", "ArrowDown"
	      	// "Up","ArrowUp":
      		// "Left" "ArrowLeft":
      		// "Right","ArrowRight":

		default:
	}

	if(success){
		nextStage();
	}

}, true);




textarea.onkeydown = function(event) {
	// SUPPORT TAB SPACES
    if (event.keyCode == 9) {
        var newCaretPosition = textarea.selectionStart + 4;
        textarea.value = textarea.value.substring(0, textarea.selectionStart) + "    " 
                + textarea.value.substring(textarea.selectionStart, textarea.value.length);
        textarea.selectionStart = newCaretPosition;
        textarea.selectionEnd = newCaretPosition;
        return false;
    }
    if(event.getModifierState("CapsLock")){
		errorText("caps lock is on, tap caps lock to turn it off");
		// TODO: show caps lock location picture
	}
	if(event.getModifierState("NumLock")){
		errorText("num lock is off, turn it on to type numbers with the numpad");
		// TODO: show caps lock location picture
	}
}