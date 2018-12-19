

import React from "react"

class AppContent extends React.Component {

  constructor(options){
    super(options)
    var hi = this;
    this.SQUAREDIM = 100
    this.state = {
      gameState: "ready",
      clicks: 1,
      x: 200,
      y: 200,
      startTime: "",
      timeElapsed: 0,
      highScore: null
    }
    this.scores = []
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
    return(
      <div>
        <div>Time elapsed: {this.renderTimeElapsed()}</div>

        <div>Best Score: {this.formatTime(this.state.highScore)}</div>
        <div onClick={this.resetGame}>
          Restart
        </div>
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
      width:"100px",
      height:"100px",
      top:"50%",
      left: "50%"
    }
    return (
      <div style={divStyle} onClick={this.begin}>
      Start the game
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
      "font-size": "40px",
      color: "white",
      "text-align": "center"
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
    this.scores.push(this.state.timeElapsed)
    console.log(this.scores)
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


}

export default AppContent