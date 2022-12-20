const data = [
    {
        views: "10K",
        price: 8
    },
    {
        views: "50K",
        price: 12
    },
    {
        views: "100K",
        price: 16
    },
    {
        views: "500K",
        price: 24
    },
    {
        views: "1M",
        price: 36
    }
]
class CalculatePrice{
    calculatePageViews(position) {
        return data[position].views;
    }

    calculatePrice(position) {
        return data[position].price.toFixed(2);
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


function createData(steps, max) {
    const arr = [];
    const unit = max / steps;

    for (let i = 0; i < steps + 1; i++) {
        arr.push(unit * i);
    }

    return arr;
}

let arr = createData(4, 560);

function findInRange(values, valueToFind) {

    for (let i = 0; i < values.length-1; i++) {
        if (valueToFind >= values[i] && valueToFind <= values[i+1]) {
            if(valueToFind == values[i+1]) {
                return i+1;
            }
            return i;
        }
    }

    return -1;
}

mousePositionHandler.onMouseMove((x, y, xMax) => {
    const { x: normX, y: normY, xMax: maxX } = mousePositionHandler.normalizePosition(x, y, xMax);
    const posX = Math.max(Math.min(normX, 560), 0);

    document.getElementById("slider-thumb").style.left = posX - 25 + 'px';
    document.getElementById("progress").style.width = posX + 560 / 100 + 'px'; // 560 - xMax

    let step = findInRange(arr, posX);
    if(arr[step] <= posX) {
        mousePositionHandler.pageViews.innerHTML = mousePositionHandler.calculatePrice.calculatePageViews(step);
        mousePositionHandler.priceAmount.innerHTML = mousePositionHandler.calculatePrice.calculatePrice(step);
    
        if(mousePositionHandler.checkbox.checked) {
            mousePositionHandler.onClickCheckbox();
        }
    }
});