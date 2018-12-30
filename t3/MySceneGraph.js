var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];
        this.lights = [];
        this.primitives = [];
        this.components = [];
        this.componentsIdWithAnimations = [];
        this.primitivesIdWithUpdate = [];
        this.transformations = [];
        this.textures = [];
        this.materials = [];
        this.animations = [];
        this.materialCurrentIndex = 0;

        this.cameras = [];
        this.defaultCameraId = null;

        this.idRoot = null;                    // The id of the root element.
        this.defaultMaterial = new CGFappearance(this.scene);

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // Auxiliar
        //this.tmpMaterial = null;
        this.LARGE_TESTING_NUMBER = 0;

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        //Teste
        this.game = new Game(this.scene);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "Root tag <yas> missing";

        var nodes = rootElement.children;
        var error = this.parseAllBlocks(nodes);   
        if(error != null)
            this.onXMLError(error);     
    }

    /**
     * Parses the <scene> block
     * @param {Root node of scene block} sceneNode 
     */
    parseScene(sceneNode){
        /* Default Values */
        var rootSS = "root";
        var axis_length = 2;

        /* Reading values */
        rootSS = this.reader.getString(sceneNode,'root');
        axis_length = this.reader.getFloat(sceneNode,'axis_length');

        /* Testing if they are valid */
        if(rootSS == null){
            this.onXMLError("In <scene>: Error in root name");
            rootSS = "root";
        }
        if(axis_length == null || isNaN(axis_length)){
            this.onXMLError("In <scene>: Error in axis_length");
        }

        /* Setting the values */
        this.axis_length = axis_length;
        this.idRoot = rootSS;
    }

    /**
     * Parses the <views> block
     * @param {Root node of views block} viewsNode 
     */
    parseViews(viewsNode){
        var error = 1;

        this.defaultCameraId = this.reader.getString(viewsNode,'default');
    
        /* Check if there is at least one view */
        var children = viewsNode.children;
        if(children.length == 0){
            this.onXMLError("In <views>: Must be at least one view");
            return error;
        }

        /* Generate the views and save them */
        for(var i = 0; i < children.length; i++){
            var name = children[i].nodeName;
        
            var newView;
            var newViewId = this.reader.getString(children[i],'id');

            if(!this.correctElementId(newViewId, this.cameras, "view"))
                return error;

            if(name == "perspective"){
        
                newView = this.generatePerspective(children[i]);
      
            }
            else if(name == "ortho"){

                newView = this.generateOrtho(children[i]);
            }
            else{
                this.onXMLMinorError("In <views>: A view must be 'ortho' or 'perspective', found: "+ name);
            }

            if(newView == null)
                return error;

            this.cameras[newViewId] = newView;
            
        }
    }

    /**
     * Parses the information of one perspective and returns it
     * @param {Node of a perspective camera} node 
     * @returns CGFcamera with the values in the node
     */
    generatePerspective(node){

        var validFov, validNear, validFar;

        var fov = this.reader.getFloat(node,'angle');
        validFov = this.checkValidFloat(fov, "<view>::<perspective> Angle in perspetive view (ID = " + node.id + ")");

        var near = this.reader.getFloat(node,'near');
        validNear = this.checkValidFloat(near, "<view>::<perspective> Near in perspetive view (ID = " + node.id + ")");    
        
        var far = this.reader.getFloat(node,'far');
        validFar = this.checkValidFloat(far, "<view>::<perspective> Far in perspetive view (ID = " + node.id + ")");
        
        if(!validFov || !validNear || !validFar)
            return null;

        let position = this.getXYZ(node,'from',false);
        let target = this.getXYZ(node,'to',false);

        if(position == null || target == null)
            return null;

        var camera = new CGFcamera(fov*DEGREE_TO_RAD,near,far,position,target);

        return camera;
    }
        
    /**
     * Parses the information of one ortho camera and returns it
     * @param {Node of a ortho camera} node
     * @returns CGFcameraOrtho with the values in the node
     */
    generateOrtho(node){

        var validNear, validFar, validLeft, validRight, validTop, validBottom;

        var near = this.reader.getFloat(node,'near');
        validNear = this.checkValidFloat(near,"<view>::<ortho> Near in ortho view (ID = " + node.id + ")");

        var far = this.reader.getFloat(node,'far');
        validFar = this.checkValidFloat(far,"<view>::<ortho> Far in ortho view (ID = " + node.id + ")");

        var left = this.reader.getFloat(node,'left');
        validLeft = this.checkValidFloat(left,"<view>::<ortho> Left in ortho view (ID = " + node.id + ")");

        var right = this.reader.getFloat(node,'right');
        validRight = this.checkValidFloat(right,"<view>::<ortho> Right in ortho view (ID = " + node.id + ")");

        var top = this.reader.getFloat(node,'top');
        validTop = this.checkValidFloat(top,"<view>::<ortho> Top in ortho view (ID = " + node.id + ")");

        var bottom = this.reader.getFloat(node,'bottom');
        validBottom = this.checkValidFloat(bottom,"<view>::<ortho> Bottom in ortho view (ID = " + node.id + ")");

        if(!validNear || !validFar || !validLeft || !validRight || !validTop || !validBottom)
            return null;

        let position = this.getXYZ(node,'from',false);
        let target = this.getXYZ(node,'to',false);

        if(position == null || target == null)
            return null;

        let up = vec3.fromValues(0,1,0);

        var camera = new CGFcameraOrtho(left,right,bottom,top,near,far,position,target,up);
        
        return camera;
    }

     /**
     * Checks if a value read is a valid float or not
     * @param {Value of the Float} value 
     * @param {Error message/location of error} errorMessage 
     */
    checkValidFloat(value,errorMessage){

        var valid = true;

        if(value == null || value == undefined || isNaN(value)){

            this.onXMLError("Float invalid on: " + errorMessage);
            valid = false;
        }

        return valid;
    }

    /**
     * Checks if RGB and A values are valid or not.
     * If values are not valid print a location message with: 
     * nodeName, subnodeName  sent as parameters and the invalid value
     * @param {Id of the node wich values are tested} nodeId 
     * @param {Id of the node wich values are tested} nodeName
     * @param {R value to test validity} r 
     * @param {G value to test validity} g
     * @param {B value to test validity} b
     * @param {A value to test validity} a
     *   
     */
    checkValidRGBA(nodeId, nodeName, subnodeName, r, g, b, a){

        var valid = true;
        var rValid, gValid, bValid, aValid;

        errorLocation = nodeName + "with ID = " + nodeId + " (" + subnodeName + ") : ";

        rValid = this.checkValidFloat(r, errorLocation + "invalid 'r' value" );
        gValid = this.checkValidFloat(g, errorLocation + "invalid 'g' value");
        bValid = this.checkValidFloat(b,errorLocation + "invalid 'b' value");
        aValid = this.checkValidFloat(a, errorLocation + "invalid 'a' value");

        if(!rValid || !gValid || !bValid || !aValid)
            valid = false;

        return valid;
    }

    /**
     * Generates a vector of {x,y,z} from a Father Node and the name of the child with the values
     * @param {Node with children that contains values of XYZ} node 
     * @param {Name of the Tag of the child that holds the values of XYZ} tagName 
     * @returns vec3 object with the values of x,y,z or null in case of failure
     */
    getXYZ(node,tagName, existW){
        var children = node.children;
        var nodeNames = [];

        for(var i = 0; i < children.length;i++)
            nodeNames.push(children[i].nodeName);

        var indexOfFrom = nodeNames.indexOf(tagName);
        if(indexOfFrom == -1){
            this.onXMLError(node.nodeName + " (ID = " + node.id + "): <" + tagName + "> not found");
            return null;
        }

        var fromNode = children[indexOfFrom];

        var fromX = this.reader.getFloat(fromNode,'x');
        var fromY = this.reader.getFloat(fromNode,'y');
        var fromZ = this.reader.getFloat(fromNode,'z');
        if(existW)
            var fromW = this.reader.getFloat(fromNode,'w');

        if(isNaN(fromX) || isNaN(fromY) || isNaN(fromZ)){
            this.onXMLError(node.nodeName + " (ID = " + node.id +"): <" + tagName + "> Values (x,y,z) are not numbers");
            return null;
        }

        if(existW)
            if(isNaN(fromW)){
                this.onXMLError(node.nodeName + "(ID " + node.id +"): <" + tagName + "> Value (w) is not a number");
                return null;
            }

        let result;
        if(existW)
            result = vec4.fromValues(fromX, fromY, fromZ, fromW);
        else
            result = vec3.fromValues(fromX,fromY,fromZ);

        return result;
    }

    /**
     * Parses the <ambient> block
     * @param {Root node of ambient block} ambientNode 
     */
    parseAmbient(ambientNode){
        var ambient = new Object();
       
        var children = ambientNode.children;
        var nodeNames = [];
        var error = 1;

        this.saveNodesNames(children, nodeNames);

        let ambientRGBA = this.getRGBA(ambientNode, 'ambient');
        let backgroundRGBA = this.getRGBA(ambientNode, 'background');

        if(ambientRGBA == null || backgroundRGBA == null)
            return error;

        ambient.ambR = ambientRGBA[0];
        ambient.ambG = ambientRGBA[1];
        ambient.ambB = ambientRGBA[2];
        ambient.ambA = ambientRGBA[3];

        ambient.backR = backgroundRGBA[0];
        ambient.backG = backgroundRGBA[1];
        ambient.backB = backgroundRGBA[2];
        ambient.backA = backgroundRGBA[3];
                
        this.ambient = ambient;        
    }

    /**
     * Parses the <lights> block
     * @param {Root node of lights block} lightsNode 
     */
    parseLights(lightsNode){
        
        var children = lightsNode.children; //all lights (omni and spot)
        var lightCreated;
        var numLights = 0;


        for(var i=0; i < children.length; i++){
            
            var nodeName = children[i].nodeName;

            if(nodeName != "omni" && nodeName != "spot"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }


            lightCreated = this.createLight(nodeName, children[i]);
            
            if(!lightCreated)
                return 1;
            
            numLights++;
        }


        if(numLights == 0)
        {
            this.onXMLError("At least one light must be defined");
            return 1;
        }

        if(numLights > 8)
            this.onXMLMinorError("Too many lights defined; WebGL imposes a limit of 8 lights");

    }

    createLight(lightType, lightNode){

        var lightId = this.reader.getString(lightNode, 'id');
        var lightEnabled = this.reader.getFloat(lightNode, 'enabled');
        var isEnabled = false;

        if(lightEnabled == 1){
            isEnabled = true;
        }
        else{
            isEnabled = false;
        }

        if(!this.correctElementId(lightId, this.lights, "light"))
            return false;   //error creating light: not valid id
        
        if(lightId == null || lightEnabled == null)
            return false;

        
        let lightPosition = this.getXYZ(lightNode, 'location', true);
        let lightAmbient = this.getRGBA(lightNode, 'ambient');
        let lightDiffuse = this.getRGBA(lightNode, 'diffuse');
        let lightSpecular = this.getRGBA(lightNode, 'specular');

        if(lightPosition == null || lightAmbient == null || lightDiffuse == null|| lightSpecular == null)
            return false;

        if(lightType == "spot"){

            var angle = this.reader.getFloat(lightNode, 'angle');
            var exponent = this.reader.getFloat(lightNode, 'exponent');
            let lightDirection = this.getSpotDirection(lightNode, lightPosition);

            if(angle == null || exponent == null || lightDirection == null)
                return false;

            //create spot light
            this.createSpot(lightId, isEnabled, angle, exponent, lightPosition, lightDirection, lightAmbient, lightDiffuse, lightSpecular);
        }
        else{

            //create omni light
            this.createOmni(lightId, isEnabled, lightPosition, lightAmbient, lightDiffuse, lightSpecular);
        }

        return true;

    }


    createOmni(id, enabled, location, ambient, diffuse, specular){

        this.lights[id] = [];

        this.lights[id][0] = enabled;
        this.lights[id][1] = location;
        this.lights[id][2] = ambient;
        this.lights[id][3] = diffuse;
        this.lights[id][4] = specular;

    }

    createSpot(id, enabled, angle, exponent, location, direction, ambient, diffuse, specular){

        this.lights[id] = [];

        this.lights[id][0] = enabled;
        this.lights[id][1] = location;
        this.lights[id][2] = ambient;
        this.lights[id][3] = diffuse;
        this.lights[id][4] = specular;
        this.lights[id][5] = direction;
        this.lights[id][6] = angle;
        this.lights[id][7] = exponent;
        
    }


    correctElementId(elementId, elementsArray, elementName) {

        var correctId = false;

        if(elementId == null)
            this.onXMLError("no ID defined for " + elementName);

        else if(elementsArray[elementId] != null)
            this.onXMLError("ID must be unique for each " + elementName + " (conflict: ID = " + elementId + ")");

        else
            correctId = true;

        return correctId;       
    }


    getSpotDirection(spotNode, spotLocation){

        let target = this.getXYZ(spotNode, 'target', false);


        var deltaX = target[0] - spotLocation[0];
        var deltaY = target[1] - spotLocation[1];
        var deltaZ = target[2] - spotLocation[2];

        let direction = vec3.fromValues(deltaX, deltaY, deltaZ);
        return direction;
    }


    getRGBA(node, tagName){

        var children = node.children;
        var nodeNames = [];

        this.saveNodesNames(children, nodeNames);

        var tagIndex = nodeNames.indexOf(tagName);
        if(tagIndex == -1){
            this.onXMLError(node.nodeName + " (ID = " + node.id + "): <" + tagName + "> not found");
            return null;
        }

        var tagNode = children[tagIndex];

        var r = this.reader.getFloat(tagNode,'r');
        var g = this.reader.getFloat(tagNode,'g');
        var b = this.reader.getFloat(tagNode,'b');
        var a = this.reader.getFloat(tagNode,'a');


        if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)){
            this.onXMLError(node.nodeName + " (ID = " + node.id +"): <" + tagName + "> Values (r,g,b,a) are not numbers");
            return null;
        }

        if(!this.validRGBAValues(r, g, b, a, node, tagName))
            return null;

        let result = vec4.fromValues(r,g,b,a);
        return result;
    }


    saveNodesNames(nodes, names) {

        for (var i = 0; i < nodes.length; i++) {
            
            names.push(nodes[i].nodeName);
        }
    }

    /**
     * Parses the <texture> block
     * @param {Root node of textures block} texturesNode 
     */
    parseTextures(texturesNode){

        var children = texturesNode.children; //all textures
        var numTextures = 0;
        var error = 1;

        for(var i=0; i < children.length; i++){
            
            var nodeName = children[i].nodeName;

            if(nodeName != "texture"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            if(this.createTexture(children[i]))
                numTextures++;
            else
                return error;
        }

        if(numTextures == 0){
            this.onXMLError("At least one texture must be difined");
            return error;
        }

    }

    createTexture(textureNode) {

        var textureId = this.reader.getString(textureNode,'id');
        var file = this.reader.getString(textureNode,'file');

        if( !this.correctElementId(textureId, this.textures, "texture") )
            return false;

        var newTexture = new CGFtexture(this.scene,file);
        //newTexture.loadTexture(file);

        if(newTexture == null){
            
            this.onXMLError("Texture (ID = " + textureId + ") : File '" + file + "' does not exist");
            return false;
        }

        this.textures[textureId] = newTexture;
        return true;
    }

    /**
     * Parses the <materials> block
     * @param {Root node of materials block} materialsNode 
     */
    parseMaterials(materialsNode){

        var numMaterials = 0;
        var error = 1;

        //For each material, save the CGFappearence in this.materials
        for(var i = 0; i < materialsNode.children.length; i++){

            //Verify tag
            if (materialsNode.children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + materialsNode.children[i].nodeName + ">");
                continue;
            }
           
            //Create the material and get its id
            var newMatId = this.reader.getString(materialsNode.children[i],'id');
            var newMaterial = this.parseOneMaterial(materialsNode.children[i]);

            //Verify new material id
            if(!this.correctElementId(newMatId, this.materials, "material"))
                return error;

            //Verify if material was created successfuly
            if(newMaterial == null)
                return error;

            //If there was no error at xml's material add it to the map
            this.materials[newMatId] = newMaterial;
            numMaterials++;
            
        }

        //Verify if there is at least one material
        if(numMaterials == 0){

            this.onXMLError("At least one Material must be defined");
            return error;
        }

    }

    /**
     * Parses one block
     * @param {Node of a single material block} materialsNode 
     */
    parseOneMaterial(materialNode){
        
        var material = new CGFappearance(this.scene);        

        //Check if Shininess is within bounds
        var shininess = this.reader.getFloat(materialNode,'shininess');

        if(shininess <= 0 || shininess == undefined || isNaN(shininess)){

            this.onXMLError("Material : Shininess value is invalid.");
            return null;
        }

        material.setShininess(shininess);

        var nodeNames = [];

        this.saveNodesNames(materialNode.children, nodeNames);

        let emission = this.getRGBA(materialNode, 'emission');
        let ambient = this.getRGBA(materialNode, 'ambient');
        let diffuse = this.getRGBA(materialNode, 'diffuse');
        let specular = this.getRGBA(materialNode, 'specular');

        if(emission == null || ambient == null || diffuse == null || specular == null)
            return null;
        
        material.emission = emission;
        material.ambient = ambient;
        material.diffuse = diffuse;
        material.specular = specular;

        return material;
    }

    findChildNode(parentNode, nodeNames, childName) {

        var index = nodeNames.indexOf(""+childName);
        var childNode = parentNode.children[index];

        return childNode;
    }


    /**
     * Parses the <transformations> block
     * @param {Root node of transformations block} transformationsNode 
     */
    parseTransformations(transformationsNode){
        var children = transformationsNode.children;

        //Loop through all the transformations, creates them and saves them
        for(var i = 0; i < children.length; i++){

            var id = this.reader.getString(children[i],'id');
            
            if( !this.correctElementId(id, this.transformations, "transformation"))
                return;

            var matrix = this.generateMatrix(children[i]);

            this.transformations[id] = matrix;
        }
    }

    /**
     * Parses the<components> block
     * @param {Root node of components block} componentsNode 
     */
    parseComponents(componentsNode){
        var children = componentsNode.children;

        //Loop all the Components and Create a MyComponent for each one
        for(var i = 0; i < children.length; i++){

            var newComponent = this.generateNewComponent(children[i]);
            var idOfComp = this.reader.getString(children[i],'id');
            this.components[idOfComp] = newComponent;
        }
    }

    /**
     * Generate a MyComponent object from a Component Node
     * @param {Component Node} componentNode 
     */
    generateNewComponent(componentNode){        
        //Initializing the new component
        var newComp =  new MyComponent(this.scene,this);
        newComp.id = this.reader.getString(componentNode,'id');
        
        var transformationId;

        //Parsing children of Component
        var nodeNames = [];

        this.saveNodesNames(componentNode.children, nodeNames);
        
        //Parsing children
        var childrenNode = this.findChildNode(componentNode, nodeNames, "children");
        this.parseComponentChildren(childrenNode, newComp);

        //Parsing materials of Component
        var materialsNode = this.findChildNode(componentNode, nodeNames, "materials")
        this.parseComponentMaterials(materialsNode, newComp);

        //Parsing transformations of Component
        var transformationNode = this.findChildNode(componentNode, nodeNames, "transformation");
        this.parseComponentTransformation(transformationNode, newComp)

        //Parsing texture of Component
        var textureNode = this.findChildNode(componentNode, nodeNames, "texture");
        this.parseComponentTexture(textureNode, newComp);

        //Parsing animations of Component
        var animationNode = this.findChildNode(componentNode, nodeNames, "animations");
        if(animationNode != undefined)
            this.parseComponentAnimation(animationNode, newComp);

        return newComp;
    }

    /**
     * Adds an animation to a component
     * @param {Node of an animation} node 
     * @param {Component to be added the animation} newComp 
     */
    parseComponentAnimation(node,newComp){
        var children = node.children;
        for(var i = 0; i < children.length; i++){
            var animationId = this.reader.getString(children[i],"id");
            var animation = this.animations[animationId];
            newComp.animations.push(animation);
        }
        //save the id of the component to make sure it is updated
        this.componentsIdWithAnimations.push(newComp.id);
    }

    parseComponentChildren(childrenNode, newComp){

        //Loop through the component' children
        var grandChildren = childrenNode.children;
        
        if(grandChildren.length == 0){
            this.onXMLError("Component with no children");
        }

        for(var i = 0; i < grandChildren.length; i++){

            var name = grandChildren[i].nodeName;
            var id = this.reader.getString(grandChildren[i],'id');

            if(name == "primitiveref"){
                newComp.primitivesId.push(id);
            }
            else if(name == "componentref"){
                newComp.componentsId.push(id);
            }
            else{
                this.onXMLError("Reference to primitiveref/componentref with error");
            }
        }
    }

    parseComponentTransformation(transformationNode, newComp){

        var nodeNames = [];
        var transformationSubnodes = transformationNode.children;

        this.saveNodesNames(transformationSubnodes, nodeNames);

        if(nodeNames[0] == "transformationref"){
            newComp.transformationId = this.reader.getString(transformationSubnodes[0],'id');

            if(this.transformations[newComp.transformationId] == null){

                this.onXMLError("Transformation '" + newComp.transformationId + "' used but not created");
            }
    
        }
        else{
            newComp.transformation = this.generateMatrix(transformationNode);
        }

    }

    parseComponentMaterials(materialsNode, newComp){

        var materialsSubnodes = materialsNode.children; //all 'material' nodes

        if(materialsSubnodes.length == 0){
            this.onXMLError("Component (ID = " + newComp.id + ") needs at least one material");
        }

        for(var i = 0 ; i < materialsSubnodes.length; i++){

            newComp.materialsId.push(this.reader.getString(materialsSubnodes[i],'id'));

            if(newComp.materialsId[i] != "inherit" && this.materials[newComp.materialsId[i]] == null){
                this.onXMLError("Material " + newComp.materialsId[i] + " user but not created");
            }
        }

    }

    parseComponentTexture(textureNode, newComp){

        var textureInf = new Object();

        textureInf.id = this.reader.getString(textureNode, 'id');
        textureInf.lengthS = null;
        textureInf.lengthT = null;
        textureInf.inheritST = false;

        //Check if the texture already exists
        if(this.textures[textureInf.id] == null && textureInf.id != "inherit" && textureInf.id != "none"){
            this.onXMLError("Component refers to texture " + textureInf.id + " but it doesnt exist");
        }

        
        if(textureInf.id != "none"){

            textureInf.lengthS = this.reader.getFloat(textureNode, 'length_s', false);
            textureInf.lengthT = this.reader.getFloat(textureNode, 'length_t', false);

            if(textureInf.id == "inherit" && textureInf.lengthS == null)
                textureInf.inheritST = true;

        }

        if(textureInf.id != "none" && textureInf.id != "inherit"){

            if(textureInf.lengthS == null)
                this.onXMLError("Missing lenght_s at Component's texture with ID: " + textureInf.id);

            if(textureInf.lengthT == null)
                this.onXMLError("Missing lenght_t at Component's texture with ID: " + textureInf.id);
        }

        newComp.textureInf = textureInf;
    }



    /**
     * Helper function to parseTransformations(). Calculates the final operation matrix.
     * @param {Transformation Node} transformationNode
     */
    generateMatrix(transformationNode){
        var children = transformationNode.children;
        this.scene.loadIdentity();

        //Generate and Compute the Transformation 4x4 Matrix 
        for(var i = 0; i < children.length; i++){
            var id = children[i].nodeName;            
            var matrix;

            switch(id){
                case "translate":
                    matrix = this.genTranslateMatrix(children[i]);
                    break;
                case "rotate":
                    matrix = this.genRotateMatrix(children[i]);
                    break;
                case "scale":
                    matrix = this.genScaleMatrix(children[i]);
                    break;
                default:
                    this.onXMLError("Geometric Transformation not recognized:", id);
            }
            

            this.scene.multMatrix(matrix);
        }
        return this.scene.getMatrix();
    }

    /**
     * Generate a translate matrix
     * @param {Translate Node} transNode 
     */
    genTranslateMatrix(transNode){
        var matrix = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ];

        matrix[12] = this.reader.getFloat(transNode,'x');
        matrix[13] = this.reader.getFloat(transNode,'y');
        matrix[14] = this.reader.getFloat(transNode,'z');

        return matrix;
    }

    /**
     * Generate a rotate matrix
     * @param {Rotate Node} rotateNode 
     */
    genRotateMatrix(rotateNode){
        var matrix = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ];

        //wich axis is it using
        var axis = this.reader.getString(rotateNode,'axis');
        var angle = this.reader.getString(rotateNode,'angle');
        var angleInRad = angle*DEGREE_TO_RAD;
        
        switch(axis){
            case "z":
                matrix[0] = matrix[5]= Math.cos(angleInRad);
                matrix[1] = Math.sin(angleInRad);
                matrix[4] = (-1)*Math.sin(angleInRad);
                break;
            case "y":
                matrix[0] = matrix[10] = Math.cos(angleInRad);
                matrix[2] = (-1)*Math.sin(angleInRad);
                matrix[8] = Math.sin(angleInRad);
                break;
            case "x":
                matrix[5] = matrix[10]= Math.cos(angleInRad);
                matrix[6] = Math.sin(angleInRad);
                matrix[9] = (-1)*Math.sin(angleInRad);
                break;
            default:
                this.onXMLError("Axis on rotation transformation not recognized");
        }
        return matrix;
    }

    /**
     * Generate a scale matrix
     * @param {Scale Node} scaleNode 
     */
    genScaleMatrix(scaleNode){
        var matrix = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ];
        
        matrix[0] = this.reader.getFloat(scaleNode,'x');
        matrix[5] = this.reader.getFloat(scaleNode,'y');
        matrix[10] = this.reader.getFloat(scaleNode,'z');

        return matrix;
    }

    /**
     *  Parses the <primitives> block
     *  @param {Root node of primitives block} primitivesNode
     */
    parsePrimitives(primitivesNode){
        var children = primitivesNode.children;

        //Saving all primitives
        for(var i=0; i < children.length; i++){

            //Checking if the tag is correct
            if(children[i].nodeName != "primitive"){
                this.onXMLMinorError("unkown tag <" + children[i].nodeName + ">");
                continue;
            }

            //Verifyng if primitive has only one child
            if(children[i].children.length != 1){
                this.onXMLMinorError("primitive must have one and only one child");
            }

            //Saving primitive
            var primitiveID = this.reader.getString(children[i],'id');
            this.savePrimitive(primitiveID, children[i].children[0]);
        }
    }

    /**
     * Saves primitive's information at primitives' array
     * @param {Id of the primitive} primitiveID 
     * @param {Node of the primitive} primitiveNode 
     */
    savePrimitive(primitiveID, primitiveNode){

        var primitive;
        var type = primitiveNode.nodeName;

        switch(type){
            case "rectangle":
                primitive = this.createRectangle(primitiveNode);
                break;
            case "triangle":
                primitive = this.createTriangle(primitiveNode);
                break;
            case "cylinder":
                primitive = this.createCylinder(primitiveNode);
                break;
            case "sphere":
                primitive = this.createSphere(primitiveNode);
                break;
            case "torus":
                primitive = this.createTorus(primitiveNode);
                break;
            case "plane":
                primitive = this.createPlane(primitiveNode);
                break;
            case "patch":
                primitive = this.createPatch(primitiveNode);
                break;
            case "cylinder2":
                primitive = this.createCylinder2(primitiveNode);
                break;
            case "vehicle":
                primitive = new Vehicle(this.scene);
                break;
            case "terrain":
                primitive = this.createTerrain(primitiveNode);
                break;
            case "water":
                primitive = this.createWater(primitiveNode);
                this.primitivesIdWithUpdate.push(primitiveID);
                break;
            case "board":
                primitive = new Board(this.scene);
                break;
            case "timer":
                primitive = new Timer(this.scene);
                break;
            default:
                this.onXMLError("Primitive with unkown name:" + type);
        }

        this.primitives[primitiveID] = primitive;
    }

    createWater(primitiveNode){
        let textureID = this.reader.getString(primitiveNode,'idtexture',true);
        let waveMap = this.reader.getString(primitiveNode,'idwavemap',true);
        let parts = this.reader.getInteger(primitiveNode,'parts',true);
        let heightScale = this.reader.getFloat(primitiveNode,'heightscale',true);
        let texscale = this.reader.getFloat(primitiveNode,'texscale',true);

        return new Water(this.scene,textureID,waveMap,parts,heightScale,texscale);
    }

    /**
     * Create a Terrain out of a Terrain Node
     * @param {Terrain Node} primitiveNode 
     */
    createTerrain(primitiveNode){
        let textureId = this.reader.getString(primitiveNode,'idtexture',true);
        let heightMap = this.reader.getString(primitiveNode,'idheightmap',true);
        let parts = this.reader.getInteger(primitiveNode,'parts',true);
        let heighScale = this.reader.getFloat(primitiveNode,'heightscale',true);

        return new Terrain(this.scene,textureId,heightMap,parts,heighScale);
    }

    /**
     * Create a Rectangle out of a Rectangle Node
     * @param {Rectangle Node} primitiveNode 
     */
    createRectangle(primitiveNode){
        //Read the values
        var x1 = this.reader.getFloat(primitiveNode,'x1');
        var y1 = this.reader.getFloat(primitiveNode,'y1');
        var x2 = this.reader.getFloat(primitiveNode,'x2');
        var y2 = this.reader.getFloat(primitiveNode,'y2');

        //Create the rectangle
        var rectangle = new MyRectangle(this.scene, x1, y1, x2, y2);

        return rectangle;
    }

    /**
     * Create a Triangle out of a Triangle Node
     * @param {Triangle Node} primitiveNode 
     */
    createTriangle(primitiveNode){
        //Read the values
        var x1 = this.reader.getFloat(primitiveNode, 'x1');
        var y1 = this.reader.getFloat(primitiveNode, 'y1');
        var z1 = this.reader.getFloat(primitiveNode, 'z1');
        var x2 = this.reader.getFloat(primitiveNode, 'x2');
        var y2 = this.reader.getFloat(primitiveNode, 'y2');
        var z2 = this.reader.getFloat(primitiveNode, 'z2');
        var x3 = this.reader.getFloat(primitiveNode, 'x3');
        var y3 = this.reader.getFloat(primitiveNode, 'y3');
        var z3 = this.reader.getFloat(primitiveNode, 'z3');

        //Create the triangle
        var triangle = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);

        return triangle;
    }

    /**
     * Create a Cylinder out of a Cylinder Node
     * @param {Cylinder Node} primitiveNode 
     */
    createCylinder(primitiveNode){
        //Read Values
        var base = this.reader.getFloat(primitiveNode, 'base');
        var top = this.reader.getFloat(primitiveNode, 'top');
        var height= this.reader.getFloat(primitiveNode, 'height');
        var slices = this.reader.getFloat(primitiveNode, 'slices');
        var stacks = this.reader.getFloat(primitiveNode, 'stacks');

        //Create the cylinder
        var cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);

        return cylinder;
    }

    /**
     * Create a Sphere out of a Sphere Node
     * @param {Sphere Node} primitiveNode 
     */
    createSphere(primitiveNode){
        //Read values
        var radius = this.reader.getFloat(primitiveNode, 'radius');
        var slices = this.reader.getFloat(primitiveNode, 'slices');
        var stacks = this.reader.getFloat(primitiveNode, 'stacks');

        //Create the sphere
        var sphere = new MySphere(this.scene, radius, slices, stacks);

        return sphere;
    }

    /**
     * Create a Torus out of a Torus Node
     * @param {Torus Node} primitiveNode 
     */
    createTorus(primitiveNode){
        //Read values
        var inner = this.reader.getFloat(primitiveNode, 'inner');
        var outer = this.reader.getFloat(primitiveNode, 'outer');
        var slices = this.reader.getFloat(primitiveNode, 'slices');
        var loops = this.reader.getFloat(primitiveNode, 'loops');

        //Create the sphere
        var torus = new MyTorus(this.scene, inner, outer, slices, loops);

        return torus;
    }

    /**
     * Create a Plane out of a Plane Node
     * @param {Plane Node} primitiveNode 
     */
    createPlane(primitiveNode){
        //Read the values
        var uDivs = this.reader.getFloat(primitiveNode,'npartsU');
        var vDivs = this.reader.getFloat(primitiveNode,'npartsV');
      
        //Create the plane
        var plane = new  Plane(this.scene, uDivs, vDivs);

        return plane;
    }

    /**
     * Create a Patch out of a Rectangle Node
     * @param {Patch Node} primitiveNode 
     */
    createPatch(primitiveNode){
        //Read the values
        var uPoints = this.reader.getFloat(primitiveNode,'npointsU');
        var vPoints = this.reader.getFloat(primitiveNode,'npointsV');
        var uDivs = this.reader.getFloat(primitiveNode,'npartsU');
        var vDivs = this.reader.getFloat(primitiveNode,'npartsV');

        var controlpoints = [];
        var allPointsNodes = primitiveNode.children;

        //Saves all controlpoints in array to give to the patch
        this.initControlpoints(controlpoints, allPointsNodes);

        //Create the patch
        var patch = new Patch(this.scene, uDivs, vDivs, uPoints, vPoints, controlpoints);

        return patch;
    }

    initControlpoints(controlpoints, allPointsNodes){

        for(var i = 0; i < allPointsNodes.length; i++){

            var pointNode = allPointsNodes[i];

            if(pointNode.nodeName != "controlpoint"){
                this.onXMLMinorError("Not reognized tag <" + pointNode.name + ">");
            }

            var x = this.reader.getFloat(pointNode,'xx');
            var y = this.reader.getFloat(pointNode,'yy');
            var z = this.reader.getFloat(pointNode,'zz');

            controlpoints.push(vec3.fromValues(x,y,z));
        }
    }

    /**
     * Create a Cylinder2 out of a Cylinder Node
     * @param {Cylinder2 Node} primitiveNode 
     */
    createCylinder2(primitiveNode){
        //Read Values
        var base = this.reader.getFloat(primitiveNode, 'base');
        var top = this.reader.getFloat(primitiveNode, 'top');
        var height= this.reader.getFloat(primitiveNode, 'height');
        var slices = this.reader.getFloat(primitiveNode, 'slices');
        var stacks = this.reader.getFloat(primitiveNode, 'stacks');

        //Create the cylinder
        var cylinder2 = new Cylinder2(this.scene, base, top, height, slices, stacks);

        return cylinder2;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        
        if( this.components[this.idRoot] != null)
            this.components[this.idRoot].display(this.defaultMaterial,null,null,this.materialCurrentIndex);
        
        this.game.display();
    }


    validRGBAValues(r, g, b, a, node, tagName){

        if( r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1 || a < 0 || a > 1){

            this.onXMLError(node.nodeName + " (ID = " + node.id + ") : values (r,g,b,a) out of bounds");
            return false;
        }

        return true;
    }

    /**
     * Parses all the animations
     * @param {Node of the animation} node 
     */
    parseAnimations(animationsNode){
        var children = animationsNode.children;

        for(var i = 0; i < children.length; i++){
            var animation;

            var type = children[i].nodeName;
            var id = this.reader.getString(children[i],"id");

            if(type == "linear"){

                animation = this.createLinearAnimation(children[i]);
                animation.init();
            }
            else if(type == "circular"){

                animation = this.createCircularAnimation(children[i]);
            }   
            else{
                this.onXMLError("Animation type not found:", animationType);   
                return; 
            }
            
            this.animations[id] = animation;
        }

    }

    /**
     * Creates one linear animation
     * @param {Node of a linear animation} node 
     */
    createLinearAnimation(animationNode){
        
        var timeSpan = this.reader.getFloat(animationNode,'span');
        var animation = new LinearAnimation(this.scene,timeSpan);
        var pointsNodes = animationNode.children;

        //Add the points of the animation
        for(var i = 0; i < pointsNodes.length; i++){
            animation.addControlPoint(
                this.reader.getFloat(pointsNodes[i],'xx'),
                this.reader.getFloat(pointsNodes[i],'yy'),
                this.reader.getFloat(pointsNodes[i],'zz')
            );
        }

        return animation;
    }

    /**
     * Creates one circular animation
     * @param {Node of a circular animation} node 
     */
    createCircularAnimation(node){
        let timeSpan = this.reader.getFloat(node,'span');
        let center = this.reader.getVector3(node,'center');
        let radius = this.reader.getFloat(node,'radius');
        let startAng = this.reader.getFloat(node,"startang");
        let rotAng = this.reader.getFloat(node,'rotang');
        let centerCoord = new Coord(center[0],center[1],center[2]);
        return new CircularAnimation(this.scene,timeSpan,centerCoord,radius,startAng*DEGREE_TO_RAD,rotAng*DEGREE_TO_RAD);
    }


    /**
     * Parses and treates all the calls to parsers
     * @param {Nodes of all the blocks to be parsed} nodes 
     */
    parseAllBlocks(nodes){

        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1){
            this.onXMLError("Tag <scene> missing");
            return "first tag <scene> missing";
        }
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("First tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }
        //=================================================================================
        console.log("<scene> (first tag) parsed");
        //=================================================================================
    
        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "second tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("second tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

         //=================================================================================
         console.log("<views> (second tag) parsed");
         //=================================================================================
     
        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "third tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("third tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        //=================================================================================
        console.log("<ambient> (third tag) parsed");
        //=================================================================================

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "forth tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("forth tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        //=================================================================================
        console.log("<lights> (forth tag) parsed");
        //=================================================================================

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "fifth tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("fifth tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        //=================================================================================
        console.log("<textures> (fifth tag) parsed");
        //=================================================================================

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "sixth tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("sixth tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        //=================================================================================
        console.log("<materials> (sixth tag) parsed");
        //=================================================================================

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "seventh tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("seventh tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        //=================================================================================
        console.log("<transformations> (seventh tag) parsed");
        //=================================================================================

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "eighth tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("eighth tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }
        //=================================================================================
        console.log("<animations> (eighth tag) parsed");
        //=================================================================================

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "nineth tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("nineth tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        //=================================================================================
        console.log("<primitives> (nineth tag) parsed");
        //=================================================================================

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tenth tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tenth tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

        //=================================================================================
        console.log("<components> (tenth tag) parsed");
        //=================================================================================
    }
}