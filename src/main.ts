import { Application, Assets, Sprite, Ticker, VERSION } from 'pixi.js';
import './style.css';

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
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;
  app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add((ticker: Ticker) => {
    bunny.rotation += 0.1 * ticker.deltaTime;
  });
}

main().catch(console.error);
