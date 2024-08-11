class ComputerScene extends Scene {
  // Массив ячеек, в которые нельзя стрелять
  untouchables = [];
  // Флаг хода игрока
  playerTurn = true;
  // Элемент для отображения статуса игры
  status = null;
  // Массив функций для удаления обработчиков событий
  removeEventListeners = [];

  // Инициализация сцены
  init() {
    // Находим элемент статуса на странице
    this.status = document.querySelector('.battlefield-status');
  }

  // Начало сцены, принимает массив ячеек, в которые нельзя стрелять
  start(untouchables) {
    const { opponent } = this.app;

    // Скрываем все элементы с классом 'app-actions'
    document.querySelectorAll('.app-actions').forEach((element) => element.classList.add('hidden'));

    // Показываем элемент с атрибутом 'data-scene="computer"'
    document.querySelector('[data-scene="computer"]').classList.remove('hidden');

    // Очищаем и рандомизируем поле противника
    opponent.clear();
    opponent.randomize(ShipView);

    // Сохраняем ячейки, в которые нельзя стрелять
    this.untouchables = untouchables;

    // Очищаем массив функций удаления обработчиков событий
    this.removeEventListeners = [];

    // Находим кнопки "сдаться" и "начать заново"
    const surrenderBtn = document.querySelector("[data-action='surrender']");
    const againBtn = document.querySelector("[data-action='again']");

    // Показываем кнопку "сдаться" и скрываем кнопку "начать заново"
    surrenderBtn.classList.remove('hidden');
    againBtn.classList.add('hidden');

    // Добавляем обработчик события на кнопку "сдаться"
    this.removeEventListeners.push(
      addEventListener(surrenderBtn, 'click', () => {
        this.app.start('preparation');
      })
    );

    // Добавляем обработчик события на кнопку "начать заново"
    this.removeEventListeners.push(
      addEventListener(againBtn, 'click', () => {
        this.app.start('preparation');
      })
    );
  }

  // Остановка сцены
  stop() {
    // Удаляем все обработчики событий
    for (const removeEventListener of this.removeEventListeners) {
      removeEventListener();
    }
    // Очищаем массив функций удаления обработчиков событий
    this.removeEventListeners = [];
  }

  // Обновление сцены
  update() {
    const { mouse, opponent, player } = this.app;

    // Определяем, закончилась ли игра
    const isEnd = opponent.lost || player.lost;

    // Убираем класс 'battlefield-item__active' со всех ячеек противника
    const cells = opponent.cells.flat();
    cells.forEach((cell) => cell.classList.remove('battlefield-item__active'));

    // Если игра закончилась, обновляем статус и показываем/скрываем кнопки
    if (isEnd) {
      opponent.lost
        ? (this.status.textContent = 'Вы выиграли!')
        : (this.status.textContent = 'Вы проиграли((');

      document.querySelector("[data-action='surrender']").classList.add('hidden');
      document.querySelector("[data-action='again']").classList.remove('hidden');
      return;
    }

    // Когда курсор над полем противника
    if (isUnderPoint(mouse, opponent.table)) {
      // Находим ячейку под курсором
      const cell = cells.find((cell) => isUnderPoint(mouse, cell));

      if (cell) {
        // Подсвечиваем ячейку при наведении
        cell.classList.add('battlefield-item__active');

        // Стреляем при клике на ячейку
        if (this.playerTurn && mouse.curLeftBtn && !mouse.prevLeftBtn) {
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);

          const shot = new ShotView(x, y);
          const result = opponent.addShot(shot);

          // Контролируем очередность хода
          if (result) {
            this.playerTurn = shot.variant === 'miss' ? false : true;
          }
        }
      }
    }

    // Ход компьютера
    if (!this.playerTurn) {
      const x = getRandomBetween(0, 9);
      const y = getRandomBetween(0, 9);

      // Проверяем, не является ли ячейка запретной для выстрела
      let inUntouchables = false;
      const { matrix } = player;
      for (const item of this.untouchables) {
        if ((item[0].x === x && item[0].y === y) || matrix[y][x].shouted) {
          inUntouchables = true;
        }
      }

      // Если ячейка не запретная, делаем выстрел
      if (!inUntouchables) {
        const shot = new ShotView(x, y);
        const result = player.addShot(shot);

        if (result) {
          this.playerTurn = shot.variant === 'miss' ? true : false;
        }
      }
    }

    // Обновляем статус очередности хода
    this.playerTurn
      ? (this.status.textContent = 'Ваш ход')
      : (this.status.textContent = 'Ход компьютера');
  }
}
