import {Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@material-tailwind/react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/scss/main.scss';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {Provider} from "react-redux";
import {store} from "./redux/store.ts";
import Spinner from "./components/spinner";
import App from "./App.tsx";

const app = (
    <Provider store={store}>
        <Suspense fallback={<Spinner/>}>
            <BrowserRouter>
                <ToastContainer
                    position='top-right'
                    autoClose={3000}
                    // hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                />
                <ThemeProvider>
                    <App/>
                </ThemeProvider>
            </BrowserRouter>
        </Suspense>
    </Provider>
)

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(app)

