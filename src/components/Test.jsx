function Test(imageUrl) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const dotCanvas = document.createElement("canvas");
  const dotCtx = dotCanvas.getContext("2d");

  const img = new Image();

  const strokes = []; // Array to store all strokes
  let currentStroke = []; // Array to store coordinates of the current stroke
  let isDrawing = false;
  let pointCount = 0; // Counter to keep track of the total points

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;

    dotCanvas.width = img.width;
    dotCanvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 60;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    document.body.appendChild(canvas);
    document.body.appendChild(dotCanvas);

    // Add undo button
    const undoButton = document.createElement("button");
    undoButton.innerText = "Undo";
    document.body.appendChild(undoButton);
    undoButton.addEventListener("click", handleUndo);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
  };

  img.src = imageUrl;

  function handleMouseDown(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointCount = 0; // Reset point count on new stroke
    currentStroke.push([
      +(x / canvas.width).toFixed(5),
      +(y / canvas.height).toFixed(5),
    ]); // Store the starting point rounded to 5 decimal places
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handleMouseMove(e) {
    if (!isDrawing) return;
    pointCount++;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (pointCount % 200 !== 0) {
      currentStroke.push([
        +(x / canvas.width).toFixed(5),
        +(y / canvas.height).toFixed(5),
      ]); // Store the point rounded to 5 decimal places
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handleMouseUp() {
    isDrawing = false;
    ctx.closePath();
    if (currentStroke.length > 0) {
      strokes.push([...currentStroke]); // Store the current stroke
    }
    currentStroke = []; // Clear current stroke array for the next stroke
    console.log("Extracted coordinates:", strokes);

    // Plot the strokes as dots
    plotStrokesAsDots(strokes);
  }

  function handleUndo() {
    if (strokes.length > 0) {
      strokes.pop(); // Remove the last stroke
      redrawCanvas(); // Redraw the canvas without the last stroke
    }
  }

  function redrawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0); // Redraw the image

    // Clear the dot canvas
    dotCtx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);

    // Redraw all strokes
    strokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.forEach(([x, y], index) => {
        const canvasX = x * canvas.width;
        const canvasY = y * canvas.height;
        if (index === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });
      ctx.stroke();
      ctx.closePath();
    });

    // Plot the strokes as dots
    plotStrokesAsDots(strokes);
  }

  function plotStrokesAsDots(strokes) {
    dotCtx.fillStyle = "black";

    strokes.forEach((stroke) => {
      stroke.forEach(([x, y]) => {
        const canvasX = x * dotCanvas.width;
        const canvasY = y * dotCanvas.height;
        drawDot(dotCtx, canvasX, canvasY); // Draw dot
      });
    });
  }

  function drawDot(ctx, x, y) {
    const radius = 5; // Adjust the radius of the dot
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
  }
}

const imageUrl = "/C.png";
Test(imageUrl);
export default Test;
