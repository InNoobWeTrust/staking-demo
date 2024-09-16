import {
    useEffect,
    useState,
} from 'react';
import {
    useWagmiConfig,
} from '@web3-onboard/react';
import {
    formatEther,
    parseEther,
} from 'viem';
import { waitForTransactionReceipt } from '@web3-onboard/wagmi';
import logo from '../assets/images/logo.png';
import ADDRESSES from '../utils/constants/ADDRESSES.json';
import { Row, Col } from 'reactstrap';
import {
    StyledButton, StyledWrapper, ToggleButtons,
} from './StyledComponent';
import ConnectWallet from './blocknative/ConnectWallet';
import ErroModal from './ErroModal';
import Loading from './Loading';
import CAlert from './CAlert';
import {
    readPartnerAiContractAllowance,
    readPartnerAiContractBalanceOf,
    readStakingContractCanWithdrawAmount,
    readStakingContractEarnedToken,
    readStakingContractPlans,
    readStakingContractTotalRewardsPerWalletPerPlan,
    writePartnerAiContractApprove,
    writeStakingContractClaimEarned,
    writeStakingContractStake,
    writeStakingContractUnstake,
} from '../contract.generated';

const Staking = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertFlag, setAlertFlag] = useState(false);
    const [type, setType] = useState("info");
    const [aContent, setAContent] = useState("Success");
    const [timestamp, setTimestamp] = useState('30');
    const [direction, setDirection] = useState('Stake');
    const [stakeAmount, setStakeAmount] = useState(0);
    const [errorContent, setErrorContent] = useState("");
    const [allowanceValue, setAllowanceValue] = useState(0);
    const [stakingInfo, setStakingInfo] = useState({
        totalStaked: '0',
        canWithdraw: '0',
        totalClaimed: '0',
        pendingReward: '0',
        apy: '0',
    })
    const toggleTimestamp = (timestamp) => setTimestamp(timestamp);
    const toggleDirection = (direction) => setDirection(direction);
    const [errorFlag, setErrorFlag] = useState(false);
    const [account, setAccount] = useState(null);
    const toggle = () => setErrorFlag(!errorFlag);

    const wagmiConfig = useWagmiConfig();

    useEffect(() => {
        if (account) {
            const walletAdd = account.address
            setWalletAddress(walletAdd)
            const stakingId = getStakingId()
            getValueByPlan(stakingId, walletAdd);
        } else {
            setStakingInfo({
                totalStaked: '0',
                canWithdraw: '0',
                totalClaimed: '0',
                pendingReward: '0',
                apy: '0',
            })
        }
        // eslint-disable-next-line
    }, [account, timestamp]);

    const getValueByPlan = async (stakingId, _walletAddress) => {
        const allowValue = await readPartnerAiContractAllowance(wagmiConfig, {
            args: [_walletAddress, ADDRESSES.STAKING_ADDRESS],
        });
        setAllowanceValue(allowValue)
        const plan = await readStakingContractPlans(wagmiConfig, {
            args: [stakingId],
        })
        let canWithdraw = await readStakingContractCanWithdrawAmount(wagmiConfig, {
            args: [stakingId, _walletAddress],
        })
        let totalStaked = canWithdraw[0];
        totalStaked = parseFloat(formatEther(totalStaked)).toString()
        canWithdraw = parseFloat(formatEther(canWithdraw[1])).toString()
        let pendingReward = (await readStakingContractEarnedToken(wagmiConfig, {
            args: [stakingId, _walletAddress],
        }))
        pendingReward = parseFloat(formatEther(pendingReward)).toString()
        let totalClaimed = (await readStakingContractTotalRewardsPerWalletPerPlan(wagmiConfig, {
            args: [stakingId, _walletAddress],
        }))
        totalClaimed = parseFloat(formatEther(totalClaimed)).toString()
        // Ref: https://viem.sh/docs/faq.html#why-is-a-contract-function-return-type-returning-an-array-instead-of-an-object
        let apy = plan[2].toString(); // `apr` field
        setStakingInfo({
            totalStaked,
            canWithdraw,
            totalClaimed,
            pendingReward,
            apy,
        })
    }


    // Get stakingId by timestamp
    const getStakingId = () => {
        let sId = 0n;
        if (timestamp === '30') {
            sId = 0n;
        } else if (timestamp === '60') {
            sId = 1n;
        } else if (timestamp === '90') {
            sId = 2n;
        } else if (timestamp === '120') {
            sId = 3n;
        } else {
            setErrorFlag(true)
            setErrorContent("Please select staking pool!")
            setLoading(false)
        }
        return sId;
    }

    // Alert dismiss function
    const onDismiss = () => setAlertFlag(false);

    // Get all token of owner wallet when user click 'max' button
    const getAllToken = async () => {
        if (direction === 'Stake') {
            const tokenBalance = parseFloat(formatEther(await readPartnerAiContractBalanceOf(wagmiConfig, {
                args: [walletAddress],
            })));
            setStakeAmount(tokenBalance)
        } else if (direction === 'Withdraw') {
            setStakeAmount(stakingInfo.canWithdraw)
        }
    }

    const handleSWCClick = async () => {
        setLoading(true)
        let amount = parseEther(stakeAmount.toString());
        const stakingId = getStakingId();
        if (direction === "Claim") {
            try {
                if (Number(stakingInfo.pendingReward) === 0) {
                    setAContent("You don't have claimed value.")
                    setAlertFlag(true)
                    setType("danger")
                    setLoading(false)
                } else {
                    const claimHash = await writeStakingContractClaimEarned(wagmiConfig, {
                        args: [stakingId],
                    });
                    waitForTransactionReceipt(wagmiConfig, {
                        hash: claimHash,
                    });
                    getValueByPlan(stakingId, walletAddress);
                    setLoading(false)
                    setAContent("Claim Success!")
                    setAlertFlag(true)
                    setType("info")
                }
            } catch (err) {
                setErrorContent("Claim issue!")
                console.log(err)
                setErrorFlag(true)
                setLoading(false)
            }
        } else if (Number(stakeAmount) === 0) {
            if (direction === 'Stake') {
                setAContent("Staking Amount cannot be zero")
            } else if (direction === 'Withdraw') {
                setAContent("Withdraw Amount cannot be zero")
            }
            setAlertFlag(true)
            setType("danger")
            setLoading(false)
        } else {
            if (direction === 'Stake') {
                const tokenBalance = parseFloat(formatEther(await readPartnerAiContractBalanceOf(wagmiConfig, {
                    args: [walletAddress],
                })));
                if (stakeAmount > tokenBalance) {
                    setAContent("Balance is not enough")
                    setAlertFlag(true)
                    setType("danger")
                    setLoading(false)
                } else {
                    try {
                        const planStatus = await readStakingContractPlans(wagmiConfig, { args: [stakingId] })
                        if (planStatus.conclude) {
                            setErrorContent("Your plan is concluded!")
                            setErrorFlag(true)
                            setLoading(false)
                        } else {

                            if (Number(amount) > Number(allowanceValue)) {
                                const approveHash = await writePartnerAiContractApprove(wagmiConfig, {
                                    args: [ADDRESSES.STAKING_ADDRESS, amount],
                                })
                                waitForTransactionReceipt(wagmiConfig, {
                                    hash: approveHash,
                                })
                            }
                            const stakingHash = await writeStakingContractStake(wagmiConfig, {
                                args: [stakingId, amount],
                            })
                            waitForTransactionReceipt(wagmiConfig, {
                                hash: stakingHash,
                            })
                            getValueByPlan(stakingId, walletAddress);
                            setLoading(false)
                            setAContent("Staking Success!")
                            setAlertFlag(true)
                            setType("info")

                        }
                    } catch (err) {
                        setLoading(false)
                        console.log("ski312-err", err)
                    }
                }
            } else if (direction === "Withdraw") {
                try {
                    if (stakeAmount > Number(stakingInfo.totalStaked)) {
                        setAContent(`You can't withdraw more than ${stakingInfo.canWithdraw}`)
                        setAlertFlag(true)
                        setType("danger")
                        setLoading(false)
                    } else {
                        const unstakeHash = await writeStakingContractUnstake(wagmiConfig, {
                            args: [stakingId, amount],
                        });
                        waitForTransactionReceipt(wagmiConfig, {
                            hash: unstakeHash,
                        });
                        getValueByPlan(stakingId, walletAddress);
                        setLoading(false)
                        setAContent("Withdraw Success!")
                        setAlertFlag(true)
                        setType("info")
                    }
                } catch (err) {
                    setErrorContent("Withdraw issue!")
                    console.log(err)
                    setErrorFlag(true)
                    setLoading(false)
                }
            }
        }

    }

    const handleChange = (e) => {
        setStakeAmount(e.target.value);
    };

    return (
        <div className='staking d-flex align-items-center justify-content-center'>
            <div style={{ flexDirection: "row" }} >
                <CAlert alertFlag={alertFlag} type={type} aContent={aContent} onDismiss={onDismiss} />
                <StyledWrapper className='p-3'>
                    <div className='col-12 d-flex justify-content-between my-2'>
                        <img src={logo} alt="logo" style={{ height: 40 }} />
                        <ConnectWallet
                            setErrorFlag={setErrorFlag}
                            setErrorContent={setErrorContent}
                            getStakingId={getStakingId}
                            getValueByPlan={getValueByPlan}
                            setAccount={setAccount}
                            account={account}
                        />
                    </div>
                    <div className='py-2 w-100'>
                        <ToggleButtons className='d-flex w-100'>
                            <StyledButton onClick={() => toggleTimestamp('30')} style={{ height: 30 }} className={`col ${timestamp === '30' ? 'active' : ''} text-nowrap`}>
                                30 Days
                            </StyledButton>
                            <StyledButton onClick={() => toggleTimestamp('60')} style={{ height: 30 }} className={`col ${timestamp === '60' ? 'active' : ''} text-nowrap`}>
                                60 Days
                            </StyledButton>
                            <StyledButton onClick={() => toggleTimestamp('90')} style={{ height: 30 }} className={`col ${timestamp === '90' ? 'active' : ''} text-nowrap`}>
                                90 Days
                            </StyledButton>
                            <StyledButton onClick={() => toggleTimestamp('120')} style={{ height: 30 }} className={`col ${timestamp === '120' ? 'active' : ''} text-nowrap`}>
                                120 Days
                            </StyledButton>
                        </ToggleButtons>
                    </div>
                    <Row>
                        <Col className="d-flex flex-wrap col-12 text-white">
                            <span className='col-12 fs-4 fw-semibold'>
                                Stake for {timestamp} Days
                            </span>
                        </Col>
                    </Row>
                    <div className='d-flex align-items-center flex-column w-100 text-white fs-6 py-2'>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>
                                Total Staked
                            </div>
                            <div>
                                {stakingInfo.totalStaked}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>
                                Can Withdraw
                            </div>
                            <div>
                                {stakingInfo.canWithdraw}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>
                                Total Claimed
                            </div>
                            <div>
                                {stakingInfo.totalClaimed}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>
                                Pending Reward
                            </div>
                            <div>
                                {stakingInfo.pendingReward}
                            </div>
                        </div>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>
                                APY
                            </div>
                            <div>
                                {stakingInfo.apy} %
                            </div>
                        </div>
                    </div>
                    <div className='w-100 py-2'>
                        <ToggleButtons>
                            <StyledButton onClick={() => toggleDirection('Stake')} style={{ height: 30 }} className={`col-4 ${direction === 'Stake' ? 'active' : ''}`}>
                                Stake
                            </StyledButton>
                            <StyledButton onClick={() => toggleDirection('Withdraw')} style={{ height: 30 }} className={`col-4 ${direction === 'Withdraw' ? 'active' : ''}`}>
                                Withdraw
                            </StyledButton>
                            <StyledButton onClick={() => toggleDirection('Claim')} style={{ height: 30 }} className={`col-4 ${direction === 'Claim' ? 'active' : ''}`}>
                                Claim
                            </StyledButton>
                        </ToggleButtons>
                    </div>
                    {direction !== 'Claim' &&
                        <div className='d-flex flex-wrap pb-2 w-100'>
                            <div className='d-flex align-items-center justify-content-start text-start pb-2'>
                                <span className='col-12 text-white fs-6'>
                                    Enter mount you want to {direction === 'Stake' ? 'stake' : 'withdraw'}
                                </span>
                            </div>
                            <div className='col-12 position-relative'>
                                <input value={stakeAmount} onChange={handleChange} className='text-white w-100 p-2 pe-5'
                                    style={{ backgroundColor: '#000', border: '1px solid #081117', borderRadius: '5px' }} type="number" />
                                <StyledButton className='active position-absolute' onClick={() => getAllToken()} style={{ height: 20, padding: 3, right: 10, bottom: '28%' }}>
                                    Max
                                </StyledButton>
                            </div>
                        </div>}
                    <StyledButton className='active w-100 mt-2' onClick={() => handleSWCClick()}>
                        {direction === 'Stake' ? allowanceValue > 1 ? 'Stake' : 'Approve' : direction === 'Withdraw' ? 'Withdraw' : 'Claim Reward'}
                    </StyledButton>
                </StyledWrapper>
            </div>
            <Loading loading={loading} />
            <ErroModal errorFlag={errorFlag} toggle={toggle} errorContent={errorContent} onDismiss={onDismiss} />
        </div>
    )
}

export default Staking;