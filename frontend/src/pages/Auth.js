import React, { useState, Fragment, useContext, useEffect } from 'react';
import './Auth.css';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import ModalContext from '../context/modal-context';
import SignUp from '../components/SignUp/SignUp';
import SignIn from '../components/SignIn/SignIn';

import InfoModal from '../components/Modal/Modal';


const AuthPage = () => {
    let [isLogin, setisLogin] = useState(false);
    let [isLoading, setIsLoading] = useState(false);
    let [showInfoModal, setShowInfoModal] = useState(false);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();

    useEffect(() => {
        cookie();
    }, []);

    const modalInfo = (show, header, text) => {
        setShowInfoModal(show);
        setModalHeader(header);
        setModalText(text);
    };

    const { login } = useContext(AuthContext);

    const switchModeHandler = () => {
        return setisLogin(!isLogin);
    };

    const cookie = () => {
        fetch('/cookie', {
            method: 'GET',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {

                login(
                    data.response.token,
                    data.response.userId
                );
            })
            .catch(err => {
                console.log('There is no cookie!');
            });
    };

    const submitHandler = (values) => {
        let time = JSON.stringify(new Date().getTime());
        setIsLoading(true);
        let query = {
            query: `
              query Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                  userId
                  token
                }
              }
            `,
            variables: {
                email: values.email,
                password: values.password
            }
        };
        if (isLogin) {
            query = {
                query: `
            mutation CreateUser($email: String!, $password: String!, $name: String!, $surname: String!, $createdAt: String!, $updatedAt: String!) {
              createUser(userInput: {email: $email, password: $password, name: $name, surname: $surname, createdAt: $createdAt, updatedAt: $updatedAt}) {
                _id
                email
              }
            }
          `,
                variables: {
                    email: values.email,
                    password: values.password,
                    name: values.firstName,
                    surname: values.lastName,
                    createdAt: time,
                    updatedAt: time
                }
            };
        }
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    setIsLoading(false);
                    throw (res.statusText);
                }
                return res.json();
            })
            .then(res => {
                if (res.data.login) {
                    setIsLoading(false);
                    login(
                        res.data.login.token,
                        res.data.login.userId,

                    );
                } else {
                    let args = {
                        userId: res.data.createUser._id,
                        creatorsEmail: res.data.createUser.email
                    };
                    createSettings(args, values);
                }
            })
            .catch(err => {
                setIsLoading(false);
                modalInfo(true, 'Oops!',`Your email or password is incorect.`);
                throw err;
            });
    };

    const createSettings = (args, values) => {
        let requestBody = {
            query: `
            mutation CreateSettings($dailyBudget: String!, $weeklyBudget: String!, $monthlyBudget: String!, $members: String!, $categories: String!,  $currency: String!, $userId: String!, $creatorEmail: String! ) {
                createSettings(settingsInput:{dailyBudget: $dailyBudget, weeklyBudget: $weeklyBudget, monthlyBudget: $monthlyBudget, members:$members, categories:$categories,currency:$currency, userId: $userId, creatorEmail: $creatorEmail}) {
                    _id
                   
                  }
              }
      `,
            variables: {
                dailyBudget: '',
                weeklyBudget: '',
                monthlyBudget: '',
                members: '',
                categories: '',
                currency: '',
                userId: args.userId,
                creatorEmail: args.creatorsEmail
            }
        };
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (!res.ok) {
                    setIsLoading(false);
                    throw (res.statusText);
                }
                return res.json();
            })
            .then(res => {
                if (res.errors) {
                    throw (res.errors[0].message);
                }
                if (res.data) {
                    modalInfo(true, 'Confirmation',`Hi ${values.firstName} ${values.lastName}, your account was created. Now You can sign in.`);
                    switchModeHandler();
                    setIsLoading(false);
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    }; 

    return (
        <ModalContext.Provider value={{ modalHeader, modalText, showInfoModal, setShowInfoModal }}>
            <AuthContext.Provider value={{ submitHandler, switchModeHandler }}>
                <InfoModal />
                {
                    isLoading ? <Spinner /> :
                        <Fragment>
                            {
                                isLogin ? <SignUp /> : <SignIn />
                            }
                        </Fragment>
                }

            </AuthContext.Provider>
        </ModalContext.Provider>
    );
};

export default AuthPage;