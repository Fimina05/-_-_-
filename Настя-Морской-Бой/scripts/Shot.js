//представляет выстрел в игре
//Класс хранит координаты выстрела и его статус (вариант).
class Shot {
  x = null; // координата X выстрела
  y = null; // координата Y выстрела
  variant = null; // статус выстрела (например, промах, попадание и т.д.)

  //Инициализирует объект выстрела с заданными координатами и статусом
  constructor(x, y, variant) {
    Object.assign(this, { x, y, variant });
  }

  // метод для установки статуса выстрела
  setVariant(variant) {
    this.variant = variant;
  }
}
