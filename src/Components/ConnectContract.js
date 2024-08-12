import { ethers } from 'ethers'
import ADDRESSES from '../utils/constants/ADDRESSES.json'

export const getPartnerAIContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contractABI = require('../utils/abis/Token.json')
    const contract = new ethers.Contract(
        ADDRESSES.TOKEN_ADDRESS,
        contractABI,
        signer,
    )
    return contract
}

export const getStakingContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contractABI = require('../utils/abis/Staking.json')
    const contract = new ethers.Contract(
        ADDRESSES.STAKING_ADDRESS,
        contractABI,
        signer,
    )
    return contract
}

export const getProvider = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    return {provider, signer}
}

export const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    let result = await signer.getBalance()
    result = parseFloat(ethers.utils.formatUnits(result))
  
    return result
  }

export const getPARTAIBalance = async (walletAddress) => {
    const contract = getPartnerAIContract()
    let response = await contract.balanceOf(walletAddress)
    response = parseFloat(ethers.utils.formatUnits(response))

    return response
}