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

        this.leftBigDigit = 1;
        this.leftSmallDigit = 0;

        this.rightBigDigit = 2;
        this.rightSmallDigit = 5;
    }

    restart(){
        
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
            this.leftButton.display();
        this.scene.popMatrix();

        //right button
        this.scene.pushMatrix();
            this.scene.translate(4,6,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(101,this.rightButton);
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
    }

}