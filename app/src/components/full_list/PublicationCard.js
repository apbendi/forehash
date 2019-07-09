import React from 'react';
import PropTypes from 'prop-types';
import { Container, Col, Row, Card, Image, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function dateForTimestamp(timestamp) {
    let date = new Date(1000 * parseInt(timestamp));
    return date.toLocaleDateString();
}

const PublicationCard = props => {
    let account = props.publicationValues.user;
    let pubDate = dateForTimestamp(props.publicationValues.date);
    let detailLink = [account, props.publicationValues.subID].join("/")

    return (
            <Card>
                <Card.Body>
                <Container>
                    <Row>
                        <Col xs="12">
                            <Image src={"https://eth.vanity.show/" + account}
                                    style={{
                                        margin: "auto",
                                        display: "block",
                                    }}
                                    roundedCircle
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col xs="12">
                            <center>
                                <strong>{account.slice(0, 12)}... </strong><br />
                                Published: {pubDate} <p />
                                <LinkContainer to={detailLink}>
                                    <Button>Details</Button>
                                </LinkContainer>
                            </center>
                        </Col>
                    </Row>
                </Container>
                </Card.Body>
            </Card>
    );
}

PublicationCard.propTypes = {
    publicationValues: PropTypes.object.isRequired,
}

export default PublicationCard;
