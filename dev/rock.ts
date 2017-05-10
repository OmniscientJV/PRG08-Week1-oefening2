class Rock extends GameObject {

    private speed:number;
    private hitByCar: Boolean;
                        
    constructor(x: number, y: number, instanceTag : string) 
    {
        super(x, y, 62, 62, "rock", document.getElementById("container"), instanceTag);
        this.speed = 0;
    }

    public initialize()
    {

    }

    public update():void 
    {
        this.position.y += this.speed;

        if(this.hitByCar && this.position.y < 600)
            this.speed += 0.15;
    }

    public hit(hitByGo: GameObject)
    {
        if(hitByGo.getInstanceTag() == "car")
        {
            this.hitByCar = true;
            this.speed = 1;
            this.position.x += 75;
        }
    }
}