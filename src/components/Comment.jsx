import styled from '@emotion/styled';

import React from 'react';

import style from '../styles/designSystem';

export default function Comment({ comment, onChangeComment }) {
  return (
    <FormField>
      <label htmlFor="devlink-comment">
        comment
      </label>
      <input
        type="text"
        id="devlink-comment"
        aria-label="devlink-comment"
        placeholder="Comment를 입력해주세요"
        name="comment"
        autoComplete="off"
        value={comment || ''}
        onChange={onChangeComment}
      />
    </FormField>
  );
}

const FormField = styled.fieldset`
  margin-top: 20px;

  display: flex;
  flex-direction: column;

  & label {
    text-transform: capitalize;
    
    font-size: ${style.font.size.small};
    font-weight: ${style.font.weight.light};

    opacity: 0.8;
  }

  & label + input {
    margin-top: 4px;

    padding: 0 16px;
    background: ${style.colors.white};
    border-radius: 15px;
  }

  & input {
    height: 30px;

    font-size: ${style.font.size.regular};
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
