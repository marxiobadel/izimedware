import React from 'react';

const AddButton = ({add}) => {
    return (
        <button onClick={add} className="btn btn-primary i-false p-0 sharp">
            <i className="fa fa-plus"></i>
        </button>
    );
}

export default AddButton;