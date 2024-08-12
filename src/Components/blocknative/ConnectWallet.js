import { useEffect, useState } from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
import { truncateAddress } from "../../utils/tools";
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import ADDRESSES from '../../utils/constants/ADDRESSES.json';
import SelectChainModal from '../SelectChainModal';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  background: transparent;
  border-radius: 3px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  &.active {
    background: linear-gradient(180deg, #e2a2fe 0%, #a423ed 100%);
}
`;
const StyledDropButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  background: transparent;
  border-radius: 3px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  &.active {
    background: linear-gradient(180deg, #e2a2fe 0%, #a423ed 100%);
}
`;
export default function ConnectWallet({ setErrorFlag, setErrorContent, getStakingId, getValueByPlan,setAccount, account }) {
    let provider;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [ wrongChain, setWrongChain ] = useState(false)
    const [ showChainModal, setShowChainModal ] = useState(false)
    const mToggle = () => {
        setShowChainModal(false)
    };
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const [
        {
          chains, // the list of chains that web3-onboard was initialized with
          connectedChain, // the current chain the user's wallet is connected to
          settingChain // boolean indicating if the chain is in the process of being set
        },
        setChain // function to call to initiate user to switch chains in their wallet
      ] = useSetChain()

    useEffect(() => {
        if (!wallet?.provider) {
            provider = null
        } else {
            provider = new ethers.providers.Web3Provider(wallet.provider, 'any');
        }
    }, [wallet])

    const chainOptions = {
        chainId: ADDRESSES.CHAINID,
        rpcUrl: `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
        label: 'Sepolia test network',
        token: 'ETH'
    }

    const handleChain = () => {
        setShowChainModal(true)
    }

    useEffect(() => {
        if (wallet?.provider) {
            const { name, avatar } = wallet?.accounts[0].ens ?? {};
            console.log("ski312-account", account)
            if(ADDRESSES.CHAINID !== connectedChain.id) {
                setWrongChain(true)
            } else {
                setErrorFlag(false)
                setAccount({
                    address: wallet.accounts[0].address,
                    balance: wallet.accounts[0].balance,
                    ens: { name, avatar: avatar?.url }
                });
                setWrongChain(false)
            }
        }
    }, [wallet, connectedChain]);
    
    if (wallet?.provider && account) {
        return (
            <>
                <SelectChainModal showChainModal={showChainModal} setChain={() =>setChain(chainOptions)} disconnect={() => disconnect({ label: wallet.label })} mToggle={mToggle}/>
                <div className='d-flex align-items-center justify-content-center'>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret size="lg" style={ wrongChain ? { backgroundColor: "red" } : { backgroundColor: "black" } }>
                        { wrongChain ? 
                            <div className='wrong-chain' onClick={() => handleChain()}>
                                Wrong network
                            </div>
                            : truncateAddress(account.address) 
                        }
                        </DropdownToggle>
                        { !wrongChain &&  
                            <DropdownMenu style={{ backgroundColor: "black" }}>
                                <DropdownItem className='cutom-dropdown-item' style={{ backgroundColor: "black" }}>
                                    <StyledDropButton className='active' style={{ height: '100%', width: '100%' }} onClick={() => disconnect({ label: wallet.label })}>Disconnect</StyledDropButton>
                                </DropdownItem>
                            </DropdownMenu>
                        }
                    </Dropdown>
                </div>
                
            </>
        );
    }
    return (
        <>
            <StyledButton className='active' style={{ height: 40 }} disabled={connecting} onClick={() => connect()}>
                Connect
            </StyledButton>
        </>
    );
}