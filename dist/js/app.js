$('.single-item').slick();



//UI Controller
const UICtrl = (function () {

    //Private Methods/Data
    const UISelector = {

        //Open Modal
        wishlist: '.wishlist',
        cart: '.cart',
        moreDetails: '.item-details',

        //Get Product Info
        productName: '.info p:nth-child(1)',
        productPrice: '.info p:nth-child(2)',

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

        //Cart Price
        totalCart: '#totalCart'
    }

    //Public Method to Access Private Methods/Data
    return {

        //Get Selectors
        getSelectors: function () {
            return UISelector;
        },

        getFlowerDetails: function () {
            return {
                name: document.querySelector(UISelector.productName).innerHTML,
                price: document.querySelector(UISelector.productPrice).innerHTML
            }
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
                positionClass: "nfc-top-right",
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
            document.querySelector(UISelector.totalCart).innerHTML = `RM${total}`;
        },

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
    }

})();

//User Controller
const UserCtrl = (function () {

    //User Constructor
    const User = function (id, username, password, totalCart) {

        this.id = id;
        this.username = username;
        this.password = password;
        this.totalCart = totalCart;
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
            newUser = new User(ID, user, passwd, 0);

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
        }

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
                    UserCtrl.setCurrentLoginUser(user);
                    UICtrl.setAccountState(true, user.username);
                    UICtrl.setTotalCart(user.totalCart);
                })
            }

        });

        //Add To Wishlist Event
        document.querySelectorAll(UISelector.wishlist).forEach(div => {
            div.addEventListener('click', addProductWishlist);
        });

        //Add To Cart Event
        document.querySelectorAll(UISelector.cart).forEach(div => {
            div.addEventListener('click', addProductCart)
        });

        //Add To Product Details Event
        document.querySelectorAll(UISelector.moreDetails).forEach(div => {
            div.addEventListener('click', viewProductDetails);
        });

        //Add Login Modal Event
        document.querySelector(UISelector.login).addEventListener('click', e => {

            const currentUser = UserCtrl.getCurrentLoginUser();
            if (currentUser) {

                //Logout
                UICtrl.setAccountState(false, "");
                UserCtrl.logoffUser();
                StorageCtrl.removeCurrentUserFromStorage();
                UICtrl.createNotification("Bye", "See You Again", "warning");
            } else {

                //Login
                MicroModal.show('modal-2');
            }
        });

        //Add Register Modal Event
        document.querySelector(UISelector.register).addEventListener('click', e => {
            MicroModal.show('modal-3')
        });

        //Add Login Event
        document.querySelector(UISelector.btnLogin).addEventListener('click', loginUser);

        //Add Register Event
        document.querySelector(UISelector.btnRegister).addEventListener('click', registerUser)
    }

    const addProductWishlist = function (e) {

        let name = e.target.parentNode.parentNode.parentNode.nextElementSibling.firstElementChild.innerHTML;
        let price = e.target.parentNode.parentNode.parentNode.nextElementSibling.lastElementChild.innerHTML;

        console.log(`${name} ${price}`);

        MicroModal.show('modal-1');
        e.preventDefault();
    }

    const addProductCart = function (e) {

        console.log("cart")

        e.preventDefault();
    }

    const viewProductDetails = function (e) {

        console.log("details")

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
                UICtrl.setTotalCart(users.totalCart);

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
            console.log('input empty');
        }

        e.preventDefault();
    }

    return {
        init: function () {

            //Load Even Listener
            loadEvenListener();
        }
    }
})(UICtrl, StorageCtrl, UserCtrl);


App.init();
MicroModal.init();
