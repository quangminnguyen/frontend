import Login from "~/auth/Login";
import DefaultLayout from "~/components/defaultLayout/DefaultLayout";
import Home from "~/homepage/Home";

export const publicRouter = [
    { element: Home, path: "/", exact: true, layout: DefaultLayout },
    { element: Login, path: "/login", exact: true },
];

export const privateRouter = [];
