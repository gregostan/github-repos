import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryComponent } from './repository.component';
import { Component, DebugElement } from '@angular/core';
import { Branch, Repository } from '../../model/model';
import { By } from '@angular/platform-browser';

const branches = [
  new Branch('master', 'shaMaster123'),
  new Branch('develop', 'shaDevelop123'),
];

const repository = new Repository('repositoryname', 'ownerlogin', [
  ...branches,
]);

describe('RepositoryComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let el: DebugElement;

  @Component({
    selector: `app-test-component`,
    template: `<app-repository [repository]="testRepository"></app-repository>`,
  })
  class TestComponent {
    testRepository = repository;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepositoryComponent, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all required elements', () => {
    fixture.detectChanges();
    expect(
      el.query(By.css('.repository__name')).nativeElement.textContent
    ).toContain(repository.ownerLogin);
    expect(
      el.query(By.css('.repository__name')).nativeElement.textContent
    ).toContain(repository.name);

    const resultBranches = el.queryAll(By.css('.repository__branch'));
    expect(resultBranches.length).toEqual(2);

    expect(resultBranches[0].nativeElement.textContent).toContain(
      branches[0].name
    );
    expect(resultBranches[0].nativeElement.textContent).toContain(
      branches[0].sha
    );

    expect(resultBranches[1].nativeElement.textContent).toContain(
      branches[1].name
    );
    expect(resultBranches[1].nativeElement.textContent).toContain(
      branches[1].sha
    );
  });
});
