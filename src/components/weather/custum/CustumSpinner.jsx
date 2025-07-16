import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CustomSpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7); /* 선택사항: 살짝 흐리게 */
  border-radius: inherit;
  position: relative;
`;

const SpinnerIcon = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid #ccc;
  border-top: 5px solid #333;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export default function CustomSpinner() {
  return (
    <CustomSpinnerWrapper>
      <SpinnerIcon />
    </CustomSpinnerWrapper>
  );
}