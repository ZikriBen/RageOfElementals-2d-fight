function circle(pos, radius, color, scaleX, scaleY) {
    c.beginPath();
    c.fillStyle = color;
    c.arc(pos.x * scaleX, pos.y * scaleY, radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
}

class Joystick {
    constructor(x, y, radius, handleRadius, scaleX, scaleY) {
        this.pos = new Vector2(x, y);
        this.origin = new Vector2(x, y);
        this.radius = radius;
        this.handleRadius = handleRadius;
        this.handleFriction = 0.25;
        this.ondrag = false;
        this.touchPos = new Vector2(0, 0);
        this.listener();
        this.lastDirection = null;
        this.scaleX = scaleX;
        this.scaleY = scaleY
    }
    listener() {
	// Touch Events
        addEventListener('touchstart', e => {
            this.touchPos = new Vector2(e.touches[0].pageX, e.touches[0].pageY);
            if (this.touchPos.sub(this.origin).mag() <= this.radius) {
                this.ondrag = true;
            }
        });
        addEventListener('touchend', () => {
            this.ondrag = false;
        });
        addEventListener('touchmove', e => {
            this.touchPos = new Vector2(e.touches[0].pageX, e.touches[0].pageY);
        });

    }
    reposition() {
        if (this.ondrag == false) {
            this.pos = this.pos.add(this.origin.sub(this.pos).mul(this.handleFriction));
        } else {
            const diff = this.touchPos.sub(this.origin);
            const maxDist = Math.min(diff.mag(), this.radius);
            this.pos = this.origin.add(diff.normalize().mul(maxDist));
        }
    }

    getDirection() {
        if (this.ondrag == false) {
            keyUpFunc(this.lastDirection)
            this.lastDirection = null;
            return
        }
        // Calculate the normalized vector
        const normalizedVector = this.pos.sub(this.origin).normalize();
    
        // Set a threshold for detection (adjust as needed)
        const threshold = 0.8;
    
        // Initialize direction as null
        let direction = null;
    
        // Determine the direction based on the normalized vector
        if (normalizedVector.x > threshold) direction = 'd';
        if (normalizedVector.x < -threshold) direction = 'a';
        if (normalizedVector.y > threshold) direction = 's';
        if (normalizedVector.y < -threshold) direction = 'w';
    
        // Set the lastDirection property
        this.lastDirection = direction;
    }


    draw() {
        // Draw Joystick
        circle(this.origin, this.radius, '#707070', this.scaleX, this.scaleY);
        // Draw Handle
        circle(this.pos, this.handleRadius, '#3d3d3d', this.scaleX, this.scaleY);
    }
    update() {
        this.getDirection();
        this.reposition();
        this.draw();    
    }
}