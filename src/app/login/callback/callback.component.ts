import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { SpotifyWebService } from '../../spotify-web.service';
import {CookieService} from "ngx-cookie-service";


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private spotifyService: SpotifyWebService,
              private cookieService: CookieService) {  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(qp => {
      if (qp.accessToken) {
        console.log('Access Token: ' + qp.accessToken);
        this.spotifyService.setAccessToken(qp.accessToken);



        // this.spotifyService.generatePlaylistAndFill(['Mac Miller', 'Post Malone'])
        //   .then(data => {
        //     console.log('Data', data);
        //   })
        //   .catch(err => {
        //     console.log('Err', err);
        //   });

        this.router.navigate(['create-playlist']);
      }
    });
  }

}
