var DEGREE_TO_RAD = Math.PI / 180;
var UPDATE_SPEED = 33.33; //in milliseconds

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.previousTime = 0;
       
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCamera();

        /* Values of camera for interface */
        this.cameraList = [];               /* String to id (int)           */
        this.cameraValues = [];             /* id (int) to object           */
        this.currentCamera = null;          /* Name of the String          */
        this.cameraNames = [];              /* Array with names of views */

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(UPDATE_SPEED);

        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCamera() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    logPicking() {

        if(this.pickMode == false) {
            if(this.pickResults != null && this.pickResults.length > 0) {
                for(var i = 0 ; i < this.pickResults.length; i++){
                    var obj = this.pickResults[i][0];
                    if(obj){
                        var customId = this.pickResults[i][1];
                        console.log("Object: " + obj + ", with id = " + customId);
                        this.graph.game.stateMachine(customId, obj);
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
            }
        }
    }


    /**
     * Updates scene depending on the currTime.
     * @param {*} currTime 
     */
    update(currTime){

        //Calculates deltaTime/timeElapsed since last update
        var timeElapsed = currTime - this.previousTime;

        // UPDATE GAME STATE
        if(this.graph.loadedOk){
            this.graph.game.update(timeElapsed);
        }
        

        //Updates previous time to next update
        this.previousTime = currTime;

        //Updates moving primitives like Water
        for(var i = 0; i < this.graph.primitivesIdWithUpdate.length;i++){
            this.graph.primitives[this.graph.primitivesIdWithUpdate[i]].update(currTime);
        }

        //Update all the values of the animations that are currently active
        for(var i = 0 ; i < this.graph.componentsIdWithAnimations.length ; i++){

            var id = this.graph.componentsIdWithAnimations[i];

            var doneWithAnimation = this.graph.components[id].updateAnimation(timeElapsed);            
            if(doneWithAnimation == -1){
                this.graph.componentsIdWithAnimations.splice(i,1);
            }
        }

        

    }


    /**
     * Updates the camera 
     */
    updateCamera(){
        this.camera = this.graph.cameras[this.currentCamera];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {

        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                //Spotlights
                if(light[5] != null){

                    this.lights[i].setSpotDirection(light[5][0], light[5][1], light[5][2]);
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    
                }
                

                this.lights[i].update();

                i++;
            }
        }
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        //this.camera.near = this.graph.near;
        //this.camera.far = this.graph.far;

        //TODO: Change reference length according to parsed graph
        //this.axis = new CGFaxis(this, this.graph.referenceLength);
        this.axis = new CGFaxis(this,this.graph.axis_length,0.2);
        this.axis.axis_length = this.graph.axis_length;

        // TODO: Change ambient and background details according to parsed graph
        this.gl.clearColor( this.graph.ambient.backR,
                            this.graph.ambient.backG,
                            this.graph.ambient.backB,
                            this.graph.ambient.backA);

        this.setGlobalAmbientLight( this.graph.ambient.ambR,
                                    this.graph.ambient.ambG,
                                    this.graph.ambient.ambB,
                                    this.graph.ambient.ambA);


        this.initLights();
        this.initValuesOfCameras();

        //console.log(this.cameraList);
        //this.updateCamera();
        //console.log(this.graph.cameras);

        // Adds lights group.
        //this.interface.addLightsGroup(this.graph.lights);
        
        this.interface.addCameras();
        //this.camera = this.graph.cameras[this.currentCamera];
        this.interface.setActiveCamera(this.camera);

        //Add lights interface
        this.interface.addLightsGroup(this.graph.lights);


        this.sceneInited = true;


        
    }


    initValuesOfCameras(){
        //this.cameraList = [];               /* Strings to id*/
        //this.cameraValues = [];             /* id (int) to object */
        //currentCamera = null;               /* id of current camera */
        var i = 0;
        for(var key in this.graph.cameras){
            this.cameraNames.push(key);
            this.cameraList[key] = i;
            this.cameraValues[i] = this.graph.cameras[key];

            //Update value of currentCamera according to the defualt value given in xml
            if(key == this.graph.defaultCameraId)
                this.currentCamera = key;

            i++;
        }
        this.updateCamera();
    }

    getCameraStringList(){
        return this.cameraNames;
    }

    setCamera(cameraId){
        this.camera = this.graph.cameras[cameraId];
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        this.logPicking();
        this.clearPickRegistration();
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //testing
        //this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        //this.gl.enable(this.gl.DEPTH_TEST);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            if(this.graph.loadedOk){
                this.graph.displayScene();
            }
                
        }
        else {
            // Draw axis
            this.axis.display();
        }

        //test
        //var plane = new Plane(this, 8, 8);
        //plane.display();
        //var vehicle = new Vehicle(this);
        //vehicle.display();
        //var cy2 = new Cylinder2(this, 5, 3, 5, 10, 10);
        //cy2.display();
        //

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}