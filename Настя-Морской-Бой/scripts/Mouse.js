//отслеживания состояния мыши и сенсорных событий
//Он сохраняет текущие и предыдущие состояния различных атрибутов мыши и обеспечивает обновление этих состояний при различных событиях.
class Mouse {
  element = null;

  under = false; // регистрация положения курсора мыши над объектом
  prevUnder = false;

  x = null; // текущие координаты
  y = null;

  prevX = null; // предыдущие координаты
  prevY = null;

  curLeftBtn = false; // состояние левой кнопки мыши
  prevLeftBtn = false;

  delta = 0; // состояние прокрутки колесика мыши
  prevDelta = 0;

  touchStart = null;
  prevTouchStart = null;

  touchMove = null;
  prevTouchMove = null;

  constructor(element) {
    this.element = element;

    //обновляет координаты и состояния.
    const stateUpdate = (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.delta = 0;
      this.under = true;
    };

    // обработчики событий мыши
    element.addEventListener('pointermove', (e) => {
      this.tick();
      this.touchMove = true;
      stateUpdate(e);
    });
    element.addEventListener('pointerenter', (e) => {
      this.tick();
      stateUpdate(e);
    });
    element.addEventListener('pointerleave', (e) => {
      this.tick();
      stateUpdate(e);
      this.under = false;
    });
    element.addEventListener('pointerdown', (e) => {
      this.tick();
      this.touchStart = true;

      stateUpdate(e);

      // обновление состояния левой кнопки мыши
      if (e.button === 0) {
        this.curLeftBtn = true;
      }
    });
    element.addEventListener('pointerup', (e) => {
      this.tick();
      this.touchMove = false;
      this.touchStart = false;

      stateUpdate(e);

      // обновление состояния левой кнопки мыши
      if (e.button === 0) {
        this.curLeftBtn = false;
      }
    });
    element.addEventListener('wheel', (e) => {
      this.tick();
      
      this.x = e.clientX;
      this.y = e.clientY;
      // обновление состояния колесика мыши
      this.delta = e.deltaY > 0 ? 1 : -1;
      this.under = true;
    });

    // элементарные обработчики сенсорных событий (закомментированы)
    // element.addEventListener('touchstart', (e) => {
    //   console.log(e);
    //   this.curTouchStart = true;
    //   this.curTouchStart = false;
    //   stateUpdate(e);
    // });

    // element.addEventListener('touchend', (e) => {
    //   console.log(e);
    //   this.curTouchMove = false;
    //   this.curTouchStart = false;
    //   stateUpdate(e);
    // });
  }

  // метод, который записывает текущее состояние в предыдущее
  tick() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevUnder = this.under;
    this.prevLeftBtn = this.curLeftBtn;
    this.prevDelta = this.delta;
    this.prevTouchStart = this.touchStart;
    this.prevTouchMove = this.touchMove;
    this.delta = 0;
  }
}
