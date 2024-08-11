class App {
  static instance = null; // Статическое поле для хранения единственного экземпляра приложения

  mouse = null;
  player = null;
  opponent = null;
  scenes = {};
  activeScene = null;

  constructor(scenes = {}) {
    // Проверка на существующий экземпляр приложения
    if (App.instance) {
      return App.instance; // Возвращаем существующий экземпляр
    }

    // Инициализация компонентов приложения
    const mouse = new Mouse(document.body);
    const player = new BattleFieldView(true);
    const opponent = new BattleFieldView(false);

    Object.assign(this, { mouse, player, opponent });

    document.querySelector('[data-side="player"]').append(player.root);
    document.querySelector('[data-side="opponent"]').append(opponent.root);

    // Добавление сцен
    for (const [sceneName, SceneClass] of Object.entries(scenes)) {
      this.scenes[sceneName] = new SceneClass(sceneName, this);
    }

    // Инициализация сцен
    for (const scene of Object.values(this.scenes)) {
      scene.init();
    }

    requestAnimationFrame(() => this.tick());

    // Присваиваем экземпляр текущему объекту и возвращаем его
    App.instance = this;
    return this;
  }

  tick() {
    requestAnimationFrame(() => this.tick());

    // Обновление активной сцены и мыши
    this.activeScene && this.activeScene.update();
    this.mouse.tick();
  }

  start(sceneName, ...args) {
    // Если сцена с таким названием уже активна, возвращаем false
    if (this.activeScene && this.activeScene.name === sceneName) {
      return false;
    }

    // Если сцена не существует, возвращаем false
    if (!this.scenes.hasOwnProperty(sceneName)) {
      return false;
    }

    // Если есть активная сцена, останавливаем её
    if (this.activeScene) {
      this.activeScene.stop();
    }

    // Запускаем новую сцену
    const scene = this.scenes[sceneName];
    this.activeScene = scene;
    scene.start(...args);

    return true;
  }
}
