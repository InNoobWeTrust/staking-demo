import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ADDRESSES from '../utils/constants/ADDRESSES.json';

const SelectChainModal = (props) => {
  const chainOptions = {
      chainId: ADDRESSES.CHAINID,
      rpcUrl: `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
      label: 'Sepolia test network',
      token: 'ETH'
  }
    return (
    <div>
      <Modal isOpen={props.showChainModal} contentClassName='chain-body-modal' className='select-chain-modal' size='sm' toggle={props.mToggle} >
        <ModalHeader toggle={props.mToggle}>
          Switch Network
        </ModalHeader>
        <ModalBody>
          <div onClick={() => props.setChain(chainOptions)}>
            <img src="/ethereum.svg" class="icon-class"/>
            Sepolia Network
          </div>
          <hr/>
          <div onClick={() => props.disconnect()}>
            <img src="/logout.svg" class="icon-class"/>
             &nbsp;Disconnect
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default SelectChainModal;