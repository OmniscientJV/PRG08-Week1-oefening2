class Util
{
    public static checkCollision(go1: GameObject, go2: GameObject)
    {
        let collided = false;
        let go1Pos = go1.getPosition();
        let go1Size = go1.getSize();
        let go2Pos = go2.getPosition();
        let go2Size = go2.getSize();

        if (go1Pos.x < go2Pos.x + go2Size.width &&
            go1Pos.x + go1Size.width > go2Pos.x &&
            go1Pos.y < go2Pos.y + go2Size.height &&
            go1Size.height + go1Pos.y > go2Pos.y)
        collided = true;

        return collided;
    }
}