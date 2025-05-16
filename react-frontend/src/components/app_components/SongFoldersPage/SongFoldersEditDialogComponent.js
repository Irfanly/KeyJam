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

const SongFoldersCreateDialogComponent = (props) => {
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
chordSheetId: _entity?.chordSheetId,
folderName: _entity?.folderName,
tag: _entity?.tag,
        };

        setLoading(true);
        try {
            
        const result = await client.service("songFolders").patch(_entity._id, _data);
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info songFolders updated successfully" });
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
        <Dialog header="Edit SongFolders" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="songFolders-edit-dialog-component">
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
                <label htmlFor="chordSheetId">ChordSheetId:</label>
                <InputText id="chordSheetId" className="w-full mb-3 p-inputtext-sm" value={_entity?.chordSheetId} onChange={(e) => setValByKey("chordSheetId", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["chordSheetId"]) && (
              <p className="m-0" key="error-chordSheetId">
                {error["chordSheetId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="folderName">FolderName:</label>
                <InputText id="folderName" className="w-full mb-3 p-inputtext-sm" value={_entity?.folderName} onChange={(e) => setValByKey("folderName", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["folderName"]) && (
              <p className="m-0" key="error-folderName">
                {error["folderName"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="tag">Tag:</label>
                <InputText id="tag" className="w-full mb-3 p-inputtext-sm" value={_entity?.tag} onChange={(e) => setValByKey("tag", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["tag"]) && (
              <p className="m-0" key="error-tag">
                {error["tag"]}
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

export default connect(mapState, mapDispatch)(SongFoldersCreateDialogComponent);
