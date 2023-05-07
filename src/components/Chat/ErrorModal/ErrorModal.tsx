import { Button, Modal } from "react-bootstrap";

export const ErrorModal = (props: { show: boolean, onClose: any }) => {
    return (
        <Modal show={props.show} onHide={props.onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>File size should be less than 25 MB.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}