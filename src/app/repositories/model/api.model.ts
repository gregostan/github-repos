export interface ApiRepository {
  name: string;
  owner: ApiOwner;
  fork: boolean;
}

export interface ApiOwner {
  login: string;
}

export interface ApiBranch {
  name: string;
  commit: ApiCommit;
}

export interface ApiCommit {
  sha: string;
}
