import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type { GetKpisResponse,GetProductsResponse,GetTransactionsResponse } from "./types";

export const api = createApi({
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_BASE_URL }),
    reducerPath: "main",
    tagTypes:["Kpis","Products","Transactions","Statement"],
    endpoints:(build)=>({
        getKpis:build.query<Array<GetKpisResponse>,void>({
            query:()=> "kpi/kpis",
            providesTags:["Kpis"]
        }),
        getProducts:build.query<Array<GetProductsResponse>,void>({
            query:()=> "product/products",
            providesTags:["Products"]
        }),
        getTransactions:build.query<Array<GetTransactionsResponse>,void>({
            query:()=> "transaction/transactions",
            providesTags:["Transactions"]
        }),
        getStatement: build.query<any[], void>({
          query: () => "statement/",
          providesTags: ["Statement"],
        }),
        getForecast: build.query<any, void>({
          query: () => "statement/forecast",
          providesTags: ["Statement"],
        }),
        uploadStatement: build.mutation<any, FormData>({
          query: (body) => ({ url: "statement/upload", method: "POST", body }),
          invalidatesTags: ["Statement"],
        }),
        clearStatement: build.mutation<any, void>({
          query: () => ({ url: "statement/", method: "DELETE" }),
          invalidatesTags: ["Statement"],
        }),
    })
})

export const {
    useGetKpisQuery,
    useGetProductsQuery,
    useGetTransactionsQuery,
    useGetStatementQuery,
    useGetForecastQuery,
    useUploadStatementMutation,
    useClearStatementMutation,} = api;