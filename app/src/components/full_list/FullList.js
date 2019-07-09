import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PublicationCard from './PublicationCard';

class FullList extends Component {
    constructor(props, context) {
        super(props);

        this.utils = context.drizzle.web3.utils;
        this.revelations = this.revelations.bind(this);
        this.publications = this.publications.bind(this);
    }

    revelations() {
        return this.props.bankshotState.events.filter( event => {
            return (event.event === 'Revelation');
        });
    }

    publications() {
        return this.props.bankshotState.events
                .filter( event => {
                    return (event.event === 'Publication');
                })
                .sort( (pub1, pub2) => {
                    return (parseInt(pub2.returnValues.date) - parseInt(pub1.returnValues.date))
                });
    }

    render() {
        let cards = this.publications().map( (publication, index) => {
            return (
                <Col md="4" className="mt-3" key={index}>
                    <PublicationCard publicationValues={publication.returnValues} />
                </Col>
            );
        });

        return (
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>Global Bankshot Statistics</Card.Header>
                            <Card.Body>
                                <Card.Title><big>{this.publications().length} predictions have been published</big></Card.Title>
                                <Card.Subtitle className="text-secondary">{this.revelations().length} have been revealed</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    {cards}
                </Row>
            </Container>
        );
    }
}

FullList.contextTypes = {
    drizzle: PropTypes.object,
}

FullList.propTypes = {

};

let mapStateToProps = state => {
    return {
        activeAccount: state.accounts[0],
        bankshotState: state.contracts.Bankshot,
    };
}

export default drizzleConnect(FullList, mapStateToProps, null);
