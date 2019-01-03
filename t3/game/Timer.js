
/**
 * left button picking id is 100
 * right button pickin id is 101
 * restart button picking id is 102
 */
class Timer {
    constructor(scene){
        this.scene = scene

        //Rectangle 3d    12x6x3
        this.front = new MyRectangle(this.scene,-6,0,6,6);
        this.side = new MyRectangle(this.scene, -1.5,0,1.5,6); 
        this.top = new MyRectangle(this.scene, -6,-1.5,6,1.5);

        //left timer
        this.digit = new MyRectangle(this.scene, -1.25,0,1.25,5);

        //timer button
        this.leftButton = new MyCylinder(this.scene, 1.4,1.4,1,20,20);
        this.rightButton = new MyCylinder(this.scene, 1.4,1.4,1,20,20);

        //restart button
        this.restartButton = new MyCylinder(this.scene, 1,1,1,20,20);

        this.dummie = new MyRectangle(this.scene, 0,0,0.1,0.1);

        this.isLeftButtonDown = false;
        this.isRightButtonDown = false;
        this.isRestartButtonDown = false;
        this.playingGame = false;

        this.HARD = 3;
        this.MEDIUM = 6;
        this.EASY = 9;
        this.CHALLENGE = 9;

        this.leftBigDigit = this.EASY; 
        this.leftSmallDigit = 0;

        this.rightBigDigit = this.EASY;
        this.rightSmallDigit = 0;

        this.previousTime = 0;

        this.restartButtonAnimation = new AnimationController(this.scene);
        this.leftButtonAnimation = new AnimationController(this.scene);
        this.rightButtonAnimation = new AnimationController(this.scene);
        this.timerLoaded = true;
    }

    /**
     * Resets the timers
     * @param {"left" or "right"} button 
     */
    resetTimer(button){
        //console.log("Reseting " + button)
        let dif = this.scene.graph.game.dificulty
        if(dif == "Challenge"){
            return;
        }
        if(button == "left"){
            if(dif == "Easy"){
                this.leftBigDigit = this.EASY;
            }
            else if(dif == "Medium"){
                this.leftBigDigit = this.MEDIUM;
            }
            else if(dif == "Hard"){
                this.leftBigDigit = this.HARD;
            }
            this.leftSmallDigit = 0;
        }
        else{
            if(dif == "Easy"){
                this.rightBigDigit = this.EASY;
            }
            else if(dif == "Medium"){
                this.rightBigDigit = this.MEDIUM;
            }
            else if(dif == "Hard"){
                this.rightBigDigit = this.HARD;
            }
            
            this.rightSmallDigit = 0;
            //console.log("resetou right")
        }
    }

    changePlayer(){
        if(this.isLeftButtonDown){
            //console.log("clicou no esuqerdo")
            this.isLeftButtonDown = false;
            this.isRightButtonDown = true;
            this.resetTimer("left");
        }
        else{
            //console.log("clicou no direito")            
            this.isLeftButtonDown = true;
            this.isRightButtonDown = false;
            this.resetTimer("right");
        }
    }

    start(){
        let dif = this.scene.graph.game.dificulty   
        if(dif == "Challenge"){
            this.setChallenge();
        }
        else{
            this.resetTimer("left");
            this.resetTimer("right");
        }
        
        this.isRightButtonDown = true;
        this.playingGame = true;
    }

    setChallenge(){
        this.leftBigDigit = this.CHALLENGE;
        this.rightBigDigit = this.CHALLENGE;
        this.leftSmallDigit = 0;
        this.rightSmallDigit = 0;
    }

    restart(){
        let dif = this.scene.graph.game.dificulty   
        if(dif == "Challenge"){
            this.setChallenge();
        }
        else{
            this.resetTimer("left");
            this.resetTimer("right");
        }
        
        this.isLeftButtonDown = false;
        this.isRightButtonDown = false;
        this.isRestartButtonDown = false;
        this.playingGame = false;
    }

    update(currTime){
        var timeElapsed = currTime - this.previousTime;
        if(timeElapsed > 1000){
            this.previousTime = currTime;
            this.decreaseOneSecondOnActive();
        }

        if(this.timerLoaded){
            this.restartButtonAnimation.update(currTime);
            this.leftButtonAnimation.update(currTime);
            this.rightButtonAnimation.update(currTime); 
        }
        
    }

    decreaseOneSecondOnActive(){
        if(this.isLeftButtonDown){
            if(this.leftSmallDigit == 0){
                if(this.leftBigDigit == 0){
                    //GAME OVER BECAUSE TIME IT UP
                    this.playingGame = false;
                    //console.log("White pieces won")
                }else{
                    this.leftBigDigit -= 1;
                    this.leftSmallDigit = 9;
                }
            }
            else{
                this.leftSmallDigit -= 1;
            }
        }

        if(this.isRightButtonDown){
            if(this.rightSmallDigit == 0){
                if(this.rightBigDigit == 0){
                    //GAME OVER BECAUSE TIME IT UP
                    this.playingGame = false;
                    //console.log("Black pieces won");
                }else{
                    this.rightBigDigit -= 1;
                    this.rightSmallDigit = 9;
                }
            }
            else{
                this.rightSmallDigit -= 1;
            }
        }
    }

    display(){
        //front
        this.scene.pushMatrix();
            this.scene.translate(0,0,1.5);
            this.front.display();
        this.scene.popMatrix();

        //back
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0,1,0);
            this.scene.translate(0,0,1.5);
            this.front.display();
        this.scene.popMatrix();

        //bot
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2, 1,0,0);
            this.top.display();
        this.scene.popMatrix();

        //top
        this.scene.pushMatrix();
            this.scene.translate(0,6,0);
            this.scene.rotate(-Math.PI/2, 1,0,0);
            this.top.display();
        this.scene.popMatrix();

        //right
        this.scene.pushMatrix();
            this.scene.translate(6,0,0);
            this.scene.rotate(Math.PI/2, 0,1,0);
            this.side.display();
        this.scene.popMatrix();

        //left
        this.scene.pushMatrix();
            this.scene.translate(-6,0,0);
            this.scene.rotate(-Math.PI/2, 0,1,0);
            this.side.display();
        this.scene.popMatrix();

        this.scene.graph.materials["default"].apply();

        let string;
        //left timer 10's
        this.scene.pushMatrix();
            string = "number" + this.leftBigDigit;
            this.scene.graph.textures[string].bind();
            this.scene.translate(-4.25,0.5,1.55);
            this.digit.display();
        this.scene.popMatrix();

        //left timer 1's
        this.scene.pushMatrix();
            string = "number" + this.leftSmallDigit;
            this.scene.graph.textures[string].bind();
            this.scene.translate(-1.75,0.5,1.55);
            this.digit.display();
        this.scene.popMatrix();

        //left timer 10's
        this.scene.pushMatrix();
            string = "number" + this.rightBigDigit;
            this.scene.graph.textures[string].bind();
            this.scene.translate(1.75,0.5,1.55);
            this.digit.display();
        this.scene.popMatrix();

        //left timer 1's
        this.scene.pushMatrix();
            string = "number" + this.rightSmallDigit;
            this.scene.graph.textures[string].bind();
            this.scene.translate(4.25,0.5,1.55);
            this.digit.display();
        this.scene.popMatrix();

        this.scene.graph.materials["red"].apply();
        //left button
        this.scene.pushMatrix();
            this.scene.translate(-4,6,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(100,this.leftButton);
            this.leftButtonAnimation.apply();
            this.leftButton.display();
        this.scene.popMatrix();

        //right button
        this.scene.pushMatrix();
            this.scene.translate(4,6,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(101,this.rightButton);
            this.rightButtonAnimation.apply();
            this.rightButton.display();
        this.scene.popMatrix();

        this.scene.graph.materials["green"].apply();
        //reset button
        this.scene.pushMatrix();
            this.scene.translate(0,6,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(102,this.restartButton);
            this.restartButtonAnimation.apply();
            this.restartButton.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.registerForPick(200,this.dummie);
            this.dummie.display();
        this.scene.popMatrix();
    }

}