//Page to display the list of chord sheets

import { connect } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import ProjectLayout from "../Layouts/ProjectLayout";
import client from "../../services/restClient";

const ChordSheets = (props) => {
  const [loading, setLoading] = useState(true);
  const [chordSheets, setChordSheets] = useState([]);

  useEffect(() => {
    if (!props.user?._id) {
      // User not loaded yet, don't fetch
      return;
    }
    props.show();
    const userId = props.user._id;
    console.log("User ID:", userId);
    client
      .service("chordSheets")
      .find({
        query: {
          createdBy: userId,
          $limit: 100,
          $sort: { updatedAt: -1 },
          $populate: [{ path: "createdBy", service: "users", select: ["name"] }]
        }
      })
      .then((result) => {
        setChordSheets(result.data || []);
        console.log("Fetched chord sheets:", result.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chord sheets:", error);
        setLoading(false);
      });
    }, [props.user?._id]);

  return (
    <ProjectLayout>
      <div className="chord-sheets">
        <h2>My Chord Sheets</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="chord-sheet-list">
            {chordSheets.map((sheet) => (
              <Card key={sheet._id} title={sheet.title} className="chord-sheet-card">
                <p>{sheet.description}</p>
                <Button label="View" onClick={() => console.log(`Viewing ${sheet.title}`)} />
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProjectLayout>
  );
}

const mapStateToProps = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};
const mapDispatchToProps = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapStateToProps,mapDispatchToProps)(ChordSheets);