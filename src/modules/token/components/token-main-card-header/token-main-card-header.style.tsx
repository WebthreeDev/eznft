import styled from 'styled-components';


export const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 0;
    .text-container{
        width: fit-content;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        .name {
            margin: 0 !important;
        }

    }
`;