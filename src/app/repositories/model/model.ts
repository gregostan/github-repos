import { ApiBranch, ApiRepository } from './api.model';

export interface ReactiveResults<T> {
  loading?: boolean;
  error?: string;
  value?: T;
}

export class Repository {
  constructor(
    public name: string,
    public ownerLogin: string,
    public branches: Branch[]
  ) {}

  static mapFromApi(
    apiRepository: ApiRepository,
    apiBranches: ApiBranch[] = []
  ): Repository {
    const modelBranches = apiBranches.map((apiBranch) =>
      Branch.mapFromApi(apiBranch)
    );
    return new Repository(
      apiRepository.name,
      apiRepository.owner.login,
      modelBranches
    );
  }
}

export class Branch {
  constructor(public name: string, public sha: string) {}

  static mapFromApi(apiBranch: ApiBranch): Branch {
    return new Branch(apiBranch.name, apiBranch.commit.sha);
  }
}
