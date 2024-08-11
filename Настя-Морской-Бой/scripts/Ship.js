// Класс Ship
class Ship {
  // параметры корабля
  size = null;        // размер корабля
  direction = null;   // направление корабля
  killed = false;     // состояние корабля (уничтожен или нет)
  x = null;           // координата x на игровом поле
  y = null;           // координата y на игровом поле

  // проверка, находится ли корабль на игровом поле
  get placed() {
    return this.x !== null && this.y !== null;
  }

  // конструктор, инициализирующий корабль с заданными размером и направлением
  constructor(size, direction) {
    this.size = size;
    this.direction = direction;
  }

  // Метод клонирования для создания копий объекта ShipView
  clone() {
    const clone = new ShipView(this.size, this.direction, this.startX, this.startY);
    clone.div = this.div.cloneNode(true); // Клонирование HTML элемента
    return clone;
  }
}



// Класс ShipFactory для создания кораблей
class ShipFactory {
  // Фабричный метод для создания кораблей
  static createShip(type) {
    switch (type) {
      case 'destroyer':
        return new Ship(1, 'horizontal');
      case 'submarine':
        return new Ship(2, 'vertical');
      case 'battleship':
        return new Ship(3, 'horizontal');
      case 'carrier':
        return new Ship(4, 'vertical');
      case 'cruiser':
        return new Ship(2, 'horizontal');
      case 'patrolBoat':
        return new Ship(3, 'vertical');
      case 'flagship':
        return new Ship(4, 'horizontal');
      default:
        throw new Error('Unknown ship type');
    }
  }
}