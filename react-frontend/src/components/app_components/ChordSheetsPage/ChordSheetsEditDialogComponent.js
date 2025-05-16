import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const ChordSheetsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

    

    const onSave = async () => {
        let _data = {
            userId: _entity?.userId,
title: _entity?.title,
artist: _entity?.artist,
key: _entity?.key,
audioFileName: _entity?.audioFileName,
audioFileUrl: _entity?.audioFileUrl,
lyrics: _entity?.lyrics,
lyricsWithChords: _entity?.lyricsWithChords,
suggestedChords: _entity?.suggestedChords,
        };

        setLoading(true);
        try {
            
        const result = await client.service("chordSheets").patch(_entity._id, _data);
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info chordSheets updated successfully" });
        props.onEditResult(result);
        
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    

    return (
        <Dialog header="Edit ChordSheets" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="chordSheets-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="userId">UserId:</label>
                <InputText id="userId" className="w-full mb-3 p-inputtext-sm" value={_entity?.userId} onChange={(e) => setValByKey("userId", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["userId"]) && (
              <p className="m-0" key="error-userId">
                {error["userId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="title">Title:</label>
                <InputText id="title" className="w-full mb-3 p-inputtext-sm" value={_entity?.title} onChange={(e) => setValByKey("title", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["title"]) && (
              <p className="m-0" key="error-title">
                {error["title"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="artist">Artist:</label>
                <InputText id="artist" className="w-full mb-3 p-inputtext-sm" value={_entity?.artist} onChange={(e) => setValByKey("artist", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["artist"]) && (
              <p className="m-0" key="error-artist">
                {error["artist"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="key">Key:</label>
                <InputText id="key" className="w-full mb-3 p-inputtext-sm" value={_entity?.key} onChange={(e) => setValByKey("key", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["key"]) && (
              <p className="m-0" key="error-key">
                {error["key"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="audioFileName">AudioFileName:</label>
                <InputText id="audioFileName" className="w-full mb-3 p-inputtext-sm" value={_entity?.audioFileName} onChange={(e) => setValByKey("audioFileName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["audioFileName"]) && (
              <p className="m-0" key="error-audioFileName">
                {error["audioFileName"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="audioFileUrl">AudioFileUrl:</label>
                <InputText id="audioFileUrl" className="w-full mb-3 p-inputtext-sm" value={_entity?.audioFileUrl} onChange={(e) => setValByKey("audioFileUrl", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["audioFileUrl"]) && (
              <p className="m-0" key="error-audioFileUrl">
                {error["audioFileUrl"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="lyrics">Lyrics:</label>
                <InputText id="lyrics" className="w-full mb-3 p-inputtext-sm" value={_entity?.lyrics} onChange={(e) => setValByKey("lyrics", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["lyrics"]) && (
              <p className="m-0" key="error-lyrics">
                {error["lyrics"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="lyricsWithChords">LyricsWithChords:</label>
                <InputText id="lyricsWithChords" className="w-full mb-3 p-inputtext-sm" value={_entity?.lyricsWithChords} onChange={(e) => setValByKey("lyricsWithChords", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["lyricsWithChords"]) && (
              <p className="m-0" key="error-lyricsWithChords">
                {error["lyricsWithChords"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="suggestedChords">SuggestedChords:</label>
                <InputText id="suggestedChords" className="w-full mb-3 p-inputtext-sm" value={_entity?.suggestedChords} onChange={(e) => setValByKey("suggestedChords", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["suggestedChords"]) && (
              <p className="m-0" key="error-suggestedChords">
                {error["suggestedChords"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ChordSheetsCreateDialogComponent);
