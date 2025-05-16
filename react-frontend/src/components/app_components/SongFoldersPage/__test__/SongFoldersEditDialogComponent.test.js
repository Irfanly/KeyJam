import React from "react";
import { render, screen } from "@testing-library/react";

import SongFoldersEditDialogComponent from "../SongFoldersEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders songFolders edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <SongFoldersEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("songFolders-edit-dialog-component")).toBeInTheDocument();
});
