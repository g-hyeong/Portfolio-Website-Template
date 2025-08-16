/**
 * 모달이 열려있을 때 배경 스크롤을 방지하는 유틸리티
 */

let scrollLockCount = 0;
let originalBodyStyle = '';

/**
 * body 스크롤을 비활성화합니다
 */
export const disableBodyScroll = () => {
  if (scrollLockCount === 0) {
    originalBodyStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount++;
};

/**
 * body 스크롤을 활성화합니다
 */
export const enableBodyScroll = () => {
  if (scrollLockCount > 0) {
    scrollLockCount--;
    if (scrollLockCount === 0) {
      document.body.style.overflow = originalBodyStyle;
    }
  }
};

/**
 * 모든 스크롤 잠금을 해제합니다 (비상용)
 */
export const clearAllScrollLocks = () => {
  scrollLockCount = 0;
  document.body.style.overflow = originalBodyStyle;
};