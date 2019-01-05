/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        //this.gui = new dat.GUI();
        this.gui = new dat.GUI( { autoPlace: true, width: 500 } );

        // add a group of controls (and open/expand by defult)
        this.processKeyboard = function(){};

        
        

        return true;
    }

    addOptions(){
        this.opt = this.gui.addFolder("Options");
        var modes = ["Human vs Human", "Human vs Bot", "Bot vs Bot", "Movie"]
        this.opt.open();
        let controller = this.opt.add(this.scene.graph.game,'mode',modes).name("Game mode");
        var self = this;
        controller.onFinishChange(
            function(value){
                if(value == "Movie"){
                   self.scene.graph.game.playMovie(); 
                }
            }
        )
        var difs = ["Easy", "Medium", "Hard", "Challenge"];
        var difControl  = this.opt.add(this.scene.graph.game,'dificulty',difs).name("Dificulty");
        var self = this;
        difControl.onFinishChange(
            function(value){
                self.scene.graph.game.timer.restart();
            }
        )

        this.opt.add(this.scene.graph.game,'speed', 1,10).step(0.5).name("Speed");
    }

    addInformation(){
        this.info = this.gui.addFolder("Information");
        this.info.open();
        this.info.add(this.scene.graph.game,'currentState').name("State").listen();
        this.info.add(this.scene.graph.game, 'resultString').name("Result").listen();
    }

    addGraphics(){
        this.graphics = this.gui.addFolder("Graphics");

        var pieces = ["Modern","Medieval"];
        let theme_controller = this.graphics.add(this.scene.graph.game,'pieces_theme',pieces);

        let controller = this.graphics.add(this.scene,'graphName',this.scene.graphNames);
        var self = this;
        controller.onFinishChange(
            function(value){
                self.scene.graphName = value;
                self.scene.updateGraphBasedOnGraphName();
                
            }
        )
        theme_controller.onFinishChange(
            function(value){
                self.scene.graph.game.updatePieceGeoIndex();
            }
        )
    }


    processKeyUp(event){
        if(event.code == "KeyM"){
            this.scene.graph.materialCurrentIndex++;
        }

        if(event.code == "KeyU"){
            this.scene.graph.game.undo();
        }
    };

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {
        //return;

        var group = this.gui.addFolder("Lights");
        //group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;
        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

    addCameras(){
        var self = this;
        var group = this.gui.addFolder("Cameras");

        //var cameraController = group.add(this.scene,'currentCamera',this.scene.getCameraStringList());
        let listOfCam = ["leftCam","rightCam","whiteCam","blackCam"];
        var cameraController = group.add(this.scene,'destinyCamera',listOfCam).listen();

        cameraController.onFinishChange(
            function(value){
                self.scene.stateMachineCamera();
            }
        );
    }

}