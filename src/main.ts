import { Application, Assets, Container, Sprite, Ticker, VERSION } from 'pixi.js';
import './style.css';

const imgPathBase = '/assets/images/';
const imgPaths = {
  bunny: 'https://pixijs.com/assets/bunny.png',
  background: imgPathBase + 'bg.png',
  mockGameWorld: imgPathBase + 'city.png',
  bottomGuiBackground: imgPathBase + 'ui/bot.png',
};

async function main() {
  const app = new Application();
  await app.init({
    /** The background color equals the top part of the background image. */
    background: '0x2466aa',
    resizeTo: document.body,
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
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  {
    ///// Add background, cover type: crop, aligned to the bottom
    const texture = await Assets.load(imgPaths.background);
    const sprite = new Sprite(texture);
    const hwRatio = sprite.height / sprite.width;
    sprite.anchor.set(0.5, 1);
    app.stage.addChildAt(sprite, 0);

    // TODO: Move to on resize event
    app.ticker.add(() => {
      sprite.width = app.screen.width;
      sprite.height = app.screen.width * hwRatio;
      sprite.x = app.screen.width * 0.5;
      sprite.y = app.screen.height;
    });
  }

  {
    ///// Add mock game world sprite
    const texture = await Assets.load(imgPaths.mockGameWorld);
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    app.stage.addChildAt(sprite, 1);

    // TODO: Move to on resize event
    app.ticker.add(() => {
      const scaleFactor = Math.min(app.screen.width, app.screen.height) / 480;
      sprite.scale.set(scaleFactor);
      sprite.x = app.screen.width * 0.5;
      sprite.y = app.screen.height * 0.62;
    });
  }

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  function createGuiContainer(sceenAlignX: number, screenAlignY: number) {
    const container = new Container();
    app.stage.addChild(container);

    // TODO: Move to on resize event
    app.ticker.add(() => {
      const scaleFactor = Math.min(app.screen.width, app.screen.height) / 960;
      container.scale.set(scaleFactor);

      container.x = sceenAlignX * app.screen.width;
      container.y = screenAlignY * app.screen.height;
    });

    return container;
  }

  const guiContainers = {
    topLeft: createGuiContainer(0, 0),
    topCwnter: createGuiContainer(0.5, 0),
    topRight: createGuiContainer(1, 0),
    bottomLeft: createGuiContainer(0, 1),
    bottomCenter: createGuiContainer(0.5, 1),
    bottomRight: createGuiContainer(1, 1),
  };

  {
    ///// Add bottom-center aligned GUI elements
    const texture = await Assets.load(imgPaths.bottomGuiBackground);
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 1.0);
    guiContainers.bottomCenter.addChild(sprite);
  }
}

main().catch(console.error);
