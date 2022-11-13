/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';

import React from 'react';

import style from '../styles/designSystem';

export default function Preview({ preview }) {
  return (
    <PreivewContainer>
      <label htmlFor="devlink-preive">
        preview
      </label>
      {preview
        ? (
          <PreviewContainer>
            <PreviewImage
              src={preview && preview.thumbnail}
              alt="thumbnail"
            />
            <div>
              <p>{preview && preview.title}</p>
              <p>{preview && preview.description}</p>
              <p>{preview && preview.url}</p>
            </div>
          </PreviewContainer>
        )
        : (

          <PreviewWrapper>
            <DefaultPreviewImage
              src="../../assets/images/preview_default.png"
              alt="preview-default"
            />
          </PreviewWrapper>
        )}
    </PreivewContainer>
  );
}

const PreivewContainer = styled.fieldset`
  margin-top: 20px;

  display: flex;
  flex-direction: column;

  & label {
    text-transform: capitalize;
    
    font-weight: 300;
    font-size: ${style.font.size.small};;
    opacity: 0.8;

  }
`;

const PreviewWrapper = styled.div`
  margin-top: 4px;

  width: 272px;
  height: 72px;

  background: ${style.colors.yoonblue.mediumDark};
  box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 15px;
`;

const DefaultPreviewImage = styled.img`
  margin: 25px 82px;

  width: 108px;
  height: 22px;
`;

const PreviewContainer = styled.div`
  margin-top: 4px;

  width: 272px;
  height: 72px;

  background: ${style.colors.white};
  box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 16px 15px 15px 16px;

  display: flex;

  & div {
    padding: 8px;

  }

  & p {
    width: 180px;

    display: block;
    text-overflow: ;
    overflow: hidden;
  
    :not(:nth-of-type(1)) {
      padding-top: 6px;    
    }
  }

  /* Preview title */
  & p:nth-of-type(1) {
    white-space: nowrap; 

    color: ${style.colors.yoonblue.deepDark};
    font-weight: 500;
    font-size: ${style.font.size.small};;
  }

  /* Preview description */
  & p:nth-of-type(2) {
    white-space: wrap;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    color: ${style.colors.gray.dark};
    font-weight: 400;
    font-size: 11px;
  }

  /* Preview url */
  & p:nth-of-type(3) {    
    white-space: nowrap; 
    
    color: ${style.colors.yoonblue.normal};
    font-weight: 600;
    font-size: 11px;
  }
`;

const PreviewImage = styled.img`
  border-radius: 15px 0 0 15px;
  width: 72px;
  height: 72px;  
`;
