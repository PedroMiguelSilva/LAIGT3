class CameraAnimation {
    constructor(camera,time,startAng,rotAng, destiny,distance){
        this.camera = camera;
        this.time = time*1000;
        this.rotAng = rotAng;
        this.startAng = startAng;
        this.destiny = destiny;
        this.distance = distance;

        this.finalAngle = startAng + rotAng;
       
        this.angSpeed = this.rotAng/this.time;

        this.currentTime = 0;
        this.alpha = this.startAng;
        this.previousAlpha = this.startAng;
        this.finalTarget = vec3.scale(vec3.create(),this.camera.target,-1);
    }

    /**
     * Update the position of the camera
     * @param {Delta time} deltaTime
     * @returns   -1 - animation ended
     *            0 - animation to be continued
     */
    update(deltaTime){
        this.alpha += this.angSpeed * deltaTime;

        if(this.angSpeed >= 0){
            if(this.alpha >= this.startAng + this.rotAng){
                this.alpha = this.previousAlpha + this.finalAngle - this.previousAlpha;
                this.previousAlpha = this.alpha;
                this.camera.orbit(vec3.fromValues(0,1,0),this.finalAngle - this.previousAlpha);
                this.updatePosition();
                return -1;
            }
                
        }
        else if(this.angSpeed < 0){
            if(this.alpha <= this.startAng + this.rotAng){
                this.alpha = this.previousAlpha + this.finalAngle - this.previousAlpha;
                this.previousAlpha = this.alpha;
                this.camera.orbit(vec3.fromValues(0,1,0),this.finalAngle - this.previousAlpha);
                this.updatePosition();
                return -1;
            }
                
        }
        //console.log(this.alpha)
        this.camera.orbit(vec3.fromValues(0,1,0),this.alpha-this.previousAlpha);
        this.previousAlpha = this.alpha;
        return 0;
    }

    updatePosition(){
        switch(this.destiny){
            case "leftCam":
            this.camera.setPosition(vec3.fromValues(75,50,0));
            break;
            case "rightCam":
            this.camera.setPosition(vec3.fromValues(-75,50,0));
            break;
            case "whiteCam":
            this.camera.setPosition(vec3.fromValues(0,50,-75));
            break;
            case "blackCam":
            this.camera.setPosition(vec3.fromValues(0,50,75));
            break;
        }

        this.camera.zoom(this.camera.myZoom)

    }
    

    apply(){
        
    }
}