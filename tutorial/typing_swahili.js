textarea = document.getElementsByTagName('textarea')[0];
body = document.getElementsByTagName('body')[0];
const title_text = document.getElementById('title_text');
const help_text = document.getElementById('help_text');
const error_text = document.getElementById('error_text');
const buttons = document.getElementById('buttons');
const keyboard_img = document.getElementById('keyboard_img');
const img_caption = document.getElementById('img_caption');
var animating_error = false;

//IDEA: They have to type a sentence, highlighting letters as they type.  Explain when they pause.
//IDEA: list of lessons, they choose which one.
//IDEA: progress bar
//IDEA: take a break when people would rather type 

function practice_clicked(){
	buttons.style.display = "none"
	stage = STAGES.single_click;
	changeText(stage.title, stage.help_text);
	stage_success = false;
}

function cursorEmphasis(x, y, ex, ey){
	var cursor = document.getElementById("cursor");
	cursor.setAttribute("style", "top:"+ ey +"px; left:" + ex +"px; opacity: 1;");
	cursor.style.transform = 'translate('+(x-ex)+'px, '+(y-ey)+'px)';
	setTimeout(function(){	
		setTimeout(function(){
			cursor.style.transform = '';
			cursor.setAttribute("style", "opacity: 0;");
		}, 1000);
	}, 1000);
}

function changeText(new_title, new_help, image, caption){
	title_text.innerHTML = new_title;
	help_text.innerHTML = new_help;
	error_text.innerHTML = "";
	keyboard_img.src = "";
	img_caption.innerHTML = "";
	if(image != undefined){
		keyboard_img.src = image;
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
		}, 1000);
	}
}

function nextStage(){
	success = false;
	stage = STAGES[stage.next];
	changeText(stage.title, stage.help_text, stage.image, stage.caption);
	if(stage.onStart) stage.onStart();
}

function checkText(criteria){
	if (Object.entries(criteria).every(
		(each)=>{
			if (!each[1]){
				//errorText("you need a " + (each[0]=="text"?"bit more":"") + each[0]);
				errorText("you need a " + (each[0]=="text"?"bit more":"") + each[0]);
			}
			else return true;
		})){
		nextStage();
	}
}

const STAGES = {
	start: {
		next: "click",
	},
	click: {
		image: "../images/typing/keyboard.png",
		//title: "Let's type!",
		//help_text: "click in the text box to start",
		title: "Andika!",
		help_text: "Ili uanze bonyeza sehemu ya kuandikia",
		next: "letters",
		onStart: function(){
			var listen = textarea.addEventListener('click', function(){
				this.removeEventListener('click',arguments.callee,false);
				nextStage();
			});
		},
	}, letters: {
		image: "../images/typing/letters.png",
		//title: "Typing letters",
		//help_text: "Press any key with a letter." ,
		title: "Andika maneno",
		help_text: "Bonyeza kitufe chenye herufi." ,
		next:"space",
	}, space: {
		image: "../images/typing/space.png",
		//title: "Typing a space",
		//help_text: "Use your thumb to press down on the space bar",
		title: "Acha nafasi",
		help_text: "Tumia kidole gumba kubonyeza kitufe cha kuacha nafasi",
		next: "backspace",
	}, backspace: {
		image: "../images/typing/backspace.png",
		//title: "Removing letters",
		//help_text: "Press \"backspace\" to remove characters." ,
		title: "Futa maandishi",
		help_text: "Bonyeza \"backspace\"." ,
		next: "shift",

//TODO: explain shift, gif

	}, shift: {
		image: "../images/typing/shift.png",
		//title: "Capital letters (a -> A)",
		//help_text: "Hold down the \"shift\" key" ,
		title: "Herufi kubwa (a -> A)",
		help_text: "Shikilia \"shift\"" ,
		caption: "(shiftkey zote zinafanya, kazi chagua moja)",
		next: "shift2",
	}, shift2: {
		image: "../images/typing/shift.png",
		//title: "Capital letters (a -> A)",
		//help_text: "Keep holding down the \"shift\" key and tap on any letter." ,
		title: "Herufi kubwa (a -> A)",
		help_text: "Shikilia \"shift\" na ubonyeze kitufe chenye herufi" ,
		caption: "(shiftkey zote zinafanya, kazi chagua moja)",
		shifting: true,
		next: "period",
	}, period: {
		image: "../images/typing/period.png",
		//title: "Punctuation",
		//help_text: "Press the period key '.'" ,
		title: "Vituo vya uandishi",
		help_text: "Bonyeza '.'" ,
		next: "comma",
	}, comma: {
		image: "../images/typing/comma.png",
		//title: "Punctuation",
		//help_text: "Press the comma key ','" ,
		title: "Vituo vya uandishi",
		help_text: "Bonyeza ','" ,
		next: "question",
	}, question: {
		image: "../images/typing/question.png",
		//title: "Advanced Punctuation",
		//help_text: "Hold shift and then press ?" ,
		title: "Vituo vya uandishi",
		help_text: "Shikilia shift na ubonyeze ?" ,
		shifting: true,
		next: "number",

		// TODO: dialog? "hold down the shift key to get more punctuation"
		// TODO: error, keep holding down the shift key
		// TODO: if /, prompt for ?     if ? prompt for /
		// TODO: insert picture of key

	}, sentence: {
		image: "../images/typing/keyboard.png",
		//title: "Write a sentence",
		//help_text: "Use shift, space, backspace, <br> and punctuation" ,
		title: "Andika sentensi",
		help_text: "Leo ni siku nzuri." ,
		next: "number",
		onStart: function(){
			var score = {
				capital: false,
				letter: false,
				space: false,
				punctuation: false,
				backspace: false,
				text: false,
				enter: true,
			}
			var letters = 0;
			document.addEventListener('keydown', function() {
				//TOFIX: error for what is missing
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
					case "Enter":
						score.enter = true;
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
				if(checkText(score)){
					this.removeEventListener('keydown',arguments.callee,false);
				};
			}, true);
		},
	}, number: {
		image: "../images/typing/numbers.png",
		//title: "Numbers",
		//help_text: "Press a number key." ,
		title: "namba",
		help_text: "Bonyeza kitufe chenye namba." ,
		next: "enter",
	}, enter: {
		image: "../images/typing/enter.png",
		//title: "New line",
		//help_text: "Click the 'enter' or 'return' key on the keyboard" ,
		title: "Mstari mpya",
		help_text: "Bonyeza 'enter' au 'return'" ,
		next: "tab",
	}, tab: {
		image: "../images/typing/tab.png",
		//title: "Indent line",
		//help_text: "To add multiple spaces, press the 'tab' key" ,
		title: "nafasi nyingi",
		help_text: "bonyeza 'tab'" ,
		next: "highlight",

//TODO: explain, gif with highlighting text, copy, click, paste

	}, highlight: {
		image: "../images/trackpad/click_drag.gif",
		//title: "Highlight text",
		//help_text: "Click and drag on text to select it" ,
		title: "Highlight ujumbe",
		help_text: "Bonyeza na ubebe sentesi ili kuichagua" ,
		next: "copy",
		onStart: function(){
			document.addEventListener('click', function(){
		//TODO: error, not clicking where text is
				if (textarea.selectionEnd - textarea.selectionStart > 3){
					this.removeEventListener('click',arguments.callee,false);
					nextStage();
				} else if (textarea.selectionStart == textarea.selectionEnd) {
					//errorText("Move the mouse while clicking");
					errorText("unatakiwa usogeze mshale ukuukiwa unabonyeza");
				}
			});
		},
	}, copy: {
		image: "../images/typing/copy.png",
		//title: "Copy text",
		//help_text: "The 'ctrl' key is used to do actions on highlighted text.  Hold down ctrl and press 'c'" ,
		title: "Rudi (copy)",
		help_text: "Shikilia 'ctrl' na ubonyeze 'c'" ,
		next: "cursor",
		onStart: function(){
			var listen = textarea.addEventListener('copy', function(){
				if(textarea.selectionStart != textarea.selectionEnd){
					this.removeEventListener('copy',arguments.callee,false);
					nextStage();
				} else{
					//errorText("Your text must still be highlighted!");
					errorText("Your text must still be highlighted!");
				}
			});
		},
	}, cursor: {
		//title: "Move cursor",
		//help_text: "Click at the start of your text, so that we can insert text there." ,
		title: "peleka mshale",
		help_text: "Bonyeza mwanzo wa sentensi, ili uweke sentensi" ,
		next: "paste",
		onStart: function(){
			var coordinates = {x:500, y:500};
			var mouselisten = document.addEventListener('mousemove', function(e){
				coordinates = {x: e.clientX, y: e.clientY};
			});
			textarea.addEventListener('click', function(){
				if(textarea.selectionStart != textarea.selectionEnd)
					//errorText("Do not drag, that will highlight text.");
					errorText("usisogeze ukiwa unabonyeza");
				else if(textarea.selectionStart == 0){
					this.removeEventListener('click',arguments.callee);
					this.removeEventListener('mousemove',mouselisten);
					nextStage();
				} else{
					//errorText("Click at the BEGINNING");
					errorText("Bonyeza mwanzoni");
					cursorEmphasis(20,50,coordinates.x, coordinates.y);
				}

			});
			setTimeout(function(){
				cursorEmphasis(20,50,coordinates.x, coordinates.y);
			}, 1000);
		},
	}, paste: {
		image: "../images/typing/paste.png",
		//title: "Paste text",
		//help_text: "Hold down ctrl and press 'v'" ,
		title: "Rudi (paste)",
		help_text: "Shikilia 'ctrl' na ubonyeze 'v'" ,
		next: "last",
		onStart: function(){
			var listen = textarea.addEventListener('paste', function(){
				this.removeEventListener('paste',arguments.callee,false);
				nextStage();
			});
		},
	}, 
	//TODO: should enter go here?
	undo: {
		image: "../images/typing/undo.png",
		//title: "Undo",
		//help_text: "Now, hold down 'ctrl' and press 'z'" ,
		title: "Futa",
		help_text: "Shikilia 'ctrl' na ubonyeze 'z'" ,
		next: "last",
		onStart: function(){
			var listen = textarea.addEventListener('undo', function(){
				this.removeEventListener('undo',arguments.callee,false);
				nextStage();
			});
		},
	}, last: {
		//title: "Great job!",
		//help_text: "Now click on the \"next\" button to continue, or \"practice\" to restart." ,
		title: "Bomba Bomba!",
		help_text: "chagua unachotaka" ,
		onStart: function(){
			buttons.style.display = "inline";
		},
	}

//TODO: undo
}

var stage = STAGES.start;
nextStage();
var success = false;

document.addEventListener('keyup', (event) => {
	if(stage == STAGES.shift2 && !event.shiftKey){
		//errorText("Keep holding down shift!!");
		errorText("Endelea kushikilia shift!!");
	}
}, true);
document.addEventListener('keydown', (event) => {
	var keyname = event.key;
	if (event.repeat && keyname == keyname.match("[A-Za-z]")){
		//errorText("Tap keys shortly to avoid repeating letters");
		errorText("TBonyeza polepole kuepuka kurudia herufi");
	}
	switch(stage){
		case STAGES.keys:
			success = true;
			break;
		case STAGES.letters:
			success = (keyname == keyname.match("[A-Za-z]"));
			break;
		case STAGES.space:
			success = (keyname == " ");
			break;
		case STAGES.backspace:
			success = (keyname == "Backspace");
			break;
		case STAGES.shift:
			success = (event.shiftKey);
			break;
		case STAGES.shift2:
			success = (keyname == keyname.match("[A-Z]"));
			break;
		case STAGES.period:
			success = (keyname == ".");
			if(keyname == ">"){
				//errorText("Do not use shift");
				errorText("Usitumie shift");
			}
			if(keyname == ","){
				//errorText("That is a comma, period is the key next to comma");
				errorText("Hiyo ni comma");
			}
			break;
		case STAGES.comma:
			success = (keyname == ",");
			if(keyname == "<"){
				//errorText("Do not use shift");
				errorText("Usitumie shift");
			}
			if(keyname == "."){
				//errorText("That is a period, comma is the key next to period");
				errorText("Hiyo ni period");
			}
			break;
		case STAGES.question:
			success = (keyname == "?");
			if(keyname == ">"){
				//errorText("You must use shift");
				errorText("lazima utumie shift");
			}
			//TODO: add picture of typical keys with shift values
			break;
		case STAGES.number:
			success = (keyname == keyname.match("[0-9]"));
			break;
		case STAGES.enter:
			success = (keyname == "Enter");
			break;
		case STAGES.tab:
			success = (keyname == "Tab");
			break;
		case STAGES.copy:
		case STAGES.paste:
		case STAGES.undo:
			if (!event.ctrlKey){
				//errorText("You must hold down ctrl");
				errorText("Lazima ushikilie ctrl");
			}
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
		errorText("CapsLock MAKES ALL LETTERS BIG. <br> Press CapsLock to turn it off, and use shift instead.");
		// TODO: explain caps lock, the light, show picture
		// TODO: remove caps lock error when it is turned off
	}
	if(event.getModifierState("NumLock")){
		errorText("num lock is off, turn it on to type numbers with the numpad");
	}
}