import React from "react";
import { render, screen } from "@testing-library/react";

import ChordSheetsCreateDialogComponent from "../ChordSheetsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders chordSheets create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ChordSheetsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("chordSheets-create-dialog-component")).toBeInTheDocument();
});
