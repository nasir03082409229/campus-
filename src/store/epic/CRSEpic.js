import {
    Observable
} from 'rxjs'
import CRSAction from "../actions/CRSAction";
import * as firebase from 'firebase';
import config from './config';

const postRef = firebase.database().ref('posts');
const userRef  = firebase.database().ref('users');
const ref = firebase.database().ref('/');
export default class CRSEpic {


    
    static applyToJob = (action$) => {
        return action$.ofType(CRSAction.APPLY_TO_JOB)
            .switchMap(({
                payload
            }) => {
                console.log(payload)
                return Observable.fromPromise(
                    userRef.child(`/${firebase.auth().currentUser.uid}/appliedPost`).push(payload).then(()=>{
                        // alert('Post Created Successfully') payload = PostKey
                        postRef.child(`${payload}/appliedstudent/`).push(firebase.auth().currentUser.uid).then(()=>{
                             
                        });
                    }).catch((re)=>{ console.log(re.message)})  
                )
                    .map((x) => {
                        return {
                            type: CRSAction.NULL
                        }
                    })
            })
    }

    

    static getUsers = (action$) => {
        return action$.ofType(CRSAction.GET_USERS)
            .switchMap(({
                payload
            }) => {
                return new Observable((observer) => {
                    userRef.on('child_added', (s) => {
                        observer.next({
                            type: CRSAction.GET_USER_ADD,
                            payload: {
                                key: s.key,
                                userData: s.val()
                            }
                        })
                    })
                    userRef.on('child_changed', (s) => {
                        console.log(s.val(), s.key)
                        // alert('child_changed')
                        observer.next({
                            type: CRSAction.GET_USER_PROFILE,
                            payload: {
                                key: s.key,
                                userData: s.val()
                            }
                        })
                    })

                }).takeUntil(action$.ofType('LOGOUT'));
            })
    }

    static updateProfile = (action$) => {
        return action$.ofType(CRSAction.UPDATE_PROFILE)
            .switchMap(({
                payload
            }) => {
                console.log(payload)
                return Observable.fromPromise(
                    userRef.child(`${firebase.auth().currentUser.uid}`).set(payload).then(()=>{
                        alert('Profile Updated Successfully')
                    })
                )
                    .map((x) => {
                        return {
                            type: CRSAction.NULL
                        }
                    })
            })
    }

    static addPost = (action$) => {
        return action$.ofType(CRSAction.ADD_POST)
            .switchMap(({
                payload
            }) => {
                console.log(payload)
                return Observable.fromPromise(
                    postRef.push(payload).then(()=>{
                        alert('Post Created Successfully')
                    })
                )
                    .map((x) => {
                        return {
                            type: CRSAction.NULL
                        }
                    })
            })
    }

    static deletePost = (action$) => {
        return action$.ofType(CRSAction.DELETE_POST)
            .switchMap(({
                payload
            }) => {
                // console.log('Nasir')
                return Observable.fromPromise(
                    postRef.child(`/${payload}/`).set(null)
                )
                    .map((x) => {
                        return {
                            type: CRSAction.NULL
                        }
                    })
            })
    }
    static updatePost = (action$) => {
        // alert('asnias')
        return action$.ofType(CRSAction.UPDATE_POST)
            .switchMap(({
                payload
            }) => {
                console.log(payload)
                return Observable.fromPromise(
                    postRef.child(`${payload.key}`).set(payload.postData)
                )
                    .map((x) => {
                        return {
                            type: CRSAction.NULL
                        }
                    })
            })
    }



    static getPost = (action$) => {
        return action$.ofType(CRSAction.GET_POST)
            .switchMap(({
                payload
            }) => {
                return new Observable((observer) => {
                    postRef.on('child_added', (s) => {
                        observer.next({
                            type: CRSAction.GET_POST_ADD,
                            payload: {
                                key: s.key,
                                postData: s.val()
                            }
                        })
                    })
                    postRef.on('child_removed', (s) => {
                        console.log(s.val(), s.key)
                        observer.next({
                            type: CRSAction.GET_POST_DELETE,
                            payload: s.key
                        })
                    })
                    postRef.on('child_changed', (s) => {
                        console.log(s.val(), s.key)
                        // alert('child_changed')
                        observer.next({
                            type: CRSAction.GET_POST_UPDATE,
                            payload: {
                                key: s.key,
                                postData: s.val()
                            }
                        })
                    })

                }).takeUntil(action$.ofType('LOGOUT'));
            })
    }


    static getCancelLogout = (action$) =>
        action$.ofType('LOGOUT')
            .switchMap(({ payload }) => {
                ref.off();
                postRef.off();
                return Observable.of({ type: CRSAction.NULL})
                //we dont want to do any work on GET_TODO_CANCELLED so we are dispatching NULL action
            })






}








