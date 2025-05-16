import React from "react";
import { render, screen } from "@testing-library/react";

import ChordSheetsEditDialogComponent from "../ChordSheetsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders chordSheets edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ChordSheetsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("chordSheets-edit-dialog-component")).toBeInTheDocument();
});
