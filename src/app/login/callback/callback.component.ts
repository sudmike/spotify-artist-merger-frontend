import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyWebService } from '../../spotify-web.service';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private spotifyService: SpotifyWebService) {  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(qp => {
      if (qp.accessToken) {
        console.log('Access Token: ' + qp.accessToken);
        this.spotifyService.setAccessToken(qp.accessToken);
      }
    });
  }

}
