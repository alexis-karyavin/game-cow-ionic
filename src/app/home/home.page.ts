import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  //Загаданное слово
  private word: string;
  // переменная, которая через двойную привязку к полю input 
  public model: any = null;
  public itemsWord: Array<string> = [];
  // В конструктору инжектируем сервис, который отвечает вывод alert окна
  constructor(private alertController: AlertController) {}
  // Хук жизненного цикла копмпоненты, вызывается один раз после установки свойств компонента, которые участвуют в привязке. Выполняет инициализацию компонента
  ngOnInit(): void {
    //Вызываем окно с alert, где мы загадем слово
    this.showModalCreateWord().then(r => {});
  }

  async showModalCreateWord() {
    const alert = await this.alertController.create({
      header: 'Загадайте слово',
      inputs: [{
        name: 'word',
        type: 'text',
        placeholder: 'Начните ввод'
      }],
      // По нажатию на кнопку ОК. Сохраняем слово в word 
      buttons: [{
        text: 'OK',
        handler: (blah) => {
          //Удаляем пробелы (если они есть)
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

  // Если отгадали слово, то вызывает окно alert
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

  //Очиищаем все поля
  private reloadApp() {
    this.word = '';
    this.model = null;
    this.itemsWord = [];
    this.showModalCreateWord();
  }

  public guess(value: string): void {
    const wordGuess = value.split(' ').join('').toLowerCase();
    if ( wordGuess === '' ) { return; }

    // Проверяем на быков и коров
    const result = this.getAnimals(wordGuess);
    this.itemsWord.unshift(`${wordGuess} - ${result.cow} коров, ${result.bull} быков`);
    if (this.word.length === result.bull) {
      this.showMessageWin().then(r => {});
    }
    this.model = '';
  }

  // Ищем коров
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

  // Ищем быков
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

  // Ищем зверьков
  private getAnimals(value: string) {
    const resultBull = this.getBull(value);
    const resultCow = this.getCow(value, resultBull.symbols);
    return {
      bull: resultBull.bull,
      cow: resultCow
    };
  }
}
