/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Dependencies
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Pagination, Spin, Steps, Switch } from 'antd';
import axios from 'axios';
import React, { ClipboardEvent, KeyboardEventHandler, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { A11y, Autoplay, EffectFade, Navigation, Scrollbar } from 'swiper'
import { HomeContext } from '../../core/routes/providers/home.provider';
import { HomeProviderModel } from '../../core/routes/providers/models/home-provider.model';
import { AddressCheckResponseModel } from '../home/models/address-check.model';
import { FeaturedToken } from '../home/models/featured-token';
import { DashedCard } from '../token/components/token-info-highlight/token-info-highlight.style';
import { ResultFinalItemModel, ScamTokensResponseModel } from './models/scam-tokens.model';
import { SpyCharityInfoModel } from './models/spy-info.model';
import { Container } from './reward.style';
import TokenSlideItem from './token-slide-item/token-slide-item';
import moment from 'moment';
import { FaCopy } from 'react-icons/fa';
import { AiFillCheckCircle } from 'react-icons/ai';

SwiperCore.use([Autoplay, Navigation, Pagination, Scrollbar, A11y]);


const RewardComponent: React.FC = () => {
    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 3,
    });
    const { latestScamsState, recentlyAddedState, featuredTokensState, potentialScamsState } = useContext(HomeContext) as HomeProviderModel;

    const [latestScams] = latestScamsState;
    const [recentlyTokens] = recentlyAddedState;
    const [featuredTokens] = featuredTokensState;
    const [potentialScams] = potentialScamsState;
    const [step1, setStep1] = useState<boolean>(true);
    const [step2, setStep2] = useState<boolean>(false);
    const [step3, setStep3] = useState<boolean>(false);
    const [step4, setStep4] = useState<boolean>(false);
    const [step5, setStep5] = useState<boolean>(false);

    const [step1Loading, setStep1Loading] = useState<boolean>(false);
    const [step2Loading, setStep2Loading] = useState<boolean>(false);
    const [step3Loading, setStep3Loading] = useState<boolean>(false);
    const [step4Loading, setStep4Loading] = useState<boolean>(true);


    const [disableClaim, setDisableClaim] = useState<boolean>(false);


    const [currentStep, setCurrentStep] = useState<number>(0);

    const [twitterUrl, setTwitterUrl] = useState<string | null>(null);


    const [tweetToggle, setTweetToggle] = useState<boolean>(false);


    const [walletAddress, setWalletAddress] = useState<boolean>(false);


    const [spyCharityInfo, setspyCharityInfo] = useState<SpyCharityInfoModel | null>(null);

    const [scamsData, setFirstData] = useState<ResultFinalItemModel[]>([]);

    const [copyConfirm, setCopyConfirm] = useState<boolean>(false);


    const [scamDateInPlataform, setScamDateInPlataform] = useState<ResultFinalItemModel>();



    const [currentAddress, setCurrentAddress] = useState<string>();
    const [addresValidaton, setAddressValidation] = useState<{ err: number, message: string, active: boolean, button?: any }>()
    const [addressLoading, setAddressLoading] = useState<boolean>(false);
    const { toChecksumAddress } = require('ethereum-checksum-address');

    let inputRef;
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (step2) {

            const sortedByDate: any[] = latestScams.slice().sort(
                (a, b) => {
                    return (new Date(a.savingTime) as any) - (new Date(b.savingTime) as any)
                }
            );
            setScamDateInPlataform(sortedByDate[0]);
            const savingTime = moment(sortedByDate[0]?.savingTime).format('yyy-MM-DD');

            axios.get(`https://nhlm8489e3.execute-api.us-east-2.amazonaws.com/prod/charity/inspectwallet/${currentAddress}`)
                .then(
                    res => {
                        if (res.data['checkWalletForCharity'] === undefined) {
                            setStep1(false)
                            setStep2Loading(false)
                            setStep3Loading(true)
                            setCurrentStep(1)
                            const data: ScamTokensResponseModel = res.data;
                            const array: any[] = [];
                            data.resultFinal.forEach(result => {
                                const hasItem = array.some((item: any) => item.address === result.address)
                                if (!hasItem) {
                                    array.push(result);
                                }
                            })
                            setFirstData(array);
                            axios.post(`https://nhlm8489e3.execute-api.us-east-2.amazonaws.com/prod/charity/inspectwallet/spy_txs/`,
                                {
                                    address: currentAddress,
                                    scamInPlatformDate: savingTime
                                }
                            ).then(
                                res => {
                                    setspyCharityInfo(res.data)
                                    setStep3(true)
                                    setStep3Loading(true)
                                    setCurrentStep(2)
                                    if (res.data && res.data !== undefined) {
                                        setInterval(() => {
                                            setStep4(true)
                                            setCurrentStep(3)
                                        }, 3000)
                                    }
                                }
                            )
                        }
                    }
                )
        }
    }, [step2]);

    useEffect(() => {
        // setWalletAddress()
    }, []);

    const validadeAddress = (address: string) => {
        return axios.get(`https://nhlm8489e3.execute-api.us-east-2.amazonaws.com/prod/tokenorwalletinfo/${address}`)

    }

    const handleSearchEnter: KeyboardEventHandler<HTMLInputElement> | undefined = (event) => {
        setAddressValidation({
            err: 0,
            message: '',
            active: false
        })

        if (event.code === 'Enter') {
            setAddressLoading(true);
            let addr = '';
            try {
                if (!event.currentTarget.value || event.currentTarget.value === undefined) {
                    throw new Error('Empty Address');
                }
                addr = toChecksumAddress(event.currentTarget.value);
                if (addr === '') {
                    throw new Error('Please make sure to input a correct Wallet Address')
                }
            } catch (err) {
                const e: Error = err as Error;
                setAddressValidation({
                    err: 0,
                    message: e.message,
                    active: true
                })
                setAddressLoading(false);

            }


            try {
                if (addr !== undefined && addr !== '') {
                    validadeAddress(addr).then(
                        ({ data }) => {
                            setAddressLoading(false);
                            const addressCheckResponse: AddressCheckResponseModel | null = data.smartContractInfo;
                            if (addressCheckResponse == null) {
                                throw new Error('Please make sure to input a correct Wallet Address');
                            }
                            if (addressCheckResponse.contractType === 'wallet') {
                                setCurrentAddress(addr)
                                axios.get(`https://nhlm8489e3.execute-api.us-east-2.amazonaws.com/prod/charity/inspectwallet/${addr}`)
                                    .then(
                                        res => {
                                            setAddressLoading(false);
                                            if (res.data['checkWalletForCharity'] === undefined) {
                                                if (res.data.resultFinal.length > 0) {
                                                    setStep1(false)
                                                    setStep2(true)

                                                } else {
                                                    setAddressValidation({
                                                        err: 0,
                                                        message: "if you were scammed by a token reported here, and the think you are eligible for a charity, please contact TJ",
                                                        button: {
                                                            text: 'Contact TJ',
                                                            link: `https://t.me/tjay_spywolf`
                                                        },
                                                        active: true
                                                    })
                                                }

                                            } else {
                                                const charityData = res.data.checkWalletForCharity;
                                                const status = charityData.Items[0].status;
                                                const charityAmount = charityData.Items[0].charityAmount;
                                                const txHash = charityData.Items[0].charityTX;
                                                if (status === 'PENDING') {
                                                    setAddressValidation({
                                                        err: 0,
                                                        message: `You already have a pending claim with this wallet address, for a total rewards of  ${formatter.format(charityAmount)} SPYs`,
                                                        active: true
                                                    })

                                                } else {
                                                    setAddressValidation({
                                                        err: 0,
                                                        message: `Charity for the amount of ${formatter.format(charityAmount)} $SPYs has been successfully paid to this wallet!`,
                                                        active: true,
                                                        button: {
                                                            text: 'see transaction',
                                                            link: `https://bscscan.com/tx/${txHash}`
                                                        },
                                                    })

                                                }
                                            }
                                        })
                            } else {
                                throw new Error('Please make sure to input a correct Wallet Address');

                            }
                        },

                    ).catch(e => {
                        setAddressValidation({
                            err: 0,
                            message: 'Please make sure to input a correct Wallet Address',
                            active: true
                        })
                        setAddressLoading(false);
                    })
                } else {
                    throw new Error('Please make sure to input a correct Wallet Address');

                }
            } catch (err) {
                const e = err as Error;
                setAddressValidation({
                    err: 0,
                    message: e.message,
                    active: true
                })
                setAddressLoading(false);

            }
        }

    };

    const searchTokenOrWalletOnPaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const value = event.clipboardData?.getData('Text');
        setAddressLoading(true);
        let addr = '';
        try {
            if (!value || value === undefined) {
                throw new Error('Empty Address');
            }
            addr = toChecksumAddress(value);
            if (addr === '') {
                throw new Error('Please make sure to input a correct Wallet Address')
            }
        } catch (err) {
            const e: Error = err as Error;
            setAddressValidation({
                err: 0,
                message: e.message,
                active: true
            })
            setAddressLoading(false);

        }


        try {
            if (addr !== undefined && addr !== '') {
                validadeAddress(addr).then(
                    ({ data }) => {
                        const addressCheckResponse: AddressCheckResponseModel | null = data.smartContractInfo;
                        if (addressCheckResponse == null) {
                            setAddressLoading(false);
                            throw new Error('Please make sure to input a correct Wallet Address');
                        }
                        if (addressCheckResponse.contractType === 'wallet') {
                            setCurrentAddress(addr)
                            axios.get(`https://nhlm8489e3.execute-api.us-east-2.amazonaws.com/prod/charity/inspectwallet/${addr}`)
                                .then(
                                    res => {
                                        setAddressLoading(false);
                                        if (res.data['checkWalletForCharity'] === undefined) {
                                            if (res.data.resultFinal.length > 0) {
                                                setStep1(false)
                                                setStep2(true)
                                            } else {
                                                setAddressValidation({
                                                    err: 0,
                                                    message: "if you were scammed by a token reported here, and the think you are eligible for a charity, please",
                                                    button: {
                                                        text: 'Contact TJ',
                                                        link: `https://t.me/tjay_spywolf`
                                                    }, active: true
                                                })
                                            }
                                        } else {
                                            const charityData = res.data.checkWalletForCharity;
                                            const status = charityData.Items[0].status;
                                            const charityAmount = charityData.Items[0].charityAmount;
                                            const txHash = charityData.Items[0].charityTX;
                                            if (status === 'PENDING') {
                                                setAddressValidation({
                                                    err: 0,
                                                    message: `You already have a pending claim with this wallet address, for a total rewards of  ${formatter.format(charityAmount)} SPYs`,
                                                    active: true
                                                })

                                            } else if (status === 'REJECTED') {
                                                setAddressValidation({
                                                    err: 0,
                                                    message: charityData.Items[0].message,
                                                    active: true
                                                })
                                            } else {
                                                setAddressValidation({
                                                    err: 0,
                                                    message: `Charity for the amount of ${formatter.format(charityAmount)} $SPYs has been successfully paid to this wallet!`,
                                                    active: true,
                                                    button: {
                                                        text: 'see transaction',
                                                        link: `https://bscscan.com/tx/${txHash}`
                                                    },
                                                })

                                            }
                                        }
                                    })
                        } else {
                            throw new Error('Please make sure to input a correct Wallet Address');

                        }
                    },

                ).catch(e => {
                    setAddressValidation({
                        err: 0,
                        message: 'Please make sure to input a correct Wallet Address!',
                        active: true
                    })
                    setAddressLoading(false);
                })
            } else {
                throw new Error('Please make sure to input a correct Wallet Address');

            }
        } catch (err) {
            const e = err as Error;
            setAddressValidation({
                err: 0,
                message: e.message,
                active: true
            })
            setAddressLoading(false);

        }

    }

    const handleTweetToggle = (e) => {
        setTweetToggle(e);
    }

    const claim = () => {
        setStep5(true);
        setDisableClaim(true);
        const claimData = {
            httpMethod: "POST",
            walletAddress: currentAddress,
            charityAmount: spyCharityInfo?.charityAmount,
            scamTX: scamsData[0].scamTX,
            scamTokenAddress: scamsData[0].address,
            spyAmount: spyCharityInfo?.spyAmount,
            spyTXHash: spyCharityInfo?.spyTXHash,
            charityTX: null
        };
        if (tweetToggle) {
            claimData.charityAmount = spyCharityInfo?.charityAmountWithTweet;
            claimData['tweetLink'] = twitterUrl?.toLowerCase();
            if (!twitterUrl?.toLowerCase().includes('twitter.com')) {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Invalid Twitter url, please check it again.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                })
                return;
            }
        }
        axios.post('https://nhlm8489e3.execute-api.us-east-2.amazonaws.com/prod/charity/claim', claimData).then(
            () => {
                Swal.fire(
                    {
                        titleText: `It's all set!`,
                        text: 'you will received your SPYs in the next 24h, thank you for trusting SpyWolf',
                        willClose: () => {
                            navigate('/')
                        }

                    }
                )
            }
        ).catch(
            e => {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                })
            }
        );

    }

    const handleTwitterInput = e => {
        setTwitterUrl(e.target.value);
    }

    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null)
    const [swipe, setSwipe] = useState<any>();



    return <Container>
        <Card className="steppers">
            <Steps direction="vertical" current={currentStep}>
                <Steps.Step title="Type your wallet address" description="Our system will inspect your tokens" />
                <Steps.Step title="See list of scams" description="Find out which tokens scammed you" />
                <Steps.Step title="$SPY transactions" description={<span>
                    (Make sure you <a style={{ color: '#5eaab3' }} target="__blank" href="https://uniswap.org">bought SPYs </a> already)
                </span>} />
                <Steps.Step title="See your reward!" description="Based on your next transaction" />
                <Steps.Step title="Complete" description="You'll Receive your SPYs within 24 hrs!" />
            </Steps>
        </Card>
        <Card >
            {
                step1 && <div className='content'> <div className="title-wrapper">
                    <h1 className='fs-2hx text-dark mb-2'>
                        "Scam Survivor" Charity
                    </h1>
                    <span className='fs-2 fw-bold mb-20 earn-extra-cta'>
                        All scam victims get an extra 20% in their next $SPY transaction
                    </span>
                </div>

                    <div className="search-wrapper">
                        <span className='fs-4 fw-bold mb-3' style={{ textAlign: 'center' }}>
                            Add wallet that contains the scammed tokens
                        </span>

                        <Input
                            onKeyDown={handleSearchEnter}
                            prefix={<Button
                                type='ghost' style={{ background: 'transparent !important' }}
                                loading={addressLoading} icon={<SearchOutlined />} > </Button>}
                            placeholder="Input Wallet Address"
                            onPaste={searchTokenOrWalletOnPaste}
                        />
                        {
                            addresValidaton?.active && <div className="validation-wrapper">
                                <span className="address-validation-error"> {addresValidaton?.message} </span>
                                {
                                    addresValidaton.button && (
                                        <a className="link-primary " href={addresValidaton?.button.link} target="__blank">{addresValidaton?.button.text}</a>
                                    )
                                }
                            </div>
                        }
                    </div>
                    <div className="slider-space">
                        <Swiper
                            onBeforeInit={(swipper) => {
                                setSwipe(swipper)
                                setTimeout(() => swipper.slideNext(300), 2200);
                            }}
                            autoplay={{
                                delay: 1000,
                                pauseOnMouseEnter: false,
                                disableOnInteraction: false,
                            }}
                            slidesOffsetBefore={40}
                            slidesPerView={4}
                            breakpoints={
                                {
                                    0: {
                                        slidesPerView: 3
                                    },
                                    360: {
                                        slidesPerView: 3
                                    },
                                    460: {
                                        slidesPerView: 4
                                    },
                                    560: {
                                        slidesPerView: 5
                                    },
                                    700: {
                                        slidesPerView: 5
                                    },
                                    860: {
                                        slidesPerView: 5
                                    }
                                }
                            }
                            loop={true}
                            centeredSlidesBounds={true}
                        >
                            {
                                latestScams && latestScams?.map((token, i) => <SwiperSlide key={i} style={{ width: '80px !important' }}>
                                    <TokenSlideItem logoSize={'50px'} token={token} tagColor='red' />
                                </SwiperSlide>)
                            }
                        </Swiper>
                    </div>

                </div>
            }

            {
                !step1 &&
                <div className="content spin-content">
                    <div className="pb-10 pb-lg-15 text-center mt-6">
                        <h2 className="fw-bolder text-dark">Your Address</h2>
                        <div className="text-muted fw-bold fs-6 contact-address">
                            {currentAddress}
                            <span className="copybutton" style={{ marginLeft: '10px' }} onClick={() => {
                                navigator.clipboard.writeText(currentAddress ? currentAddress : '');
                                setCopyConfirm(true)
                                setTimeout(() => setCopyConfirm(false), 1000)
                            }} >
                                {!copyConfirm && <FaCopy color="#181c32"></FaCopy>}
                                {copyConfirm && <AiFillCheckCircle color="#181c32"></AiFillCheckCircle>}
                            </span>
                        </div>
                    </div>
                    {(scamsData?.length === 0) &&
                        <div className="spin-content">
                            <Spin />
                            <br></br>
                            <span>Searching...</span>
                        </div>
                    }
                    {(step2 && scamsData?.length > 0) && <div className="content">
                        <div className="fs-4 fw-bold mb-5">These are the projects that scammed you </div>
                        <div className="tokens">
                            {scamsData?.map(r =>
                                <DashedCard className="token" style={{ height: 'fit-content' }}>
                                    <img className="logo" width={50} height={50} src={(latestScams?.find((latest: FeaturedToken) => latest.address === r.address) as FeaturedToken).logoPicture} />
                                    <div className="tokenname text-gray-800 fs-7">{(latestScams?.find((latest: FeaturedToken) => latest.address === r.address) as FeaturedToken).name}</div>
                                </DashedCard>
                            )}
                        </div>
                        {
                            (step3 && spyCharityInfo == null) &&
                            <div className='me-5 fw-bold' style={{ marginTop: '20px ​!importan' }}>
                                <label className="fs-5">This promo only works with SPY transactions made after the scam was reported in our platform.</label>
                                <Button type='primary' target="__blank" style={{ width: '50%', marginTop: '20px !important', color: '#1b3311', margin: '20px auto' }} href='https://uniswap.org'>Buy $SPY</Button>
                            </div>

                        }

                    </div>
                    }
                    {(step3Loading && !step3) &&
                        <div>
                            <Spin />
                            <br></br>
                            <span>Searching transaction...</span>
                        </div>
                    }

                    {(step3 && spyCharityInfo != null) &&
                        <div className="mb-0 fv-row fv-plugins-icon-container mt-15 text-center ">
                            <div className="fs-3 fw-bold mb-2">Highest SPY transaction found</div>
                            <div className="fs-5 fw-bold mb-5">{spyCharityInfo ? formatter.format(spyCharityInfo.spyAmount) : '-'} SPY</div>
                            <div className="fv-plugins-message-container invalid-feedback"></div>
                            {!step4 &&
                                <div className='spin-content'>
                                    <Spin />
                                    <br></br>
                                    <span>processing rewards...</span>
                                </div>
                            }

                        </div>
                    }
                    {/* {
                        (step3 && spyCharityInfo == null) &&
                        <div className="mb-0 fv-row fv-plugins-icon-container mt-15 text-center ">
                            <div className="fs-4 fw-bold mb-2">This promo only works with SPY transactions made after the scam was reported in our platform, you can <a  target="__target" href="https://uniswap.org">buy SPY here</a>
                            </div>
                        </div>
                    } */}

                    {
                        (step4 && spyCharityInfo != null) && <div className="content">
                            <div className="text-center mb-10 xmt-15 ">
                                <div className="mb-10">
                                    <h3 className="fs-2hx text-dark mb-2">Your Reward 🤑</h3>
                                    <div className="fs-2 fw-bold">{!tweetToggle ? formatter.format(spyCharityInfo?.charityAmount as any) : formatter.format(spyCharityInfo?.charityAmountWithTweet as any)} SPY</div>
                                </div>
                                <div className="d-flex flex-stack mb-4 " style={{ justifyContent: 'center' }} >
                                    <div className="me-5 fw-bold">
                                        <label className="fs-5">Want an extra  {spyCharityInfo ? formatter.format(spyCharityInfo?.charityAmountWithTweet - spyCharityInfo?.charityAmount) : 0} SPY?  </label>
                                        <Switch style={{ marginLeft: '10px' }} onChange={handleTweetToggle}></Switch>
                                    </div>
                                </div>
                                {
                                    tweetToggle &&
                                    <div>
                                        <span>Tweet about us to help other victims claim their rewards</span>
                                        <Input style={{ marginBottom: '2rem' }} type="text" onInput={handleTwitterInput} className="form-control form-control-solid" placeholder="Paste the Tweet URL here..." name="invite_teammates" />
                                    </div>
                                }
                                <Button style={{ margin: '0 auto' }} disabled={tweetToggle && !twitterUrl?.includes('twitter.com/')} className="btn btn-primary mb-5" onClick={claim}>Claim Now</Button>
                            </div>
                        </div>
                    }
                </div>
            }

        </Card>
    </Container>;
};

export default RewardComponent;

