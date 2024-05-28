import { Application, Assets, Container, Sprite, Texture, Text, Ticker, VERSION } from 'pixi.js';

import './style.css';

const imgPathBase = '/assets/images/';
const imgPaths = {
  bunny: 'https://pixijs.com/assets/bunny.png',
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
  const updateBunny = (ticker: Ticker) => {
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    bunny.rotation += 0.1 * ticker.deltaTime;
  };
  app.ticker.add(updateBunny);

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// Load all image assets
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  type TextureKey = keyof typeof imgPaths;
  for (const key in imgPaths) {
    Assets.add({ alias: key, src: imgPaths[key as TextureKey] });
  }
  const allTextureKeys = Object.keys(imgPaths) as TextureKey[];
  const textures: Record<TextureKey, Texture> = await Assets.load(allTextureKeys);

  app.ticker.remove(updateBunny);
  bunny.destroy();

  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////
  //// //// //// //// //// //// //// //// //// //// //// //// //// //// ////

  {
    ///// Add background, cover type: crop, aligned to the bottom
    const sprite = new Sprite(textures.background);
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
    const sprite = new Sprite(textures.mockGameWorld);
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

main().catch(console.error);
