import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular'
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    expenseReason: string;
    expenseAmount: number;

    currentExpenses: any[] = [];

    constructor(public alertController: AlertController, public toastController: ToastController) {

    }

    async presentAlert() {
        const alert = await this.alertController.create({
            header: 'Invalid Inputs',
            message: 'Please enter valid inputs!',
            buttons: ['Okay']
        });

        await alert.present();
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Please enter valid inputs!',
            duration: 2000,
            translucent: true,
            color: "medium",
        });
        toast.present();
    }

    getTotalExpenses() {
        let total = 0;
        for (let i = 0; i < this.currentExpenses.length; i++) {
            total += this.currentExpenses[i].amount;
        }
        return total;
    }

    clear() {
        this.expenseReason = null;
        this.expenseAmount = null;
    }

    addExpense() {
        if (this.expenseAmount > 0 && this.expenseReason.trim().length > 0) {
            let expense = { reason: this.expenseReason, amount: this.expenseAmount };
            this.currentExpenses.push(expense);
        }
        else {
            this.presentToast();
        }
    }
}
