import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
})
export class SubmitComponent implements OnInit {
  @Output() submitPlaylist = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  onSubmitClick(): void {
    this.submitPlaylist.emit();
  }
}
