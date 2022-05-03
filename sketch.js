let subway;
let restaurant;
let panel;
let truman;
let nancy;
let chatBubble;
let chatBubbleFlipped;

let walkingRight;
let walkingLeft;
let currentGif;

let sidewalkNoise;
let subwayNoise;
let currentAudio;

let vtfont;
let mapX;
let bgWidth = 900;
let chatWidth = 400;
let width = bgWidth + chatWidth;
let height = 600;

let bot = new RiveScript(); //new bot
let submitBttn, inputField;
let instruct = "Use the left and right arrow keys to move around and explore."
let response = "This is Truman Lam, third-generation owner of Jing Fong Restaurant. Say 'Hi Truman' to start a conversation.";

let myVoice = new p5.Speech();

function preload() {
  subway = loadImage('images/canal pixel.png');
  restaurant = loadImage('images/jingfong pixel.png');
  panel = loadImage('images/panel.png');
  truman = loadImage('images/truman lam.png');
  nancy = loadImage('images/nancy wang yuen.png');
  chatBubble = loadImage('images/chat bubble.png');
  chatBubbleFlipped = loadImage('images/chat bubble flipped.png');
  walkingRight = loadImage('images/walking right.gif');
  walkingLeft = loadImage('images/walking left.gif');
  vtfont = loadFont('VT323-Regular.ttf');
  sidewalkNoise = loadSound('audio/chinatown sidewalk.mp3');
  subwayNoise = loadSound('audio/subway station.mp3');

  bot.loadFile("bot.txt").then(loaded).catch(error);
}

function setup() {
  createCanvas(width, height);
  mapX = bgWidth/3;

  currentGif = walkingRight;
  currentAudio = sidewalkNoise;
  currentAudio.play();

  inputField = createInput();
  inputField.position(bgWidth + 40, 500);
  inputField.size(chatWidth - 70, 100);
  inputField.style('font-size', '20px');

  submitBttn = createButton("Send");
  submitBttn.position(bgWidth + 40, 500 + inputField.height + 20);
  submitBttn.mousePressed(chat);
  submitBttn.style('background-color', '#f5edba');
  submitBttn.style('border', '5px solid #d26471');
  submitBttn.style('color', '#9d303b');
  submitBttn.style('font-size', '24px');
  submitBttn.style('font-family', '"VT323", monospace');

  myVoice.setRate(1.3);
  myVoice.setVoice("Alex");
  myVoice.speak(instruct);
  myVoice.speak(response);

}

function draw() {
  background(128);
  fill(255);

  // display background and player
  if (mapX < bgWidth) {
    myVoice.setVoice("Alex");
    currentAudio = sidewalkNoise;
    image(restaurant, 0, 0, bgWidth, height);

    imageMode(CENTER);
    image(truman, bgWidth/2 + 20, height - 150);
    image(currentGif, mapX, height - 100, 150, 150);

    if (abs(bgWidth/2 + 20 - mapX) < 100) {
      image(chatBubble, bgWidth/2 + 200, height - 245, 250, 100);
      textAlign(CENTER);
      fill(157,48,59);
      text("Chat with me!", bgWidth/2 + 75, height - 250, 250);
      textAlign(LEFT);
    }

    imageMode(CORNER);
    
  } else {
    myVoice.setVoice("Fiona");
    currentAudio = subwayNoise;
    image(subway, 0, 0, bgWidth, height);
    imageMode(CENTER);
    image(nancy, bgWidth - 100, height - 150, 200, 300);
    image(currentGif, mapX - bgWidth, height - 100, 150, 150);

    if (abs(bgWidth - 100 - (mapX - bgWidth)) < 100) {
      image(chatBubbleFlipped, bgWidth/2 + 140, height - 245, 250, 100);
      textAlign(CENTER);
      fill(157,48,59);
      text("Chat with me!", bgWidth/2 + 20, height - 250, 250);
      textAlign(LEFT);
    }

    imageMode(CORNER);
    
  }

  // movement w arrow keys
  if (keyIsDown(LEFT_ARROW) && mapX > 25) {
    currentGif = walkingLeft;
    currentGif.play()
    mapX -= 5;
    if (mapX == bgWidth) {
      response = "This is Truman Lam, third-generation owner of Jing Fong Restaurant. Say 'Hi Truman' to start a conversation.";
    }
  } else if (keyIsDown(RIGHT_ARROW) && mapX < bgWidth * 2 - 25) {
    currentGif = walkingRight;
    currentGif.play();
    mapX += 5;
    if (mapX == bgWidth) {
      response = "This is Nancy Wang Yuen, an author and sociology professor specializing in Asian American representation in Hollywood. Say 'Hi Nancy' to start a conversation.";
    }
  } else {
    currentGif.pause();
  }

  // chat window
  image(panel, bgWidth, 0, 400, height);

  // display response
  fill(157,48,59);
  textSize(24);
  textLeading(24);
  textFont(vtfont);
  text (response, bgWidth + 50, 65, chatWidth - 85);
}

function chat() {
  let input = inputField.value();
  inputField.value('');
  bot.reply("local-user", input).then(respond);
}
function respond(reply) {
  response = reply;
  myVoice.speak(reply);
}
function loaded() {
  console.log("Chatbot ready!");
  bot.sortReplies(); // You must sort the replies before trying to fetch any!
}
function error(error) {
  console.log("There is an error.");
  console.log(error);
}

function keyPressed(){
  if (keyCode===ENTER){
    chat();
  }
}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}