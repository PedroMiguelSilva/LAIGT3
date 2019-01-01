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
        this.opt.add(this.scene.graph.game,'mode',modes);

        var difs = ["Easy", "Medium", "Hard", "Challenge"];
        this.opt.add(this.scene.graph.game,'dificulty',difs);

        this.opt.add(this.scene.graph.game,'speed', 1,10).step(0.5).name("Speed");
    }

    addInformation(){
        this.info = this.gui.addFolder("Information");
        this.info.open();
        var msg = this.info.add(this.scene.graph.game,'currentState').listen();
    }

    processKeyUp(event){
        if(event.code == "KeyM"){
            this.scene.graph.materialCurrentIndex++;
        }
    };

    update(){

    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

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

        var cameraController = this.gui.add(this.scene,'currentCamera',this.scene.getCameraStringList());
    
        cameraController.onFinishChange(
            function(value){
                self.scene.updateCamera();
            }
        );
    }

}