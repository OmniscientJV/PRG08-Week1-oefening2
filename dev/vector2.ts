class Vector2
{
    public x: number;
    public y: number;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    public static add(v1 : Vector2, v2: Vector2)
    {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    public static min(v1 : Vector2, v2: Vector2)
    {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    public static multiple(v1 : Vector2, v2: Vector2)
    {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    public static divide(v1 : Vector2, v2: Vector2)
    {
        return new Vector2(v1.x / v2.x, v1.y / v2.y);
    }

    public static distance(v1 : Vector2, v2: Vector2)
    {
         return Vector2.min(v1, v2).length();
    }

    public length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}