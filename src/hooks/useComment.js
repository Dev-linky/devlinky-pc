/* eslint-disable react/no-array-index-key */
import { useDispatch, useSelector } from 'react-redux';

import { setComment } from '../redux/slice';

import { get } from '../utils';

const useComment = () => {
  const dispatch = useDispatch();

  const comment = useSelector(get('comment'));

  const handleChangeComment = (e) => {
    dispatch(setComment(e.target.value));
  };

  return [
    comment,
    handleChangeComment,
  ];
};

export default useComment;
