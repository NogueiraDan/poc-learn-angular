import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText',
  standalone: true
})
export class HighlightTextPipe implements PipeTransform {
  transform(text: string, search: string): string {
    if (!search || !text) {
      return text;
    }
    
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}
