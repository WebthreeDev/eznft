import styled from 'styled-components';


export const Container = styled.div`
  display: grid;
  grid-template-columns: 50px 100px 1fr 100px ;
  column-gap: 1rem;
  margin:1rem 0;
  align-items: center;
  cursor: pointer;
      &:hover{
            background: #f4f7f9;
      }
`;

export const LogoContainer = styled.div`
      img{
            border-radius: 100%;
      }
`;


export const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    .symbol{
        font-size: 1rem;
    }
`;


export const ReleaseContainer = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      min-width: 100px;
`;


export const TrustLevelContainer = styled.div`
      width: 100%;
      display: flex;
      justify-content: center;

`;

export const ActionsContainer = styled.div`
      display: flex;
      justify-content: flex-end;
`;