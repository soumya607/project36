//Create variables here
var dogIMG,happyDogIMG,milkIMG,bedIMG,washIMG,garIMG;
var btnFeed, btnAddFeed;
var foodS,foodstock,database;
var milkx=107;
var milky=370;
var currenttime;
var lastFed;

function preload()
{
  //load images here
  dogIMG=loadImage("images/dogImg.png")
  happydogIMG=loadImage("images/dogImg1.png")
  milkIMG=loadImage("images/Milk.png")
  bedIMG=loadImage("images/BedRoom.png")
  garIMG=loadImage("images/Garden.png")
  washIMG=loadImage("images/WashRoom.png")

}

var gameState ;

function setup() 
{
	createCanvas(800, 550);
  rectMode(CENTER);
  database = firebase.database();

  btnFeed = createButton("feed the dog");
  btnFeed.position(900,105);
  btnFeed.mousePressed(writeStock)

  btnAddFeed = createButton("Add the feed");
  btnAddFeed.position(750,105);
  btnAddFeed.mousePressed(addFeed)

  dog = createSprite(720, 340, 10,10);
	dog.addImage(dogIMG)
  dog.scale=0.2

  foodstock = database.ref('food');
  foodstock.on("value",readStock );
  database.ref("gameState").on("value",function(data){
    gameState = data.val();
  })

  fedTime=database.ref('lastfeed');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

}


function draw() 
{  
  background(46,139,87)
  //display()
  drawSprites();
    
  //add styles here
  textSize(15);
  fill("black");
  stroke("black")
  
  text("Food Left : " + foodS , 305,25)
  text("Last Feed : " + lastFed , 205, 65)
  
  if(gameState != "hungry"){
    btnFeed.hide();
    btnAddFeed.hide();
    dog.remove();
  }else {
    btnFeed.show()
    btnAddFeed.show();
    dog.addImage(dogIMG);
    
  }
  currenttime = hour()
 if (currenttime=== (lastFed +1)){
 update("playing");
 imageMode(CENTER)
 image(garIMG,400,225,800,550)
 }else if(currenttime==lastFed +2){
 update("sleeping");
 imageMode(CENTER)
 image(bedIMG,400,225,800,550)
 }else if(currenttime > lastFed +2 && currenttime<= lastFed + 4){
   update("bath")
   imageMode(CENTER)
  image(washIMG,400,225,800,550)
 }else{
  update("hungry");
  imageMode(CENTER)
  display()
 }
}

function update(state){
database.ref("/").update({
  gameState: state 
})
}


function readStock(data)
{
  foodS = data.val();
}

//function to write values in DB
function writeStock()
{
   if(foodS <= 0)
   {
     foodS = 0;
   }else{
     foodS=foodS-1;
   }
 

   dog.addImage(happydogIMG);
   dog.scale = 0.2

  database.ref('/').update({
    food:foodS,

    lastfeed: hour()
  })


}

function addFeed()
{
  if(foodS < 30)
  {

    dog.addImage(dogIMG);
    dog.scale = 0.2

    database.ref('/').update({
      food:foodS + 1,
    })

   }
}

function display(){
var x = 80, y = 100;

  if(foodS != 0){
     for (var i = 0 ; i < foodS ; i++){
       
      if(i%10 ==0){
       x = 80;
       y = y + 50;
       }
       image(milkIMG,x, y,50,50)
       x = x+30
     }
  }
} 