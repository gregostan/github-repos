import { TestBed } from '@angular/core/testing';

import { RepositoriesService } from './repositories.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiBranch, ApiRepository } from '../model/api.model';
import { Branch, Repository } from '../model/model';

describe('RepositoriesService', () => {
  let service: RepositoriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepositoriesService],
    });
    service = TestBed.inject(RepositoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not fetch results if empty username', () => {
    service.fetchResults('').subscribe((results) => {
      expect(results.value).toEqual(null);
    });
    service.fetchResults(null).subscribe((results) => {
      expect(results.value).toEqual(null);
    });

    httpMock.verify(); // expected 0 http calls
  });

  it('should emit empty results if user has 0 repositories', () => {
    service.fetchResults('username').subscribe((results) => {
      expect(results.value).toEqual([]);
    });

    const req = httpMock.expectOne({ method: 'GET' });
    req.flush([]);
    httpMock.verify();
  });

  it('should emit error if user does not exist', () => {
    service.fetchResults('username').subscribe((results) => {
      expect(results.error).toContain('User not found');
    });

    const req = httpMock.expectOne({ method: 'GET' });
    req.flush('not found', { status: 404, statusText: 'Not Found' });
    httpMock.verify();
  });

  it('should filter out fork repositories', () => {
    const repositories: ApiRepository[] = [
      {
        name: 'repository1',
        owner: {
          login: 'ownerLogin',
        },
        fork: false,
      },
      {
        name: 'repository2',
        owner: {
          login: 'ownerLogin',
        },
        fork: false,
      },
    ];

    const repositoriesForks: ApiRepository[] = [
      {
        name: 'fork1',
        owner: {
          login: 'ownerLogin',
        },
        fork: true,
      },
    ];

    const allRepositories = [...repositories, ...repositoriesForks];

    const expectedRepositories = [
      new Repository('repository1', 'ownerLogin', []),
      new Repository('repository2', 'ownerLogin', []),
    ];

    service.fetchResults('ownerLogin').subscribe((results) => {
      expect(results.value).toEqual(expectedRepositories);
    });

    httpMock
      .expectOne(service.repositoriesEndpoint('ownerLogin'))
      .flush(allRepositories);

    httpMock
      .expectOne(service.branchesEndpoint('ownerLogin', 'repository1'))
      .flush([]);

    httpMock
      .expectOne(service.branchesEndpoint('ownerLogin', 'repository2'))
      .flush([]);

    httpMock.expectNone(service.branchesEndpoint('ownerLogin', 'fork1'));

    httpMock.verify();
  });

  it('should emit results', () => {
    const repositories: ApiRepository[] = [
      {
        name: 'repository1',
        owner: {
          login: 'ownerLogin',
        },
        fork: false,
      },
      {
        name: 'repository2',
        owner: {
          login: 'ownerLogin',
        },
        fork: false,
      },
    ];

    const repository1Branches: ApiBranch[] = [
      { name: 'master', commit: { sha: 'sha1' } },
      { name: 'develop', commit: { sha: 'sha2' } },
    ];

    const repository2Branches: ApiBranch[] = [
      { name: 'master', commit: { sha: 'sha3' } },
      { name: 'develop', commit: { sha: 'sha4' } },
    ];

    const expectedRepositories = [
      new Repository('repository1', 'ownerLogin', [
        new Branch('master', 'sha1'),
        new Branch('develop', 'sha2'),
      ]),
      new Repository('repository2', 'ownerLogin', [
        new Branch('master', 'sha3'),
        new Branch('develop', 'sha4'),
      ]),
    ];

    service.fetchResults('ownerLogin').subscribe((results) => {
      expect(results.value).toEqual(expectedRepositories);
    });

    httpMock
      .expectOne(service.repositoriesEndpoint('ownerLogin'))
      .flush(repositories);

    httpMock
      .expectOne(service.branchesEndpoint('ownerLogin', 'repository1'))
      .flush(repository1Branches);

    httpMock
      .expectOne(service.branchesEndpoint('ownerLogin', 'repository2'))
      .flush(repository2Branches);

    httpMock.verify();
  });
});
