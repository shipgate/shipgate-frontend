import { Phone } from "lucide-react";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import {
  authTokenChange,
  logoutUser,
  setAccessToken,
  setUserData,
} from "./authSlice";
import { errorToast, successToast } from "@/lib/toast";
import {
  CustomError,
  ILogin,
  ISignupFormdata,
  LoginOtpResponse,
  LoginResponse,
} from "../types";
import { request } from "http";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.usedToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, store, extraOptions) => {
  let result = await baseQuery(args, store, extraOptions);

  const authState = (store.getState() as RootState).auth;

  console.log("Attaching token to headers:", authState);

  if (result.error && result.error.status === 401) {
    if (!authState.token || !authState.refreshToken) return result;

    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: {
          refreshToken: authState.refreshToken,
          userId: authState.user?.userId,
        },
      },
      store,
      extraOptions,
    );

    if (refreshResult.data) {
      // Store the new tokens
      store.dispatch(
        setAccessToken({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          accessToken: refreshResult.data.token,
        }),
      );
      // Retry the original request
      result = await baseQuery(args, store, extraOptions);
    } else {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // LOGIN
    // login step 1
    // use
    login: builder.mutation<LoginResponse, ILogin>({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setUserData({
              userId: data.userId,
              email: data.email,
              fullName: data.fullName,
              role: data.role,
            }),
          );

          dispatch(
            authTokenChange({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }),
          );
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useSignupMutation
    signup: builder.mutation<LoginResponse, ISignupFormdata>({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          successToast("Verification Email sent! check your inbox.");
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useSupportTicketMutation
    supportTicket: builder.mutation<
      unknown,
      {
        name: string;
        email: string;
        subject: string;
        message: string;
      }
    >({
      query: (formData) => ({
        url: "/supportTicket",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useRequestQuoteMutation
    requestQuote: builder.mutation<
      unknown,
      {
        name: string;
        company: string;
        email: string;
        phone: string;
        senderAddress: string;
        senderCountry: string;
        senderState: string;
        recipientAddress: string;
        recipientCountry: string;
        recipientState: string;
        itemDescription: string;
        shippingType: string;
        weightKg: number;
        cbmVolume: number;
        containerTypeEnum: "Container20Ft" | "Container40Ft" | string;
        specialRequirement: string;
      }
    >({
      query: (formData) => ({
        url: "/quote/create",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useCreateShipmentMutation
    createShipment: builder.mutation<
      unknown,
      {
        shippingTypeEnum: "Air" | "Sea";
        senderName: string;
        senderPhone: string;
        senderCountry: string;
        senderState: string;
        senderCity: string;
        senderEmail: string;
        recipientName: string;
        recipientPhone: string;
        recipientCountry: string;
        recipientState: string;
        recipientCity: string;
        recipientEmail: string;
        item: {
          itemDescription: string;
          quantity: number;
          weightKg: number;
          lengthCm: number;
          widthCm: number;
          heightCm: number;
          cbmVolume: number;
          containerSize: string;
        };
      }
    >({
      query: (formData) => ({
        url: "/shipments",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useAddFundMutation
    addFund: builder.mutation<
      unknown,
      {
        Amount: string;
        Channel: "Card" | "BankTransfer" | "MobileMoney";
      }
    >({
      query: (formData) => ({
        url: `/wallet?Amount=${formData.Amount}&Channel=${formData.Channel}`,
        method: "POST",
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // useWithdrawMutation
    withdraw: builder.mutation<
      unknown,
      {
        amount: number;
        bankName: string;
        accountNumber: string;
        accountName: string;
      }
    >({
      query: (formData) => ({
        url: "/wallet/withdraw",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            successToast(
              `Successfully withdrawn ₦${args?.amount} from your wallet`,
            );
          }
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // login resend otp step 1b
    loginResendOtp: builder.mutation<unknown, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/auth/web-login/${sessionId}/resend-otp`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // login step 2
    //useLoginOtpMutation
    loginOtp: builder.mutation<
      LoginOtpResponse,
      { sessionId: string; code: string }
    >({
      query: (formData) => ({
        url: "/auth/web-login/validate-2fa",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authTokenChange(data.data.userToken));
          dispatch(setUserData(data.data.user));
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // SIGNUP
    // signup step 1
    // useSignupPhoneVerificationMutation
    signupPhoneVerification: builder.mutation<
      unknown,
      { countryId: number; phoneNumber: string; email: string }
    >({
      query: (formData) => ({
        url: "/auth/signup/phone-verification",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // signup step 1b
    // useSignupResendOtpMutation
    signupResendOtp: builder.mutation<unknown, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/auth/signup/${sessionId}/resend-phone-otp`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // signup step 2
    // useSignupVerifyCodeMutation
    signupVerifyCode: builder.mutation<
      unknown,
      { sessionId: string; code: string }
    >({
      query: (formData) => ({
        url: `/auth/signup/${formData.sessionId}/verify-code`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          code: formData.code,
        },
      }),
    }),

    // signup step 3
    // useSignupPasswordDetailMutation
    signupPasswordDetail: builder.mutation<
      unknown,
      { sessionId: string; password: string; confirmPassword: string }
    >({
      query: (formData) => ({
        url: `/auth/signup/${formData.sessionId}/password-detail`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      }),
    }),

    // useGetShipmentsQuery
    getShipments: builder.query({
      query: () => ({
        url: `/shipments`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useGetShipmentByTrackingNumberQuery
    getShipmentByTrackingNumber: builder.query({
      query: (trackingNumber) => ({
        url: `/shipments/${trackingNumber}`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useGetShippingMethodQuery
    getShippingMethod: builder.query({
      query: () => ({
        url: `/shippingMethod`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useGetBlogsQuery
    getBlogs: builder.query({
      query: () => ({
        url: `/blog/all-blog-posts`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // useGetAllInvoicesQuery
    getAllInvoices: builder.query({
      query: () => ({
        url: `/invoice/all-invoices`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // useWalletsQuery
    wallets: builder.query({
      query: () => ({
        url: `/wallet/balance`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // useTotalMoneySpentQuery
    totalMoneySpent: builder.query({
      query: () => ({
        url: `/shipments/total-money-spent`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // useTotalShipmentQuery
    totalShipment: builder.query({
      query: () => ({
        url: `/shipments/total-shipments`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // admin
    // useActiveSuperAdminUsersQuery
    activeSuperAdminUsers: builder.query({
      query: () => ({
        url: `/super-admin/all-users`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // useGetAllCourierUsersQuery
    getAllCourierUsers: builder.query({
      query: () => ({
        url: `/super-admin/all-users/Courier`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    // useGetDashboardDataQuery
    getDashboardData: builder.query({
      query: () => ({
        url: `/super-admin/dashboard`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // super admin
    // useCreateCourierMutation
    createCourier: builder.mutation<
      unknown,
      {
        fullName: string;
        email: string;
        phoneNumber: string;
        assignedCity: string;
      }
    >({
      query: (formData) => ({
        url: `/super-admin/manage-couriers`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          successToast("Courier created successfully");
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
    createAdmin: builder.mutation<
      unknown,
      { fullName: string; email: string; role: string }
    >({
      query: (formData) => ({
        url: `/super-admin/manage-admins`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          successToast("Admin created successfully");
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useDeleteAdminMutation
    deleteAdmin: builder.mutation<unknown, { id: string }>({
      query: (formData) => ({
        url: `/super-admin/delete/${formData.id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          successToast("Deleted successfully");
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useGetAdminShipmentQuery
    getAdminShipment: builder.query({
      query: () => ({
        url: `/shipments`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useUpdateShipmentPriceMutation
    updateShipmentPrice: builder.mutation<
      unknown,
      { trackingNumber: string; cost: number }
    >({
      query: (formData) => ({
        url: `/shipments/${formData?.trackingNumber}/set-cost`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: { cost: formData.cost },
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          successToast("Price updated successfully");
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),

    // useGetAdminDasbhoardDataQuery
    getAdminDasbhoardData: builder.query({
      query: () => ({
        url: `/admin/dashboard`,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorM = error as CustomError;
          errorToast(errorM.error?.data?.error || "Unexpected errror");
        }
      },
    }),
  }),
});

export const {
  // auth
  useLoginMutation,

  useSignupMutation,

  // shipment method
  useGetShippingMethodQuery,

  // shipments
  useGetShipmentsQuery,
  useGetShipmentByTrackingNumberQuery,
  useCreateShipmentMutation,
  useTotalMoneySpentQuery,
  useTotalShipmentQuery,

  // blogs
  useGetBlogsQuery,

  // invoice
  useGetAllInvoicesQuery,

  // support
  useSupportTicketMutation,

  // request quote
  useRequestQuoteMutation,

  // wallet
  useAddFundMutation,
  useWithdrawMutation,

  // wallets
  useWalletsQuery,

  // signup
  useSignupPhoneVerificationMutation,
  useSignupVerifyCodeMutation,
  useSignupPasswordDetailMutation,
  useSignupResendOtpMutation,
  useLoginOtpMutation,
  useLoginResendOtpMutation,

  // super admin
  useActiveSuperAdminUsersQuery,
  useGetAllCourierUsersQuery,
  useGetDashboardDataQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useCreateCourierMutation,
  useGetAdminShipmentQuery,
  useUpdateShipmentPriceMutation,

  // admin
  useGetAdminDasbhoardDataQuery,
} = apiSlice;
