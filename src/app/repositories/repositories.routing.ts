import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RepositoriyListComponent } from './repository-list-component/repositoriy-list.component';

const routes: Routes = [
  {
    path: '',
    component: RepositoriyListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepositoriesRoutingModule {}
