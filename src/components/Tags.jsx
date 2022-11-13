/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';

import React from 'react';

import style from '../styles/designSystem';

import { isEmpty } from '../utils';

export default function Tgas({
  ulTagsRef,
  tags,
  onClickRemoveTag,
  inputTagRef,
  onChangeTag,
  onKeyDownEnter,
  autoCompleteTags,
  onClickAutoCompleteTag,
  isShowTagsValidationMessage,
}) {
  return (
    <FormField>
      <label htmlFor="devlink-tags">
        tags
      </label>
      <TagInputWrapper>
        <ul ref={ulTagsRef}>
          {!isEmpty(tags) && tags.map((tag, index) => (
            <li key={index}>
              <TagText>{`#${tag}`}</TagText>
              <button type="button" alt="btn-remove-tag" title="remove-tag" onClick={onClickRemoveTag(index)} />
            </li>
          ))}
          <li>
            <input
              type="text"
              id="devlink-tags"
              aria-label="devlink-tags"
              placeholder={isEmpty(tags) ? 'tag 입력 후 enter를 입력해주세요' : undefined}
              ref={inputTagRef}
              name="tags"
              autoComplete="off"
              onChange={onChangeTag}
              onKeyDown={onKeyDownEnter}
            />
          </li>
        </ul>
      </TagInputWrapper>
      <AutoCompleteTagsWrapper showAutoCompleteTags={!isEmpty(autoCompleteTags)}>
        <ul>
          {!isEmpty(autoCompleteTags)
                      && autoCompleteTags.map((autoCompleteTag, index) => (
                        <li key={index}>
                          <AutoCompleteTagsText onClick={onClickAutoCompleteTag(index)}>{`#${autoCompleteTag.name}`}</AutoCompleteTagsText>
                        </li>
                      ))}
        </ul>
      </AutoCompleteTagsWrapper>
      {isShowTagsValidationMessage && <ValidationMessage>tag 를 입력해주세요</ValidationMessage>}
    </FormField>
  );
}

const FormField = styled.fieldset`
  margin-top: 20px;

  display: flex;
  flex-direction: column;

  & label {
    text-transform: capitalize;
    
    font-size: ${style.font.size.small};;
    font-weight: ${style.font.weight.light};

    opacity: 0.8;
  }

  & label ~ :nth-child(2) {
    margin-top: 4px;

    padding: 0 16px;
    background: ${style.colors.white};
    border-radius: 15px;
  }

  & input {
    height: 30px;

    ::placeholder {
      font-size: ${style.font.size.small};;
      font-family: ${style.font.family.krNum};
      font-weight: ${style.font.weight.light};

      opacity: 0.5;
    }
  }
`;

const TagInputWrapper = styled.div`
  width: 272px; /* 태그가 많아졌을 때, 늘어나는 걸 방지하기 위해 고정값 사용 */

  & ul {
    display: flex;
    flex-wrap: nowrap; /* 1줄로 표시  */
    overflow: scroll;

    align-items: center;

    & li {
      flex: 0 0 auto;

      & span {

      }

      & button {
        margin-left: 2px;
        width: 10px;
        height: 10px;

        background: url('../../assets/images/tag-remove.png');
      }
    }

    & li:not(:first-of-type) {
      margin-left: 10px;
    }

    & li:last-of-type input {
      width: 200px; /* placeholder 보일 정도만 */
    }
  }

  & ul::-webkit-scrollbar { /* Chrome, Safari, Opera*/
    display: none; /* 스크롤 바 안보이게 */
  }
`;

const TagText = styled.span`
  font-size: ${style.font.size.small};
  font-family: ${style.font.family.krNum};
  font-weight: ${style.font.weight.regular};
  color: #383D4B;
  text-transform: uppercase;
`;

const AutoCompleteTagsWrapper = styled.div`
  margin: 0 16px;

  display: ${({ showAutoCompleteTags }) => (showAutoCompleteTags ? 'block' : 'none')};

  height: 32px;
  background: ${style.colors.white};
  border: 0.25px solid ${style.colors.gray.normal};

  ul {
    display: flex;
    flex-direction: row;
    margin: 8px;

    li {
      list-style: none;

      height: 16px;

      background: #8F8ECF;
      border-radius: 40px;
    }

    li:not(:first-of-type) {
      margin-left: 4px;
    }
  }
`;

const AutoCompleteTagsText = styled.span`

  display: flex;
  align-items: center;

  font-weight: ${style.font.weight.bold};
  font-size: 10px;
  line-height: 12px;

  color:  ${style.colors.white};
  background: #8F8ECF;
  margin: 3px 6px;
  text-transform: uppercase;

  cursor: pointer;
`;

const ValidationMessage = styled.p`
  margin-top: 6px;
  margin-left: 16px;

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
