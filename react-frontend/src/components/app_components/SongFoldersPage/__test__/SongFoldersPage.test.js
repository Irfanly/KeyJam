import React from "react";
import { render, screen } from "@testing-library/react";

import SongFoldersPage from "../SongFoldersPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders songFolders page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <SongFoldersPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("songFolders-datatable")).toBeInTheDocument();
    expect(screen.getByRole("songFolders-add-button")).toBeInTheDocument();
});
