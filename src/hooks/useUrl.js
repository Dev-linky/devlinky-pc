/* eslint-disable react/no-array-index-key */
import { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  fetchPreview,
  setUrl,
} from '../redux/slice';

import { get } from '../utils';

const useUrl = () => {
  const dispatch = useDispatch();

  const isShowUrlValidationMessage = useSelector(get('isShowUrlValidationMessage'));

  const url = useSelector(get('url'));
  const inputUrlRef = useRef();

  const handleChangeUrl = (e) => {
    dispatch(setUrl(e.target.value));
  };

  const handleSearchUrl = () => {
    dispatch(fetchPreview());
  };

  return [url, inputUrlRef, handleChangeUrl, handleSearchUrl, isShowUrlValidationMessage];
};

export default useUrl;
