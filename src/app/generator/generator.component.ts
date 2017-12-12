import {Component, OnInit} from '@angular/core';
import {generateStuff} from '../store/domain-state';
import * as history from '../store/time';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css']
})
export class GeneratorComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  generateItems() {
    generateStuff(20);
  }

  previous() {
    history.previousState();
  }

  next() {
    history.nextState();
  }
}
