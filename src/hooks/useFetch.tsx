import { logout, refresh } from "@services";
import { FetchResponse, UserRole } from "@objects";
import { unsetBranches } from "src/store/slices/branches";
import { unsetBusiness } from "src/store/slices/business";
import { authLogout, setToken } from "src/store/slices/auth";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { useCallback } from "react";

export const useFetch = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const fetch = useCallback(async function fetch<T>(
    fetchFunction: (token: string) => Promise<FetchResponse<T>>
  ) {
    try {
      const response = await fetchFunction(auth.token!);

      // If we get forbidden (code 9), we try to refresh the token
      if (
        response.isError &&
        response.exception !== undefined &&
        response.exception.code === 9
      ) {
        const refreshResponse = await refresh(auth.refresh!);

        if (refreshResponse.isError || refreshResponse.data === undefined) {
          logout(auth.token!, auth.refresh!);

          if (auth.user?.role === UserRole.CLIENT) {
            dispatch(authLogout());
            dispatch(unsetBusiness());
            dispatch(unsetBranches());
          } else {
            dispatch(authLogout());
          }

          return response;
        }

        // We save the new token and the fetch is performed with the new token
        dispatch(setToken(refreshResponse.data));
        return await fetchFunction(refreshResponse.data);
      } else {
        return response;
      }
    } catch (e) {
      return { error: e as Error, isError: true };
    }
  }, [auth, dispatch]);

  return fetch;
};
