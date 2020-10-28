export class Artist {
  public name: string;
  public imagePath: string;
  public numSongs: number;

  constructor(Name: string, ImagePath: string, NumSongs: number = 20) {

    this.name = Name;
    this.imagePath = ImagePath;
    this.numSongs = NumSongs;
  }

}
