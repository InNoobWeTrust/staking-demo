
import styled from 'styled-components';

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  background: transparent;
  border-radius: 3px;
  padding: 10px 0px;
  font-size: 1em;
  cursor: pointer;
  &.active {
    background: linear-gradient(180deg, #e2a2fe 0%, #a423ed 100%);
}
`;

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  border: 1px solid #142834;
  border-radius: 5px;
  background-color: #020609;
  `;
export const ToggleButtons = styled.div`
    display: flex;
    border: 1px solid #cc33ff;
    border-radius: 5px;
    background-color: #020609;
    padding: 3px;
`;