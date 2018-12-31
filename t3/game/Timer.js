
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

        this.isLeftButtonDown = false;
        this.isRightButtonDown = false;
        this.isRestartButtonDown = false;
        this.playingGame = false;

        //TODO change according to dificulty
        this.leftBigDigit = 6; //Game.dificulty.MEDIUM.time;
        this.leftSmallDigit = 0;

        //TODO change this according to dificulty
        this.rightBigDigit = 6;
        this.rightSmallDigit = 0;

        this.previousTime = 0;

        this.restartButtonAnimation = new AnimationController(this.scene);
        this.leftButtonAnimation = new AnimationController(this.scene);
        this.rightButtonAnimation = new AnimationController(this.scene);
        this.timerLoaded = true;
    }

    changePlayer(){
        if(this.isLeftButtonDown){
            this.isLeftButtonDown = false;
            this.isRightButtonDown = true;
            this.rightBigDigit = 6;
            this.rightSmallDigit = 0;
        }else{
            this.isLeftButtonDown = true;
            this.isRightButtonDown = false;
            this.leftBigDigit = 6; //Game.dificulty.MEDIUM.time;
            this.leftSmallDigit = 0;
        }
    }

    start(){
        //TODO change according to dificulty
        this.leftBigDigit = 6; //Game.dificulty.MEDIUM.time;
        this.leftSmallDigit = 0;

        //TODO change this according to dificulty
        this.rightBigDigit = 6;
        this.rightSmallDigit = 0;

        this.isRightButtonDown = true;
        this.playingGame = true;
    }

    restart(){
        //TODO change according to dificulty
        this.leftBigDigit = 6; //Game.dificulty.MEDIUM.time;
        this.leftSmallDigit = 0;

        //TODO change this according to dificulty
        this.rightBigDigit = 6;
        this.rightSmallDigit = 0;
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
                    console.log("White pieces won")
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
                    console.log("Black pieces won");
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
    }

}