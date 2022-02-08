/* eslint-disable jsx-a11y/anchor-is-valid */
// Dependencies
import { LaptopOutlined } from '@ant-design/icons';
import { Badge, Button, Popover, Tag } from 'antd';
import { differenceInDays, format } from 'date-fns';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FaTelegram } from 'react-icons/fa';
import { FeaturedToken } from '../../home/models/featured-token';
// import PoweredBy from '../powered-by/powered-by';
import { ActionsContainer, Container, InfoContainer, LogoContainer,  ReleaseDate, TrustLevelContainer } from './potential-scams-item.style';

const tagNewConstraint = -14;

const PotentialScamsItem: React.FC<{ token: FeaturedToken, imageLoading?: boolean }> = (props) => {
    useEffect(() => {

    }, []);

    return <Container>

        {
            props?.token?.savingTime && differenceInDays(moment(props?.token?.savingTime).utc().hours(0).minutes(0).milliseconds(0).toDate(), moment().utc().hours(0).minutes(0).milliseconds(0).toDate()) > tagNewConstraint ?
                <Badge count="NEW" offset={[-10, 5]} style={{ fontSize: '10px' }} >   <LogoContainer>
                    <img src={props.token.logoPicture} width="50px" alt="" />
                    {
                        props.imageLoading && <div className="image-placeholder">
                        </div>
                    }
                </LogoContainer>
                </Badge>
                :
                <LogoContainer>
                    <img src={props.token.logoPicture} width="50px" alt="" />

                    {
                        props.imageLoading && <div className="image-placeholder">
                        </div>
                    }
                </LogoContainer>
        }

        <InfoContainer>
            <a className='text-dark fw-bolder  mb-1 fs-6' >{props?.token?.name}</a>
            <span className=' symbol text-muted fw-bold d-block' >{props?.token?.symbol}</span>
        </InfoContainer>
        <ReleaseDate>
            <span className='released-title text-muted fw-bold d-block fs-8'>
                Release
            </span>
            <span className='text-dark fw-bolder d-block fs-7'>
                {
                    (props?.token?.releaseDate) &&
                    format(moment(props?.token?.releaseDate).utc().hour(0).minutes(0).second(0).milliseconds(0).toDate(), 'PP')
                }
            </span>
        </ReleaseDate>
        <TrustLevelContainer>
            {
                (!props?.token?.scamReasonTooltip?.length || props?.token?.scamReasonTooltip?.length === 0) && props?.token?.scamReason?.map(reason =>
                    <Tag
                        style={{ whiteSpace: 'pre-wrap' }}
                        color={'red'}
                    >
                        {reason}
                    </Tag>
                )}

            {
                (props?.token?.scamReasonTooltip && props?.token?.scamReasonTooltip?.length > 0) && props?.token?.scamReason?.map(reason =>
                    <Popover content={<span>{props?.token?.scamReasonTooltip}</span>} >
                        <Tag
                            color={'red'}
                        >
                            {reason}
                        </Tag>
                    </Popover>
                )}
        </TrustLevelContainer>
        {
            // props?.token.vettedBy &&
            // <ReleaseContainer>
            //     {/* <PoweredBy
            //         company={props?.token.vettedBy}
            //     /> */}
            // </ReleaseContainer>
        }
        <ActionsContainer>
            {
                props?.token?.website &&
                <Button type="ghost" href={`${props?.token?.website}`} target={'__blank'}> <LaptopOutlined />  </Button>
            }
            {
                props?.token?.telegram &&
                <Button type="ghost" href={props?.token?.telegram} target={'__blank'}><FaTelegram color={'#a1a5b7'} fontSize={20} /></Button>
            }

        </ActionsContainer>
    </Container >
};

export default PotentialScamsItem;

