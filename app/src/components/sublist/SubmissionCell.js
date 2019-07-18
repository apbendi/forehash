import React from 'react'
import PropTypes from 'prop-types';
import HashSpan from '../HashSpan';

const SubmissionCell = props => {
    var className = "list-group-item list-group-item-action flex-column align-items-start";
    var badge = "";
    var badgeBreak = "";

    if (props.revelationDate) {
        badge = (<span className="badge badge-warning badge-pill">Revealed {props.revelationDate}</span>);
        badgeBreak = (<br />);
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

            <HashSpan hash={props.hash} />
            {badge}{badgeBreak}
            <span>Published: {props.pubDate}</span><br />
            <span>Deposit: {props.deposit} ETH</span><br />
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
