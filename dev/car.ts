/// <reference path="wheel.ts"/>
/// <reference path="gameObject.ts" />

class Car extends GameObject {

    private speed: number;
    private braking: boolean;
    private wheels: Wheel[]; // 0: backwheel, 1: frontwheel.

    private initialSpeed: number; // higher the speed higher the difficulty.

    private rockRef: GameObject;
            
    constructor(x: number, y: number, speed: number, instanceTag: String) 
    {
        super(x, y, 145, 45, "car", document.getElementById("container"), instanceTag);
        this.speed = speed;
        this.initialSpeed = speed;

        this.wheels = [new Wheel(15, 30, this.div), new Wheel(105, 30, this.div)];
        Game.instance().addObject(this.wheels[0], this.wheels[1]);

        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e));
    }

    public initialize()
    {
        this.rockRef = Game.instance().findObject("rock");
    }
    
    private onKeyDown(event:KeyboardEvent):void 
    {
        switch(event.keyCode)
        {
            default: // normally we restrict this to a key, for now any key.
                this.braking = true;
            break;
        }
    }       

    public update():void 
    {
        if(this.braking && this.speed > 0)
            this.speed -= 0.09;

        this.position.x += this.speed;

        if(!Game.instance().hasGameEnded())
        {
            if(this.speed <= 0)
            {
                this.speed = 0;
                let distance = Vector2.distance(this.position, this.rockRef.getPosition()) - this.getSize().width; // minus the width of the car.
                Game.instance().setScore((500 - distance) * this.initialSpeed); // higher score based on initial speed (difficulty).
                Game.instance().endGame();
            }
        }
    }

    public hit(hitByGo: GameObject)
    {
        if(hitByGo.getInstanceTag() == "rock")
        {
            this.speed = 0;
            this.rockRef.hit(this);
            Game.instance().setScore(0);
            Game.instance().endGame();
        }
    } 
}