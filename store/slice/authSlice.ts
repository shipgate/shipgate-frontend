import { createSlice } from "@reduxjs/toolkit";
import { User, Account } from "@/store/types";

interface AuthState {
  usedToken: string | null;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  usedToken: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authTokenChange: (state, action) => {
      console.log("Auth token change action payload:", action.payload);
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.usedToken = action.payload.accessToken;
    },
    setAccessToken: (state, action) => {
      state.token = action.payload.accessToken;
    },
  logoutUser: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.usedToken = null;
    },
    adjustUsedToken: (state, action) => {
      state.usedToken = action.payload;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },

    // setBusinessCertificateStatus: (state, action: PayloadActio>) => {
    //   if (state.user)
    //     state.user.corporateBNPLModel.businessCertificateStatus =
    //       action.payload;
    // },
    // setUploadLogo: (state, action: PayloadAction<string>) => {
    //   if (state.user) state.user.corporateBNPLModel.logo = action.payload;
    // }
  },
});

export const {
  authTokenChange,
  logoutUser,
  adjustUsedToken,
  setUserData,
  setAccessToken,
  // setBusinessCertificateStatus,
  // setUploadLogo
} = authSlice.actions;
export default authSlice.reducer;
