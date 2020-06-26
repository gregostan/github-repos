import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RepositoriesService } from '../service/repositories.service';
import { merge, Observable, of, Subject } from 'rxjs';
import { ReactiveResults, Repository } from '../model/model';
import { FormControl, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-repos',
  templateUrl: './repositoriy-list.component.html',
  styleUrls: ['./repositoriy-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoriyListComponent implements OnInit {
  results$: Observable<ReactiveResults<Repository[]>>;
  username = new FormControl('', Validators.required);

  constructor(private repositoriesService: RepositoriesService) {}

  ngOnInit(): void {
    this.results$ = this.username.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((username: string) => {
        return merge(
          of({ loading: true }),
          this.repositoriesService.fetchResults(username)
        );
      })
    );
  }
}
