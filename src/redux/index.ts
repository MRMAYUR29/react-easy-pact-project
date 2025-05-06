import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import {
     appReducer,
     CategorySliceReducer,
     GeoGraphicsSliceReducer,
     MappedProductSliceReducer,
     ProductSliceReducer,
     UserSliceReducer,
     userTypeSliceReducer,
} from "./slice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
     auditLogsApiMiddleware,
     auditLogsApiReducer,
     authApiMiddleware,
     authApiReducer,
     categoryApiMiddleware,
     categoryApiReducer,
     geoGraphicsApiMiddleware,
     geoGraphicsApiReducer,
     mappedProductApiMiddleware,
     mappedProductApiReducer,
     productApiMiddleware,
     productApiReducer,
     userApiMiddleware,
     userApiReducer,
     userTypeApiMiddleware,
     userTypeApiReducer,
} from "./api";

const persistConfig = {
     key: "root",
     storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = configureStore({
     reducer: combineReducers({
          app: persistedReducer,
          category: CategorySliceReducer,
          product: ProductSliceReducer,
          geographic: GeoGraphicsSliceReducer,
          user: UserSliceReducer,
          userType: userTypeSliceReducer,
          mappedProduct: MappedProductSliceReducer,

          authApi: authApiReducer,
          categoryApi: categoryApiReducer,
          productApi: productApiReducer,
          geoGraphicsApi: geoGraphicsApiReducer,
          userApi: userApiReducer,
          userTypeApi: userTypeApiReducer,
          mappedProductApi: mappedProductApiReducer,
          auditLogsApi: auditLogsApiReducer,
     }),
     middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
               serializableCheck: false,
          }).concat([
               authApiMiddleware,
               categoryApiMiddleware,
               productApiMiddleware,
               geoGraphicsApiMiddleware,
               userApiMiddleware,
               userTypeApiMiddleware,
               mappedProductApiMiddleware,
               auditLogsApiMiddleware as Middleware,
          ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
setupListeners(store.dispatch);
export default store;
export const persistor = persistStore(store);
