const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); // linear interpolation
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());

const settings = {
  suffix: random.getSeed(), // file suffix
  dimensions: [2048, 2018]
};

console.log('seed', random.getSeed());

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount); // defaults to randomly pick single palette with 5 colors

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x += 1) {
      for (let y = 0; y < count; y += 1) {
        // UV space [0..1]
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = Math.abs(random.noise2D(u, v)) * 0.15;

        points.push({
          color: random.pick(palette), // pick one color randomly
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v]
        });
      }
    }
    return points;
  };

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;

      const x = lerp(margin, width - margin, u); // % between [400..1648] pixels
      const y = lerp(margin, width - margin, v);

      /*       context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill(); */

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('=', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
