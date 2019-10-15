$('.single-item').slick();

//UI Controller
const UICtrl = (function () {

    //Private Methods/Data
    const UISelector = {

        //Open Modal
        wishlist: '.wishlist',
        cart: '.cart',

        //Open Modal
        register: '#register',
        login: '#login',
        allWishList: '#wishlist',

        //Register fields
        registerUsername: '#registerUsername',
        registerPassword: '#registerPassword',

        //Login fields
        loginUsername: '#loginUsername',
        loginPassword: '#loginPassword',

        //Login & Register Button
        btnLogin: '#btnLogin',
        btnRegister: '#btnRegister',

        //Welcome Username 
        username: '#username',

        //Error Message (Login/Register)
        errorLogin: '#errorLogin',
        errorRegister: '#errorRegister',

        //Cart Price Home Page
        totalCart: '#totalCart',

        //Modal Product Items
        modalPicture: '#showPicture',
        modalName: '#showName',
        modalPrice: '#showPrice',

        quantity: '#quantity',
        cartQuantity: '#cart_quantity',

        //Add To Cart Modal Button
        addToCart: '#addToCart',

        //Modal 1
        modalCart: '#modal-1',

        //Cart Table
        checkoutTable: '#checkoutTable',

        //Table body
        tableBody: '#table-body',

        //Cart Footer Item
        totalPrice: '#totalPrice',

        //Click Area
        clickSection: '#click-section',

    }

    //Public Method to Access Private Methods/Data
    return {

        //Get Selectors
        getSelectors: function () {
            return UISelector;
        },

        getLoginInput: function () {
            return {
                username: document.querySelector(UISelector.loginUsername).value,
                password: document.querySelector(UISelector.loginPassword).value
            }
        },

        getRegisterInput: function () {
            return {
                username: document.querySelector(UISelector.registerUsername).value,
                password: document.querySelector(UISelector.registerPassword).value
            }
        },

        createNotification: function (title, message, theme) {

            window.createNotification({
                closeOnClick: true,
                displayCloseButton: false,
                positionClass: "nfc-bottom-right",
                showDuration: 1500,
                theme: theme
            })({
                title: title,
                message: message
            });
        },

        clearLoginInput: function () {
            document.querySelector(UISelector.loginUsername).value = '';
            document.querySelector(UISelector.loginPassword).value = '';
            document.querySelector(UISelector.errorLogin).innerHTML = '';
        },

        clearRegisterInput: function () {
            document.querySelector(UISelector.registerUsername).value = '';
            document.querySelector(UISelector.registerPassword).value = '';
            document.querySelector(UISelector.errorRegister).innerHTML = '';
        },

        setAccountState: function (state, username) {
            if (state) {
                document.querySelector(UISelector.username).innerHTML = `Welcome ${username}`;
                document.querySelector(UISelector.login).innerHTML = 'Logout';
            } else {
                document.querySelector(UISelector.username).innerHTML = `Welcome user`;
                document.querySelector(UISelector.login).innerHTML = 'Login';
            }
        },

        setErrorLoginMsg: function (message) {
            document.querySelector(UISelector.errorLogin).innerHTML = message;
        },

        setErrorRegisterMsg: function (message) {
            document.querySelector(UISelector.errorRegister).innerHTML = message;
        },

        setTotalCart: function (total) {
            document.querySelector(UISelector.totalCart).innerHTML = `RM${total}.00`;
        },

        setModalInformation: function (id, price, name, picture) {
            document.querySelector(UISelector.modalPrice).innerHTML = price;
            document.querySelector(UISelector.modalName).innerHTML = name;
            document.querySelector(UISelector.modalPicture).src = picture;
            document.querySelector(UISelector.modalCart).dataset.product = id;
        },

        getModalInformation: function () {
            return {
                "id": document.querySelector(UISelector.modalCart).dataset.product,
                "product name": document.querySelector(UISelector.modalName).innerHTML,
                "total": document.querySelector(UISelector.modalPrice).innerHTML,
                "image": document.querySelector(UISelector.modalPicture).src,
                "quantity": document.querySelector(UISelector.quantity).value
            }
        },

        recomputeProductQuantity: function (increment) {

            let quantity = document.querySelector(UISelector.quantity).value;

            if (increment == "add") {
                document.querySelector(UISelector.quantity).value++;

            } else {
                if (quantity > 1) {
                    document.querySelector(UISelector.quantity).value--;
                }
            }
        },

        loadCartTableHead: function (table, data) {

            let thead = table.createTHead();
            let row = thead.insertRow();
            for (let key of data) {
                if (key == "id") continue;
                let th = document.createElement("th");
                let text = document.createTextNode(key);

                if (key == "name") {
                    text = document.createTextNode("Product Name");
                } else if (key == "src") {
                    text = document.createTextNode("Image");
                }

                th.appendChild(text);
                row.appendChild(th);
            }
        },

        sortObjKeysAlphabetically: function (obj) {
            let ordered = {};
            Object.keys(obj).sort().forEach(function (key) {
                ordered[key] = obj[key];
            });
            return ordered;
        },

        loadCartTableData: function (table, data) {

            let subTotal = 0;

            data.forEach(element => {

                const row = table.insertRow();

                let sortElement = UICtrl.sortObjKeysAlphabetically(element)

                for (key in sortElement) {

                    if (key == "id") continue;
                    const cell = row.insertCell();
                    const text = document.createTextNode(element[key]);



                    if (key == "image") {
                        const img = document.createElement('img');
                        img.className = 'table__img';
                        img.src = element[key];
                        cell.appendChild(img);
                    } else if (key == "quantity") {

                        //Create Quantity Box
                        const quantityBox = document.createElement('div');
                        quantityBox.className = "quantity-box";

                        //Create circleBtn(down)
                        const circleBtnMinus = document.createElement('div');
                        circleBtnMinus.classList.add('down');
                        circleBtnMinus.classList.add('circleBtn');
                        circleBtnMinus.dataset.productId = element.id;

                        //Create circleBtn(up)
                        const circleBtnPlus = document.createElement('div');
                        circleBtnPlus.classList.add('up');
                        circleBtnPlus.classList.add('circleBtn');
                        circleBtnPlus.dataset.productId = element.id;

                        //Create circleBtn(delete)
                        const circleBtnDelete = document.createElement('div');
                        circleBtnDelete.classList.add('delete');
                        circleBtnDelete.classList.add('circleBtn');
                        circleBtnDelete.style.backgroundColor = "red";
                        circleBtnDelete.dataset.deleteItem = element.id;

                        //Create Icon Down
                        const fontIconMinus = document.createElement('i');
                        fontIconMinus.classList.add('fas');
                        fontIconMinus.classList.add('fa-chevron-down');

                        //Create Icon Up
                        const fontIconPlus = document.createElement('i');
                        fontIconPlus.classList.add('fas');
                        fontIconPlus.classList.add('fa-chevron-up');

                        //Create Icon Times
                        const fontIconTrash = document.createElement('i');
                        fontIconTrash.classList.add('fas');
                        fontIconTrash.classList.add('fa-times');
                        fontIconTrash.style.color = "white";

                        //Create Input
                        const numberInput = document.createElement('input');

                        //Set Attribute
                        numberInput.id = `${UISelector.cartQuantity}-${element.id}`;
                        numberInput.setAttribute("type", "number");
                        numberInput.setAttribute("value", element[key]);
                        numberInput.disabled = true;
                        numberInput.style.fontWeight = "bold";

                        //Append Icon To Parent Div
                        circleBtnMinus.appendChild(fontIconMinus);
                        circleBtnPlus.appendChild(fontIconPlus);
                        circleBtnDelete.appendChild(fontIconTrash);

                        quantityBox.appendChild(circleBtnMinus);
                        quantityBox.appendChild(numberInput);
                        quantityBox.appendChild(circleBtnPlus);
                        quantityBox.appendChild(circleBtnDelete);
                        cell.appendChild(quantityBox);


                    } else if (key == "total") {

                        const price = parseInt(element.total.substr(2, 3));
                        const quantity = parseInt(element.quantity);
                        const total = price * quantity;
                        subTotal += parseInt(total);

                        cell.appendChild(document.createTextNode(`RM${total}.00`));

                    } else {
                        cell.appendChild(text);
                    }
                }

            });

            UICtrl.setTotalCart(subTotal);
            document.querySelector(UISelector.totalPrice).textContent = `RM${subTotal}.00`;

        },

        incrementCartValue: function (e) {
            const list = e.target.parentNode.classList;
            const cartInputFromDown = e.target.parentNode.nextElementSibling;
            const cartInputFromUp = e.target.parentNode.previousSibling;

            if (list.contains('up')) {

                cartInputFromUp.value++;

            } else {
                if (cartInputFromDown.value > 1) {
                    cartInputFromDown.value--;
                }

            }

            return {
                quantity: list.contains('up') ? cartInputFromUp.value : cartInputFromDown.value,
                id: list.contains('up') ? cartInputFromUp.id.substr(15) : cartInputFromDown.id.substr(15)
            }
        }
    }
})();


//Storage Controller
const StorageCtrl = (function () {

    return {
        storeUser: function (user) {
            let users;

            //Check if any users in ls
            if (localStorage.getItem('users') === null) {
                users = [];

                //Push new user
                users.push(user);

                //Set ls
                localStorage.setItem('users', JSON.stringify(users));
            } else {
                users = JSON.parse(localStorage.getItem('users'));

                //Push new user
                users.push(user);

                //Re set ls
                localStorage.setItem('users', JSON.stringify(users));
            }
        },

        getUserFromStorage: function () {
            let users;
            if (localStorage.getItem('users') === null) {
                users = [];
            } else {
                users = JSON.parse(localStorage.getItem('users'));
            }

            return users;
        },

        setCurrentUserFromStorage: function (user) {
            let currentUser;
            if (localStorage.getItem('currentUser') === null) {

                //Initialize Array
                currentUser = [];

                //Add Item To Array
                currentUser.push(user);

                //Add Array Item to Local Storage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        },

        getCurrentUserFromStorage: function () {
            let currentUser;
            if (localStorage.getItem('currentUser') === null) {
                currentUser = [];
            } else {
                currentUser = JSON.parse(localStorage.getItem('currentUser'));
            }

            return currentUser;
        },

        removeCurrentUserFromStorage: function () {
            localStorage.removeItem('currentUser');
        },

        addProductToUser: function (userID, product) {
            let users = JSON.parse(localStorage.getItem('users'));

            users.forEach(user => {
                let flowerArray;

                if (user.id == userID) {
                    if ('flowers' in user) {
                        flowerArray = user.flowers;

                        flowerArray.forEach((flower, index) => {
                            if (flower.id == product.id) {
                                product.quantity = parseInt(product.quantity) + parseInt(flower.quantity);
                                flowerArray.splice(index, 1);
                            }
                        });

                    } else {
                        flowerArray = [];
                    }

                    flowerArray.push(product)
                    user.flowers = flowerArray;
                };
            });

            localStorage.setItem('users', JSON.stringify(users));
        },

        updateProductToUser: function (userID, id, quantity) {
            let users = JSON.parse(localStorage.getItem('users'));

            users.forEach(user => {
                let flowerArray;

                if (user.id == userID) {
                    if ('flowers' in user) {
                        flowerArray = user.flowers;

                        flowerArray.forEach((flower, index) => {
                            if (flower.id == id) {

                                flower.quantity = quantity;
                            }
                        });

                    } else {
                        flowerArray = [];
                    }

                    user.flowers = flowerArray;
                };
            });
            localStorage.setItem('users', JSON.stringify(users));
        },

        clearCart: function () {
            let users = JSON.parse(localStorage.getItem('users'));
            let currentUser = UserCtrl.getCurrentLoginUser();

            users.forEach(user => {
                if (user.id == currentUser.id) {
                    delete user.flowers;
                }
            });

            localStorage.setItem('users', JSON.stringify(users));
        },

        removeItemFromCart: function (id) {
            let users = JSON.parse(localStorage.getItem('users'));
            let currentUser = UserCtrl.getCurrentLoginUser();

            users.forEach(user => {
                if (user.id == currentUser.id) {
                    let flowerToDelete = user.flowers;

                    flowerToDelete.forEach((flower, index) => {
                        if (flower.id == id) {
                            flowerToDelete.splice(index, 1);
                        }
                    });
                }
            });

            localStorage.setItem('users', JSON.stringify(users));
        },

        recomputeTotalPrice: function () {
            let users = JSON.parse(localStorage.getItem('users'));
            let currentUser = UserCtrl.getCurrentLoginUser();
            let total = 0;
            let userFlowers

            users.forEach(user => {
                if (user.id == currentUser.id) {
                    if ('flowers' in user) {
                        userFlowers = user.flowers;
                        userFlowers.forEach(flower => {
                            let flowerNumeric = flower.total.substr(2, 3)
                            total += (parseInt(flowerNumeric) * parseInt(flower.quantity));
                        });
                    }
                }
            });
            return total;
        }
    }

})();

//User Controller
const UserCtrl = (function () {

    //User Constructor
    const User = function (id, username, password) {

        this.id = id;
        this.username = username;
        this.password = password;
    }

    const data = {
        users: StorageCtrl.getUserFromStorage(),
        currentLoginUser: null,
    }


    return {
        //Add to users data.users array
        addUser: function (user, passwd) {

            let ID;

            //Create Increment ID
            if (data.users.length > 0) {
                ID = data.users[data.users.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Craete New User Object
            newUser = new User(ID, user, passwd);

            //Add To Users Array
            data.users.push(newUser);

            return newUser;

        },

        getUserByUsername: function (username) {
            let found = null;

            data.users.forEach(user => {
                if (user.username === username) {
                    found = user;
                }
            })

            return found;
        },

        setCurrentLoginUser: function (currentUser) {
            data.currentLoginUser = currentUser;
        },

        getCurrentLoginUser: function () {
            return data.currentLoginUser;
        },

        logoffUser: function () {
            data.currentLoginUser = null;
        },


    }

})();


const App = (function (UICtrl, StorageCtrl, UserCtrl) {

    const loadEvenListener = function () {

        //Get UI Selector 
        const UISelector = UICtrl.getSelectors();

        //Reload Current User Event
        window.addEventListener('DOMContentLoaded', e => {
            const currentUser = StorageCtrl.getCurrentUserFromStorage();


            if (currentUser.length !== 0) {
                currentUser.forEach(user => {

                    //Set Current Login
                    UserCtrl.setCurrentLoginUser(user);

                    //Set To Logout
                    UICtrl.setAccountState(true, user.username);

                    //Set Total Cart Price
                    loadTotalCartPrice();
                })
            }

        });

        //Add To Wishlist Event
        document.querySelectorAll(UISelector.wishlist).forEach(div => {
            div.addEventListener('click', addProductWishlist);
        });

        //Add To Cart Event Modal
        document.querySelectorAll(UISelector.cart).forEach(div => {
            div.addEventListener('click', openProductModal);
        });

        //Add Login Modal Event
        document.querySelector(UISelector.login).addEventListener('click', openLoginModal);

        //Add Register Modal Event
        document.querySelector(UISelector.register).addEventListener('click', e => {
            MicroModal.show('modal-3')
        });

        //Add Login Event
        document.querySelector(UISelector.btnLogin).addEventListener('click', loginUser);

        //Add Register Event
        document.querySelector(UISelector.btnRegister).addEventListener('click', registerUser);

        //Add Flower To Cart Event
        document.querySelector(UISelector.addToCart).addEventListener('click', addProductCart);

        //Open Total Cart Modal
        document.querySelector(UISelector.totalCart).addEventListener('click', openCartModal);

        //Event Delegation
        document.querySelector(UISelector.clickSection).addEventListener('click', eventDelegation);

    }

    //Increment Value
    const eventDelegation = function (e) {


        const itemTarget = e.target.parentNode;

        if (itemTarget.classList.contains('circleBtn') && itemTarget.classList.contains('delete')) {

            //Delete Specific Item From Cart
            StorageCtrl.removeItemFromCart(itemTarget.dataset.deleteItem);

            //Repopulate Cart Data
            loadTableData();

        } else if (itemTarget.classList.contains('up') || itemTarget.classList.contains('down')) {

            //Alter Input Value In Cart Modal
            const updateDetails = UICtrl.incrementCartValue(e);
            const currentUser = UserCtrl.getCurrentLoginUser().id;
            StorageCtrl.updateProductToUser(currentUser, updateDetails.id, updateDetails.quantity);
            loadTableData();

        } else if (itemTarget.classList.contains('circleBtn')) {

            //Alter Input Value In Product Modal
            incrementValue(e);
        }

        e.preventDefault();
    }

    //MODALS
    const openCartModal = function () {
        if (UserCtrl.getCurrentLoginUser() !== null) {
            loadTableData();
            MicroModal.show('modal-4');
        } else {

            MicroModal.show('modal-2');
        }
    }

    const openProductModal = function (e) {

        //Get Data From Clicked Item
        let id = e.target.parentNode.parentNode.parentNode.nextElementSibling.dataset.id;
        let name = e.target.parentNode.parentNode.parentNode.nextElementSibling.firstElementChild.innerHTML;
        let price = e.target.parentNode.parentNode.parentNode.nextElementSibling.lastElementChild.innerHTML;
        let picture = e.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.src;

        //Set Item To Modal
        UICtrl.setModalInformation(id, price, name, picture);

        //Open Modal
        MicroModal.show('modal-1');

        e.preventDefault();
    }

    const openLoginModal = function () {
        const currentUser = UserCtrl.getCurrentLoginUser();
        if (currentUser) {

            //Logout
            UICtrl.setAccountState(false, "");
            UserCtrl.logoffUser();
            UICtrl.setTotalCart("0");
            StorageCtrl.removeCurrentUserFromStorage();
            UICtrl.createNotification("Bye", "See You Again", "warning");
        } else {

            //Login
            MicroModal.show('modal-2');
        }
    }

    const loadTotalCartPrice = function () {
        const total = StorageCtrl.recomputeTotalPrice()

        UICtrl.setTotalCart(total);
    }

    //Computations
    const addProductWishlist = function () {

    }

    const addProductCart = function (e) {

        if (UserCtrl.getCurrentLoginUser() !== null) {
            const user = UserCtrl.getCurrentLoginUser().id;
            const productInfo = UICtrl.getModalInformation();

            StorageCtrl.addProductToUser(user, productInfo);
            loadTotalCartPrice();
            MicroModal.close('modal-1');
            UICtrl.createNotification("Added", "Item has been added to cart", "success");
        } else {
            MicroModal.close('modal-1');
            MicroModal.show('modal-2');
        }


        e.preventDefault();
    }

    const loginUser = function (e) {

        const input = UICtrl.getLoginInput();

        if (input.username !== '' && input.password != '') {

            const users = UserCtrl.getUserByUsername(input.username);

            if (users && users.username == input.username && users.password == input.password) {


                //Set current login user
                UserCtrl.setCurrentLoginUser(users);

                //Set Welcome User
                UICtrl.setAccountState(true, users.username);

                //Clear Register Input Field
                UICtrl.clearLoginInput();

                //Set Current User Local Storage State
                StorageCtrl.setCurrentUserFromStorage(users);

                //Set Total Cart Price
                loadTotalCartPrice();

                //Close Modal
                MicroModal.close('modal-2');

                //Show Login Notification
                UICtrl.createNotification("Welcome", `Glad To See You Again ${users.username}`, "success");


            } else {
                UICtrl.setErrorLoginMsg("Invalid Username or Password");
            }

        } else {
            UICtrl.setErrorLoginMsg("Input Must Not Be Empty");
        }



        e.preventDefault();
    }

    const registerUser = function (e) {

        const input = UICtrl.getRegisterInput();
        const users = UserCtrl.getUserByUsername(input.username);

        if (input.username !== '' && input.password != '') {

            if (!users) {
                //Add New User to Array
                const newUser = UserCtrl.addUser(input.username, input.password);

                //Add New User to Local Storage
                StorageCtrl.storeUser(newUser);

                //Close login modal
                MicroModal.close('modal-3');

                //Clear Input
                UICtrl.clearRegisterInput();

                //Success Notification
                UICtrl.createNotification("Account", "Successfully Created, Please Login", "success")
            } else {
                UICtrl.setErrorRegisterMsg("Username has been taken");
            }

        } else {
            UICtrl.setErrorLoginMsg("Input Must Not Be Empty");
        }

        e.preventDefault();
    }

    const incrementValue = function (e) {

        const list = e.target.parentNode.classList;

        if (list.contains('plus')) {
            UICtrl.recomputeProductQuantity("add")

        } else {
            UICtrl.recomputeProductQuantity("minus")
        }
    }

    const loadTableData = function () {

        const UISelector = UICtrl.getSelectors();
        const userFromStorage = JSON.parse(localStorage.getItem('users'));
        const currentUser = UserCtrl.getCurrentLoginUser();

        const userFromId = userFromStorage
            .filter(userFromStorage => userFromStorage.id == currentUser.id)
            .map(userFlower => userFlower.flowers);

        let table = document.querySelector(UISelector.checkoutTable);
        table.innerHTML = '';
        let keyHeader = userFromId[0][0];
        if (keyHeader == undefined) {
            UICtrl.setTotalCart('0');
            document.querySelector(UISelector.totalPrice).textContent = `RM0.00`;
        } else {
            let allData = userFromId[0];
            let data = Object.keys(UICtrl.sortObjKeysAlphabetically(keyHeader));

            UICtrl.loadCartTableData(table, allData);
            UICtrl.loadCartTableHead(table, data);
        }

    }

    return {
        init: function () {

            //Load Event Listener
            loadEvenListener();

        }
    }
})(UICtrl, StorageCtrl, UserCtrl);


App.init();
MicroModal.init();
