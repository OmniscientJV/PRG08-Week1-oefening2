abstract class GameObject
{
    protected position : Vector2;
    protected size : any = {width: 0, height: 0};
    protected div : HTMLElement;
    protected texture: String;
    protected instanceTag: String;
    static _count : number = 0;

    // default parent is document container.
    // instance tag om objecten gemakkelijk te vinden. Standaard is dit een ID (nummer van gecreerde GameObject in application lifetime) van het GameObject.
    constructor(x: number, y: number, width: number, height: number, texture, parent : HTMLElement = document.getElementById("container"), instanceTag : String = (GameObject._count += 1).toString())
    {
        this.position = new Vector2(x, y);
        this.size = {width, height};
        this.instanceTag = instanceTag;

        this.div = document.createElement(texture);
        parent.appendChild(this.div);
    }

    public setPosition(x: number, y: number)
    {
        this.position.x = x;
        this.position.y = y;
    }

    public getPosition()
    {
        return this.position;
    }

    public setSize(width: number, height: number)
    {
        this.size.width = width;
        this.size.height = height;
    }

    public getSize()
    {
        return this.size;
    }

    public getInstanceTag()
    {
        return this.instanceTag;
    }

    public abstract update();
    public abstract initialize();
    public abstract hit(hitByGo: GameObject);

    public draw()
    {
        this.div.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
}