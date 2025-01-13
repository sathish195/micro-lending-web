import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Input_Name, Input_text, Number_Input } from '../comman/All-Inputs';

const PenaltyModal = ({ show, handleClose, handleSave }) => {
    const [amount, setAmount] = React.useState('');
    const [note, setNote] = React.useState('');

    const onSave = () => {
        handleSave(amount, note);
        setAmount('');
        setNote('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Calculate Penalty</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Penalty Amount</Form.Label>
                        <Number_Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Note</Form.Label>
                        <Input_text
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PenaltyModal;
