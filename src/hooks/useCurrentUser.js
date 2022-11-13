import { useDispatch, useSelector } from 'react-redux';

import { setCurrentUser } from '../redux/slice';

import { loadItem } from '../services/storage/localStorage';

import { get, isEmpty } from '../utils';

const useCurrentUser = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(get('currentUser'));
  const lastLoginUser = loadItem('LAST_LOGIN_USER');

  if (isEmpty(currentUser) && lastLoginUser) {
    dispatch(setCurrentUser(JSON.parse(lastLoginUser)));
  }

  return {
    currentUser,
  };
};

export default useCurrentUser;
