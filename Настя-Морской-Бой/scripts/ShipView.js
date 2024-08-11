//добавляет функциональность для представления корабля на игровом поле в виде HTML-элемента.
//Класс позволяет изменять направление корабля, проверять его положение на игровом поле и добавлять визуальные эффекты.
class ShipView extends Ship {
  div = null; // HTML элемент, представляющий корабль
  startX = null;
  startY = null;

  // Создает HTML элемент для корабля и инициализирует его с заданными параметрами.
  constructor(size, direction, startX, startY) {
    const prototypeShip = ShipFactory.createShip(size, direction); // Создаем прототип корабля
    super(prototypeShip.size, prototypeShip.direction); // Вызываем конструктор родительского класса

    // Клонируем прототип корабля
    const clonedShip = prototypeShip.clone();
    
    this.div = clonedShip.div; // HTML элемент корабля
    this.startX = startX;
    this.startY = startY;

    // начальное размещение кораблей снизу поля
    this.setDirection(direction, true);
  }

  // проверка ориентации и размещение кораблей
  setDirection(newDirection, force = false) {
    if (!force && this.direction === newDirection) {
      return false;
    }

    this.div.classList.remove(`ship-${this.direction}-${this.size}`);

    this.direction = newDirection;

    this.div.classList.add(`ship-${this.direction}-${this.size}`);

    return true;
  }

  // метод для переворачивания
  toggleDirection() {
    const newDirection = this.direction === 'row' ? 'column' : 'row';
    this.setDirection(newDirection);
  }

  // проверка нахождения точки над кораблем
  isUnder(point) {
    return isUnderPoint(point, this.div);
  }


  //Добавляют или удаляют тень у корабля для визуального эффекта.
  addShadow() {
    !this.div.classList.contains('ship-shadow') &&
      this.div.classList.add('ship-shadow');
  }

  removeShadow() {
    this.div.classList.contains('ship-shadow') &&
      this.div.classList.remove('ship-shadow');
  }


  //Удаляют или добавляют предупреждение о неправильном размещении корабля на игровом поле.
  removePlaceAlert() {
    const div = this.div;
    div.classList.contains('ship-none-place') &&
      div.classList.remove('ship-none-place');
    return true;
  }

  getPlaceAlert(rectShip, rectField, curShip, windowRect) {
    const div = this.div;

    const { startX, startY } = curShip;

    const leftShip = rectShip.left;
    const rightShip = rectShip.right;
    const topShip = rectShip.top;
    const bottomShip = rectShip.bottom;

    const leftField = rectField.left;
    const rightField = rectField.right;
    const topField = rectField.top;
    const bottomField = rectField.bottom;

    const difference = topShip - startY;

    if (
      leftShip < startX + 45 &&
      leftShip > startX &&
      topShip - difference < startY + 45 &&
      topShip - difference > startY - 45
    ) {
      this.removePlaceAlert();
      return;
    }

    if (
      leftShip < leftField - 16 ||
      rightShip > rightField + 16 ||
      topShip < topField - 16 ||
      bottomShip > bottomField + 16
    ) {
      div.classList.add('ship-none-place');
      return true;
    } else {
      this.removePlaceAlert();
    }
  }
}
