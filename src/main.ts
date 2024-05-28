import { Application, Assets, Sprite, Ticker, VERSION } from 'pixi.js';
import './style.css';

const imgPathBase = '/assets/images/';
const imgPaths = {
  bunny: 'https://pixijs.com/assets/bunny.png',
  background: imgPathBase + 'bg.png',
};

async function main() {
  const app = new Application();
  await app.init({
    background: '0x1099bb',
    resizeTo: document.body,
    // preference: 'webgpu',
  });

  console.log('PixiJS app initialized. Version:', VERSION);

  document.body.appendChild(app.canvas);

  // create a new Sprite from an image path
  const tex = await Assets.load('https://pixijs.com/assets/bunny.png');
  const bunny = Sprite.from(tex);
  bunny.anchor.set(0.5);
  app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add((ticker: Ticker) => {
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    bunny.rotation += 0.1 * ticker.deltaTime;
  });

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// Background
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  {
    ///// Add background, cover type: crop, aligned to the bottom
    const texture = await Assets.load(imgPaths.background);
    const bg = new Sprite(texture);
    const hwRatio = bg.height / bg.width;
    bg.anchor.set(0.5, 1);
    app.stage.addChildAt(bg, 0);

    // TODO: Move to on resize event
    app.ticker.add(() => {
      bg.width = app.screen.width;
      bg.height = app.screen.width * hwRatio;
      bg.x = app.screen.width * 0.5;
      bg.y = app.screen.height;
    });
  }
}

main().catch(console.error);
