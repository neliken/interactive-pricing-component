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

    normalizePosition(x, y, xMax) {
        const bbox = this.slider.getBoundingClientRect();

        return {
            x: x - bbox.left,
            y: y - bbox.top,
            xMax: window.screen.width - bbox.left - bbox.width,
        };
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

mousePositionHandler.onMouseMove((x, y, xMax) => {
    const { x: normX, y: normY, xMax: maxX } = mousePositionHandler.normalizePosition(x, y, xMax);
    const posX = Math.max(Math.min(normX, 560), 0);

    if(posX % 10 == 0) {
        document.getElementById("slider-thumb").style.left = posX - 25 + 'px';
        document.getElementById("progress").style.width = posX + 560 / 100 + 'px'; // 560 - xMax

        let pageViews = posX + 560 / 100 - 5.6 + 10;
        mousePositionHandler.pageViews.innerHTML = pageViews.toFixed();
        mousePositionHandler.priceAmount.innerHTML = mousePositionHandler.calculatePrice.calculatePrice((posX + 560 / 100).toString());

        if(mousePositionHandler.checkbox.checked) {
            mousePositionHandler.onClickCheckbox();
        }
    }
});