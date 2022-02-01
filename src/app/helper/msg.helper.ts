import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class Msg {
    constructor(
        private snakeBar: MatSnackBar
    ) { }

    showMessage(message: string) {
        this.snakeBar.open(message);
    }
}