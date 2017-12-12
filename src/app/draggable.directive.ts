import {Directive, ElementRef, Renderer, Input, Output, OnInit, HostListener, EventEmitter} from '@angular/core';

export class Position {
  constructor(public x: number, public y: number) {
  }

  substract(pos: Position) {
    return new Position(this.x - pos.x, this.y - pos.y);
  }
}

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  private moving = false;
  private orignal: Position = null;

  @Output() start = new EventEmitter<any>();
  @Output() stop = new EventEmitter<any>();
  @Output() move = new EventEmitter<any>();

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  ngOnInit() {
    const element = this.el.nativeElement;
    this.renderer.setElementClass(element, 'ng-draggable', true);
  }

  private getPosition(x: number, y: number) {
    return new Position(x, y);
  }

  private moveTo(pos: Position) {
    const delta = pos.substract(this.orignal);

    console.log('move', delta);

    this.move.emit(delta);
  }

  private pickUp() {
    if (!this.moving) {
      this.start.emit(this.el.nativeElement);
      this.moving = true;
    }
  }

  private putBack() {
    if (this.moving) {
      this.stop.emit(this.el.nativeElement);
      this.moving = false;
    }
  }

  private getPositionFromMouse(event: MouseEvent) {
    return this.getPosition(event.movementX, event.movementY);
  }

  // Support Mouse Events:
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: any) {
    // 1. skip right click;
    // 2. if handle is set, the element can only be moved by handle
    if (event.button === 2) {
      return;
    }

    this.orignal = this.getPositionFromMouse(event);
    this.pickUp();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.putBack();
  }

  @HostListener('document:mouseleave')
  onMouseLeave() {
    this.putBack();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: any) {
    if (this.moving) {
      this.moveTo(this.getPositionFromMouse(event));
    }
  }

  // Support Touch Events:
  @HostListener('document:touchend')
  onTouchEnd() {
    this.putBack();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: any) {
    event.stopPropagation();
    event.preventDefault();

    this.orignal = this.getPositionFromMouse(event.changedTouches[0]);
    this.pickUp();
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: any) {
    event.stopPropagation();
    event.preventDefault();

    if (this.moving) {
      this.moveTo(this.getPositionFromMouse(event.changedTouches[0]));
    }
  }
}
