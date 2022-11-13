export const isNeedScroll = (inputTagref) => {
  const SCROLL_X_BREAK_POINT = 220; // 총 tags들의 최대 너비?

  const inputTagElementLeftPosition = inputTagref.current?.offsetLeft;

  return SCROLL_X_BREAK_POINT < inputTagElementLeftPosition;
};

export const autoXScroll = (ref, xValue) => {
  ref.current.scrollBy(xValue, 0);
};
