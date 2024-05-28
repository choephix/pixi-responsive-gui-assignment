import { Application, Assets, Container, Sprite, Texture, Text, Ticker, VERSION } from 'pixi.js';

import './style.css';

/**
 * I'm keeping everything in one file for simplicity.
 */

const imgPathBase = './assets/images/';
const imgPaths = {
  background: imgPathBase + 'bg.png',
  mockGameWorld: imgPathBase + 'city.png',
  bottomGuiBackground: imgPathBase + 'ui/bot.png',
  bottomGuiGlow: imgPathBase + 'ui/LIGHT copy 645ке.png',
  buttonRed: imgPathBase + 'ui/Button_red(1).png',
  buttonRedIcon: imgPathBase + 'ui/Button_dice_icon.png',
  buttonHomePad: imgPathBase + 'ui/Group 1et.png',
  buttonHomeIcon: imgPathBase + 'ui/MB_icon.png',
  buttonNewsPad: imgPathBase + 'ui/Hue_Saturation 2 copywe.png',
  buttonNewsIcon: imgPathBase + 'ui/news_icon.png',
  hambugerButton: imgPathBase + 'ui/gamburger_button.png',
  porfileAvatar: imgPathBase + 'ui/profile_icons_0013.png',
  shieldIcon: imgPathBase + 'ui/shield.png',
  topGuiBackground: imgPathBase + 'ui/coin_bg.png',
  topGuiCoinButton: imgPathBase + 'ui/coin.png',
  topGuiBuyButton: imgPathBase + 'ui/+.png',
  cloud1: imgPathBase + 'cloud.png',
  cloud2: imgPathBase + 'cloud2.png',
};
type TextureKey = keyof typeof imgPaths;

async function main() {
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// Instantiate the PixiJS application
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  const app = new Application();
  await app.init({
    /** The background color equals the top part of the background image. */
    background: '0x2466aa',
    resizeTo: document.body,
  });

  console.log('PixiJS app initialized. Version:', VERSION);

  document.body.appendChild(app.canvas);

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// Load all image assets (using the Pixi bunny as loading indicator)
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  const bunny = await createLoadingBunny(app);
  bunny.addToStage();

  const textures = await loadGameAssets();

  bunny.destroy();

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  {
    ///// Add background, cover type: crop, aligned to the bottom
    const background = createBackground(textures, app);
    app.stage.addChild(background);

    ///// Add clouds
    const clouds = createClouds(textures, app);
    app.stage.addChild(clouds);
  }

  {
    ///// Add mock game world sprite
    const sprite = new Sprite(textures.mockGameWorld);
    sprite.anchor.set(0.5, 0.5);
    app.stage.addChild(sprite);

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
    topCenter: createGuiContainer(0.5, 0),
    topLeft: createGuiContainer(0, 0),
    topRight: createGuiContainer(1, 0),
    bottomCenter: createGuiContainer(0.5, 1),
    bottomLeft: createGuiContainer(0, 1),
    bottomRight: createGuiContainer(1, 1),
  };

  {
    ///// Add bottom-center aligned GUI elements

    const pad = new Sprite(textures.bottomGuiBackground);
    pad.anchor.set(0.5, 1.0);
    guiContainers.bottomCenter.addChild(pad);

    const glow = new Sprite(textures.bottomGuiGlow);
    glow.anchor.set(0.5, 1.0);
    guiContainers.bottomCenter.addChild(glow);
    app.ticker.add(() => (glow.alpha = 0.75 + 0.25 * Math.sin(app.ticker.lastTime / 250)));

    const redButton = new Container();
    redButton.position.set(-7, -170);
    guiContainers.bottomCenter.addChild(redButton);

    const redButtonPad = new Sprite(textures.buttonRed);
    redButtonPad.anchor.set(0.5, 0.5);
    redButtonPad.scale.set(0.7);
    redButton.addChild(redButtonPad);

    const redButtonIcon = new Sprite(textures.buttonRedIcon);
    redButtonIcon.anchor.set(0.5, 0.5);
    redButtonIcon.scale.set(0.9);
    redButtonIcon.position.set(0, -20);
    redButton.addChild(redButtonIcon);
  }

  {
    ///// Add bottom-left and bottom-right aligned GUI elements

    const homeButton = new Container();
    homeButton.position.set(135, -100);
    guiContainers.bottomLeft.addChild(homeButton);

    const homeButtonPad = new Sprite(textures.buttonHomePad);
    homeButtonPad.anchor.set(0.5, 0.5);
    homeButton.addChild(homeButtonPad);

    const homeButtonIcon = new Sprite(textures.buttonHomeIcon);
    homeButtonIcon.anchor.set(0.5, 0.5);
    homeButton.addChild(homeButtonIcon);

    const newsButton = new Container();
    newsButton.position.set(-135, -100);
    guiContainers.bottomRight.addChild(newsButton);

    const newsButtonPad = new Sprite(textures.buttonNewsPad);
    newsButtonPad.anchor.set(0.5, 0.5);
    newsButton.addChild(newsButtonPad);

    const newsButtonIcon = new Sprite(textures.buttonNewsIcon);
    newsButtonIcon.anchor.set(0.5, 0.5);
    newsButton.addChild(newsButtonIcon);
  }

  {
    ///// Add top-left and top-right aligned GUI elements

    const burgerMenuButton = new Sprite(textures.hambugerButton);
    burgerMenuButton.anchor.set(0.5, 0.5);
    burgerMenuButton.position.set(65, 65);
    guiContainers.topLeft.addChild(burgerMenuButton);

    const profileAvatar = new Sprite(textures.porfileAvatar);
    profileAvatar.anchor.set(0.5, 0.5);
    profileAvatar.position.set(165, 65);
    profileAvatar.scale.set(0.5);
    guiContainers.topLeft.addChild(profileAvatar);

    const shieldIcon = new Sprite(textures.shieldIcon);
    shieldIcon.anchor.set(0.5, 0.5);
    shieldIcon.position.set(-65, 65);
    guiContainers.topRight.addChild(shieldIcon);
  }

  {
    ///// Add top-center aligned GUI element

    const topCenterGui = new Container();
    topCenterGui.position.set(0, 65);
    guiContainers.topCenter.addChild(topCenterGui);

    const topGuiBackground = new Sprite(textures.topGuiBackground);
    topGuiBackground.anchor.set(0.5, 0.5);
    topCenterGui.addChild(topGuiBackground);

    const coinButton = new Sprite(textures.topGuiCoinButton);
    coinButton.anchor.set(0.5, 0.5);
    coinButton.position.set(-150, 0);
    topCenterGui.addChild(coinButton);

    const buyButton = new Sprite(textures.topGuiBuyButton);
    buyButton.anchor.set(0.5, 0.5);
    buyButton.position.set(150, 0);
    topCenterGui.addChild(buyButton);

    const userIdLabel = new Text({
      text: 'user: 1715600095720',
      style: {
        fontFamily: 'serif',
        fontSize: 32,
        fill: 0x101010,
        align: 'center',
      },
    });
    userIdLabel.anchor.set(0.5, 0.5);
    userIdLabel.position.set(0, 70);
    topCenterGui.addChild(userIdLabel);
  }
}

/**
 * @returns Since the assignment requires loading only image-type assets,
 * returning a just dictionary of loaded textures.
 */
async function loadGameAssets() {
  for (const key in imgPaths) {
    Assets.add({ alias: key, src: imgPaths[key as TextureKey] });
  }
  const allTextureKeys = Object.keys(imgPaths) as TextureKey[];
  const textures: Record<TextureKey, Texture> = await Assets.load(allTextureKeys);

  return textures;
}
type GameTexturesCache = Awaited<ReturnType<typeof loadGameAssets>>;

async function createLoadingBunny(app: Application) {
  const texture = await Assets.load('https://pixijs.io/examples/examples/assets/bunny.png');
  const bunny = new Sprite(texture);
  bunny.anchor.set(0.5);

  const updateBunny = (ticker: Ticker) => {
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    bunny.rotation += 0.1 * ticker.deltaTime;
  };
  app.ticker.add(updateBunny);

  return {
    addToStage: () => app.stage.addChild(bunny),
    destroy: () => {
      app.ticker.remove(updateBunny);
      bunny.destroy();
    },
  };
}

function createBackground(textures: GameTexturesCache, app: Application) {
  const container = new Container();

  ///// Add background, cover type: crop, aligned to the bottom
  const sprite = new Sprite(textures.background);
  sprite.anchor.set(0.5, 1);
  container.addChild(sprite);

  // TODO: Move to on resize event
  app.ticker.add(() => {
    const scaleFactor = app.screen.width / sprite.texture.width;
    container.scale.set(scaleFactor);
    container.x = app.screen.width * 0.5;
    container.y = app.screen.height;
  });

  return container;
}

function createClouds(textures: GameTexturesCache, app: Application) {
  const container = new Container();

  //// Instantiate a cloud sprite and add it to the container
  function addNewCloud(textureKey: TextureKey) {
    const sprite = new Sprite(textures[textureKey]);
    sprite.anchor.set(0.5, 0.5);
    container.addChild(sprite);
    return sprite;
  }

  function createCloudsRow(textureKey: TextureKey, yFrac: number, xSpeed: number) {
    const clouds = [
      //// Add a three clouds to the container, which will slowly move sideways
      addNewCloud(textureKey),
      addNewCloud(textureKey),
      addNewCloud(textureKey),
    ];

    //// If the view's width is smaller than this value, let's just assume
    //// it's equal to it, to avoid the clouds from overlapping too much.
    const minScreenWidth = 1680;
    app.ticker.add(ticker => {
      const xOffset = Math.sin(xSpeed * ticker.lastTime);
      const assumedScreenWidth = Math.max(minScreenWidth, app.screen.width);
      for (const [i, cloud] of clouds.entries()) {
        const xFactor = xOffset + i - 1; // -1, 0, 1
        cloud.x = app.screen.width * 0.5 + assumedScreenWidth * xFactor * 0.5;
        cloud.y = app.screen.height * yFrac;
      }
    });
  }

  createCloudsRow('cloud1', 0.1, -0.00003);
  createCloudsRow('cloud2', 0.4, 0.00002);

  return container;
}

main().catch(console.error);
