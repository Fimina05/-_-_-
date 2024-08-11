class BattleFieldView extends BattleField {
  // наше приложение
  root = null;

  // игровое поле
  table = null;

  // хранилище всех кораблей
  dock = null;

  // хранилище всех выстрелов
  polygon = null;

  // ячейки
  cells = [];

  // показывать ли корабли на игровом поле
  showShips = true;

  constructor(showShips = true) {
    super();

    // Создаем корневой элемент для приложения
    const root = document.createElement('div');
    root.classList.add('battlefield');

    // Создаем таблицу для игрового поля
    const table = document.createElement('table');
    table.classList.add('battlefield-table');

    // Создаем хранилище для кораблей
    const dock = document.createElement('div');
    dock.classList.add('battlefield-dock');

    // Создаем хранилище для выстрелов
    const polygon = document.createElement('div');
    polygon.classList.add('battlefield-polygon');

    // Присваиваем созданные элементы свойствам объекта
    Object.assign(this, { root, table, dock, polygon, showShips });
    root.append(table, dock, polygon);

    // Создаем ячейки для игрового поля
    for (let y = 0; y < 10; y++) {
      const row = [];
      const tr = document.createElement('tr');
      tr.classList.add('battlefield-row');
      tr.dataset.y = y;
      for (let x = 0; x < 10; x++) {
        const td = document.createElement('td');
        td.classList.add('battlefield-item');
        td.dataset.x = x;
        td.dataset.y = y;

        tr.append(td);
        row.push(td);
      }
      table.append(tr);
      this.cells.push(row);
    }

    /* маркеры для таблицы */
    // горизонтальные маркеры
    for (let x = 0; x < 10; x++) {
      const cell = this.cells[0][x];
      const marker = document.createElement('div');

      marker.classList.add('marker', 'marker-column');
      marker.textContent = 'АБВГДЕЖЗИК'[x];
      cell.append(marker);
    }

    // вертикальные маркеры
    for (let y = 0; y < 10; y++) {
      const cell = this.cells[y][0];
      const marker = document.createElement('div');

      marker.classList.add('marker', 'marker-row');
      marker.textContent = y + 1;

      cell.append(marker);
    }
  }

  // инициализация метода addShip
  addShip(ship, x, y) {
    if (!super.addShip(ship, x, y)) {
      return false;
    }

    // отображение кораблей на игровом поле
    if (this.showShips) {
      this.dock.append(ship.div);

      if (ship.placed) {
        // когда корабль находится над игровым полем, переписываем координаты
        const cell = this.cells[y][x];
        const cellRect = cell.getBoundingClientRect();
        const rootRect = this.root.getBoundingClientRect();

        ship.div.style.left = `${cellRect.left - rootRect.left}px`;
        ship.div.style.top = `${cellRect.top - rootRect.top}px`;
      } else {
        ship.setDirection('row');
        ship.div.style.left = `${ship.startX}px`;
        ship.div.style.top = `${ship.startY}px`;
      }
    }
    return true;
  }

  // удаление корабля
  removeShip(ship) {
    if (!super.removeShip(ship)) {
      return false;
    }

    // если корабль в доке, удаляем его из дока
    if (Array.prototype.includes.call(this.dock.children, ship.div)) {
      ship.div.remove();
    }

    return true;
  }

  // проверка нахождения точки над игровым полем
  isUnder(point) {
    return isUnderPoint(point, this.root);
  }

  // добавление выстрела
  addShot(shot) {
    if (!super.addShot(shot)) {
      return false;
    }

    // добавляем визуальную часть выстрела
    this.polygon.append(shot.div);

    // визуализация клетки после выстрела, рассчитываем по координатам
    const cell = this.cells[shot.y][shot.x];
    const cellRect = cell.getBoundingClientRect();
    const rootRect = this.root.getBoundingClientRect();

    shot.div.style.left = `${cellRect.left - rootRect.left}px`;
    shot.div.style.top = `${cellRect.top - rootRect.top}px`;

    return true;
  }

  // удаление визуального выстрела
  removeShot(shot) {
    if (!super.removeShot(shot)) {
      return false;
    }

    if (Array.prototype.includes.call(this.polygon.children, shot.div)) {
      shot.div.remove();
    }

    return true;
  }

  // окраска ячеек поля
  paintCells(field) {
    console.log(1);
    const matrix = this.matrix;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        matrix[y][x].free && field[y][x].classList.add('free-cell');
        !matrix[y][x].free && field[y][x].classList.add('occupied-cell');
      }
    }
  }

  // очистка окрашенных ячеек
  cleanPaintCells(field) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        field[y][x].classList.contains('free-cell') &&
          field[y][x].classList.remove('free-cell');
        field[y][x].classList.contains('occupied-cell') &&
          field[y][x].classList.remove('occupied-cell');
      }
    }
  }
}
