import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularDraggableModule } from 'angular2-draggable';

import { MobxAngularModule } from 'mobx-angular';

import { AppComponent } from './app.component';

import { SidebarComponent } from './sidebar/sidebar.component';
import { DraggableDirective } from './draggable.directive';
import { GeneratorComponent } from './generator/generator.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DraggableDirective,
    GeneratorComponent,
  ],
  imports: [
    BrowserModule,
    MobxAngularModule,
    AngularDraggableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
