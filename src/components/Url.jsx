/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';

import React from 'react';

import style from '../styles/designSystem';

export default function Url({
  url,
  inputUrlRef,
  isShowUrlValidationMessage,
  onChangeUrl,
  onSeatchUrl,
}) {
  return (
    <>
      <URLInputField>
        <label htmlFor="devlink-url">
          url
        </label>
        <URLInputContainer>
          <URLInput
            ref={inputUrlRef}
            type="text"
            id="devlink-url"
            aria-label="devlink-url"
            placeholder="URL을 입력해주세요"
            name="url"
            value={url || ''}
            onChange={onChangeUrl}
          />
          <SearchButton
            type="button"
            id="search-url"
            aria-label="search-url"
            onClick={onSeatchUrl}
          >
            <img src="../../assets/images/btn-search-url.png" alt="btn-search" />
          </SearchButton>
        </URLInputContainer>
      </URLInputField>
      {isShowUrlValidationMessage
            && <ValidationMessage>URL을 입력해주세요</ValidationMessage>}
    </>
  );
}

const URLInputField = styled.fieldset`
  margin-top: 20px;

  display: flex;
  flex-direction: column;

  & label {
    text-transform: uppercase;
    
    font-size: ${style.font.size.small};;
    font-weight: ${style.font.weight.light};

    opacity: 0.8;
  }

  & input {
    height: 30px;

    font-size: ${style.font.size.regular};;
    font-family: ${style.font.family.krNum};
    font-weight: ${style.font.weight.regular};

    ::placeholder {
      font-size: ${style.font.size.small};;
      font-family: ${style.font.family.krNum};
      font-weight: ${style.font.weight.light};
       
      opacity: 0.5;
    }
  }
`;

const URLInputContainer = styled.div`
  display: flex;
`;

const URLInput = styled.input`
  margin-top: 4px;

  width: 235px;
  background: ${style.colors.white};
  border-radius: 15px;

  padding: 0 16px;
`;

const SearchButton = styled.button`
  margin: 10px 0 4px 17px;

  background: transparent;

  & img {
    width: 20px;
    height: 20px;
  }
`;

const ValidationMessage = styled.p`
  position: absolute;
  left: 39px;
  top: 212px;

  margin-top: 6px;
  
  width: 244px;
  height: 20px;
  
  font-family: ${style.font.family.krNum};
  font-weight: normal;
  font-size: ${style.font.size.tiny};
  line-height: 13px;

  display: flex;
  align-items: center;

  color: ${style.colors.red};

  mix-blend-mode: normal;
`;
