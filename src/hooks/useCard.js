/* eslint-disable react/no-array-index-key */
import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import {
  showCardHoverMenu,
  toggleCardPublicSetting,
} from '../redux/slice';

const useCard = () => {
  const dispatch = useDispatch();

  const handleHoverCard = (bookmarkId) => () => {
    dispatch(showCardHoverMenu(bookmarkId));
  };

  const handleTogglePublicSetting = useCallback((bookmarkId) => () => {
    dispatch(toggleCardPublicSetting(bookmarkId));
  }, []);

  const handleClickCard = (bookmarkUrl) => () => {
    window.open(bookmarkUrl, '_blank');
  };

  return {
    handleHoverCard, handleTogglePublicSetting, handleClickCard,
  };
};

export default useCard;
