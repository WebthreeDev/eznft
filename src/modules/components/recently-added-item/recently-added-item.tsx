// Dependencies
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Popover, Tag } from 'antd';
import { spawn } from 'child_process';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedToken } from '../../home/models/featured-token';
import { ActionsContainer, Container, InfoContainer, LogoContainer, TrustLevelContainer } from './recently-added-item.style';

const RecentlyAddedItem: React.FC<{ token: FeaturedToken }> = (props) => {
    useEffect(() => { }, []);

    return <Container>
        <LogoContainer>
            <img src={'https://spywolf.co/demo/network/assets/media/projects/kodi.png'} width="50px" alt="" />
        </LogoContainer>
        <InfoContainer>
            <a className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>{props?.token?.name}</a>
            <span className=' symbol text-muted fw-bold d-block' >{props?.token?.symbol}</span>
        </InfoContainer>
        <TrustLevelContainer>
            <Popover content={<span>Want to become a trusted project? Contact SpyWolf for an audit!</span>} >
                <Tag
                    color={'red'}
                >
                    Unverified
                </Tag>
            </Popover>
        </TrustLevelContainer>
        <ActionsContainer>
            <Link to={`token/${props?.token?.address}`}>
                <Button type="ghost"> <ArrowRightOutlined /> </Button>
            </Link>
        </ActionsContainer>
    </Container>;
};

export default RecentlyAddedItem;

