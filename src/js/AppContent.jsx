

import React from "react"
import axios from "axios"


class AppContent extends React.Component {

  constructor(options){
    super(options)
    this.SQUAREDIM = 100
    this.state = {
      gameState: "ready",
      clicks: 1,
      x: 200,
      y: 200,
      startTime: "",
      timeElapsed: 0,
      highScore: null,
      highScores: []
    }
    this.getHighScores()
  }

  render() {
    return (
      <div>
        {this.renderTimeElapsed()}
        {this.renderContents()}
      </div>
    )
  }

  renderContents(){
    if (this.state.gameState == "ready") return this.renderBeginScreen()
    if (this.state.gameState == "playing") return this.renderSquare()
    if (this.state.gameState == "won") return this.renderEndScreen()
  }

  renderEndScreen(){
    const divStyle = {
      position: "absolute",
      "background": "grey",
      width:"200px",
      height:"200px",
      top:"40%",
      left: "50%",
      padding: "10px"
    }

    return(
      <div style={divStyle} >
        <div onClick={this.resetGame}>
          Reset
        </div>

        <div>Time elapsed: {this.renderTimeElapsed()}</div>
        <div>Best Score: {this.formatTime(this.state.highScore)}</div>
        

        {this.renderHighScores()}
      </div>
    )
  }

  renderTimeElapsed() {
    return this.formatTime(this.state.timeElapsed)
  }

  formatTime(time){
    return (time/1000).toFixed(3)
  }
  
  renderBeginScreen() {
    const divStyle = {
      position: "absolute",
      "background": "grey",
      width:`200px`,
      height:`200px`,
      top:"40%",
      left: "50%",
      padding: "10px"
    }
    return (
      <div style={divStyle} onClick={this.begin}>
        Start the game
        {this.renderHighScores()}
      </div>
    )
  }

  renderHighScores(){
    return (
      <div>
        High Scores:
        <div>
          {this.state.highScores.map(function(score, index) {
            return (
              <div key={index}>
                <span >{index+1}. </span>
                <span>{score.score}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  renderSquare() {
    const divStyle = {
      position: "absolute",
      "background": "#86e0a7",
      width:`${this.SQUAREDIM}px`,
      height:`${this.SQUAREDIM}px`,
      top:this.state.y,
      left: this.state.x,
      "fontSize": "40px",
      color: "white",
      "textAlign": "center"
    }
    return (
      <div style={divStyle} onClick={this.clickSuccess}>
        {10-this.state.clicks}
      </div>
    )
  }

  clickSuccess = () => {
    var clicks = this.state.clicks + 1
    var randomX = Math.max(Math.random()* window.innerWidth - this.SQUAREDIM,0)
    var randomY = Math.max(Math.random() * window.innerHeight - this.SQUAREDIM,0)
    this.setState({
      clicks:clicks,
      x: randomX,
      y: randomY
    })
    if (clicks == 10) this.endGame()
  }

  endGame = () => {
    this.postScore(this.state.timeElapsed/1000)
    if (this.state.highScore === null || 
        this.state.timeElapsed < this.state.highScore) {
          this.setState({
            highScore: this.state.timeElapsed
          })
        }
    clearInterval(this.timer)
    this.setState({
      gameState:"won"
    })
  }
  

  begin = () =>{
    this.timer = setInterval(this.changeTime.bind(this), 10)
    this.setState({
      gameState: "playing",
      startTime: Date.now()
    })
  }

  resetGame = () => {
    this.setState({
      gameState: "ready",
      clicks: 1
    })
  }

  changeTime = () => {
    this.setState({
      timeElapsed: Date.now() - this.state.startTime
    })
  }

  postScore(score){
    const thisApp = this;
    axios.post("https://desolate-spire-43036.herokuapp.com/postScore", {
      score: score
    }).then(
      thisApp.getHighScores()
    )
  }

  getHighScores(){
    const thisApp = this;
    axios.get("https://desolate-spire-43036.herokuapp.com/highScores").then(function(response) {
      thisApp.setHighScores(response.data)
    })
  }

  setHighScores(scores){
    this.setState({
      highScores: scores
    })
  }
}

export default AppContent