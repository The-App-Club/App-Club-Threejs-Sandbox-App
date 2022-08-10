import {css, cx} from '@emotion/css';
import {forwardRef} from 'react';

const _ModelContainer = ({children, className = css``}, ref) => {
  return (
    <div
      ref={ref}
      className={cx(
        css`
          border: 1px solid darkgray;
        `,
        className
      )}
    >
      {children}
    </div>
  );
};

const ModelContainer = forwardRef(_ModelContainer);

export {ModelContainer};
