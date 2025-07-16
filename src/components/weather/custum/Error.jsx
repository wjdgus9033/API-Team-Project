import styled from "styled-components";

const ErrorWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  border-radius: 12px;
  background-color: #fff5f5;
  color: #b71c1c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  margin: 0.5rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 300px;
`;

export default function Error({ title = "문제가 발생했습니다", message = "데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요." }) {
  return (
    <ErrorWrapper>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
    </ErrorWrapper>
  );
}