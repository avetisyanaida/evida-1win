import type {PropsWithChildren} from "react";

export interface ModalProps {
    onClose?: () => void;
    title: string;
}

export const ModalComponent = ({onClose, title, children}: PropsWithChildren<ModalProps>) => {
    return <div className={'modal-component'} >
        <div className="modal-content">
            <h2>{title}</h2>
            <button className={'close-btn'} onClick={onClose}>
                <i className={'icon close'}></i>
            </button>
            {children}
        </div>
    </div>
}