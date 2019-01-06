class ZoomAnimation {
    constructor(camera,time,zoom){
        this.camera = camera;
        this.time = time*1000;
        this.initialPosition = this.camera.position;
        this.currentPosition = this.initialPosition;
        this.speed = zoom/time;
        this.acumulatedZoom = 0;
        this.zoom = zoom;
    }

    update(deltaTime){
        let increment = this.speed*deltaTime*0.01;
        console.log("increment: " + increment);
        console.log("acumulated zoom: " +this.acumulatedZoom)
        
        if(this.zoom > 0){
            if(this.acumulatedZoom + increment > this.zoom){
                this.camera.zoom(this.zoom-this.acumulatedZoom);
                return -1;
            }
        }else{
            if(this.acumulatedZoom + increment < this.zoom){
                this.camera.zoom(this.zoom-this.acumulatedZoom);
                return -1;
            }
        }
        this.acumulatedZoom += increment;
        this.camera.zoom(increment)
        return 0;
    }

    apply(){
        
    }
}