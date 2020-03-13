import { Component } from '@angular/core';
import { MiProfile } from './mi-profile/mi-profile';
import { MiReads } from './mi-reads/mi-reads';
import { MiSchedule } from './mi-schedule/mi-schedule';
import { MiGoals } from './mi-goals/mi-goals';

@Component({
  selector: 'page-me',
  templateUrl: 'me.html',
})
export class Me {

  miProfile = MiProfile;
  miReads = MiReads;
  miSchedule = MiSchedule;
  miGoals = MiGoals;
}


export * from './mi-profile/mi-profile';
export * from './mi-profile-form/mi-profile-form';
export * from './mi-reads/mi-reads';
export * from './mi-goals/mi-goals';
export * from './mi-schedule/mi-schedule';
export * from './mi-health/mi-health';