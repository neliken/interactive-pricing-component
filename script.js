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
    constructor(element, handleOnMouseDown, calculatePrice) {
        this.calculatePrice = calculatePrice;
        this.pageViews = document.getElementById("pageViews");
        this.slider = document.getElementById("slideContainer");
        this.checkbox = document.getElementById("checkbox");
        this.priceAmount = document.getElementById("priceAmount");
        this.progressBar = document.getElementById("progress");
        this.sliderThumb = document.getElementById("slider-thumb");

        this.isLeftButtonMouseDown = false;
        this.handleOnMouseDown = handleOnMouseDown;
        this.element = element;

        if (this.element == null) {
            throw new Error("Element not found");
        }

        if (this.handleOnMouseDown) {
            this.onMouseDown();
            this.onMouseUp();
        }
    }
    onMouseDown() {
        this.element.addEventListener("mousedown", () => {
            this.isLeftButtonMouseDown = true;
        });
    }

    onMouseUp() {
        this.element.addEventListener("mouseup", () => {
            this.isLeftButtonMouseDown = false;
        });
    }

    onMouseMove(callback) {
        this.element.addEventListener("mousemove", (e) => {
            e.preventDefault();
            const { clientX, clientY } = e;

            if (this.isLeftButtonMouseDown || !this.handleOnMouseDown) {

                callback(clientX, clientY);
            }
        });
    }

    normalizePosition(x, y) {
        const bbox = this.slider.getBoundingClientRect();

        return {
            x: x - bbox.left,
            y: y - bbox.top
        };
    }

    onChangeSliderValue(e) {
        // this.sliderValue = this.slider.value;
        // this.pageViews.innerHTML = this.sliderValue;
        // this.priceAmount.innerHTML = this.calculatePrice.calculatePrice(this.sliderValue);
        //
        // let progressBarValue = (this.slider.value/10 - 5)/2 * 10;
        // this.progressBar.style.width = progressBarValue + '%'

        // this.sliderThumb.style.top =  + 'px';
        // this.sliderThumb.style.left = e.clientY + 'px';

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

const mousePositionHandler = new UpdateUI(
    document.querySelector(".card"),
    true,
    calculatePrice
);

mousePositionHandler.onMouseMove((x, y) => {
    const { x: normX, y: normY } = mousePositionHandler.normalizePosition(x, y);

    console.log(normX, normY)

    const posX = Math.max(Math.min(normX, 567), 0);

    console.log(posX)

    if (posX % 10 == 0)
    document.getElementById("slider-thumb").style.left = posX - 25 + 'px';
});
//
// let div = document.getElementById("slider-thumb");
// let container = document.getElementById("slideContainer");
// let mousePosition;
// let isDown = false;
// let offset = 25;
//
// container.addEventListener('click', function(event) {
//     event.preventDefault();
//     let clientRect = container.getBoundingClientRect();
//
//     if (event.clientX <= 825) {
//         mousePosition = event.clientX;
//         div.style.left = (mousePosition  - clientRect.left - offset) + 'px';
//     }
// }, true);
//
// div.addEventListener('mousedown', function(event) {
//     isDown = true;
// })
//
// div.addEventListener('mouseup', function(event) {
//     isDown = false;
// })
// div.addEventListener('mousemove', function(event) {
//     event.preventDefault();
//     let clientRect = container.getBoundingClientRect();
//
//     if (event.clientX <= 825 && isDown) {
//         mousePosition = event.clientX;
//         div.style.left = (mousePosition  - clientRect.left - offset) + 'px';
//     }
// }, true);