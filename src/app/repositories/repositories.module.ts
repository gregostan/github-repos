import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositoriesRoutingModule } from './repositories.routing';
import { RepositoriyListComponent } from './repository-list-component/repositoriy-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepositoryComponent } from './repository-list-component/repository/repository.component';

@NgModule({
  declarations: [RepositoriyListComponent, RepositoryComponent],
  imports: [CommonModule, RepositoriesRoutingModule, ReactiveFormsModule],
})
export class RepositoriesModule {}
