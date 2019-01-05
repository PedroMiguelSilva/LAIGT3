
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

        this.isLeftButtonUp = false;
        this.isRightButtonUp = false;
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
        
        this.dificulties = {
            EASY : "Easy",
            MEDIUM : "Medium",
            HARD : "Hard",
            CHALLENGE : "Challenge"
        }

        this.buttons = {
            LEFT : "left",
            RIGHT : "right"
        }
        
        this.timerLoaded = true;
    }

    /**
     * Resets the timers
     * @param {"left" or "right"} button 
     */
    resetTimer(button){
        let dif = this.scene.graph.game.dificulty
        if(dif == this.dificulties.CHALLENGE){
            return;
        }
        if(button == this.buttons.LEFT){
            if(dif == this.dificulties.EASY){
                this.leftBigDigit = this.EASY;
            }
            else if(dif == this.dificulties.MEDIUM){
                this.leftBigDigit = this.MEDIUM;
            }
            else if(dif == this.dificulties.HARD){
                this.leftBigDigit = this.HARD;
            }
            this.leftSmallDigit = 0;
        }
        else{
            if(dif == this.dificulties.EASY){
                this.rightBigDigit = this.EASY;
            }
            else if(dif == this.dificulties.MEDIUM){
                this.rightBigDigit = this.MEDIUM;
            }
            else if(dif == this.dificulties.HARD){
                this.rightBigDigit = this.HARD;
            }
            
            this.rightSmallDigit = 0;
        }
    }

    /**
     * Change the player playing
     */
    changePlayer(){
        if(this.isLeftButtonUp){
            this.isLeftButtonUp = false;
            this.isRightButtonUp = true;
            this.resetTimer(this.buttons.RIGHT);
        }
        else{          
            this.isLeftButtonUp = true;
            this.isRightButtonUp = false;
            this.resetTimer(this.buttons.LEFT);
        }
    }

    /**
     * Start the timer
     */
    start(){
        let dif = this.scene.graph.game.dificulty   
        if(dif == this.dificulties.CHALLENGE){
            this.setChallenge();
        }
        else{
            this.resetTimer(this.buttons.LEFT);
            this.resetTimer(this.buttons.RIGHT);
        }
        
        
        this.isRightButtonUp = true;
        this.playingGame = true;
    }

    /**
     * Set values to challenge
     */
    setChallenge(){
        this.leftBigDigit = this.CHALLENGE;
        this.rightBigDigit = this.CHALLENGE;
        this.leftSmallDigit = 0;
        this.rightSmallDigit = 0;
    }

    /**
     * Restart the timer
     */
    restart(){
        let dif = this.scene.graph.game.dificulty   
        if(dif == this.dificulties.CHALLENGE){
            this.setChallenge();
        }
        else{
            this.resetTimer(this.buttons.LEFT);
            this.resetTimer(this.buttons.RIGHT);
        }
        
        this.isLeftButtonUp = false;
        this.isRightButtonUp = false;
        this.isRestartButtonDown = false;
        this.playingGame = false;
    }

    /**
     * Update the timer
     */
    update(currTime){
        var timeElapsed = currTime - this.previousTime;
        if(timeElapsed > 1000){
            this.previousTime = currTime;
            this.decreaseOneSecondOnActive();
        }
    }

    /**
     * Decrease one second on timer
     */
    decreaseOneSecondOnActive(){
        if(this.isLeftButtonUp){
            if(this.leftSmallDigit == 0){
                if(this.leftBigDigit == 0){
                    this.playingGame = false;
                }else{
                    this.leftBigDigit -= 1;
                    this.leftSmallDigit = 9;
                }
            }
            else{
                this.leftSmallDigit -= 1;
            }
        }

        if(this.isRightButtonUp){
            if(this.rightSmallDigit == 0){
                if(this.rightBigDigit == 0){
                    this.playingGame = false;
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

    /**
     * Displays the timer
     */
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
            this.scene.translate(-4,5.2,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(100,this.leftButton);
            if(this.isLeftButtonUp){
                this.scene.translate(0,0,0.8);
            }
            this.leftButton.display();
        this.scene.popMatrix();

        //right button
        this.scene.pushMatrix();
            this.scene.translate(4,5.2,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(101,this.rightButton);
            if(this.isRightButtonUp){
                this.scene.translate(0,0,0.8);
            }
            this.rightButton.display();
        this.scene.popMatrix();

        this.scene.graph.materials["green"].apply();
        //reset button
        this.scene.pushMatrix();
            this.scene.translate(0,6,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(102,this.restartButton);
            this.restartButton.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.registerForPick(200,this.dummie);
            this.dummie.display();
        this.scene.popMatrix();
    }

}