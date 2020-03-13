import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'image' })
export class SanitizeImagePipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }

    transform(value, args): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {

        const pipeArgs = args.split(':');
        for (let i = 0; i < pipeArgs.length; i++) {
            pipeArgs[i] = pipeArgs[i].trim(' ');
        }

        if (value) {
            switch (pipeArgs[0].toLowerCase()) {
                case 'url':
                    return this.sanitized.bypassSecurityTrustUrl(value);
                case 'resource':
                    return this.sanitized.bypassSecurityTrustResourceUrl(value);
                case 'script':
                    return this.sanitized.bypassSecurityTrustScript(value);
                case 'style':
                    if (value === 'url(undefined)'|| value === 'url(null)' || value === 'url((unknown))') {
                        switch (pipeArgs[1].toLowerCase()) {
                            case 'profile':
                                return 'url(/assets/imgs/Placeholder.png)';
                            case 'placeholder':
                                return 'url(/assets/imgs/Placeholder.png)';
                        }
                    } else {
                        return this.sanitized.bypassSecurityTrustStyle(value);
                    }
                case 'html':
                    return this.sanitized.bypassSecurityTrustHtml(value);
                default:
                    throw new Error(`Unable to bypass security for invalid type: ${pipeArgs[0].toLowerCase()}`);
            }
        } else {
            switch (pipeArgs[1].toLowerCase()) {
                case 'profile':
                    return 'http://www.ionicity.co.uk/wp-content/uploads/2017/01/placeholder.png';
                case 'placeholder':
                    return 'http://www.ionicity.co.uk/wp-content/uploads/2016/12/placeholder.png';
                default:
                    return 'Nothing to Display';
            }
        }
    }
};
