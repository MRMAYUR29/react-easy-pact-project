import { FC, Fragment, ReactNode } from "react";
import {} from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store, { persistor } from "./redux";
import { PersistGate } from "redux-persist/integration/react";

export interface AppProviderProps {
     children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
     return (
          <Fragment>
               <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                         <BrowserRouter>{children}</BrowserRouter>
                    </PersistGate>
               </Provider>
          </Fragment>
     );
};
