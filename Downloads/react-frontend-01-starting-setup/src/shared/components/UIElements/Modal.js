import React from 'react';
import './Modal.css'
import ReactDom from 'react-dom';
import Backdrop from './Backdrop';
import { CSSTransition } from 'react-transition-group';

const Modal = props =>{
 return <React.Fragment>
     {props.show && <Backdrop onClick={props.onCancel}></Backdrop>}
     <CSSTransition in= {props.show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
         {/* easy, spread operator, props defined in Modal get passed in ModalOverlay Component */}
         <ModalOverlay {...props}></ModalOverlay>
     </CSSTransition>
 </React.Fragment>
};

const ModalOverlay = props =>{
    const content = <div className={`modal ${props.className}`} style = {props.style} >
        <header className={`modal__header ${props.headerClass}` }>
             {props.header}
        </header>
        <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
            <div className={`modal__content ${props.contentClass}`}>
                {props.children}
            </div>
            <footer className={`modal__footer ${props.footerClass}`}>
                {props.footer}
            </footer>
        </form>
        
    </div>
return ReactDom.createPortal(content , document.getElementById('modal-hook'));
};

export default Modal;