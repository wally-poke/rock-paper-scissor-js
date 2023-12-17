// Get the button from player
const goalScore = 5

function randomOpponentMove() {
    let possibleOpponentMove = ["paper","scissor","rock"]
    var maxIndex = possibleOpponentMove.length
    var moveIndex = Math.floor(Math.random() * maxIndex);
    return possibleOpponentMove[moveIndex];
    }

// Function to determine the winner
function getPlayerWinStatus(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
      return "tie";
    } else if (
      (userChoice === "rock" && computerChoice === "scissor") ||
      (userChoice === "paper" && computerChoice === "rock") ||
      (userChoice === "scissor" && computerChoice === "paper")
    ) {
      return "win";
    } else {
      return "lose";
    }
  }

  // Before : The score is updated while the animation is playing, so, we migrate to the next function
// function addAnimationClass(element,classList){
//     /**
//      * Add classList to element class, and automatically remove after the animation ends
//      * Arguments
//      * 1. element : an element which will add the animation classList to
//      * 2. ClassList : a list of class name which related to property animation 
//      */
//     element.classList.add(...classList)
//     alert("Check 1")

//     element.addEventListener("animationend", function(){
//         element.classList.remove(...classList)
//     }) 
// }

function resetGame(){
    /**
     * Reset score of the game
     */
    playerScore = document.querySelector("#player-score")
    opponentScore = document.querySelector("#opponent-score")

    playerScore.textContent = 0
    opponentScore.textContent = 0
}

function addSyncAnimationClass(element, classList) {
    return new Promise(resolve => {
        element.classList.add(...classList);

        element.addEventListener("animationend", function handler() {
            element.classList.remove(...classList);
            element.removeEventListener("animationend", handler);
            resolve();
        });
    });
}

function addGeneralClass(element, classList) {
    element.classList.add(...classList);
    setTimeout(()=>element.classList.remove(...classList),300)
}

function playSoundFromMoveName(moveName){
    // Select sound file from key  
    switch (moveName){
        case "paper":
            sound_file = "./sounds/paper.mp3"
            break
        case "scissor":
            sound_file = "./sounds/scissor.mp3"
            break
        case "rock":
            sound_file = "./sounds/rock.mp3"
            break
        default:
            sound_file = null
    }
    if (sound_file != null){
        var audio = new Audio(sound_file)
        audio.play()}
}

function playSoundFromWinStatus(moveName){
    // Select sound file from key  
    switch (moveName){
        case "win":
            sound_file = "./sounds/small-win.wav"
            break
        case "lose":
            sound_file = "./sounds/small-lose.mp3"
            break
        default:
            sound_file = null
    }
    if (sound_file != null){
        var audio = new Audio(sound_file)
        audio.play()}
}

// Declare element
var selectButtons = document.querySelectorAll(".select-button")
selectButtons.forEach(function(btn){
    btn.addEventListener("click", handleMoveClick)
})

async function handleMoveClick(){

    document.querySelector("#display-text").style.visibility = "hidden"
    // Get the current state 
    var playerScore = document.querySelector("#player-score")
    var opponentScore = document.querySelector("#opponent-score")

    // Get the player move and remove # front of id
    var playerMove = this.id
    var opponentMove = randomOpponentMove()

    // Retrieve the current state
    var playerMoveImage = document.querySelector("#player-move-image")
    var opponentMoveImage = document.querySelector("#opponent-move-image")
    
    // Play Sound
    playSoundFromMoveName(playerMove)
    playerMoveImage.setAttribute("src","./images/"+playerMove+".png")
    opponentMoveImage.setAttribute("src","./images/"+opponentMove+".png")

    // Disable all button 
    selectButtons.forEach(function(btn){
        btn.toggleAttribute("disabled");
    })

    // Allow these animation of two animation run asynchonously

    await Promise.all([
        addSyncAnimationClass(playerMoveImage, ["animate__animated", "animate__slideInLeft"]),
        addSyncAnimationClass(opponentMoveImage, ["animate__animated", "customAnimate__slideInRightWithRotate"])
    ]);

    // Do not run this until the animation ends
    var playerStatus = getPlayerWinStatus(playerMove,opponentMove)
    
    var displayText = ""
    switch (playerStatus){
        case "win":
            playerScore.textContent = parseInt(playerScore.textContent) + 1
            displayText = "🥳 You win !"

            // Add the temporary color of circle
            var winnerCircle = document.querySelectorAll(".score-container > .circle")[0]
            addGeneralClass(winnerCircle,["green"])
            break
        case "lose":
            opponentScore.textContent = parseInt(opponentScore.textContent) + 1
            displayText = "😢 You lose !"

            var winnerCircle = document.querySelectorAll(".score-container > .circle")[1]
            addGeneralClass(winnerCircle,["red"])
            break
        case "tie":
            displayText = "😐 It's tie !"
    }
    
    playSoundFromWinStatus(playerStatus)

    document.querySelector("#display-text").textContent = displayText
    document.querySelector("#display-text").style.visibility = "visible"
    
    // Toggle back after finished
    selectButtons.forEach(function(btn){
        btn.toggleAttribute("disabled");
    })

    // Check the ending of the game 
    playerScore_ = playerScore.textContent
    opponentScore_ = opponentScore.textContent
    if (playerScore_ == goalScore ||
        opponentScore_ == goalScore){
            // Pop up the game over Pop up
            if (playerScore_ > opponentScore_){
                var result = `🥳 You Win ${playerScore_}-${opponentScore_} 🥳`
            }
            else{
                var result = `😢 You Lose ${playerScore_}-${opponentScore_} 😢`
            }
            
            document.querySelector(".popup h2").textContent = result
            window.location.href = "#popup1";
            resetGame()
            //resetGame()
            
    }
}
