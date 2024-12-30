let result = document.querySelector('#result')
let hideBtn = document.querySelector("button")
let score = JSON.parse(localStorage.getItem('score')) || {  
    win : 0,
    losses : 0,
    ties : 0
}


let computerChoice = () =>{
    let choiceComputer = ''
    let randomChoice = Math.random()

    if(randomChoice>=0 && randomChoice < 1/3){
        choiceComputer = "Rock"
    }
    else if(randomChoice>=1/3 && randomChoice < 2/3){
        choiceComputer = "Paper"
    }
    else if(randomChoice>=2/3 && randomChoice < 1){
        choiceComputer = "Scissors"
    }
    return choiceComputer
}



let userChoice = (userChoice) => {
    let computerMove = computerChoice()
    let moveResult = ''
    if(userChoice === "Rock"){
        if(computerMove === "Rock"){
            moveResult = 'Ties'
            
        }
        else if(computerMove === "Paper"){
            moveResult = 'Win'
            
        }
        else if(computerMove === "Scissors"){
            moveResult = 'Lose'
            
        }
    }
    else if(userChoice === "Paper"){
        if(computerMove === "Paper"){
            moveResult = 'Ties'
            
        }
        else if(computerMove === "Rock"){
            moveResult = 'Win'
            
        }
        else if(computerMove === "Scissors"){
            moveResult = 'Lose'
            
        }
    }
    else if(userChoice === "Scissors"){
        if(computerMove === "Paper"){
            moveResult = 'Win'
            
        }
        else if(computerMove === "Rock"){
            moveResult = 'Lose'
            
        }
        else if(computerMove === "Scissors"){
            moveResult = 'Ties'
            
        }
    }
    if(moveResult === "Win"){
        score.win+=1
    }
    else if(moveResult === "Ties"){
        score.ties+=1
    }
    else if(moveResult === "Lose"){
        score.losses+=1
    }
    localStorage.setItem('score',JSON.stringify(score)) 
    result.innerHTML=`you pick : <img  src="images/${userChoice}.png" />and computer Choice :  <img src="images/${computerMove}.png"  />  <b>Result is </b>  <img src="images/${moveResult}.png"/>`
    updateSocre()
}   
let updateSocre = () =>{
    document.querySelector("#score_display").innerHTML = `Wins : ${score.win} , Losses : ${score.losses} , Ties : ${score.ties}`
   
    console.log(score.win)
    if(score.win > 0 || score.ties > 0 || score.losses > 0){
        
        hideBtn.style.display = 'block'
    }
    
}
if(score.win === 0 && score.ties === 0 && score.losses === 0){
    
    hideBtn.style.display = 'none'
}


let resetButton = () =>{
    score.win = 0
    score.ties = 0
    score.losses = 0
    localStorage.setItem('score',JSON.stringify(score)) //to update score in browser local storage
    if(score.win === 0 && score.ties === 0 && score.losses === 0){
        
        hideBtn.style.display = 'none'
    }
    
    // Refresh the current window
    window.location.reload();



}
updateSocre()
let isAutoPlaying = false
let intervalId;
let autoPlay = () =>{
    if(!isAutoPlaying){
        const playerMove = computerChoice()
        intervalId=setInterval(function(){
            userChoice(playerMove)
        },1000)
        isAutoPlaying = true
    }else{
        clearInterval(intervalId)
        isAutoPlaying = false
    }
    
}