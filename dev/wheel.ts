/// <reference path="gameObject.ts" />

class Wheel extends GameObject 
{         
    constructor(x: number, y: number, parent: HTMLElement) 
    {
        super(x, y, 22, 22, "wheel", parent);
    }
    
    public initialize() {}

    public update():void {}

    public hit(hitByGo: GameObject) {}
}