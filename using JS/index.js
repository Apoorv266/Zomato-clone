let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenOrder = false
let restaurantTimer = null;
let valetTimer = null;
let valetDeliveryTimer = null;
let isOrderDelivered = false

window.addEventListener("load", function () {
    document.getElementById('acceptOrder').addEventListener('click', function () {
        askRestaurantToAcceptOrReject();
    });

    document.getElementById('findValet').addEventListener('click', function () {
        startSearchingForValets();
    })


    this.document.getElementById('deliverOrder').addEventListener('click',function(){
        setTimeout(() => {
            isOrderDelivered = true;
        }, 2000); 
    })

    orderAcceptedFrmRestrant().then(isOrderAccepted => {
        if (isOrderAccepted) {
            startPreparingOrder()
        } else {
            this.alert("Initiating refund !")
        }
    }).catch(err => {
        console.log(err)
    })
})

// Step 1 - Waiting for retaurant to accept order
function askRestaurantToAcceptOrReject() {
    setTimeout(() => {
        isOrderAccepted = confirm("Should restaurant accept order?")
        hasRestaurantSeenOrder = true
    }, 1000);
}

// Step 2 - check if restaurant has accepted order
function orderAcceptedFrmRestrant() {
    var promise = new Promise((resolve, reject) => {
        // if restuarant has seen order but not accepting or rejecting then keep on checking if order accepted or rejected
        restaurantTimer = setInterval(() => {
            console.log("check restaurant status !")
            if (!hasRestaurantSeenOrder) {
                return
            }
            if (isOrderAccepted) resolve(true);
            else resolve(false);


            clearInterval(restaurantTimer);
        }, 2000);
    })
    return promise
}


//  Start preparing order or not
function startPreparingOrder() {
    Promise.allSettled([
        updateOrderStatus(),
        updateMapView(),
        // startSearchingForValets(),
        checkIfValetAssigned()
        // checkForOrderDelivery()
    ]).then(res => {
        console.log("res", res)
        setTimeout(() => {
            alert('How was your food? Rate your food and delivery partner');
        }, 5000);
    }).catch(err => {
        console.log(err)
    })
}


// Helper functions - Pure functions - does only one specific task and nothing else 

function updateOrderStatus() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById('currentStatus').innerText = isOrderDelivered ? 'Order successfully delivered' : 'Preparing your order';
            resolve('status updated');
        }, 1500);
    })
}


function updateMapView() {
    // Fake delay to get data
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById('mapview').style.opacity = '1';
            resolve('map initialised');
        }, 1000);
    });
}

function startSearchingForValets() {
    const valetPromises = []
    for (let i = 0; i < 5; i++) {
        valetPromises.push(getRandomDriver())
    }
    Promise.any(valetPromises).then((selectedValet) => {
        console.log("selectedValet", selectedValet);
        isValetFound = true
    }).catch(err => {
        console.log(err)
    })
}


function getRandomDriver() {
    // Fake delay to get location data from riders
    return new Promise((resolve, reject) => {
        const timeout = Math.random() * 1000
        setTimeout(() => {
            resolve('Valet - ' + timeout);
        }, timeout);
    })
}


function checkIfValetAssigned() {
    new Promise((resolve, reject) => {
        valetTimer = setInterval(() => {
            console.log("Searching valet")
            if (isValetFound) {
                updateValetDetails()
                resolve('updated valet details');
                clearInterval(valetTimer)
            }
        }, 1000);
    })
}


function updateValetDetails() {
    if (isValetFound) {
        document.getElementById("finding-driver").classList.add("none")
        document.getElementById("found-driver").classList.remove("none")
        document.getElementById("call").classList.remove("none")
    }
}


function checkIfOrderDelivered(){
    new Promise((resolve, reject) => {
        valetDeliveryTimer = setInterval(() => {
            console.log('is order delivered by valet ?');
            if (isOrderDelivered) {
                resolve('order delivered valet details');
                updateOrderStatus();
                clearTimeout(valetDeliveryTimer);
            }
        }, 1000);
    })
}