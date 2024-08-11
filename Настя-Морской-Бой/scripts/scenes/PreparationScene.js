// Интерфейс стратегии
class Strategy {
  execute(matrix) {
    throw new Error("This method should be overridden!");
  }
}

// Конкретные стратегии
class SimpleStrategy extends Strategy {
  execute(matrix) {
    console.log("Executing simple strategy");
    return [];
  }
}

class MiddleStrategy extends Strategy {
  execute(matrix) {
    console.log("Executing middle strategy");
    const withoutShipItem = matrix.flat().filter((item) => !item.ship);
    return getSeveralRandom(withoutShipItem, 20);
  }
}

class HardStrategy extends Strategy {
  execute(matrix) {
    console.log("Executing hard strategy");
    const withoutShipItem = matrix.flat().filter((item) => !item.ship);
    return getSeveralRandom(withoutShipItem, 60);
  }
}

const shipsDockedMax = [
  // Информация о кораблях для размещения на доске с максимальным разрешением экрана
  { size: 4, direction: 'row', startX: 10, startY: 345 },
  { size: 3, direction: 'row', startX: 10, startY: 390 },
  { size: 3, direction: 'row', startX: 120, startY: 390 },
  { size: 2, direction: 'row', startX: 10, startY: 435 },
  { size: 2, direction: 'row', startX: 88, startY: 435 },
  { size: 2, direction: 'row', startX: 167, startY: 435 },
  { size: 1, direction: 'row', startX: 10, startY: 480 },
  { size: 1, direction: 'row', startX: 55, startY: 480 },
  { size: 1, direction: 'row', startX: 100, startY: 480 },
  { size: 1, direction: 'row', startX: 145, startY: 480 },
];

const shipsDockedMedium = [
  // Информация о кораблях для размещения на доске с средним разрешением экрана
  { size: 4, direction: 'row', startX: 355, startY: -23 },
  { size: 3, direction: 'row', startX: 355, startY: 17 },
  { size: 3, direction: 'row', startX: 355, startY: 57 },
  { size: 2, direction: 'row', startX: 355, startY: 97 },
  { size: 2, direction: 'row', startX: 355, startY: 137 },
  { size: 2, direction: 'row', startX: 355, startY: 177 },
  { size: 1, direction: 'row', startX: 355, startY: 217 },
  { size: 1, direction: 'row', startX: 355, startY: 257 },
  { size: 1, direction: 'row', startX: 355, startY: 297 },
  { size: 1, direction: 'row', startX: 355, startY: 337 },
];

class PreparationScene extends Scene {
  // Состояние сцены подготовки
  draggedShip = null; // Корабль, который перетаскивается
  draggedOffsetX = 0; // Смещение по оси X при перетаскивании
  draggedOffsetY = 0; // Смещение по оси Y при перетаскивании
  placed = null; // Признак размещения корабля

  lastClientWidth = document.documentElement.clientWidth; // Последнее известное значение ширины экрана
  shipData = shipsDockedMax; // Информация о кораблях для размещения на доске

  // Список функций, которые будут удалены при завершении сцены
  removeEventListeners = [];

  // Инициализация сцены
  init() {
    this.manually(); // Ручное размещение кораблей при инициализации
  }

  // Начало сцены
  start() {
    const { player, opponent } = this.app;

    // Сброс данных при начале
    opponent.clear();
    player.removeAllShots();
    player.ships.forEach((ship) => (ship.killed = false));
    this.removeEventListeners = [];

    // Скрытие элементов управления игрой, отображение сцены подготовки
    document.querySelectorAll('.app-actions').forEach((element) => element.classList.add('hidden'));
    document.querySelector('[data-scene="preparation"]').classList.remove('hidden');

    // Получение кнопок управления
    const manualPlaceBtn = document.querySelector('[data-action="manually"]');
    const randomPlaceBtn = document.querySelector('[data-action="randomize"]');
    const simpleBtn = document.querySelector('[data-computer="simple"]');
    const middleBtn = document.querySelector('[data-computer="middle"]');
    const hardBtn = document.querySelector('[data-computer="hard"]');

    // Добавление обработчиков событий для кнопок управления
    this.removeEventListeners.push(addEventListener(manualPlaceBtn, 'click', () => this.manually()));
    this.removeEventListeners.push(addEventListener(randomPlaceBtn, 'click', () => this.randomize()));
    this.removeEventListeners.push(addEventListener(simpleBtn, 'click', () => this.startComputer('simple')));
    this.removeEventListeners.push(addEventListener(middleBtn, 'click', () => this.startComputer('middle')));
    this.removeEventListeners.push(addEventListener(hardBtn, 'click', () => this.startComputer('hard')));
  }

  // Остановка сцены
  stop() {
    // Удаление всех обработчиков событий
    for (const removeEventListener of this.removeEventListeners) {
      removeEventListener();
    }

    this.removeEventListeners = [];
  }

  // Обновление сцены
  update() {
    const { mouse, player } = this.app;
    const clientWidth = document.documentElement.clientWidth;
    const rectFirstCell = player.cells[0][0].getBoundingClientRect();

// Обработка изменений ширины экрана
    if (clientWidth !== this.lastClientWidth) {
      this.manually();
      this.lastClientWidth = clientWidth;
    }

    // Обработка перетаскивания корабля
    if (!this.draggedShip && mouse.curLeftBtn && !mouse.prevLeftBtn) {
      const ship = player.ships.find((ship) => ship.isUnder(mouse));

      if (ship) {
        const shipRect = ship.div.getBoundingClientRect();
        ship.getPlaceAlert(shipRect, rectFirstCell, ship);
        this.draggedShip = ship;
        this.placed = this.draggedShip.placed;
        this.draggedOffsetX = mouse.x - shipRect.left;
        this.draggedOffsetY = mouse.y - shipRect.top;
        ship.x = null;
        ship.y = null;
      }
      ship && ship.addShadow(); // Добавление тени при перетаскивании
    }

    // Перетаскивание
    if (mouse.curLeftBtn && this.draggedShip) {
      const fieldRect = player.root.getBoundingClientRect();
      const { left, top } = fieldRect;
      const x = mouse.x - left - this.draggedOffsetX;
      const y = mouse.y - top - this.draggedOffsetY;
      const el = this.draggedShip.div;
      const shipRect = el.getBoundingClientRect();
        // Подсветка возможного места для размещения корабля
              this.draggedShip.getPlaceAlert(
                shipRect,
                fieldRect,
                this.draggedShip,
                this.windowRect
              );
              el.style.left = `${x}px`;// Установка позиции по оси X
              el.style.top = `${y}px`;// Установка позиции по оси Y
        
              player.paintCells(player.cells); // Отображение ячеек игрового поля
            }
        
            // Бросание корабля
            if (!mouse.curLeftBtn && this.draggedShip) {
              const ship = this.draggedShip;
              this.draggedShip = null;
              this.placed = null;
              const { width, height } = rectFirstCell;
              const { left, top } = ship.div.getBoundingClientRect();
              const point = {
                x: left + width / 2,
                y: top + height / 2,
              };
        
              ship.removeShadow(); // Удаление тени после броска
        
              player.cleanPaintCells(player.cells);
        
              // Проверка, находится ли корабль над какой-либо ячейкой поля
              const cell = player.cells
                .flat()
                .find((cell) => isUnderPoint(point, cell));
        
              if (cell) {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
        
                player.removeShip(ship);
                player.addShip(ship, x, y);
              } else {
                ship.removePlaceAlert();
                player.removeShip(ship);
                player.addShip(ship);
              }
            }
        
            // Вращение корабля
            if (this.draggedShip && mouse.delta) {
              this.draggedShip.toggleDirection();
            }
        
            if (
              this.draggedShip &&
              mouse.touchStart &&
              !mouse.prevTouchStart &&
              !mouse.touchMove &&
              !mouse.prevTouchMove &&
              this.placed
            ) {
              this.draggedShip.toggleDirection();
            }
        
            // Активация/деактивация кнопок выбора сложности в зависимости от укомплектованности кораблей
            if (player.complete) {
              document.querySelector('[data-computer="simple"]').disabled = false;
              document.querySelector('[data-computer="middle"]').disabled = false;
              document.querySelector('[data-computer="hard"]').disabled = false;
              document.querySelector('.title-difficulty').classList.remove('inactive-title');
            } else {
              document.querySelector('[data-computer="simple"]').disabled = true;
              document.querySelector('[data-computer="middle"]').disabled = true;
              document.querySelector('[data-computer="hard"]').disabled = true;
              document.querySelector('.title-difficulty').classList.add('inactive-title');
            }
          }
        
          // Рандомное размещение кораблей
          randomize() {
            const { player } = this.app;
        
            const clientWidth = document.documentElement.clientWidth;
        
            // Выбор массива кораблей в зависимости от разрешения экрана
            if (clientWidth <= 987) {
              this.shipData = shipsDockedMedium;
            } else if (clientWidth > 987) {
              this.shipData = shipsDockedMax;
            }
        
            // Рандомное размещение кораблей и установка их начальных координат
            player.randomize(ShipView);
        
            for (let i = 0; i < 10; i++) {
              const ship = player.ships[i];
        
              ship.startX = this.shipData[i].startX;
              ship.startY = this.shipData[i].startY;
            }
          }
        
          // Ручное размещение кораблей
          manually() {
            const { player } = this.app;
        
            player.removeAllShips();
        
            const clientWidth = document.documentElement.clientWidth;
        
            // Выбор массива кораблей в зависимости от разрешения экрана
            if (clientWidth <= 987) {
              this.shipData = shipsDockedMedium;
            } else if (clientWidth > 987) {
              this.shipData = shipsDockedMax;
            }
        
            // Ручное размещение каждого корабля согласно данным из массива
            for (const { size, direction, startX, startY } of this.shipData) {
              const ship = new ShipView(size, direction, startX, startY);
              player.addShip(ship);
            }
          }
        
         // Запуск компьютерного противника с выбранной сложностью
          startComputer(level) {
            console.log(level); // Вывод уровня сложности в консоль

            const { player } = this.app;
            const matrix = player.matrix;

            if (level === 'simple') {
              this.strategy = new SimpleStrategy();
            } else if (level === 'middle') {
              this.strategy = new MiddleStrategy();
            } else if (level === 'hard') {
              this.strategy = new HardStrategy();
            }

            const untouchables = this.strategy.execute(matrix);

            // Запуск сцены игры с компьютерным противником
            this.app.start('computer', untouchables);
          }
        }