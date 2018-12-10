class Game {
    
    constructor(scene){
        this.scene = scene;

        //Piece geometric identifiers
        this.pieceGeoIdentMan = ["man"]
        this.pieceGeoIdentKnight = ["knight"]
        this.pieceGeoIdent_Index = 0;

        this.material = this.scene.graph.materials["dark tiles"];

        this.materialBlack = this.scene.graph.materials["dark tiles"];
        this.materialWhite = this.scene.graph.materials["light tiles"];

        //Create the pieces and set their initial positions
        this.pieces = [
            new Man(this.scene,-6,-6),
            new Man(this.scene,-3,-6),
            new Man(this.scene, 0,-6),
            new Man(this.scene, 3,-6),
            new Man(this.scene, 6,-6)
        ] // 7 first for white, 7 last for black, in order: MMMMMKKmmmmmkk

        this.playerTurn = null;

        /**
         * Possible States of the Game
         */
        this.state = {
            START : "Please select a game mode",
            PLAYER_1_SELECT_PIECE: "Select a piece to move",
            PLAYER_1_MOVE_PIECE: "Select a destination of move",
            PLAYER_2_SELECT_PIECE: "Select a piece to move",
            PLAYER_2_MOVE_PIECE: "Select a destination of move",
            WON_GAME: "Congrats, game won",
            QUIT_GAME: "Quit Game",
            MOVIE: "Showing game movie, please wait",
            CONNECTION_ERROR: "Error connecting with game engine"
        };

        /**
         * Possible Game Modes
         */
        this.game_mode = {
            PVP: "Player VS Player",
            PVBOT: "Player VS Bot",
            BOTVBOT: "Bot VS Bot"
        };

        /**
         * Dificulty of the Game
         */
        this.dificulty = {
            EASY: "Easy bot and lots of time",
            MEDIUM: "Hard bot and lots of time",
            HARD: "Hard bot and less time"
        }

        this.man1 = new Man(this.scene, 3,0);
        this.anime = new LinearAnimation(this.scene, 5);
        this.anime.addControlPoint(this.man1.x, 0 , this.man1.z);
        this.anime.addControlPoint(this.man1.x+3, 0 , this.man1.z);
        this.anime.init();
        console.log(this.anime)
        this.total = 0;
        this.loaded = true;
    }

    update(delta){
        // update das animaçoes das peças
        // muda as coordenadas 
        this.total += delta;
        //console.log(this.anime)
        if(this.loaded && this.total < 10000){
             this.anime.update(delta);
        }   
       
    }

    display(){
        //for each piece, performe their animations and then display it
        this.defaultMaterial = new CGFappearance(this.scene);
        //Get the name of the component to be printed
        let nameOfMan = this.pieceGeoIdentMan[this.pieceGeoIdent_Index];

        // CHANGE 5 TO 7 ONCE THE KNIGHTS ARE DESINED AND WORKING
        for(var i = 0 ;  i < 5 ; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animation;
            if(anime != null)
                anime.apply();
                
            //de acordo com a state machine, registar ou nao a peça para picking
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfMan] );
            this.scene.graph.components[nameOfMan].display(this.materialWhite,"teste",null,0);
        
            this.scene.popMatrix();
        }


        // CHANGE 5 TO 7 ONCE THE KNIGHTS ARE DESINED AND WORKING
        for(var i = 0 ;  i < 5 ; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animation;
            if(anime != null)
                anime.apply();
                
            //de acordo com a state machine, registar ou nao a peça para picking
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfMan] );
            this.scene.graph.components[nameOfMan].display(this.materialWhite,"teste",null,0);
        
            this.scene.popMatrix();
        }

        //for loop percorre dos man, e depois dos cavaleiros por causa da diferença das geometrias

        // animaçoes de houver

        // posiçao fixa se nao houver
    }




}