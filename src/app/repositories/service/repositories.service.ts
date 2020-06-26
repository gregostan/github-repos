import { Injectable } from '@angular/core';
import { Observable, of, Subject, zip } from 'rxjs';
import { ReactiveResults, Repository } from '../model/model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { ApiBranch, ApiRepository } from '../model/api.model';

@Injectable({
  providedIn: 'root',
})
export class RepositoriesService {
  repositoriesEndpoint = (username: string) =>
    `${environment.githubUrl}/users/${username}/repos`;
  branchesEndpoint = (username: string, repository: string) =>
    `${environment.githubUrl}/repos/${username}/${repository}/branches`;

  constructor(private http: HttpClient) {}

  fetchResults(username: string): Observable<ReactiveResults<Repository[]>> {
    if (!username || !username.length) {
      return of({ value: null });
    }
    return this.http
      .get<ApiRepository[]>(this.repositoriesEndpoint(username))
      .pipe(
        map((repositories: ApiRepository[]) =>
          this.filterOutForks(repositories)
        ),
        switchMap((repositories: ApiRepository[]) => {
          if (!repositories.length) {
            return of([]);
          }
          const repositories$ = repositories.map(
            (apiRepository: ApiRepository) => this.fetchBranches(apiRepository)
          );
          return zip(...repositories$);
        }),
        map((repositories: Repository[]) => {
          return { value: repositories };
        }),
        catchError((error) => {
          if (error.status === 404) {
            return of({ error: 'User not found.' });
          } else {
            return of({ error: 'Sorry, an error occured.' });
          }
        })
      );
  }

  private filterOutForks(repositories: ApiRepository[]): ApiRepository[] {
    return repositories.filter((repo: ApiRepository) => repo.fork === false);
  }

  private fetchBranches(apiRepository: ApiRepository): Observable<Repository> {
    return this.http
      .get<ApiBranch[]>(
        this.branchesEndpoint(apiRepository.owner.login, apiRepository.name)
      )
      .pipe(
        map((apiBranches: ApiBranch[]) =>
          Repository.mapFromApi(apiRepository, apiBranches)
        ),
        catchError((error) => of(Repository.mapFromApi(apiRepository)))
      );
  }
}
