/// <reference path="car.ts"/>
/// <reference path="rock.ts"/>

class Game 
{
    private gameObjects : Array<GameObject> = new Array<GameObject>();
    private static _instance : Game;
    private running : Boolean;
    private gameEnded : Boolean;
    private score: Number;
    
    constructor() 
    {
        if(Game._instance){
            throw new Error("Kan klasse niet instantieren: Game is een singleton.");
        }

        Game._instance = this;

        this.running = true;
            
        this.addObject(
            new Car(0, 220, Math.floor(Math.random() * 5) + 2, "car"), // snelheid max: 5, min: 2.
            new Rock(500, 210, "rock")
        );

        requestAnimationFrame(() => this.gameLoop());
    }

    public static instance()
    {
        if(!Game._instance)
            Game._instance = new Game();
            
        return Game._instance;
    }

    private gameLoop()
    {
        for(let obj of this.gameObjects)
        {
            // Check collisions _after_ we update, so we can act upon things that shouldn't happen, before the user sees them in draw.
            obj.update();
            
            // O(n^2) complexity.
            for(let otherObj of this.gameObjects)
            {
                // Skip if checking yourself.
                if(otherObj.getInstanceTag() == obj.getInstanceTag())
                    continue;

                if(Util.checkCollision(obj, otherObj))
                {
                    obj.hit(otherObj);
                    otherObj.hit(obj);
                }
            }

            obj.draw();
        }

        if(this.running)
            requestAnimationFrame(() => this.gameLoop());
    }

    public setScore(score: number)
    {
        this.score = score;
    }

    public getScore()
    {
        return this.score;
    }

    public getObjectCount()
    {
        return this.gameObjects.length;
    }

    public endGame(){
        document.getElementById("score").innerHTML = `Score : ${this.score}`;
        this.gameEnded = true;
    }

    public resumeGame()
    {
        this.gameEnded = false;
    }

    public hasGameEnded()
    {
        return this.gameEnded;
    }

    /**
     * Variabele hoeveelheid gameobjecten kunnen worden toegevoegd.
     * Twee loops zodat alle objecten eerst geinstantieerd zijn voordat de initialize functie van het object wordt uitgevoerd.
     */
    public addObject(...gos : GameObject[])
    {
        if(gos.length > 0)
        {
            for(let obj of gos)
                this.gameObjects.push(obj);
        }

        for(let obj of gos)
            obj.initialize();
    }
    
    public findObject(tag : String)
    {
        for(let obj of this.gameObjects)
        {
            if(obj.getInstanceTag() == tag)
                return obj;
        }
    }
} 

// load
window.addEventListener("load", function() {
    new Game();
});