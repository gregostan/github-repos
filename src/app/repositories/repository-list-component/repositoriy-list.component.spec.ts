import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoriyListComponent } from './repositoriy-list.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RepositoriesService } from '../service/repositories.service';

describe('RepositoriyListComponent', () => {
  let component: RepositoriyListComponent;
  let fixture: ComponentFixture<RepositoriyListComponent>;
  let el: DebugElement;
  let repositoriesServiceSpy: jasmine.SpyObj<RepositoriesService>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('RepositoriesService', ['fetchResults']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RepositoriyListComponent],
      providers: [{ provide: RepositoriesService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoriyListComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    repositoriesServiceSpy = TestBed.inject(
      RepositoriesService
    ) as jasmine.SpyObj<RepositoriesService>;

    fixture.detectChanges();
    component.ngOnInit();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error when input empty', () => {
    el.query(By.css('.input')).triggerEventHandler('focus', null);
    el.query(By.css('.input')).triggerEventHandler('blur', null);
    fixture.detectChanges();
    expect(
      el.query(By.css('.input__error')).nativeElement.textContent
    ).toContain('required');
  });
});
