import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

function ErroModal(props) {

    return (
    <div>
      <Modal isOpen={props.errorFlag} toggle={props.toggle} {...props} contentClassName='loading-modal'>
        <ModalBody>
          {props.errorContent}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ErroModal;