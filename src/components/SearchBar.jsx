import styled from '@emotion/styled';
import React, { useState } from 'react';
import style from '../styles/designSystem';

const SearchBar = ({ onSearchComment }) => {
  const [keyWord, setKeyWord] = useState('');
  const onChangeKeyWord = (e) => {
    const { value } = e.target;
    setKeyWord(value);
  };

  return (
    <>
      <Title>Search</Title>

      <SearchBarContainer style={{ display: 'flex' }}>
        <SearchInput value={keyWord} onChange={onChangeKeyWord} />
        <SearchButton
          type='button'
          id='search-comment'
          aria-label='search-comment'
          onClick={() => onSearchComment(keyWord)}
        >
          <img src='../../assets/images/btn-search-url.png' alt='btn-search' />
        </SearchButton>
      </SearchBarContainer>
    </>
  );
};

const SearchBarContainer = styled.div`
  display: flex;
`;
const SearchButton = styled.button`
  margin: 10px 0 4px 17px;

  background: transparent;

  & img {
    width: 20px;
    height: 20px;
  }
`;
const SearchInput = styled.input`
  margin-top: 4px;

  flex: 1 1 90%;
  width: 100%;
  background: ${style.colors.white};
  border-radius: 15px;
  padding: 0 16px;
`;
const Title = styled.div`
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
  opacity: 0.8;
`;
export default SearchBar;
