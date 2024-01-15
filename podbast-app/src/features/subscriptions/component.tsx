import { actions as commonActions } from "/src/features/common/slice";
import { useAppDispatch, useAppSelector } from "/src/store";

export const Common = ({ children }: { children: React.ReactNode }) => {
  const count = useAppSelector((state) => state.common.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <div>
        <h1>Common</h1>
        <button onClick={() => dispatch(commonActions.increment())}>
          {count} ++
        </button>
      </div>
      <div>{children}</div>
    </>
  );
};
