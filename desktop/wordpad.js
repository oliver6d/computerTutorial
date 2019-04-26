
const STAGES = {
	click: {
		title: "Let's try typing",
		help_text: "click the box to start",
		next: "keys",
		// TODO: add a picture
	},keys: {
		title: "Let's try typing",
		help_text: "Press any key to begin." ,
		next: "letters",
		// TODO: add a picture
	},
}

var stage = STAGES.keys;
//changeText(stage.help_text, stage.title);
var success = false;

bkLib.onDomLoaded(function() {
    var myNicEditor = new nicEditor().panelInstance('area1');
    var textarea = document.getElementById("textarea");
    //textarea.focus();
    textarea.innerHTML = "How to use a word processor <br> This is a word processor.  Click here and type some more text:";
	focusclick = textarea.addEventListener('focus', function(ev){
		textarearem
	},false);

    //myNicEditor.nicPanel.findButton('bold').show();
    //myNicEditor.nicPanel.findButton('list-numbered').show();
    //myNicEditor.nicPanel.findButton('bold').hoverOn();
});
//

function{}
//Metro.infobox.create("<p>Lorem Ipsum is simply dummy text...</p>", "alert");