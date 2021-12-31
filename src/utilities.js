export const drawHand = (predictions, ctx) => {

    predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;

        const x = landmarks[8][0]
        const y = landmarks[8][1]
        
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 3 * Math.PI)
        ctx.fillStyle = "#FFA630"
        ctx.fill();
        
    })
}

export const drawSquares = (ctx) => {

    for (let x=0; x<640; x=x+160) {
        for (let y=0; y<480; y=y+120) {
            ctx.beginPath();
            ctx.fillStyle = "#4DA1A9";
            ctx.rect(x, y, 160, 120);
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();
        }
    }

}