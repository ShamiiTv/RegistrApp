import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioProfesoresPage } from './inicio-profesores.page';

const routes: Routes = [
  {
    path: '',
    component: InicioProfesoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioProfesoresPageRoutingModule {}
