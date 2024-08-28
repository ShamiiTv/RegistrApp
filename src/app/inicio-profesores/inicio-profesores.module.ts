import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioProfesoresPageRoutingModule } from './inicio-profesores-routing.module';

import { InicioProfesoresPage } from './inicio-profesores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioProfesoresPageRoutingModule
  ],
  declarations: [InicioProfesoresPage]
})
export class InicioProfesoresPageModule {}
