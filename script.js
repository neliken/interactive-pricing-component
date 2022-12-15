class CalculatePrice{
    calculatePrice(pageViews) {
        return (pageViews / 10).toFixed(2);
    }
    calculateYearlyPayment(monthlyPrice) {
        return ((monthlyPrice * 12) * 75 / 100).toFixed(2);
    }

    calculateMonthlyPayment(yearlyPrice) {
        return (yearlyPrice / 12  / 75 * 100).toFixed(2);
    }
}

const calculatePrice = new CalculatePrice();

class UpdateUI {
    constructor(calculatePrice) {
        this.calculatePrice = calculatePrice;
        this.pageViews = document.getElementById("pageViews");
        this.slider = document.getElementById("slider");
        this.checkbox = document.getElementById("checkbox");
        this.priceAmount = document.getElementById("priceAmount");
        this.progressBar = document.getElementById("progress");
    }

    onChangeSliderValue() {
        this.sliderValue = this.slider.value;
        this.pageViews.innerHTML = this.sliderValue;
        this.priceAmount.innerHTML = this.calculatePrice.calculatePrice(this.sliderValue);

        let progressBarValue = (this.slider.value/10 - 5)/2 * 10;
        this.progressBar.style.width = progressBarValue + '%'

        if(this.checkbox.checked) {
            this.onClickCheckbox();
        }
    }


    onClickCheckbox() {
        let currentPrice = this.priceAmount.innerHTML;
        if(this.checkbox.checked) {
            this.yearlyPrice = this.calculatePrice.calculateYearlyPayment(currentPrice);
            this.priceAmount.innerHTML = this.yearlyPrice;
        } else {
            this.monthlyPrice = this.priceAmount.innerHTML = this.calculatePrice.calculateMonthlyPayment(currentPrice);
            this.priceAmount.innerHTML = this.monthlyPrice;
        }
    }
}

const updateUI = new UpdateUI(calculatePrice);
