import React from "react";
import { render, screen } from "@testing-library/react";

import LessonsPage from "../LessonsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders lessons page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <LessonsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("lessons-datatable")).toBeInTheDocument();
    expect(screen.getByRole("lessons-add-button")).toBeInTheDocument();
});
