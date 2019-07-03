import React from 'react'
import PropTypes from 'prop-types';
import HashSpan from '../HashSpan';

const SubmissionCell = props => {
    var className = "list-group-item list-group-item-action flex-column align-items-start";
    var badge = "";
    var revelationText = "";

    if (props.revelationDate) {
        badge = (<span className="badge badge-warning badge-pill">Revealed</span>);
        revelationText = "Revealed: " + props.revelationDate;
    }

    if (props.isSelected) {
        className += " active";
    }

    return (
        <a href="/"
                className={className}
                onClick={(event) => {
                    event.preventDefault();
                    props.onSelection(props.subID);
                }
            }>

            <div className="d-flex w-100 justify-content-between">
                <HashSpan hash={props.hash} />
                <span>{badge}</span>
            </div>
            <span>Published: {props.pubDate}</span><br />
            <span>Deposit: {props.deposit} ETH</span><br />
            <span>{revelationText}</span>
        </a>
    );
}

SubmissionCell.propTypes = {
    subID: PropTypes.string.isRequired,
    onSelection: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    hash: PropTypes.string.isRequired,
    pubDate: PropTypes.string.isRequired,
    deposit: PropTypes.string.isRequired,
    revelationDate: PropTypes.string,
};

export default SubmissionCell;
