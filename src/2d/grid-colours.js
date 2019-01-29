const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); // linear interpolation
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2018]
};
const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x += 1) {
      for (let y = 0; y < count; y += 1) {
        // UV space [0..1]
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  };

  random.setSeed(512); // keep same 'randomness'
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u); // % between [400..1648] pixels
      const y = lerp(margin, width - margin, v);

      context.beginPath();
      context.arc(x, y, 5, 0, Math.PI * 2, false);
      context.strokeStyle = 'black';
      context.lineWidth = 10;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
