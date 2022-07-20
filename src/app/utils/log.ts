import { Injectable, OnInit } from "@angular/core";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class Log implements OnInit {

    doutput: string[] = [];
    ioutput: string[] = [];
    eoutput: string[] = [];
    woutput: string[] = [];

    ngOnInit(): void {
        this.doutput = new Array<string>();
        this.ioutput = new Array<string>();
        this.eoutput = new Array<string>();
        this.woutput = new Array<string>();
    }

    info(m) {
        console.log(m);
        this.push(m, "i");
    }

    error(m) {
        console.error(m);
        this.push(m, "e");
    }

    debug(m) {
        console.debug(m);
        this.push(m, "d");
    }

    warn(m) {
        console.warn(m);
        this.push(m, "w");
    }

    reset() {
        this.doutput = new Array<string>();
        this.ioutput = new Array<string>();
        this.eoutput = new Array<string>();
        this.woutput = new Array<string>();
    }

    private push(m, s) {
        
        if (environment.debug) {
            switch (s) {
                case "d": {
                    this.doutput.push(this.truncate(m));
                    break;
                }
                case "i": {
                    this.ioutput.push(this.truncate(m));
                    break;
                }
                case "e": {
                    this.eoutput.push(this.truncate(m));
                    break;
                }
                case "w": {
                    this.woutput.push(this.truncate(m));
                    break;
                }
                default: {
                    break;
                }
            }

        }
    }

    private truncate(input: string) {
        return input.length > 1000 ? `${input.substring(0, 100)}...` : input;
    }
}
