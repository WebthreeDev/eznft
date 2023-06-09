// Dependencies
import { Popover, Tag } from 'antd';
import React, { useEffect } from 'react';
import { FeaturedToken } from '../../home/models/featured-token';

import { AuditTokenSlideWrapper, Container } from './token-slide-item.style';

const TokenSlideItem: React.FC<{ token: Partial<FeaturedToken>, logoSize?: string, tagColor?: string }> = (props) => {
    useEffect(() => { }, []);

    return <Container>
        <AuditTokenSlideWrapper style={{ width: '80px' }}>
                <div className="logo">
                    <img width={props.logoSize ? props.logoSize : '100px'} src={props.token.logoPicture} alt="" />
                </div>
                <div className="name text-dark fw-bolder  mb-1 fs-6">{props.token.name}</div>
            <div className="tag">
                <Popover content={(props?.token?.scamReasonTooltip ? props?.token?.scamReasonTooltip : 'Want to be a trusted project? Contact ChanGuard for an audit!')}>
                    <Tag color={props.tagColor}>
                        {props.token.tag}
                    </Tag>
                </Popover>
            </div>
        </AuditTokenSlideWrapper>
    </Container >;
};

export default TokenSlideItem;

