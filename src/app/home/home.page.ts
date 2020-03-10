import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private word: string;
  public model: any = null;
  public itemsWord: Array<string> = [];
  constructor(private alertController: AlertController) {}
  ngOnInit(): void {
    this.showModalCreateWord().then(r => {});
  }

  async showModalCreateWord() {
    const alert = await this.alertController.create({
      header: 'Загадайте слово',
      // message: `<ion-input type="text" placeholder="Enter Input"></ion-input>`,
      inputs: [{
        name: 'word',
        type: 'text',
        placeholder: 'Начните ввод'
      }],
      buttons: [{
        text: 'OK',
        handler: (blah) => {
          const tmp = blah.word.split(' ').join('');
          if ( tmp === '') {
             this.showModalCreateWord();
          } else {
            this.word = blah.word.toLowerCase();
          }
        }
      }]
    });

    await alert.present();
  }

  async showMessageWin() {
    const alert = await this.alertController.create({
      header: 'Поздравляем!',
      message: 'Вы отгадали! Это было слово: ' + this.word,
      buttons: [
        {
          text: 'Начать заново',
          cssClass: 'secondary',
          handler: (blah) => {
            this.reloadApp();
          }
        }
      ]
    });

    await alert.present();
  }

  private reloadApp() {
    this.word = '';
    this.model = null;
    this.itemsWord = [];
    this.showModalCreateWord();
  }

  public guess(value: string): void {
    const wordGuess = value.split(' ').join('').toLowerCase();
    if ( wordGuess === '' ) { return; }
    const result = this.getAnimals(wordGuess);
    this.itemsWord.unshift(`${wordGuess} - ${result.cow} коров, ${result.bull} быков`);
    if (this.word.length === result.bull) {
      this.showMessageWin().then(r => {});
    }
    this.model = '';
  }

  private getCow(value: string, arrSymbols: Array<string>): number {
    let cow = 0;
    for (let i = 0; i < this.word.length; i++) {
      for (let j = 0; j < value.length; j++) {
        const id = arrSymbols.findIndex(item => {
          return value[j] === item;
        });
        if (id !== -1) { continue; }
        if ( this.word[i] === value[j] ) {
          cow++;
          break;
        }
      }
    }
    return cow;
  }
  private getBull(value: string): {bull: number, symbols: Array<string>} {
    let bull = 0, arrSymbols = [];
    for (let i = 0; i < this.word.length; i++) {
      for (let j = 0; j < value.length; j++) {
        const id = arrSymbols.findIndex(item => {
          return value[j] === item;
        });
        if (id !== -1 && i !== j) { continue; }
        if ( i === j && this.word[i] === value[j] ) {
          bull++;
          arrSymbols.push(value[j]);
          break;
        }
      }
    }
    return {
      bull: bull,
      symbols: arrSymbols
    };
  }

  private getAnimals(value: string) {
    const resultBull = this.getBull(value);
    const resultCow = this.getCow(value, resultBull.symbols);
    return {
      bull: resultBull.bull,
      cow: resultCow
    };
  }
}
