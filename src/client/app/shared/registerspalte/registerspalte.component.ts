/**
 * Created by Reto Baumgartner (rfbaumgartner) on 27.06.17.
 */

import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Params, Router } from '@angular/router';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ExtendedSearch, KnoraProperty } from '../utilities/knora-api-params';
import { AlphabeticalSortingService } from '../utilities/alphabetical-sorting.service';
import { konvolutIRI } from '../../konvolut/konvolutVariables';

@Component({
  moduleId: module.id,
  selector: 'rae-registerspalte',
  templateUrl: 'registerspalte.component.html',
  styleUrls: [ 'registerspalte.component.css' ],
  providers: [ AlphabeticalSortingService ]
})
export class RegisterspalteComponent implements OnInit {

  @Input() konvolutIRI: string;

  rsEntry: Array<any>;
  nHits: number;
  konvolutId: string;
  konvolutType: string;
  konvolutTypeMap = {'printed poem book publication': 'drucke', 'poem notebook': 'notizbuecher', 'poem typescript convolute': 'typoskripte', 'poem manuscript convolute': 'manuskripte'};
  konvolutTitle: string;
  sortingType: string;
  private sub: any;

  constructor(private http: Http, private route: ActivatedRoute, private router: Router,
              private sortingService: AlphabeticalSortingService) {
  }

  ngOnInit() {
    let searchParams = new ExtendedSearch();
    searchParams.filterByRestype = 'http://www.knora.org/ontology/text#Convolute';
    searchParams.property = new KnoraProperty('http://www.knora.org/ontology/text#hasTitle', '!EQ', ' ');
    searchParams.property = new KnoraProperty('http://www.knora.org/ontology/text#hasDescription', '!EQ', ' ');
    searchParams.showNRows = 500;

    this.sub = this.http.get('http://knora.nie-ine.ch/v1/resources/' + this.konvolutIRI)
      .map(response => response.json()).subscribe(res => {
        this.konvolutTitle = res.props['http://www.knora.org/ontology/text#hasConvoluteTitle'].values[0].utf8str;
        this.konvolutId = res.props['http://www.knora.org/ontology/text#hasAlias'].values[0].utf8str;
        this.konvolutType = res.resinfo.restype_label;
      });

    this.route.params
      .switchMap((params: Params) =>
        this.http.get(searchParams.toString()))
      .map(response => response.json())
      .subscribe((res: any) => {
        this.rsEntry = res.subjects;
        this.nHits = res.nhits;
        this.sortAlphabetically();
        this.sortingType = 'alphabetic';
      });

  }

  // TODO: Sort alphabetically after init. How?

  sortAlphabetically() {
    this.rsEntry = this.rsEntry.sort((n1, n2) => {
      const k1 = this.sortingService.germanAlphabeticalSortKey(n1.value[ 0 ]);
      const k2 = this.sortingService.germanAlphabeticalSortKey(n2.value[ 0 ]);
      if (k1 > k2) {
        return 1;
      }

      if (k1 < k2) {
        return -1;
      }

      return 0;
    });
  }

  sortChronologically() {
    // Sortiere nach obj_id bis eine interne Nummerierung da ist
    // TODO passe an entsprechende Datentypen der Felder an
    this.rsEntry = this.rsEntry.sort((n1, n2) => {
      let k1;
      let k2;
      if (this.konvolutType === 'notizbuecher' || this.konvolutType === 'manuskripte') {
        k1 = n1.obj_id;
        k2 = n2.obj_id;
      } else {
        k1 = n1.obj_id;
        k2 = n2.obj_id;
      }
      if (k1 > k2) {
        return 1;
      }

      if (k1 < k2) {
        return -1;
      }

      return 0;
    });
  }
}
