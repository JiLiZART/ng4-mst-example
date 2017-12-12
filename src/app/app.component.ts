import {Component, ChangeDetectionStrategy, AfterViewInit, OnInit} from '@angular/core';

import {store} from './store/domain-state';
import {syncStoreWithBackend} from './socket';
import {Position} from './draggable.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  store = store;

  socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:4001');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    syncStoreWithBackend(this.socket, this.store);
  }

  arrowPosition(arrow) {
    const [x1, y1, x2, y2] = this.calculateArrowPos(arrow);

    return `M${x1} ${y1} L${x2} ${y2}`;
  }

  calculateArrowPos(arrow) {
    const {from, to} = arrow;
    return [from.x + from.width / 2, from.y + 30, to.x + to.width / 2, to.y + 30];
  }

  boxStyle(box) {
    return {
      'width.px': box.width,
      'left.px': box.x,
      'top.px': box.y
    };
  }

  isBoxSelected(box) {
    return [box.isSelected ? 'box box-selected' : 'box'];
  }

  handleBoxClick(e, box) {
    this.store.setSelection(box.id);
    e.stopPropagation();
  }

  onDragEdge(pos: Position, box) {
    box.move(pos.x, pos.y);
  }
}
